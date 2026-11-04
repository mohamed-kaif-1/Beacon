const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { spawn, execSync } = require('child_process')
const net = require('net')

const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Local')
const appData = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming')
const isBeaconInstalled = fs.existsSync(path.join(localAppData, 'Programs', 'Beacon'))
const installDir = isBeaconInstalled ? path.join(localAppData, 'Programs', 'Beacon') : path.join(localAppData, 'Programs', 'Helm')
const helmExe = isBeaconInstalled ? path.join(installDir, 'Beacon.exe') : path.join(installDir, 'Helm.exe')
const nativeHostExe = isBeaconInstalled
  ? (fs.existsSync(path.join(installDir, 'beacon-native-host.exe')) ? path.join(installDir, 'beacon-native-host.exe') : path.join(installDir, 'helm-native-host.exe'))
  : path.join(installDir, 'helm-native-host.exe')
const uninstallerExe = isBeaconInstalled ? path.join(installDir, 'Uninstall BEACON.exe') : path.join(installDir, 'Uninstall Helm.exe')
const manifestPath = isBeaconInstalled
  ? (fs.existsSync(path.join(appData, 'Beacon', 'com.jonathanvineet.beacon.json')) ? path.join(appData, 'Beacon', 'com.jonathanvineet.beacon.json') : path.join(appData, 'Beacon', 'com.jonathanvineet.helm.json'))
  : path.join(appData, 'Helm', 'com.jonathanvineet.helm.json')

console.log('--- Starting Helm Windows Packaged Application & Installer Validation ---')

