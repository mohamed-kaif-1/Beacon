import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import initSqlJs, { Database, SqlValue } from 'sql.js'
import {
  NoteItem,
  CreateNoteInput,
  UpdateNoteInput,
  TaskItem,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterOptions,
  TaskStatus,
  TaskPriority,
  ProductivitySummary,
  DatabaseHealth
} from './types'
import { getHelmDataDirectory, getBeaconDataDirectory } from './watches-store'
import { logger } from './logger'

let dbInstance: Database | null = null
let dbInitPromise: Promise<Database> | null = null

export function getDatabaseFilePath(): string {
  const dir = getBeaconDataDirectory()
  const beaconDb = path.join(dir, 'beacon.db')
  const helmDb = path.join(dir, 'helm.db')

  // Auto-migrate helm.db to beacon.db if beacon.db does not exist
  if (!fs.existsSync(beaconDb) && fs.existsSync(helmDb)) {
    try {
      fs.copyFileSync(helmDb, beaconDb)
      logger.info('Database', 'Migrated helm.db to beacon.db successfully')
    } catch (err) {
      logger.error('Database', 'Failed to copy helm.db to beacon.db, falling back to helm.db', err)
      return helmDb
    }
  }

  return beaconDb
}

function persistDatabase(): void {
  if (!dbInstance) return
  const filePath = getDatabaseFilePath()
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const binaryArray = dbInstance.export()
  const buffer = Buffer.from(binaryArray)
  const tempPath = path.join(dir, `beacon.db.${process.pid}.${Date.now()}.tmp`)

  try {
    fs.writeFileSync(tempPath, buffer)
    try {
      fs.renameSync(tempPath, filePath)
    } catch {
      fs.copyFileSync(tempPath, filePath)
      fs.unlinkSync(tempPath)
    }
  } catch (err) {
    console.error('[BEACON DB] Failed to persist database to disk:', err)
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath)
      } catch {}
    }
  }
}

