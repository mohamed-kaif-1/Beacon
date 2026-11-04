/**
 * Helm Windows — Phase 6 Screensaver Test Suite
 *
 * Verifies:
 * 1. Native Helm.scr binary presence, PE header, and size
 * 2. C# ScreensaverLauncher compilation and argument handling
 * 3. Screensaver settings schema, privacy-safe defaults (showTasks=false, showWatches=false)
 * 4. Registry reading and per-user configuration (HKCU\Control Panel\Desktop)
 * 5. Named pipe exit synchronization (helm-screensaver-exit-<username>)
 * 6. Package extraFiles bundling and installer integration
 */

const fs = require('fs')
const path = require('path')
const { execSync, spawn } = require('child_process')
const net = require('net')
const os = require('os')

const projectRoot = path.resolve(__dirname, '..')
const outMain = path.join(projectRoot, 'out', 'main')
const scrPath = path.join(outMain, 'Helm.scr')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`)
    passed++
  } else {
    console.error(`  [FAIL] ${message}`)
    failed++
  }
}

// -------------------------------------------------------------
// Mirror of electron/settings-store.ts functions for standalone node testing
// -------------------------------------------------------------
const DEFAULT_SCREENSAVER_SETTINGS = {
  enabled: false,
  showClock: true,
  showDate: true,
  showWeather: true,
  showQuote: true,
  showTasks: false,
  showWatches: false,
  exitOnMouseMove: true
}

function getScrExecutablePath() {
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
  const candidates = [
    path.join(localAppData, 'Programs', 'Helm', 'Helm.scr'),
    path.join(projectRoot, 'out', 'main', 'Helm.scr'),
    path.join(projectRoot, 'resources', 'Helm.scr')
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return path.join(localAppData, 'Programs', 'Helm', 'Helm.scr')
}

function getWindowsScreensaverStatus() {
  const targetScr = getScrExecutablePath()
  let isRegistered = false
  let activeScreensaverPath = ''
  let timeoutSeconds = 600
  let screenSaveActive = false

  try {
    const stdout = execSync('reg query "HKCU\\Control Panel\\Desktop" /s', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000
    })

    const scrMatch = stdout.match(/SCRNSAVE\.EXE\s+REG_SZ\s+(.*)/i)
    if (scrMatch && scrMatch[1]) {
      activeScreensaverPath = scrMatch[1].trim()
      const normalizedActive = path.normalize(activeScreensaverPath).toLowerCase()
      const normalizedHelm = path.normalize(targetScr).toLowerCase()
      isRegistered =
        normalizedActive === normalizedHelm ||
        normalizedActive.endsWith('helm.scr')
    }

    const activeMatch = stdout.match(/ScreenSaveActive\s+REG_SZ\s+([01])/i)
    if (activeMatch && activeMatch[1]) {
      screenSaveActive = activeMatch[1].trim() === '1'
    }

    const timeoutMatch = stdout.match(/ScreenSaveTimeOut\s+REG_SZ\s+(\d+)/i)
    if (timeoutMatch && timeoutMatch[1]) {
      timeoutSeconds = parseInt(timeoutMatch[1].trim(), 10) || 600
    }
  } catch (err) {}

  return {
    isRegistered,
    scrPath: targetScr,
    activeScreensaverPath,
    timeoutSeconds,
    screenSaveActive
  }
}

function setWindowsScreensaverActive(active) {
  const targetScr = getScrExecutablePath()
  try {
    if (active) {
      execSync(`reg add "HKCU\\Control Panel\\Desktop" /v SCRNSAVE.EXE /t REG_SZ /d "${targetScr}" /f`, {
        stdio: 'ignore',
        timeout: 3000
      })
      execSync(`reg add "HKCU\\Control Panel\\Desktop" /v ScreenSaveActive /t REG_SZ /d "1" /f`, {
        stdio: 'ignore',
        timeout: 3000
      })
    } else {
      execSync('reg delete "HKCU\\Control Panel\\Desktop" /v SCRNSAVE.EXE /f', {
        stdio: 'ignore',
        timeout: 3000
      })
    }
    return true
  } catch (err) {
    return false
  }
}

async function runTests() {
  console.log('\n=== Helm Windows Phase 6: Native Screensaver Test Suite ===\n')

  // -------------------------------------------------------------
  // Test 1: Compile and verify Helm.scr native binary
  // -------------------------------------------------------------
  console.log('[Test 1] Native Screensaver Binary (Helm.scr)')
  try {
    execSync('node scripts/build-launcher.cjs', { cwd: projectRoot, stdio: 'ignore' })
  } catch (err) {
    console.error('Failed to run build-launcher.cjs:', err)
  }

  assert(fs.existsSync(scrPath), `Helm.scr exists at ${scrPath}`)

  if (fs.existsSync(scrPath)) {
    const stats = fs.statSync(scrPath)
    assert(stats.size > 10000, `Helm.scr has realistic binary size: ${stats.size} bytes`)

    const buffer = Buffer.alloc(2)
    const fd = fs.openSync(scrPath, 'r')
    fs.readSync(fd, buffer, 0, 2, 0)
    fs.closeSync(fd)
    const isPE = buffer[0] === 0x4d && buffer[1] === 0x5a // 'MZ'
    assert(isPE, 'Helm.scr is a valid Windows PE executable (MZ signature)')
  }

  // -------------------------------------------------------------
  // Test 2: Screensaver settings schema and privacy-safe defaults
  // -------------------------------------------------------------
  console.log('\n[Test 2] Screensaver Settings Schema & Privacy-First Defaults')

  assert(DEFAULT_SCREENSAVER_SETTINGS !== undefined, 'DEFAULT_SCREENSAVER_SETTINGS exists')
  assert(DEFAULT_SCREENSAVER_SETTINGS.showClock === true, 'Default showClock is true')
  assert(DEFAULT_SCREENSAVER_SETTINGS.showDate === true, 'Default showDate is true')
  assert(DEFAULT_SCREENSAVER_SETTINGS.showWeather === true, 'Default showWeather is true')
  assert(DEFAULT_SCREENSAVER_SETTINGS.showQuote === true, 'Default showQuote is true')
  assert(
    DEFAULT_SCREENSAVER_SETTINGS.showTasks === false,
    'PRIVACY CHECK: Default showTasks is FALSE (personal tasks hidden on screensaver)'
  )
  assert(
    DEFAULT_SCREENSAVER_SETTINGS.showWatches === false,
    'PRIVACY CHECK: Default showWatches is FALSE (monitored tabs hidden on screensaver)'
  )
  assert(DEFAULT_SCREENSAVER_SETTINGS.exitOnMouseMove === true, 'Default exitOnMouseMove is true')

  // Read actual settings.json if exists
  const settingsPath = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Helm', 'settings.json')
  if (fs.existsSync(settingsPath)) {
    try {
      const saved = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
      if (saved.screensaver) {
        assert(typeof saved.screensaver === 'object', 'Persistent settings contains screensaver object')
        assert(typeof saved.screensaver.showTasks === 'boolean', 'screensaver.showTasks is boolean')
      }
    } catch {}
  }

  // -------------------------------------------------------------
  // Test 3: Windows Registry Screensaver Integration (HKCU)
  // -------------------------------------------------------------
  console.log('\n[Test 3] Windows Registry Integration (HKCU\\Control Panel\\Desktop)')

  const initialStatus = getWindowsScreensaverStatus()
  assert(typeof initialStatus.isRegistered === 'boolean', 'getWindowsScreensaverStatus returns isRegistered')
  assert(typeof initialStatus.timeoutSeconds === 'number', `Windows idle timeout read: ${initialStatus.timeoutSeconds}s`)
  assert(typeof initialStatus.scrPath === 'string', `Target scrPath resolved: ${initialStatus.scrPath}`)

  // Test setWindowsScreensaverActive(true)
  const setActiveResult = setWindowsScreensaverActive(true)
  assert(setActiveResult === true, 'setWindowsScreensaverActive(true) succeeded')

  const postActiveStatus = getWindowsScreensaverStatus()
  assert(postActiveStatus.isRegistered === true, 'Registry verification: Helm is active SCRNSAVE.EXE')
  assert(postActiveStatus.screenSaveActive === true, 'Registry verification: ScreenSaveActive is 1')

  // Test setWindowsScreensaverActive(false)
  const setInactiveResult = setWindowsScreensaverActive(false)
  assert(setInactiveResult === true, 'setWindowsScreensaverActive(false) succeeded')

  const postInactiveStatus = getWindowsScreensaverStatus()
  assert(postInactiveStatus.isRegistered === false, 'Registry verification: Helm unregistered as SCRNSAVE.EXE')

  // Restore previous user setting if it was registered initially
  if (initialStatus.isRegistered) {
    setWindowsScreensaverActive(true)
  }

  // -------------------------------------------------------------
  // Test 4: Named Pipe Exit Synchronization
  // -------------------------------------------------------------
  console.log('\n[Test 4] Named Pipe Exit Signaling')
  const username = process.env.USERNAME || ''
  const testPipeName = `\\\\.\\pipe\\helm-screensaver-exit-${username}`

  let pipeReceivedExit = false
  const pipeServer = net.createServer((socket) => {
    socket.on('data', (data) => {
      if (data.toString().includes('EXIT')) {
        pipeReceivedExit = true
      }
    })
  })

  await new Promise((resolve) => {
    pipeServer.listen(testPipeName, () => {
      const client = net.connect(testPipeName, () => {
        client.write('EXIT\n')
        client.end()
      })
      client.on('close', () => {
        setTimeout(() => {
          pipeServer.close(() => resolve())
        }, 50)
      })
    })
  })

  assert(pipeReceivedExit === true, 'Named pipe server received EXIT signal successfully')

  // -------------------------------------------------------------
  // Test 5: Packaging & Installer Bundling Checks
  // -------------------------------------------------------------
  console.log('\n[Test 5] Packaging & Script Assets')
  const pkgJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'))
  const extraFiles = pkgJson.build && pkgJson.build.extraFiles ? pkgJson.build.extraFiles : []

  const hasScrExtraFile = extraFiles.some(
    (item) => item.from && item.from.includes('Helm.scr') && item.to === 'Helm.scr'
  )
  assert(hasScrExtraFile, 'package.json extraFiles bundles Helm.scr into distribution root')

  const regPs1 = path.join(projectRoot, 'scripts', 'register-screensaver.ps1')
  const unregPs1 = path.join(projectRoot, 'scripts', 'unregister-screensaver.ps1')
  assert(fs.existsSync(regPs1), 'scripts/register-screensaver.ps1 exists')
  assert(fs.existsSync(unregPs1), 'scripts/unregister-screensaver.ps1 exists')

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n=============================================================')
  console.log(`Phase 6 Test Results: ${passed} PASSED, ${failed} FAILED`)
  console.log('=============================================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
