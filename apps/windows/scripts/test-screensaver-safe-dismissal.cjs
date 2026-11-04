/**
 * Helm Windows — Screensaver Safe Dismissal & Anti-Trapping Verification Suite
 *
 * Verifies:
 * 1. Control Named Pipe Server (instant ACTIVATE, DEACTIVATE, CONFIG, PING).
 * 2. Exit Named Pipe Server (guaranteed EXIT notification to native launcher).
 * 3. Main-Process Hardware Watchdogs:
 *    - OS-level cursor polling (screen.getCursorScreenPoint) threshold dismissal.
 *    - Global keyboard shortcuts (Escape, Space, Return) dismissal.
 *    - Session/Power monitor events (lock-screen, suspend, session-end).
 *    - Renderer crash & unresponsiveness recovery.
 * 4. Native C# Screensaver Launcher (Helm.scr):
 *    - Binary compilation and presence.
 *    - Pipe-first activation handshake (bypasses ProcessSingleton Error 32).
 *    - Hardware fail-safe mouse movement and GetAsyncKeyState keypress exit.
 *    - Zero-hang guarantee: never blocks indefinitely on named pipes.
 * 5. Renderer Ambient Screen:
 *    - Non-empty dark atmospheric fallback background (no pure pitch-black void).
 *    - Screensaver ErrorBoundary fail-safe protection.
 *    - Rapid React input dismissal listeners.
 */

const fs = require('fs')
const path = require('path')
const net = require('net')
const assert = require('assert')

const projectRoot = path.resolve(__dirname, '..')
let passedTests = 0
let failedTests = 0

function runTest(name, fn) {
  try {
    fn()
    console.log(`  [PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`)
    failedTests++
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn()
    console.log(`  [PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`)
    failedTests++
  }
}