function runMigrations(db: Database): void {
  db.run('PRAGMA foreign_keys = ON;')

  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `)

  // Check current version
  let currentVersion = 0
  const versionStmt = db.prepare('SELECT MAX(version) as v FROM schema_migrations')
  if (versionStmt.step()) {
    const row = versionStmt.getAsObject()
    currentVersion = typeof row.v === 'number' ? row.v : 0
  }
  versionStmt.free()

  // Migration 1: Notes & Tasks baseline
  if (currentVersion < 1) {
    console.log('[BEACON DB] Applying migration version 1...')
    db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        is_pinned INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned DESC);

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        due_date INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        completed_at INTEGER
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notes_pinned_updated ON notes(is_pinned DESC, updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tasks_status_due ON tasks(status, due_date);

      INSERT INTO schema_migrations (version, applied_at)
      VALUES (1, datetime('now'));
    `)
    persistDatabase()
  }

  // Migration 2: Performance compound indexing
  if (currentVersion < 2) {
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_notes_pinned_updated ON notes(is_pinned DESC, updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tasks_status_due ON tasks(status, due_date);

      INSERT INTO schema_migrations (version, applied_at)
      VALUES (2, datetime('now'));
    `)
    persistDatabase()
  }
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance
  if (dbInitPromise) return dbInitPromise

  dbInitPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: (file: string) => {
        // Resolve path to sql-wasm.wasm in dev, test, and packaged asar environments
        const candidates = [
          path.join(process.resourcesPath || '', 'app.asar.unpacked', 'node_modules', 'sql.js', 'dist', file),
          path.join(__dirname, '../../node_modules/sql.js/dist', file),
          path.join(__dirname, '../node_modules/sql.js/dist', file),
          path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file)
        ]
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            return candidate
          }
        }
        return file
      }
    })
    const filePath = getDatabaseFilePath()

    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath)
        dbInstance = new SQL.Database(fileBuffer)
        logger.info('Database', 'Loaded existing SQLite database from disk')
      } catch (err) {
        logger.warn('Database', 'Corrupted database file detected. Creating backup and initializing fresh database.', err)
        try {
          const backupPath = `${filePath}.corrupted.${Date.now()}`
          fs.copyFileSync(filePath, backupPath)
          logger.info('Database', `Backed up corrupted database to ${backupPath}`)
        } catch {}
        dbInstance = new SQL.Database()
      }
    } else {
      logger.info('Database', 'Initializing new SQLite database at default path')
      dbInstance = new SQL.Database()
    }

    runMigrations(dbInstance)
    return dbInstance
  })()

  return dbInitPromise
}

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  const filePath = getDatabaseFilePath()
  let sizeBytes = 0
  try {
    if (fs.existsSync(filePath)) {
      sizeBytes = fs.statSync(filePath).size
    }
  } catch {}

  try {
    const db = await getDatabase()
    let version = 1
    let noteCount = 0
    let taskCount = 0

    const vStmt = db.prepare('SELECT MAX(version) as v FROM schema_migrations')
    if (vStmt.step()) {
      const row = vStmt.getAsObject()
      if (typeof row.v === 'number') version = row.v
    }
    vStmt.free()

    const nCountStmt = db.prepare('SELECT COUNT(*) as c FROM notes')
    if (nCountStmt.step()) {
      const row = nCountStmt.getAsObject()
      if (typeof row.c === 'number') noteCount = row.c
    }
    nCountStmt.free()

    const tCountStmt = db.prepare('SELECT COUNT(*) as c FROM tasks')
    if (tCountStmt.step()) {
      const row = tCountStmt.getAsObject()
      if (typeof row.c === 'number') taskCount = row.c
    }
    tCountStmt.free()

    return {
      status: 'healthy',
      version,
      sizeBytes,
      noteCount,
      taskCount
    }
  } catch (err) {
    logger.error('Database', 'Health check failed', err)
    return {
      status: 'corrupted',
      version: 0,
      sizeBytes,
      noteCount: 0,
      taskCount: 0
    }
  }
}

// ----------------------------------------------------
// Notes CRUD Operations
// ----------------------------------------------------

export async function getAllNotes(searchQuery?: string): Promise<NoteItem[]> {
  const db = await getDatabase()
  const q = (searchQuery || '').trim().toLowerCase()

  let sql = 'SELECT * FROM notes'
  const params: SqlValue[] = []

  if (q) {
    sql += ' WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ?'
    params.push(`%${q}%`, `%${q}%`)
  }

  sql += ' ORDER BY is_pinned DESC, updated_at DESC'

  const stmt = db.prepare(sql)
  if (params.length > 0) stmt.bind(params)

  const notes: NoteItem[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    notes.push({
      id: String(row.id),
      title: String(row.title),
      content: String(row.content || ''),
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      isPinned: Boolean(row.is_pinned)
    })
  }
  stmt.free()
  return notes
}

export async function getNoteById(id: string): Promise<NoteItem | null> {
  const db = await getDatabase()
  const stmt = db.prepare('SELECT * FROM notes WHERE id = ?')
  stmt.bind([id])

  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()
    return {
      id: String(row.id),
      title: String(row.title),
      content: String(row.content || ''),
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      isPinned: Boolean(row.is_pinned)
    }
  }
  stmt.free()
  return null
}

export async function createNote(input: CreateNoteInput): Promise<NoteItem> {
  const db = await getDatabase()
  const id = crypto.randomUUID()
  const title = (input.title || 'Untitled Note').trim().slice(0, 200) || 'Untitled Note'
  const content = (input.content || '').slice(0, 100000)
  const isPinned = Boolean(input.isPinned) ? 1 : 0
  const now = Date.now()

  db.run(
    'INSERT INTO notes (id, title, content, created_at, updated_at, is_pinned) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, content, now, now, isPinned]
  )
  persistDatabase()

  return {
    id,
    title,
    content,
    createdAt: now,
    updatedAt: now,
    isPinned: Boolean(isPinned)
  }
}

export async function updateNote(input: UpdateNoteInput): Promise<NoteItem> {
  const db = await getDatabase()
  const existing = await getNoteById(input.id)
  if (!existing) {
    throw new Error(`Note with id "${input.id}" not found`)
  }

  const title = input.title !== undefined ? input.title.trim().slice(0, 200) : existing.title
  const content = input.content !== undefined ? input.content.slice(0, 100000) : existing.content
  const isPinned = input.isPinned !== undefined ? (input.isPinned ? 1 : 0) : (existing.isPinned ? 1 : 0)
  const now = Date.now()

  db.run(
    'UPDATE notes SET title = ?, content = ?, is_pinned = ?, updated_at = ? WHERE id = ?',
    [title, content, isPinned, now, input.id]
  )
  persistDatabase()

  return {
    id: input.id,
    title,
    content,
    createdAt: existing.createdAt,
    updatedAt: now,
    isPinned: Boolean(isPinned)
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  const db = await getDatabase()
  db.run('DELETE FROM notes WHERE id = ?', [id])
  persistDatabase()
  return true
}

export async function togglePinNote(id: string): Promise<NoteItem> {
  const existing = await getNoteById(id)
  if (!existing) {
    throw new Error(`Note with id "${id}" not found`)
  }
  return updateNote({ id, isPinned: !existing.isPinned })
}

// ----------------------------------------------------
// Tasks CRUD Operations
// ----------------------------------------------------

export async function getAllTasks(filter?: TaskFilterOptions): Promise<TaskItem[]> {
  const db = await getDatabase()
  let sql = 'SELECT * FROM tasks'
  const conditions: string[] = []
  const params: SqlValue[] = []

  const now = Date.now()
  const startOfDay = new Date().setHours(0, 0, 0, 0)
  const endOfDay = new Date().setHours(23, 59, 59, 999)

  if (filter?.status && filter.status !== 'all') {
    conditions.push('status = ?')
    params.push(filter.status)
  }

  if (filter?.priority && filter.priority !== 'all') {
    conditions.push('priority = ?')
    params.push(filter.priority)
  }

  if (filter?.view === 'completed') {
    conditions.push("status = 'completed'")
  } else if (filter?.view === 'today') {
    conditions.push("status != 'completed' AND due_date IS NOT NULL AND due_date <= ?")
    params.push(endOfDay)
  } else if (filter?.view === 'upcoming') {
    conditions.push("status != 'completed' AND due_date IS NOT NULL AND due_date > ?")
    params.push(endOfDay)
  }

  if (filter?.search) {
    const s = filter.search.trim().toLowerCase()
    if (s) {
      conditions.push('(LOWER(title) LIKE ? OR LOWER(description) LIKE ?)')
      params.push(`%${s}%`, `%${s}%`)
    }
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ')
  }

  // Sort: pending/in_progress first, then priority (high -> med -> low), then due date
  sql += `
    ORDER BY 
      CASE WHEN status = 'completed' THEN 1 ELSE 0 END ASC,
      CASE WHEN due_date IS NOT NULL AND due_date < ${now} AND status != 'completed' THEN 0 ELSE 1 END ASC,
      CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END ASC,
      CASE WHEN due_date IS NULL THEN 1 ELSE 0 END ASC,
      due_date ASC,
      updated_at DESC
  `

  const stmt = db.prepare(sql)
  if (params.length > 0) stmt.bind(params)

  const tasks: TaskItem[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    tasks.push({
      id: String(row.id),
      title: String(row.title),
      description: String(row.description || ''),
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      dueDate: typeof row.due_date === 'number' ? row.due_date : undefined,
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      completedAt: typeof row.completed_at === 'number' ? row.completed_at : undefined
    })
  }
  stmt.free()
  return tasks
}

export async function getTaskById(id: string): Promise<TaskItem | null> {
  const db = await getDatabase()
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?')
  stmt.bind([id])

  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()
    return {
      id: String(row.id),
      title: String(row.title),
      description: String(row.description || ''),
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      dueDate: typeof row.due_date === 'number' ? row.due_date : undefined,
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      completedAt: typeof row.completed_at === 'number' ? row.completed_at : undefined
    }
  }
  stmt.free()
  return null
}

export async function createTask(input: CreateTaskInput): Promise<TaskItem> {
  const db = await getDatabase()
  const id = crypto.randomUUID()
  const title = (input.title || 'New Task').trim().slice(0, 200) || 'New Task'
  const description = (input.description || '').slice(0, 10000)

  const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed']
  const status: TaskStatus = validStatuses.includes(input.status as TaskStatus) ? (input.status as TaskStatus) : 'pending'

  const validPriorities: TaskPriority[] = ['low', 'medium', 'high']
  const priority: TaskPriority = validPriorities.includes(input.priority as TaskPriority) ? (input.priority as TaskPriority) : 'medium'

  const dueDate = typeof input.dueDate === 'number' && !isNaN(input.dueDate) && input.dueDate > 0 ? input.dueDate : null
  const now = Date.now()
  const completedAt = status === 'completed' ? now : null

  db.run(
    `INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, description, status, priority, dueDate, now, now, completedAt]
  )
  persistDatabase()

  return {
    id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate || undefined,
    createdAt: now,
    updatedAt: now,
    completedAt: completedAt || undefined
  }
}

