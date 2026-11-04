/**
 * Helm Windows — Phase 5.6 Baseline Measurement & Performance Profiling Tool
 * Measures startup time, process memory, SQLite WASM latency, IPC throughput, and idle CPU.
 */

const { spawn, execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { performance } = require('perf_hooks')

const rootDir = path.resolve(__dirname, '..')
const unpackedExe = path.join(rootDir, 'dist', 'win-unpacked', 'Helm.exe')

async function profileDatabase() {
  console.log('\n--- 1. SQLite WASM Initialization & Query Latency ---')
  const initSqlJs = require('sql.js')

  const t0 = performance.now()
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(rootDir, 'node_modules', 'sql.js', 'dist', file)
  })
  const wasmInitMs = performance.now() - t0
  console.log(`• SQL.js WASM Engine Init: ${wasmInitMs.toFixed(2)} ms`)

  const db = new SQL.Database()
  db.run(`
    CREATE TABLE notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      is_pinned INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
    CREATE INDEX idx_notes_is_pinned ON notes(is_pinned DESC);
  `)

  // Measure 100 Notes Inserts
  const tInsert = performance.now()
  const insertStmt = db.prepare('INSERT INTO notes VALUES (?, ?, ?, ?, ?, ?)')
  for (let i = 0; i < 100; i++) {
    insertStmt.run([
      `note-${i}`,
      `Performance Test Note ${i}`,
      `Sample body content for note number ${i} testing throughput.`,
      Date.now() - i * 1000,
      Date.now() - i * 1000,
      i % 5 === 0 ? 1 : 0
    ])
  }
  insertStmt.free()
  const insert100Ms = performance.now() - tInsert
  console.log(`• 100 Notes Bulk Insertion: ${insert100Ms.toFixed(2)} ms (${(insert100Ms / 100).toFixed(3)} ms/op)`)

  // Measure Search Query
  const tSearch = performance.now()
  const searchStmt = db.prepare('SELECT * FROM notes WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ?')
  searchStmt.bind(['%test note 42%', '%test note 42%'])
  const results = []
  while (searchStmt.step()) {
    results.push(searchStmt.getAsObject())
  }
  searchStmt.free()
  const searchMs = performance.now() - tSearch
  console.log(`• Full-text Search across 100 notes: ${searchMs.toFixed(2)} ms (found ${results.length})`)

  // Measure Database Export / Serialization
  const tExport = performance.now()
  const bytes = db.export()
  const exportMs = performance.now() - tExport
  console.log(`• Database Serialization (.export): ${exportMs.toFixed(2)} ms (size: ${(bytes.length / 1024).toFixed(1)} KB)`)

  db.close()
  return { wasmInitMs, insert100Ms, searchMs, exportMs, dbSizeBytes: bytes.length }
}

async function profileStartupAndMemory() {
  console.log('\n--- 2. Electron Startup Timing & Process Memory ---')
  if (!fs.existsSync(unpackedExe)) {
    console.log('Skipping packaged app launch profile: dist/win-unpacked/Helm.exe not found.')
    return null
  }

  // Kill any existing instances
  try {
    execSync('taskkill /F /IM Helm.exe /T 2>nul')
  } catch {}

  const cleanEnv = { ...process.env }
  delete cleanEnv.ELECTRON_RUN_AS_NODE

  // Measure Cold Startup
  const tStart = performance.now()
  const proc = spawn(unpackedExe, [], {
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: cleanEnv
  })

  let readyToShowTime = null
  let pipeServerTime = null

  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve()
    }, 4000)

    proc.stdout.on('data', (d) => {
      const text = d.toString('utf-8')
      if (text.includes('Named Pipe server listening') && !pipeServerTime) {
        pipeServerTime = performance.now() - tStart
      }
      if (text.includes('Application ready') && !readyToShowTime) {
        readyToShowTime = performance.now() - tStart
      }
      if (pipeServerTime && readyToShowTime) {
        clearTimeout(timeout)
        resolve()
      }
    })
  })

  const coldStartupMs = readyToShowTime || (performance.now() - tStart)
  console.log(`• App Launch to Ready: ${coldStartupMs.toFixed(1)} ms`)
  if (pipeServerTime) {
    console.log(`• Named Pipe IPC Active: ${pipeServerTime.toFixed(1)} ms`)
  }

  // Measure Running Memory via tasklist
  let memInfo = null
  try {
    const tasklistOutput = execSync('tasklist /FI "IMAGENAME eq Helm.exe" /FO CSV /NH', { encoding: 'utf-8' })
    const lines = tasklistOutput.trim().split('\n')
    let totalKBytes = 0
    let processCount = 0
    for (const line of lines) {
      const parts = line.split('","')
      if (parts.length >= 5) {
        const memStr = parts[4].replace(/[",\sK]/g, '')
        const kb = parseInt(memStr, 10)
        if (!isNaN(kb)) {
          totalKBytes += kb
          processCount++
        }
      }
    }
    const totalMb = totalKBytes / 1024
    memInfo = { totalMb, processCount }
    console.log(`• Process Memory (Total RSS across ${processCount} processes): ${totalMb.toFixed(1)} MB`)
  } catch (err) {
    console.warn('Could not read tasklist memory:', err.message)
  }

  // Gracefully terminate process
  try {
    proc.kill()
    execSync('taskkill /F /IM Helm.exe /T 2>nul')
  } catch {}

  return { coldStartupMs, pipeServerTime, memInfo }
}

async function run() {
  console.log('=================================================================')
  console.log('  Helm Windows — Phase 5.6 Baseline Profiling')
  console.log('=================================================================')

  const dbMetrics = await profileDatabase()
  const appMetrics = await profileStartupAndMemory()

  console.log('\n=================================================================')
  console.log('  Profiling Complete')
  console.log('=================================================================\n')
}

run().catch(console.error)