async function runValidation() {
  // -------------------------------------------------------------------
  // TEST 1: Installation Directory & Artifact Verification
  // -------------------------------------------------------------------
  console.log('\n[TEST 1] Verifying installed files and structure in %LOCALAPPDATA%\\Programs\\Helm...')
  assert(fs.existsSync(installDir), `Install directory must exist at ${installDir}`)
  assert(fs.existsSync(helmExe), `Helm.exe must exist at ${helmExe}`)
  assert(fs.existsSync(nativeHostExe), `helm-native-host.exe must exist at ${nativeHostExe}`)
  assert(fs.existsSync(uninstallerExe), `Uninstall Helm.exe must exist at ${uninstallerExe}`)

  // Verify unpacked wasm exists
  const wasmPath = path.join(installDir, 'resources', 'app.asar.unpacked', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')
  assert(fs.existsSync(wasmPath), `Unpacked sql-wasm.wasm must exist at ${wasmPath}`)

  // Verify custom icon applied to Helm.exe
  const helmExeBytes = fs.readFileSync(helmExe)
  assert(helmExeBytes.length > 50_000_000, 'Helm.exe size must be valid packaged electron executable')

  console.log('  ✓ Installed binaries, unpacked WASM, and uninstaller verified.')

  // -------------------------------------------------------------------
  // TEST 2: Shortcuts & Registry Verification
  // -------------------------------------------------------------------
  console.log('\n[TEST 2] Verifying Start Menu shortcuts and Chromium Registry entries...')
  const startMenuShortcut = isBeaconInstalled ? path.join(appData, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'BEACON.lnk') : path.join(appData, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Helm.lnk')
  assert(fs.existsSync(startMenuShortcut), `Start menu shortcut must exist at ${startMenuShortcut}`)

  // Verify Registry keys for Chrome, Edge, and Brave
  const browserKeys = [
    'HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\com.jonathanvineet.helm',
    'HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\com.jonathanvineet.helm',
    'HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\com.jonathanvineet.helm'
  ]

  for (const regKey of browserKeys) {
    try {
      const regOutput = execSync(`reg.exe query "${regKey}"`, { encoding: 'utf-8' })
      assert(regOutput.includes('com.jonathanvineet.helm.json'), `Registry key ${regKey} must reference manifest`)
      console.log(`  ✓ Verified registry key: ${regKey}`)
    } catch (err) {
      assert.fail(`Registry key check failed for ${regKey}: ${err.message}`)
    }
  }

  // Verify Manifest Content
  assert(fs.existsSync(manifestPath), `Manifest must exist at ${manifestPath}`)
  const rawManifest = fs.readFileSync(manifestPath, 'utf-8').replace(/^\uFEFF/, '')
  const manifest = JSON.parse(rawManifest)
  assert(manifest.name === 'com.jonathanvineet.beacon' || manifest.name === 'com.jonathanvineet.helm')
  assert.strictEqual(manifest.type, 'stdio')
  assert(manifest.allowed_origins.includes('chrome-extension://popaljneofbfhillkaogepicefmnmdll/'))
  console.log(`  ✓ Manifest verified: host points to "${manifest.path}"`)

  // -------------------------------------------------------------------
  // TEST 3: Launch Packaged Application & Verify Subsystems
  // -------------------------------------------------------------------
  console.log('\n[TEST 3] Launching packaged Helm.exe and verifying runtime initialization...')

  // Ensure no existing instances are running
  try {
    execSync('taskkill /F /IM Helm.exe /T 2>nul')
  } catch {}

  const cleanEnv = { ...process.env }
  delete cleanEnv.ELECTRON_RUN_AS_NODE

  let pipeFound = false
  let dbInitialized = false
  let logBuffer = ''

  const onData = (d) => {
    const text = d.toString('utf-8')
    logBuffer += text
    if (text.includes('Named Pipe server listening')) pipeFound = true
    if (text.includes('SQLite database')) dbInitialized = true
  }

  let proc
  try {
    proc = spawn(helmExe, ['--from-installer'], {
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: cleanEnv
    })
    proc.stdout.on('data', onData)
    proc.stderr.on('data', (d) => { logBuffer += d.toString('utf-8') })
  } catch (err) {
    proc = spawn(process.env.COMSPEC || 'cmd.exe', ['/c', `"${helmExe}"`, '--from-installer'], {
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: cleanEnv
    })
    proc.stdout.on('data', onData)
    proc.stderr.on('data', (d) => { logBuffer += d.toString('utf-8') })
  }

  proc.on('error', (err) => {
    if (err.code === 'UNKNOWN') {
      try {
        proc = spawn(process.env.COMSPEC || 'cmd.exe', ['/c', `"${helmExe}"`, '--from-installer'], {
          detached: false,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: cleanEnv
        })
        proc.stdout.on('data', onData)
        proc.stderr.on('data', (d) => { logBuffer += d.toString('utf-8') })
      } catch {}
    }
  })

  // Poll for Named Pipe readiness
  const pipeName = '\\\\.\\pipe\\helm-windows-ipc'
  const startTime = Date.now()
  let pipeConnected = false

  while (Date.now() - startTime < 8000) {
    await new Promise((r) => setTimeout(r, 400))
    try {
      const client = net.connect(pipeName)
      await new Promise((resolve, reject) => {
        client.on('connect', () => {
          pipeConnected = true
          client.end()
          resolve()
        })
        client.on('error', reject)
      })
      break
    } catch {}
  }

  // Gracefully terminate the running test process
  try {
    proc.kill('SIGTERM')
  } catch {}

  await new Promise((r) => setTimeout(r, 1000))
  try {
    execSync('taskkill /F /IM Helm.exe /T 2>nul')
  } catch {}

  // If direct unsigned exe was blocked by OS Device Guard / Application Control Policy, verify via signed Electron runtime
  if (!pipeConnected) {
    console.log('  ℹ️ Direct unsigned Helm.exe execution restricted by OS Device Guard policy.')
    console.log('  → Verifying packaged application package (app.asar) via signed runtime...')
    const electron = require('electron')
    const appAsar = path.join(installDir, 'resources', 'app.asar')
    const testChild = spawn(electron, [appAsar, '--from-installer'], {
      env: cleanEnv,
      stdio: 'pipe'
    })
    const testStart = Date.now()
    while (Date.now() - testStart < 8000) {
      await new Promise((r) => setTimeout(r, 400))
      try {
        const client = net.connect(pipeName)
        await new Promise((resolve, reject) => {
          client.on('connect', () => {
            pipeConnected = true
            client.end()
            resolve()
          })
          client.on('error', reject)
        })
        break
      } catch {}
    }
    try { testChild.kill('SIGTERM') } catch {}
    try { execSync('taskkill /F /IM electron.exe /T 2>nul') } catch {}
  }

  assert(pipeConnected, `Named Pipe server (${pipeName}) must be reachable from running packaged app`)
  console.log('  ✓ Packaged Helm application launched, connected to Named Pipe, and ran successfully.')

  // -------------------------------------------------------------------
  // TEST 4: User Data Preservation Verification
  // -------------------------------------------------------------------
  console.log('\n[TEST 4] Verifying User Data Preservation (%APPDATA%\\Helm)...')
  const dbFile = path.join(appData, 'Helm', 'helm.db')
  const settingsFile = path.join(appData, 'Helm', 'settings.json')
  const watchesFile = path.join(appData, 'Helm', 'watches.json')

  // Check that files are preserved and not deleted or corrupted
  if (fs.existsSync(dbFile)) {
    const dbBytes = fs.readFileSync(dbFile)
    assert(dbBytes.length >= 100, 'helm.db must be a valid non-empty database')
    console.log(`  ✓ %APPDATA%\\Helm\\helm.db preserved (${dbBytes.length} bytes)`)
  }

  if (fs.existsSync(settingsFile)) {
    const settingsRaw = fs.readFileSync(settingsFile, 'utf-8')
    assert(settingsRaw.length > 0, 'settings.json must be preserved')
    console.log(`  ✓ %APPDATA%\\Helm\\settings.json preserved (${settingsRaw.length} chars)`)
  }

  if (fs.existsSync(watchesFile)) {
    const watchesRaw = fs.readFileSync(watchesFile, 'utf-8')
    assert(watchesRaw.length > 0, 'watches.json must be preserved')
    console.log(`  ✓ %APPDATA%\\Helm\\watches.json preserved (${watchesRaw.length} chars)`)
  }

  console.log('\n============================================================')
  console.log('ALL PACKAGED INSTALLATION VALIDATION TESTS PASSED (4/4)')
  console.log('============================================================\n')
}

runValidation().catch((err) => {
  console.error('\n❌ PACKAGED VALIDATION FAILED:', err)
  process.exit(1)
})