export async function updateTask(input: UpdateTaskInput): Promise<TaskItem> {
  const db = await getDatabase()
  const existing = await getTaskById(input.id)
  if (!existing) {
    throw new Error(`Task with id "${input.id}" not found`)
  }

  const title = input.title !== undefined ? input.title.trim().slice(0, 200) : existing.title
  const description = input.description !== undefined ? input.description.slice(0, 10000) : existing.description

  const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed']
  const status: TaskStatus = input.status && validStatuses.includes(input.status) ? input.status : existing.status

  const validPriorities: TaskPriority[] = ['low', 'medium', 'high']
  const priority: TaskPriority = input.priority && validPriorities.includes(input.priority) ? input.priority : existing.priority

  let dueDate: number | null = existing.dueDate || null
  if (input.dueDate !== undefined) {
    dueDate = typeof input.dueDate === 'number' && input.dueDate > 0 ? input.dueDate : null
  }

  let completedAt: number | null = existing.completedAt || null
  if (status === 'completed' && existing.status !== 'completed') {
    completedAt = Date.now()
  } else if (status !== 'completed') {
    completedAt = null
  }

  const now = Date.now()

  db.run(
    `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = ?, completed_at = ?
     WHERE id = ?`,
    [title, description, status, priority, dueDate, now, completedAt, input.id]
  )
  persistDatabase()

  return {
    id: input.id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate || undefined,
    createdAt: existing.createdAt,
    updatedAt: now,
    completedAt: completedAt || undefined
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  const db = await getDatabase()
  db.run('DELETE FROM tasks WHERE id = ?', [id])
  persistDatabase()
  return true
}

export async function toggleCompleteTask(id: string): Promise<TaskItem> {
  const existing = await getTaskById(id)
  if (!existing) {
    throw new Error(`Task with id "${id}" not found`)
  }
  const nextStatus: TaskStatus = existing.status === 'completed' ? 'pending' : 'completed'
  return updateTask({ id, status: nextStatus })
}

// ----------------------------------------------------
// Productivity Summary for Dashboard and Ambient Board
// ----------------------------------------------------

export async function getProductivitySummary(): Promise<ProductivitySummary> {
  const db = await getDatabase()
  const notes = await getAllNotes()
  const allTasks = await getAllTasks()

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()

  const pendingTasks = allTasks.filter((t) => t.status === 'pending').length
  const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress').length
  const completedTasks = allTasks.filter((t) => t.status === 'completed').length

  const overdueTasks = allTasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate < startOfToday
  ).length

  const todayTasks = allTasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate >= startOfToday && t.dueDate <= endOfDay
  )

  const upcomingTasks = allTasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate > endOfDay
  )

  return {
    totalNotes: notes.length,
    recentNotes: notes.slice(0, 3),
    pendingTasks,
    inProgressTasks,
    completedTasks,
    tasksDueToday: todayTasks.length,
    overdueTasks,
    upcomingTasks: upcomingTasks.slice(0, 5),
    todayTasks: todayTasks.slice(0, 5)
  }
}
