const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')
const initSqlJs = require('sql.js')

// Create a unique temporary directory for this test run to guarantee total isolation
const tempDir = path.join(os.tmpdir(), `helm-test-db-${Date.now()}-${Math.floor(Math.random() * 10000)}`)
const dbDir = path.join(tempDir, 'Helm')
fs.mkdirSync(dbDir, { recursive: true })
const dbPath = path.join(dbDir, 'helm.db')

console.log('--- Starting Helm Windows Phase 4 Notes & Tasks Integration Tests ---')
console.log(`[Test Environment] Isolated SQLite test path: ${dbPath}\n`)

async function runTests() {
  // -------------------------------------------------------------------
  // TEST 1: Database Initialization & Migrations
  // -------------------------------------------------------------------
  console.log('[TEST 1] Testing SQLite WASM Engine & Schema Migrations...')
  const SQL = await initSqlJs()
  let db = new SQL.Database()

  // Run initial migrations
  db.run('PRAGMA foreign_keys = ON;')
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `)

  // Check version (should be 0 initially)
  let vStmt = db.prepare('SELECT MAX(version) as v FROM schema_migrations')
  let currentVersion = 0
  if (vStmt.step()) {
    const row = vStmt.getAsObject()
    currentVersion = typeof row.v === 'number' ? row.v : 0
  }
  vStmt.free()
  assert.strictEqual(currentVersion, 0, 'Initial schema version should be 0')

  // Apply Migration 1
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

    INSERT INTO schema_migrations (version, applied_at)
    VALUES (1, datetime('now'));
  `)

  // Verify migration version is now 1
  vStmt = db.prepare('SELECT MAX(version) as v FROM schema_migrations')
  assert(vStmt.step(), 'Must find migration record')
  assert.strictEqual(vStmt.getAsObject().v, 1, 'Schema migration version must be 1')
  vStmt.free()

  // Verify tables exist
  const tablesStmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('notes', 'tasks', 'schema_migrations')")
  const tablesFound = []
  while (tablesStmt.step()) {
    tablesFound.push(tablesStmt.getAsObject().name)
  }
  tablesStmt.free()
  assert(tablesFound.includes('notes'), 'Table "notes" must exist')
  assert(tablesFound.includes('tasks'), 'Table "tasks" must exist')
  assert(tablesFound.includes('schema_migrations'), 'Table "schema_migrations" must exist')

  console.log('  ✓ Database migrations applied and verified.')

  // Save to disk function
  function persist() {
    const data = db.export()
    fs.writeFileSync(dbPath, Buffer.from(data))
  }
  persist()

  // -------------------------------------------------------------------
  // TEST 2: Notes CRUD, Search, and Pinning
  // -------------------------------------------------------------------
  console.log('\n[TEST 2] Testing Notes CRUD, Search, and Pinning...')

  const noteId1 = crypto.randomUUID()
  const now = Date.now()
  db.run(
    'INSERT INTO notes (id, title, content, created_at, updated_at, is_pinned) VALUES (?, ?, ?, ?, ?, ?)',
    [noteId1, 'First Note', 'Helm ambient productivity checklist:\n- Check delivery\n- Review PR', now, now, 0]
  )

  const noteId2 = crypto.randomUUID()
  db.run(
    'INSERT INTO notes (id, title, content, created_at, updated_at, is_pinned) VALUES (?, ?, ?, ?, ?, ?)',
    [noteId2, 'Pinned Architecture Spec', 'Windows port architecture specification using Electron 34 and SQLite.', now + 10, now + 10, 1]
  )
  persist()

  // Fetch note by ID
  const fetchStmt = db.prepare('SELECT * FROM notes WHERE id = ?')
  fetchStmt.bind([noteId1])
  assert(fetchStmt.step(), 'Note 1 must be found by ID')
  const note1Row = fetchStmt.getAsObject()
  assert.strictEqual(note1Row.title, 'First Note')
  assert.strictEqual(note1Row.is_pinned, 0)
  fetchStmt.free()

  // Search Notes
  const searchStmt = db.prepare('SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY is_pinned DESC, updated_at DESC')
  searchStmt.bind(['%Architecture%', '%Architecture%'])
  assert(searchStmt.step(), 'Search should match "Architecture"')
  const searchMatch = searchStmt.getAsObject()
  assert.strictEqual(searchMatch.id, noteId2)
  assert.strictEqual(searchMatch.is_pinned, 1)
  searchStmt.free()

  // Update Note
  const updatedTime = Date.now() + 500
  db.run(
    'UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?',
    ['First Note (Updated)', 'Updated content here.', updatedTime, noteId1]
  )
  const verifyUpdate = db.prepare('SELECT * FROM notes WHERE id = ?')
  verifyUpdate.bind([noteId1])
  verifyUpdate.step()
  assert.strictEqual(verifyUpdate.getAsObject().title, 'First Note (Updated)')
  assert.strictEqual(verifyUpdate.getAsObject().updated_at, updatedTime)
  verifyUpdate.free()

  // Pin Toggle
  db.run('UPDATE notes SET is_pinned = 1 WHERE id = ?', [noteId1])
  const verifyPin = db.prepare('SELECT is_pinned FROM notes WHERE id = ?')
  verifyPin.bind([noteId1])
  verifyPin.step()
  assert.strictEqual(verifyPin.getAsObject().is_pinned, 1)
  verifyPin.free()

  // Delete Note 1
  db.run('DELETE FROM notes WHERE id = ?', [noteId1])
  const verifyDelete = db.prepare('SELECT * FROM notes WHERE id = ?')
  verifyDelete.bind([noteId1])
  assert(!verifyDelete.step(), 'Deleted note should no longer exist')
  verifyDelete.free()
  persist()

  console.log('  ✓ Notes operations (create, read, search, update, pin, delete) verified.')

  // -------------------------------------------------------------------
  // TEST 3: Tasks CRUD, Priorities, Due Dates, and Status
  // -------------------------------------------------------------------
  console.log('\n[TEST 3] Testing Tasks CRUD, Status Toggles, and Due Dates...')

  const today = new Date()
  const todayDue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0).getTime()
  const overdueDue = Date.now() - 24 * 60 * 60 * 1000 // yesterday
  const upcomingDue = Date.now() + 3 * 24 * 60 * 60 * 1000 // 3 days from now

  const taskId1 = crypto.randomUUID()
  const taskId2 = crypto.randomUUID()
  const taskId3 = crypto.randomUUID()

  // Task 1: Overdue high priority
  db.run(
    'INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [taskId1, 'Fix critical regression', 'Urgent fix needed for build process', 'pending', 'high', overdueDue, now, now, null]
  )

  // Task 2: Due today medium priority
  db.run(
    'INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [taskId2, 'Submit sprint report', 'Daily standup action item', 'pending', 'medium', todayDue, now, now, null]
  )

  // Task 3: Upcoming low priority
  db.run(
    'INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [taskId3, 'Plan Phase 5 OCR packaging', 'Review Python 3D printer quotation slicer', 'pending', 'low', upcomingDue, now, now, null]
  )
  persist()

  // Verify task retrieval
  const taskStmt = db.prepare('SELECT * FROM tasks WHERE id = ?')
  taskStmt.bind([taskId1])
  assert(taskStmt.step(), 'Task 1 must exist')
  const task1Row = taskStmt.getAsObject()
  assert.strictEqual(task1Row.priority, 'high')
  assert.strictEqual(task1Row.status, 'pending')
  taskStmt.free()

  // Toggle completion: pending -> completed
  const completedAt = Date.now()
  db.run(
    'UPDATE tasks SET status = ?, completed_at = ?, updated_at = ? WHERE id = ?',
    ['completed', completedAt, completedAt, taskId1]
  )

  const verifyComplete = db.prepare('SELECT status, completed_at FROM tasks WHERE id = ?')
  verifyComplete.bind([taskId1])
  verifyComplete.step()
  assert.strictEqual(verifyComplete.getAsObject().status, 'completed')
  assert.strictEqual(verifyComplete.getAsObject().completed_at, completedAt)
  verifyComplete.free()

  // Toggle completion: completed -> pending
  db.run(
    'UPDATE tasks SET status = ?, completed_at = NULL, updated_at = ? WHERE id = ?',
    ['pending', Date.now(), taskId1]
  )
  const verifyReopen = db.prepare('SELECT status, completed_at FROM tasks WHERE id = ?')
  verifyReopen.bind([taskId1])
  verifyReopen.step()
  assert.strictEqual(verifyReopen.getAsObject().status, 'pending')
  assert.strictEqual(verifyReopen.getAsObject().completed_at, null)
  verifyReopen.free()

  // Test Filters
  // 1. High priority tasks
  const priorityStmt = db.prepare('SELECT * FROM tasks WHERE priority = ?')
  priorityStmt.bind(['high'])
  assert(priorityStmt.step(), 'Should find high priority task')
  assert.strictEqual(priorityStmt.getAsObject().id, taskId1)
  priorityStmt.free()

  // 2. Search tasks
  const taskSearchStmt = db.prepare('SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ?')
  taskSearchStmt.bind(['%sprint%', '%sprint%'])
  assert(taskSearchStmt.step(), 'Search should find "sprint"')
  assert.strictEqual(taskSearchStmt.getAsObject().id, taskId2)
  taskSearchStmt.free()

  persist()
  console.log('  ✓ Tasks operations (create, status toggle, priorities, due dates, filters) verified.')

  // -------------------------------------------------------------------
  // TEST 4: Productivity Summary Calculation
  // -------------------------------------------------------------------
  console.log('\n[TEST 4] Testing Productivity Summary Metrics Calculation...')

  // Retrieve all tasks to compute metrics
  const allTasksStmt = db.prepare('SELECT * FROM tasks')
  const allTasks = []
  while (allTasksStmt.step()) {
    allTasks.push(allTasksStmt.getAsObject())
  }
  allTasksStmt.free()

  const allNotesStmt = db.prepare('SELECT * FROM notes')
  const allNotes = []
  while (allNotesStmt.step()) {
    allNotes.push(allNotesStmt.getAsObject())
  }
  allNotesStmt.free()

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).getTime()
  const pendingCount = allTasks.filter((t) => t.status === 'pending').length
  const overdueCount = allTasks.filter((t) => t.status !== 'completed' && t.due_date && t.due_date < startOfToday).length
  const todayCount = allTasks.filter((t) => t.status !== 'completed' && t.due_date && t.due_date <= endOfDay && t.due_date >= startOfToday).length

  assert.strictEqual(allNotes.length, 1, 'Should have 1 note remaining (noteId2)')
  assert.strictEqual(pendingCount, 3, 'Should have 3 pending tasks')
  assert.strictEqual(overdueCount, 1, 'Should have 1 overdue task (taskId1)')

  console.log(`  ✓ Computed summary: ${allNotes.length} notes, ${pendingCount} pending tasks, ${overdueCount} overdue tasks.`)

  // -------------------------------------------------------------------
  // TEST 5: Cold Disk Persistence & Re-open Verification
  // -------------------------------------------------------------------
  console.log('\n[TEST 5] Testing Cold Disk Persistence & File Structure...')

  // Ensure file exists and has standard SQLite 3 header
  assert(fs.existsSync(dbPath), `Database file must exist at ${dbPath}`)
  const fileBytes = fs.readFileSync(dbPath)
  assert(fileBytes.length >= 100, 'Database file size must be at least 100 bytes')
  const headerString = fileBytes.slice(0, 16).toString('utf-8')
  assert.strictEqual(headerString, 'SQLite format 3\0', 'Database file must start with valid "SQLite format 3\\0" magic header')

  // Close current database instance and reopen completely from disk buffer
  db.close()
  db = null

  console.log('  → Re-opening database from saved disk bytes...')
  const reloadedDb = new SQL.Database(fileBytes)

  // Verify notes table reloaded
  const reloadedNotes = reloadedDb.prepare('SELECT * FROM notes WHERE id = ?')
  reloadedNotes.bind([noteId2])
  assert(reloadedNotes.step(), 'Note 2 must be present in reloaded database')
  assert.strictEqual(reloadedNotes.getAsObject().title, 'Pinned Architecture Spec')
  reloadedNotes.free()

  // Verify tasks table reloaded
  const reloadedTasks = reloadedDb.prepare('SELECT count(*) as count FROM tasks')
  reloadedTasks.step()
  assert.strictEqual(reloadedTasks.getAsObject().count, 3, 'All 3 tasks must be restored after cold reload')
  reloadedTasks.free()

  reloadedDb.close()
  console.log('  ✓ Cold database reload successfully verified.')

  // Clean up test temporary directory
  try {
    fs.rmSync(tempDir, { recursive: true, force: true })
  } catch {}

  console.log('\n============================================================')
  console.log('ALL PHASE 4 NOTES & TASKS INTEGRATION TESTS PASSED (5/5)')
  console.log('============================================================\n')
}

runTests().catch((err) => {
  console.error('\n❌ TEST RUN FAILED with error:\n', err)
  try {
    fs.rmSync(tempDir, { recursive: true, force: true })
  } catch {}
  process.exit(1)
})
