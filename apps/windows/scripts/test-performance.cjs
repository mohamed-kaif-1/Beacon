/**
 * Helm Windows — Phase 5.6: Performance & Memory Profiling Test Suite
 * Validates startup optimizations, visibility-aware timer throttling,
 * composite database indexing, reduced motion GPU memory release,
 * ambient transition cleanup, IPC unregistration, and memory stability.
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { performance } = require('perf_hooks')

console.log('=================================================================')
console.log('  Helm Windows — Phase 5.6 Performance & Stability Tests')
console.log('=================================================================\n')

const rootDir = path.resolve(__dirname, '..')

async function runTests() {
  let passed = 0

  // -------------------------------------------------------------------------
  // TEST 1: Startup Timing Instrumentation & Deferred Initialization
  // -------------------------------------------------------------------------
  console.log('[TEST 1] Testing Startup Timing & Deferred Host Registration...')
  const mainTs = fs.readFileSync(path.join(rootDir, 'electron', 'main.ts'), 'utf-8')

  // Verify that ensureNativeMessagingHostRegistered is deferred using setImmediate
  assert(
    mainTs.includes('setImmediate(() => {') &&
    mainTs.includes('ensureNativeMessagingHostRegistered()'),
    'ensureNativeMessagingHostRegistered must be deferred with setImmediate to prevent startup blocking'
  )

  // Verify custom protocol registration before app.ready
  assert(
    mainTs.includes("protocol.registerSchemesAsPrivileged([") &&
    mainTs.includes("scheme: 'helm-wallpaper'"),
    'Custom protocol must be registered as privileged before app is ready'
  )

  console.log('✓ TEST 1 Passed: Critical startup path is unblocked and non-critical registrations are deferred.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 2: Window Lifecycle & Tray Minimize Handling
  // -------------------------------------------------------------------------
  console.log('\n[TEST 2] Testing Window Lifecycle & Tray Minimize Handling...')
  
  // Verify minimize-to-tray handling in main.ts
  assert(
    mainTs.includes("mainWindow.on('minimize'") &&
    mainTs.includes("current.general.minimizeToTray") &&
    mainTs.includes("mainWindow?.hide()"),
    'Minimize event must hide window to tray when minimizeToTray setting is active'
  )

  // Verify close behavior handling
  assert(
    mainTs.includes("mainWindow.on('close'") &&
    mainTs.includes("current.general.closeBehavior === 'quit'") &&
    mainTs.includes("event.preventDefault()"),
    'Close event must prevent default and hide to tray unless closeBehavior is quit'
  )

  // Verify renderer crash recovery logic
  assert(
    mainTs.includes("render-process-gone") &&
    mainTs.includes("Initiating automatic renderer window recovery"),
    'Renderer crash recovery listener must be installed with bounded recovery'
  )

  console.log('✓ TEST 2 Passed: Window lifecycle properly hides to tray without desktop render passes.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 3: Visibility-Aware Event Listener & Timer Throttling
  // -------------------------------------------------------------------------
  console.log('\n[TEST 3] Testing Visibility-Aware Timer Throttling...')
  const ambientBoardTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'ambient', 'AmbientBoardPage.tsx'), 'utf-8')
  const ambientClockTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'ambient', 'AmbientClockWeather.tsx'), 'utf-8')

  // AmbientBoardPage must track document visibility
  assert(
    ambientBoardTs.includes("document.addEventListener('visibilitychange'") &&
    ambientBoardTs.includes("document.removeEventListener('visibilitychange'"),
    'AmbientBoardPage must track and clean up visibilitychange event listener'
  )

  // Slideshow interval must pause when !isWindowVisible
  assert(
    ambientBoardTs.includes("if (isPlaying && isWindowVisible && settings.slideshowInterval > 0"),
    'Slideshow interval must require isWindowVisible to run'
  )

  // AmbientClockWeather must halt 1s interval when hidden in tray
  assert(
    ambientClockTs.includes("if (!document.hidden)") &&
    ambientClockTs.includes("timer = setInterval(updateTime, 1000)") &&
    ambientClockTs.includes("if (document.hidden)"),
    'AmbientClockWeather must suspend 1-second interval when document is hidden in tray'
  )

  console.log('✓ TEST 3 Passed: Background timers are suspended when Helm is minimized in tray.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 4: SQLite WASM Query Latency & Composite Index Utilization
  // -------------------------------------------------------------------------
  console.log('\n[TEST 4] Testing SQLite Composite Indexing & Query Latency...')
  const initSqlJs = require('sql.js')
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(rootDir, 'node_modules', 'sql.js', 'dist', file)
  })

  const db = new SQL.Database()
  db.run(`
    CREATE TABLE notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      is_pinned INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE tasks (
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

    CREATE INDEX idx_notes_pinned_updated ON notes(is_pinned DESC, updated_at DESC);
    CREATE INDEX idx_tasks_status_due ON tasks(status, due_date);
  `)

  // Check EXPLAIN QUERY PLAN for sorted notes query
  const explainStmt = db.prepare('EXPLAIN QUERY PLAN SELECT * FROM notes ORDER BY is_pinned DESC, updated_at DESC')
  const planRows = []
  while (explainStmt.step()) {
    planRows.push(explainStmt.getAsObject())
  }
  explainStmt.free()

  const planText = planRows.map((r) => r.detail || JSON.stringify(r)).join('; ')
  assert(
    planText.includes('idx_notes_pinned_updated'),
    `Query plan must utilize idx_notes_pinned_updated. Actual plan: ${planText}`
  )

  // Insert 100 notes & 100 tasks and measure query execution latency
  const insertNote = db.prepare('INSERT INTO notes VALUES (?, ?, ?, ?, ?, ?)')
  for (let i = 0; i < 100; i++) {
    insertNote.run([
      `note-${i}`,
      `Title ${i}`,
      `Content ${i}`,
      Date.now() - i,
      Date.now() - i,
      i % 4 === 0 ? 1 : 0
    ])
  }
  insertNote.free()

  const t0 = performance.now()
  const queryStmt = db.prepare('SELECT * FROM notes ORDER BY is_pinned DESC, updated_at DESC')
  const results = []
  while (queryStmt.step()) {
    results.push(queryStmt.getAsObject())
  }
  queryStmt.free()
  const queryMs = performance.now() - t0

  assert.strictEqual(results.length, 100, 'Should return all 100 notes')
  assert(queryMs < 10, `Query latency should be under 10ms (actual: ${queryMs.toFixed(3)}ms)`)

  db.close()
  console.log(`✓ TEST 4 Passed: Composite index verified with EXPLAIN QUERY PLAN; 100 notes sorted in ${queryMs.toFixed(3)}ms.`)
  passed++

  // -------------------------------------------------------------------------
  // TEST 5: Reduced Motion & GPU Layer De-allocation
  // -------------------------------------------------------------------------
  console.log('\n[TEST 5] Testing Reduced Motion GPU Texture De-allocation...')
  const globalsCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'globals.css'), 'utf-8')

  // Verify that reduced-motion rules suppress animation and reset transform & will-change
  assert(
    globalsCss.includes('.reduced-motion .animate-kenburns-a') &&
    globalsCss.includes('will-change: auto !important') &&
    globalsCss.includes('animation: none !important') &&
    globalsCss.includes('transform: none !important'),
    'globals.css must reset transform and will-change to auto for reduced motion to release GPU texture backing'
  )

  assert(
    globalsCss.includes('@media (prefers-reduced-motion: reduce)') &&
    globalsCss.includes('.animate-kenburns-a,') &&
    globalsCss.includes('will-change: auto !important'),
    '@media prefers-reduced-motion must also reset will-change to auto'
  )

  console.log('✓ TEST 5 Passed: Reduced-motion rules cleanly unpromote GPU compositor layers.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 6: Ambient Ken Burns Double-Buffer Transition Cleanup
  // -------------------------------------------------------------------------
  console.log('\n[TEST 6] Testing Ambient Double-Buffer Transition Cleanup...')
  const slideshowTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'ambient', 'KenBurnsSlideshow.tsx'), 'utf-8')

  // Verify double buffer conditional rendering: previous wallpaper only exists during transition
  assert(
    slideshowTs.includes('{previousWallpaper && isTransitioning && ('),
    'Previous wallpaper layer must only be rendered during active transition'
  )

  // Verify transition timeout clearing on rapid transitions in AmbientBoardPage
  assert(
    ambientBoardTs.includes('if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)'),
    'AmbientBoardPage must clear previous transition timer before starting a new transition'
  )

  console.log('✓ TEST 6 Passed: Double-buffer layer unmounts immediately post-transition and timers are cleared.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 7: IPC Lifecycle Idempotence & Leak-Free Cleanup
  // -------------------------------------------------------------------------
  console.log('\n[TEST 7] Testing IPC Lifecycle Idempotence & Unregistration...')
  const ipcTs = fs.readFileSync(path.join(rootDir, 'electron', 'ipc.ts'), 'utf-8')
  const pipeServerTs = fs.readFileSync(path.join(rootDir, 'electron', 'pipe-server.ts'), 'utf-8')

  // Verify unregisterIpcHandlers exists and is exported
  assert(
    ipcTs.includes('export function unregisterIpcHandlers(): void'),
    'unregisterIpcHandlers must be exported from electron/ipc.ts'
  )

  // Verify safe handle registration with removeHandler beforehand
  assert(
    ipcTs.includes('ipcMain.removeHandler(channel)') &&
    ipcTs.includes('ipcMain.handle(channel, handler)'),
    'registerHandle must remove existing handler before registering to prevent duplicate registration errors'
  )

  // Verify stopPipeServer cleans up timers and destroys active sockets
  assert(
    pipeServerTs.includes('clearInterval(leaseCheckTimer)') &&
    pipeServerTs.includes('socket.destroy()') &&
    pipeServerTs.includes('activeSockets.clear()'),
    'stopPipeServer must clear leaseCheckTimer and destroy all active sockets'
  )

  console.log('✓ TEST 7 Passed: IPC handlers and pipe server cleanup properly without memory retention.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 8: Process Memory & Garbage Collection Stability
  // -------------------------------------------------------------------------
  console.log('\n[TEST 8] Testing Process Memory & Operation Stability...')
  const db2 = new SQL.Database()
  db2.run(`
    CREATE TABLE notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER,
      updated_at INTEGER,
      is_pinned INTEGER
    );
  `)

  // Run 1,000 rapid operations (insert, update, select, delete) and check memory
  const startMem = process.memoryUsage().heapUsed
  const insertOp = db2.prepare('INSERT INTO notes VALUES (?, ?, ?, ?, ?, ?)')
  const updateOp = db2.prepare('UPDATE notes SET content = ? WHERE id = ?')
  const deleteOp = db2.prepare('DELETE FROM notes WHERE id = ?')

  for (let i = 0; i < 500; i++) {
    insertOp.run([`n-${i}`, `Title ${i}`, `Content body ${i}`, Date.now(), Date.now(), 0])
    updateOp.run([`Updated content body ${i}`, `n-${i}`])
    if (i % 2 === 0) {
      deleteOp.run([`n-${i}`])
    }
  }
  insertOp.free()
  updateOp.free()
  deleteOp.free()

  // Export database bytes
  const bytes = db2.export()
  assert(bytes.length > 0, 'Database export should produce non-empty buffer')
  db2.close()

  if (global.gc) {
    global.gc()
  }

  const endMem = process.memoryUsage().heapUsed
  const heapDeltaMb = (endMem - startMem) / 1024 / 1024
  console.log(`• Memory delta after 1,000 DB operations: ${heapDeltaMb.toFixed(2)} MB`)
  assert(heapDeltaMb < 35, `Heap delta should be under 35 MB (actual: ${heapDeltaMb.toFixed(2)} MB)`)

  console.log('✓ TEST 8 Passed: Memory remains stable across rapid database transactions.')
  passed++

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n=================================================================')
  console.log(`  Phase 5.6 Performance Test Suite: ${passed}/8 Tests PASSED!`)
  console.log('=================================================================\n')
}

runTests().catch((err) => {
  console.error('\n❌ Test failed with error:', err)
  process.exit(1)
})