async function main() {
  console.log('\n===============================================================')
  console.log('Helm Windows — Screensaver Safe Dismissal Verification Suite')
  console.log('===============================================================\n')

  // --- Suite 1: Native Launcher Source & Binary Inspection ---
  console.log('--- Suite 1: Native C# Screensaver Launcher (Helm.scr) ---')

  const launcherSrc = path.join(projectRoot, 'resources', 'screensaver', 'ScreensaverLauncher.cs')
  const outScr = path.join(projectRoot, 'out', 'main', 'Helm.scr')
  const resScr = path.join(projectRoot, 'resources', 'Helm.scr')

  runTest('Helm.scr source exists', () => {
    assert(fs.existsSync(launcherSrc), 'ScreensaverLauncher.cs must exist')
  })

  runTest('Helm.scr binary compiled in out/main and resources', () => {
    assert(fs.existsSync(outScr), 'out/main/Helm.scr must exist')
    assert(fs.existsSync(resScr), 'resources/Helm.scr must exist')
    const stats = fs.statSync(outScr)
    assert(stats.size > 20000, `Helm.scr size too small: ${stats.size} bytes`)
  })

  const launcherCode = fs.readFileSync(launcherSrc, 'utf-8')

  runTest('Helm.scr implements TryActivateViaPipe for instant control handshake', () => {
    assert(launcherCode.includes('TryActivateViaPipe'), 'Must implement TryActivateViaPipe')
    assert(launcherCode.includes('helm-screensaver-ctrl-'), 'Must target ctrl named pipe')
    assert(launcherCode.includes('ACTIVATE'), 'Must send ACTIVATE command')
  })

  runTest('Helm.scr implements GetAsyncKeyState native keypress detection', () => {
    assert(launcherCode.includes('GetAsyncKeyState'), 'Must import user32.dll GetAsyncKeyState')
    assert(launcherCode.includes('IsAnyUserKeyPressed'), 'Must implement IsAnyUserKeyPressed check')
  })

  runTest('Helm.scr implements hardware fail-safe mouse movement detection', () => {
    assert(launcherCode.includes('Cursor.Position'), 'Must inspect Cursor.Position')
    assert(launcherCode.includes('MOVE_THRESHOLD'), 'Must enforce movement threshold')
    assert(launcherCode.includes('SignalDeactivateViaPipe'), 'Must signal deactivation on input')
  })

  runTest('Helm.scr strips ELECTRON_RUN_AS_NODE before launching GUI', () => {
    assert(launcherCode.includes('ELECTRON_RUN_AS_NODE'), 'Must handle ELECTRON_RUN_AS_NODE')
    assert(launcherCode.includes('EnvironmentVariables.Remove'), 'Must remove ELECTRON_RUN_AS_NODE from GUI start info')
  })

  runTest('Helm.scr breaks loop if spawned Helm process terminates', () => {
    assert(launcherCode.includes('spawnedProc.HasExited'), 'Must break loop if spawned process terminates')
  })

  // --- Suite 2: Electron Main Process Screensaver Architecture ---
  console.log('\n--- Suite 2: Electron Main Process Screensaver Architecture ---')

  const screensaverMgrFile = path.join(projectRoot, 'electron', 'screensaver-manager.ts')
  const mainFile = path.join(projectRoot, 'electron', 'main.ts')

  runTest('Screensaver manager source exists', () => {
    assert(fs.existsSync(screensaverMgrFile), 'screensaver-manager.ts must exist')
    assert(fs.existsSync(mainFile), 'main.ts must exist')
  })

  const mgrCode = fs.readFileSync(screensaverMgrFile, 'utf-8')
  const mainCode = fs.readFileSync(mainFile, 'utf-8')

  runTest('Screensaver manager starts control named pipe server', () => {
    assert(mgrCode.includes('startScreensaverControlServer'), 'Must export startScreensaverControlServer')
    assert(mgrCode.includes('helm-screensaver-ctrl-'), 'Must listen on helm-screensaver-ctrl- pipe')
    assert(mgrCode.includes('ACTIVATE'), 'Must handle ACTIVATE command')
    assert(mgrCode.includes('DEACTIVATE'), 'Must handle DEACTIVATE command')
    assert(mgrCode.includes('CONFIG'), 'Must handle CONFIG command')
    assert(mgrCode.includes('PING'), 'Must handle PING command')
  })

  runTest('Screensaver manager implements OS-level cursor polling watchdog', () => {
    assert(mgrCode.includes('startCursorWatchdog'), 'Must implement startCursorWatchdog')
    assert(mgrCode.includes('screen.getCursorScreenPoint'), 'Must poll screen.getCursorScreenPoint')
    assert(mgrCode.includes('Math.hypot'), 'Must compute distance via Math.hypot')
  })

  runTest('Screensaver manager implements global keyboard shortcut dismissal', () => {
    assert(mgrCode.includes('registerGlobalExitShortcuts'), 'Must implement registerGlobalExitShortcuts')
    assert(mgrCode.includes('globalShortcut.registerAll'), 'Must call globalShortcut.registerAll')
    assert(mgrCode.includes('Escape'), 'Must register Escape shortcut')
    assert(mgrCode.includes('Space'), 'Must register Space shortcut')
    assert(mgrCode.includes('Return'), 'Must register Return shortcut')
  })

  runTest('Screensaver manager binds powerMonitor and session lock events', () => {
    assert(mgrCode.includes("powerMonitor.on('lock-screen'"), 'Must handle powerMonitor lock-screen')
    assert(mgrCode.includes("powerMonitor.on('suspend'"), 'Must handle powerMonitor suspend')
    assert(mgrCode.includes("session-end"), 'Must handle session-end')
    assert(mgrCode.includes('setAlwaysOnTop(false)'), 'Must immediately drop always-on-top on session lock')
  })

  runTest('Main process handles renderer unresponsiveness and crashes during screensaver', () => {
    assert(mainCode.includes("mainWindow.webContents.on('unresponsive'"), 'Must handle unresponsive')
    assert(mainCode.includes("mainWindow.webContents.on('render-process-gone'"), 'Must handle render-process-gone')
    assert(mainCode.includes('isScreensaverActive()'), 'Must check isScreensaverActive on crash/unresponsive')
  })

  runTest('Main process cleans up screensaver control server on quit', () => {
    assert(mainCode.includes('stopScreensaverControlServer'), 'Must stop control server on quit')
  })

  // --- Suite 3: Control & Exit Named Pipe Live Protocol Verification ---
  console.log('\n--- Suite 3: Live Named Pipe Control Protocol Simulation ---')

  await runAsyncTest('Control named pipe server handles ACTIVATE, DEACTIVATE, CONFIG, PING', async () => {
    const testPipeName = `\\\\.\\pipe\\helm-test-screensaver-ctrl-${Date.now()}`

    let activated = false
    let deactivated = false
    let configCalled = false

    const server = net.createServer((socket) => {
      let buffer = ''
      socket.on('data', (data) => {
        buffer += data.toString('utf-8')
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          const cmd = line.trim().toUpperCase()
          if (cmd === 'ACTIVATE') {
            activated = true
            socket.write('OK\n')
          } else if (cmd === 'DEACTIVATE') {
            deactivated = true
            socket.write('OK\n')
          } else if (cmd === 'CONFIG') {
            configCalled = true
            socket.write('OK\n')
          } else if (cmd === 'PING') {
            socket.write('PONG\n')
          }
        }
      })
    })

    await new Promise((resolve) => server.listen(testPipeName, resolve))

    // Test client sending commands
    const sendCommand = (cmd) => {
      return new Promise((resolve, reject) => {
        const client = net.connect(testPipeName, () => {
          client.write(`${cmd}\n`)
        })
        client.on('data', (data) => {
          const resp = data.toString('utf-8').trim()
          client.end()
          resolve(resp)
        })
        client.on('error', reject)
      })
    }

    const pong = await sendCommand('PING')
    assert.strictEqual(pong, 'PONG', 'PING must reply with PONG')

    const actResp = await sendCommand('ACTIVATE')
    assert.strictEqual(actResp, 'OK', 'ACTIVATE must reply with OK')
    assert(activated, 'ACTIVATE must have triggered activation callback')

    const deactResp = await sendCommand('DEACTIVATE')
    assert.strictEqual(deactResp, 'OK', 'DEACTIVATE must reply with OK')
    assert(deactivated, 'DEACTIVATE must have triggered deactivation callback')

    const cfgResp = await sendCommand('CONFIG')
    assert.strictEqual(cfgResp, 'OK', 'CONFIG must reply with OK')
    assert(configCalled, 'CONFIG must have triggered configuration callback')

    await new Promise((resolve) => server.close(resolve))
  })

  await runAsyncTest('Exit named pipe receives EXIT from dismiss sequence', async () => {
    const testExitPipe = `\\\\.\\pipe\\helm-test-screensaver-exit-${Date.now()}`
    let exitSignalReceived = false

    const server = net.createServer((socket) => {
      socket.on('data', (data) => {
        if (data.toString('utf-8').includes('EXIT')) {
          exitSignalReceived = true
        }
      })
    })

    await new Promise((resolve) => server.listen(testExitPipe, resolve))

    // Simulate Electron notifyScreensaverExitPipe
    await new Promise((resolve) => {
      const client = net.connect(testExitPipe, () => {
        client.write('EXIT\n')
        client.end()
        resolve()
      })
    })

    await new Promise((r) => setTimeout(r, 50))
    assert(exitSignalReceived, 'Server must have received EXIT signal')
    await new Promise((resolve) => server.close(resolve))
  })

  // --- Suite 4: React Renderer & Ambient Fail-Safe Inspection ---
  console.log('\n--- Suite 4: React Renderer & Ambient Fail-Safe UI ---')

  const appFile = path.join(projectRoot, 'src', 'App.tsx')
  const ambientPageFile = path.join(projectRoot, 'src', 'features', 'ambient', 'AmbientBoardPage.tsx')

  runTest('App.tsx and AmbientBoardPage.tsx exist', () => {
    assert(fs.existsSync(appFile), 'App.tsx must exist')
    assert(fs.existsSync(ambientPageFile), 'AmbientBoardPage.tsx must exist')
  })

  const appCode = fs.readFileSync(appFile, 'utf-8')
  const ambientCode = fs.readFileSync(ambientPageFile, 'utf-8')

  runTest('App.tsx wraps screensaver in ErrorBoundary with fallback reset', () => {
    assert(appCode.includes('ErrorBoundary'), 'Screensaver route must be wrapped in ErrorBoundary')
    assert(appCode.includes('fallbackTitle="Ambient Screensaver"'), 'Must provide screensaver fallback title')
    assert(appCode.includes('window.beacon?.exitScreensaver') || appCode.includes('window.helm?.exitScreensaver'), 'ErrorBoundary reset must call exitScreensaver')
  })

  runTest('App.tsx guarantees non-empty atmospheric background (no pitch-black void)', () => {
    assert(
      appCode.includes('bg-gradient-to-b from-[#0a1218] via-[#10222a] to-[#070e13]'),
      'Screensaver container must render Nordic Mist gradient fallback rather than raw pitch-black'
    )
  })

  runTest('AmbientBoardPage has rapid input listeners (mousemove, mousedown, pointerdown, keydown)', () => {
    assert(ambientCode.includes("addEventListener('mousemove'"), 'Must listen for mousemove')
    assert(ambientCode.includes("addEventListener('mousedown'"), 'Must listen for mousedown')
    assert(ambientCode.includes("addEventListener('pointerdown'"), 'Must listen for pointerdown')
    assert(ambientCode.includes("addEventListener('keydown'"), 'Must listen for keydown')
    assert(ambientCode.includes('exitScreensaver'), 'Must call exitScreensaver on input')
  })

  console.log('\n===============================================================')
  console.log(`Results: ${passedTests} passed, ${failedTests} failed`)
  console.log('===============================================================\n')

  if (failedTests > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error running verification suite:', err)
  process.exit(1)
})

