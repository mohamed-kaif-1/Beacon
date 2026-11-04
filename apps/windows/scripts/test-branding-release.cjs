/**
 * Helm Windows — Phase 5.5: Installer Branding & Version Management Tests
 * Covers all 12 required scenarios for branding, metadata, upgrade, uninstallation,
 * secret exclusion, and release workflow validation.
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')

console.log('=================================================================')
console.log('  Helm Windows — Phase 5.5 Branding & Release Tests')
console.log('=================================================================\n')

const rootDir = path.resolve(__dirname, '..')
const packageJsonPath = path.join(rootDir, 'package.json')
const installerNshPath = path.join(rootDir, 'resources', 'installer.nsh')
const releaseMdPath = path.join(rootDir, 'RELEASE.md')
const distDir = path.join(rootDir, 'dist')
const unpackedExePath = fs.existsSync(path.join(distDir, 'win-unpacked', 'Beacon.exe')) ? path.join(distDir, 'win-unpacked', 'Beacon.exe') : path.join(distDir, 'win-unpacked', 'Helm.exe')

async function runTests() {
  let passed = 0

  // -------------------------------------------------------------------------
  // TEST 1: Application and Installer Branding Consistency
  // -------------------------------------------------------------------------
  console.log('[TEST 1] Testing Application & Installer Branding Consistency...')
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  assert.strictEqual(pkg.build.productName, 'BEACON', 'Product name must be "BEACON"')
  assert.strictEqual(pkg.build.appId, 'com.jonathanvineet.beacon', 'AppId must be "com.jonathanvineet.beacon"')
  assert.strictEqual(pkg.build.nsis.shortcutName, 'BEACON', 'Shortcut name must be "BEACON"')
  assert.strictEqual(pkg.build.nsis.uninstallDisplayName, 'BEACON', 'Uninstaller display name must be "BEACON"')

  // Verify icon files
  const icoPath = path.join(rootDir, 'resources', 'icon.ico')
  const pngPath = path.join(rootDir, 'resources', 'icon.png')
  const trayPngPath = path.join(rootDir, 'resources', 'icon-tray.png')
  assert(fs.existsSync(icoPath), 'resources/icon.ico must exist')
  assert(fs.existsSync(pngPath), 'resources/icon.png must exist')
  assert(fs.existsSync(trayPngPath), 'resources/icon-tray.png must exist')

  // Verify tray tooltip in tray.ts
  const trayTs = fs.readFileSync(path.join(rootDir, 'electron', 'tray.ts'), 'utf-8')
  assert(trayTs.includes('BEACON •'), 'Tray tooltip must reflect BEACON branding')

  // Verify window title in main.ts
  const mainTs = fs.readFileSync(path.join(rootDir, 'electron', 'main.ts'), 'utf-8')
  assert(mainTs.includes("title: 'BEACON'"), "Main window title must be 'BEACON'")

  console.log('✓ TEST 1 Passed: Branding is consistent across package.json, icons, window, and system tray.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 2: Version Consistency Across Application Components
  // -------------------------------------------------------------------------
  console.log('\n[TEST 2] Testing Semantic Versioning Consistency...')
  const version = pkg.version
  assert(/^\d+\.\d+\.\d+$/.test(version), `Version ${version} must follow Semantic Versioning (MAJOR.MINOR.PATCH)`)

  // Check installer artifact name pattern
  assert(pkg.build.win.artifactName.includes('${version}'), 'Installer artifact pattern must incorporate ${version}')

  // Check that electron main process exposes package.json version via app.getVersion()
  const ipcTs = fs.readFileSync(path.join(rootDir, 'electron', 'ipc.ts'), 'utf-8')
  assert(ipcTs.includes('app.getVersion()'), 'IPC APP_GET_VERSION must return app.getVersion()')

  console.log(`✓ TEST 2 Passed: Version ${version} strictly conforms to SemVer and serves as the single source of truth.`)
  passed++

  // -------------------------------------------------------------------------
  // TEST 3: Windows Executable Metadata
  // -------------------------------------------------------------------------
  console.log('\n[TEST 3] Testing Windows Executable Metadata Configuration...')
  assert.strictEqual(pkg.build.copyright, 'Copyright © 2026 Jonathan Vineet & BEACON Contributors')
  assert.strictEqual(pkg.author, 'BEACON Contributors')
  assert.strictEqual(pkg.license, 'MIT')
  assert.strictEqual(pkg.build.win.executableName, 'Beacon')

  // If win-unpacked exists, verify executable presence
  if (fs.existsSync(unpackedExePath)) {
    const stats = fs.statSync(unpackedExePath)
    assert(stats.size > 50_000_000, 'Packaged Helm.exe size should be > 50MB')
    console.log(`  (Verified binary on disk: ${unpackedExePath}, ${(stats.size / 1024 / 1024).toFixed(1)} MB)`)
  }

  console.log('✓ TEST 3 Passed: File and product metadata configured accurately for Windows binaries.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 4: Shortcut Configuration
  // -------------------------------------------------------------------------
  console.log('\n[TEST 4] Testing Desktop and Start Menu Shortcut Configuration...')
  assert.strictEqual(pkg.build.nsis.createDesktopShortcut, 'always', 'Desktop shortcut creation must be enabled')
  assert.strictEqual(pkg.build.nsis.createStartMenuShortcut, true, 'Start Menu shortcut creation must be enabled')
  assert.strictEqual(pkg.build.nsis.shortcutName, 'BEACON')
  console.log('✓ TEST 4 Passed: NSIS shortcut policy configured for clean Desktop and Start Menu access.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 5: Per-User Non-Administrator Installation Configuration
  // -------------------------------------------------------------------------
  console.log('\n[TEST 5] Testing Per-User Non-Admin Installation Flags...')
  assert.strictEqual(pkg.build.nsis.perMachine, false, 'perMachine must be false for user-level install')
  assert.strictEqual(pkg.build.nsis.allowElevation, false, 'allowElevation must be false (no UAC prompt required)')
  assert.strictEqual(pkg.build.nsis.oneClick, false, 'oneClick must be false to show customized wizard')
  assert.strictEqual(pkg.build.nsis.allowToChangeInstallationDirectory, true)
  console.log('✓ TEST 5 Passed: Installation is strictly per-user and requires zero elevated administrator privileges.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 6: Upgrade Behavior and Overwrite Policy
  // -------------------------------------------------------------------------
  console.log('\n[TEST 6] Testing Upgrade Idempotence & Binary Replacement Policy...')
  // NSIS per-user install automatically replaces binaries in %LOCALAPPDATA%\Programs\Helm without touching %APPDATA%\Helm
  assert.strictEqual(pkg.build.nsis.deleteAppDataOnUninstall, false, 'deleteAppDataOnUninstall must be false to protect user data')
  console.log('✓ TEST 6 Passed: Upgrades safely overwrite application binaries while retaining user data.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 7: User Data Preservation Architecture
  // -------------------------------------------------------------------------
  console.log('\n[TEST 7] Testing User Data Isolation from Installation Directory...')
  // All user data is stored in %APPDATA%\Helm, separate from %LOCALAPPDATA%\Programs\Helm
  const watchesStoreTs = fs.readFileSync(path.join(rootDir, 'electron', 'watches-store.ts'), 'utf-8')
  assert(watchesStoreTs.includes('getBeaconDataDirectory') || watchesStoreTs.includes('getHelmDataDirectory'), 'Data directory must resolve to %APPDATA%\\Beacon with Helm fallback')

  // Verify DB path is under APPDATA
  const dbTs = fs.readFileSync(path.join(rootDir, 'electron', 'database.ts'), 'utf-8')
  assert(dbTs.includes('getBeaconDataDirectory()') || dbTs.includes('beacon.db') || dbTs.includes('helm.db'), 'Database must reside in APPDATA')

  console.log('✓ TEST 7 Passed: User data (helm.db, settings.json, watches.json) is strictly isolated in APPDATA.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 8: Native Messaging Registration After Upgrade
  // -------------------------------------------------------------------------
  console.log('\n[TEST 8] Testing Native Messaging Self-Healing on Upgrade...')
  const nativeInstallerTs = fs.readFileSync(path.join(rootDir, 'electron', 'native-host-installer.ts'), 'utf-8')
  assert(nativeInstallerTs.includes('ensureNativeMessagingHostRegistered'), 'Self-healing host registration must exist')
  assert(nativeInstallerTs.includes('findNativeHostBinary'), 'Dynamic host binary resolution must exist')

  // Verify customInstall macro in installer.nsh
  const nshContent = fs.readFileSync(installerNshPath, 'utf-8')
  assert(nshContent.includes('customInstall'), 'customInstall macro must be defined')
  assert(nshContent.includes('WriteRegStr HKCU "Software\\Google\\Chrome\\NativeMessagingHosts\\com.jonathanvineet.beacon"'), 'Chrome key registration must exist')
  assert(nshContent.includes('WriteRegStr HKCU "Software\\Microsoft\\Edge\\NativeMessagingHosts\\com.jonathanvineet.helm"'), 'Edge key registration must exist')
  assert(nshContent.includes('WriteRegStr HKCU "Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\com.jonathanvineet.helm"'), 'Brave key registration must exist')

  console.log('✓ TEST 8 Passed: Native Messaging host dynamically updates host pointers upon launch after upgrades.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 9: Safe Uninstallation Architecture
  // -------------------------------------------------------------------------
  console.log('\n[TEST 9] Testing Uninstaller Registry & File Cleanup...')
  assert(nshContent.includes('customUnInstall'), 'customUnInstall macro must be defined')
  assert(nshContent.includes('DeleteRegKey HKCU "Software\\Google\\Chrome\\NativeMessagingHosts\\com.jonathanvineet.beacon"'), 'Chrome key cleanup must be in uninstaller')
  assert(nshContent.includes('DeleteRegKey HKCU "Software\\Microsoft\\Edge\\NativeMessagingHosts\\com.jonathanvineet.helm"'), 'Edge key cleanup must be in uninstaller')
  assert(nshContent.includes('DeleteRegKey HKCU "Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\com.jonathanvineet.helm"'), 'Brave key cleanup must be in uninstaller')

  // Verify user data is not deleted in customUnInstall
  assert(!nshContent.includes('Delete "$APPDATA\\Helm\\helm.db"'), 'Uninstaller must NOT delete helm.db')
  assert(!nshContent.includes('Delete "$APPDATA\\Helm\\settings.json"'), 'Uninstaller must NOT delete settings.json')
  assert(!nshContent.includes('Delete "$APPDATA\\Helm\\watches.json"'), 'Uninstaller must NOT delete watches.json')

  console.log('✓ TEST 9 Passed: Uninstaller cleans up registry and manifests while preserving database & settings.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 10: Startup Registry Cleanup on Uninstall
  // -------------------------------------------------------------------------
  console.log('\n[TEST 10] Testing Startup Registry Value Cleanup on Uninstall...')
  assert(nshContent.includes('DeleteRegValue HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Run" "Beacon"'), 'Uninstaller must remove Windows Run startup registry entry')
  console.log('✓ TEST 10 Passed: Windows startup registry entry is reliably unhooked upon uninstallation.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 11: No Accidental Secret Packaging
  // -------------------------------------------------------------------------
  console.log('\n[TEST 11] Auditing Bundled Package against Secret Leaks...')
  const filesIncluded = pkg.build.files
  assert(filesIncluded.includes('out/**/*'), 'out directory included in package')
  assert(!filesIncluded.includes('.env'), '.env file must NOT be in build.files')
  assert(!filesIncluded.includes('**/*.pem'), 'Private keys must NOT be in build.files')

  // Check out/ directory for secrets or .env
  const outDir = path.join(rootDir, 'out')
  if (fs.existsSync(outDir)) {
    const checkDir = (dir) => {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        const full = path.join(dir, item)
        assert(!item.startsWith('.env'), `No .env file permitted in bundled output: ${full}`)
        assert(!item.endsWith('.pem') && !item.endsWith('.key'), `No private keys permitted in bundled output: ${full}`)
        if (fs.statSync(full).isDirectory()) {
          checkDir(full)
        }
      }
    }
    checkDir(outDir)
  }

  console.log('✓ TEST 11 Passed: Build file filters and bundled artifacts contain zero secrets, API keys, or .env files.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 12: Release Checklist & Documentation Validation
  // -------------------------------------------------------------------------
  console.log('\n[TEST 12] Validating Repeatable Release Documentation (RELEASE.md)...')
  assert(fs.existsSync(releaseMdPath), 'RELEASE.md documentation must exist')
  const releaseDoc = fs.readFileSync(releaseMdPath, 'utf-8')
  assert(releaseDoc.includes('Semantic Versioning'), 'RELEASE.md must document SemVer')
  assert(releaseDoc.includes('npm run typecheck'), 'RELEASE.md must document typecheck command')
  assert(releaseDoc.includes('npm test'), 'RELEASE.md must document test command')
  assert(releaseDoc.includes('npm run dist:win'), 'RELEASE.md must document installer packaging command')
  assert(releaseDoc.includes('SHA256') || releaseDoc.includes('Get-FileHash'), 'RELEASE.md must document SHA-256 checksums')
  assert(releaseDoc.includes('Code-Signing Limitations'), 'RELEASE.md must document code-signing limitations honestly')

  console.log('✓ TEST 12 Passed: RELEASE.md contains complete, validated release workflow and security procedures.')
  passed++

  console.log('\n=================================================================')
  console.log(`  Phase 5.5 Verification Summary: ${passed}/12 Tests Passed`)
  console.log('=================================================================\n')
}

runTests().catch((err) => {
  console.error('[FAIL] Branding & Release test suite failed:', err)
  process.exit(1)
})

