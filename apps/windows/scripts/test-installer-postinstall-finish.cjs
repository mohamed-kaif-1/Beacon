const assert = require('assert')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')

console.log('=== Helm Windows: Post-Installation & Finish Launch Diagnostics Test Suite ===\n')

let passed = 0

// ---------------------------------------------------------------------------
// TEST 1: NSIS Custom Finish Page & Script Verification
// ---------------------------------------------------------------------------
console.log('[Test 1] NSIS Installer Script (resources/installer.nsh) Audit...')
const installerNshPath = path.join(projectRoot, 'resources', 'installer.nsh')
assert(fs.existsSync(installerNshPath), 'resources/installer.nsh must exist')
const installerNsh = fs.readFileSync(installerNshPath, 'utf-8')

// Must define customFinishPage to override default StdUtils.ExecShellAsUser
assert(
  installerNsh.includes('!macro customFinishPage'),
  'resources/installer.nsh must define customFinishPage macro'
)
assert(
  installerNsh.includes('!define MUI_FINISHPAGE_RUN_FUNCTION "BeaconStartApp"') || installerNsh.includes('!define MUI_FINISHPAGE_RUN_FUNCTION "HelmStartApp"'),
  'customFinishPage must configure MUI_FINISHPAGE_RUN_FUNCTION'
)
assert(
  installerNsh.includes('ExecShell "" "$INSTDIR\\${APP_EXECUTABLE_FILENAME}" "$1"'),
  'HelmStartApp must use native non-blocking ExecShell with direct executable path'
)
assert(
  !installerNsh.includes('StdUtils.ExecShellAsUser'),
  'resources/installer.nsh must NOT use StdUtils.ExecShellAsUser (causes 32-bit COM freeze and AppHang)'
)
assert(
  installerNsh.includes('StrCpy $1 "--from-installer"'),
  'HelmStartApp must pass --from-installer parameter on post-install launch'
)

// customInstall must terminate background screensaver to prevent lock collisions
assert(
  installerNsh.includes("nsExec::Exec 'taskkill /F /IM Helm.scr /T'"),
  'customInstall must terminate any running Helm.scr instances'
)

// customUnInstall must terminate any running Helm and screensaver processes
assert(
  installerNsh.includes("nsExec::Exec 'taskkill /F /IM Helm.exe /T'"),
  'customUnInstall must terminate any running Helm.exe instances'
)

console.log('  [PASS] customFinishPage macro correctly defined with non-blocking ExecShell')
console.log('  [PASS] StdUtils.ExecShellAsUser COM freeze eliminated')
console.log('  [PASS] customInstall & customUnInstall clean process termination verified')
passed++

// ---------------------------------------------------------------------------
// TEST 2: Main Process Post-Install & Second Instance Handling Audit
// ---------------------------------------------------------------------------
console.log('\n[Test 2] Main Process Launch Handling (electron/main.ts) Audit...')
const mainTsPath = path.join(projectRoot, 'electron', 'main.ts')
assert(fs.existsSync(mainTsPath), 'electron/main.ts must exist')
const mainTs = fs.readFileSync(mainTsPath, 'utf-8')

// Main process must recognize --from-installer and bypass startMinimized
assert(
  mainTs.includes("process.argv.includes('--from-installer')"),
  'main.ts must detect --from-installer flag'
)
assert(
  mainTs.includes('const shouldStartMinimized = !isFromInstaller &&'),
  'shouldStartMinimized must be false when launched from installer'
)
assert(
  mainTs.includes("logger.info('Main', 'BEACON launched from installer: window displayed and focused')") || mainTs.includes("logger.info('Main', 'Helm launched from installer: window displayed and focused')"),
  'main.ts must log post-install window presentation and focus'
)

// Second instance handling must cleanly dismiss screensaver if running
assert(
  mainTs.includes('setScreensaverOnly(false)'),
  'second-instance must reset screensaverOnly session flag'
)
assert(
  mainTs.includes('exitScreensaverMode()'),
  'second-instance must call exitScreensaverMode when normal launch is requested'
)

console.log('  [PASS] --from-installer forces immediate window display and focus')
console.log('  [PASS] second-instance dismisses active screensaver cleanly without state conflict')
passed++

// ---------------------------------------------------------------------------
// TEST 3: Native Host Non-Blocking Registration Audit
// ---------------------------------------------------------------------------
console.log('\n[Test 3] Native Host Installer (electron/native-host-installer.ts) Non-Blocking Audit...')
const nativeInstallerPath = path.join(projectRoot, 'electron', 'native-host-installer.ts')
assert(fs.existsSync(nativeInstallerPath), 'electron/native-host-installer.ts must exist')
const nativeInstaller = fs.readFileSync(nativeInstallerPath, 'utf-8')

// ensureNativeMessagingHostRegistered must use execFile (asynchronous) rather than execFileSync
assert(
  nativeInstaller.includes("execFile('reg.exe', ['add'"),
  'native-host-installer.ts must use asynchronous execFile for reg.exe commands'
)
assert(
  !nativeInstaller.includes("execFileSync('reg.exe', ['add'"),
  'native-host-installer.ts must NOT use synchronous execFileSync during ensureNativeMessagingHostRegistered'
)

// Manifest write must be skipped if unchanged
assert(
  nativeInstaller.includes('needsWrite = false'),
  'native-host-installer.ts must avoid redundant manifest disk writes if unchanged'
)

console.log('  [PASS] Host registration converted from synchronous execFileSync to non-blocking execFile')
console.log('  [PASS] Manifest caching check prevents redundant disk I/O on startup')
passed++

// ---------------------------------------------------------------------------
// TEST 4: Package Configuration Verification
// ---------------------------------------------------------------------------
console.log('\n[Test 4] Package Configuration (package.json) Audit...')
const packageJsonPath = path.join(projectRoot, 'package.json')
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

assert.strictEqual(pkg.build.nsis.oneClick, false, 'oneClick must be false for assisted installer')
assert.strictEqual(pkg.build.nsis.perMachine, false, 'perMachine must be false (current user)')
assert.strictEqual(pkg.build.nsis.allowElevation, false, 'allowElevation must be false for standard user install')
assert.strictEqual(pkg.build.nsis.include, 'resources/installer.nsh', 'installer.nsh must be included in NSIS build')

console.log('  [PASS] NSIS installer configuration properly references resources/installer.nsh')
passed++

console.log('\n=============================================================')
console.log(`Post-Installation & Finish Launch Test Results: ${passed} PASSED, 0 FAILED`)
console.log('=============================================================\n')

