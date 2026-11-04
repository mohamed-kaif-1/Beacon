/**
 * BEACON Windows — Brand Icon Integrity and Shell Integration Verification Suite
 * Validates that all Windows application binaries, installers, shortcuts, and
 * multi-resolution icon resources strictly feature "The Quiet Path" brand identity.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const projectRoot = path.resolve(__dirname, '..')
const rootDir = path.resolve(projectRoot, '..', '..')
const resDir = path.join(projectRoot, 'resources')
const masterBrandIco = path.join(rootDir, 'resources', 'brand', 'icon.ico')
const localIco = path.join(resDir, 'icon.ico')
const outMainDir = path.join(projectRoot, 'out', 'main')
const distDir = path.join(projectRoot, 'dist')
const installedDir = path.join(process.env.LOCALAPPDATA, 'Programs', 'Beacon')
const startMenuLnk = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'BEACON.lnk')

console.log('=== BEACON Windows: Brand Icon & Shell Integration Validation Suite ===\n')

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
// Test 1: Verify Windows Multi-Resolution ICO Structure
// -------------------------------------------------------------
console.log('[Test 1] Inspecting Windows Multi-Resolution icon.ico...')
function validateIco(icoPath, label) {
  assert(fs.existsSync(icoPath), `${label} exists`)
  const buf = fs.readFileSync(icoPath)
  const count = buf.readUInt16LE(4)
  assert(count === 7, `${label} contains exactly 7 resolution frames (found ${count})`)
  
  const expectedSizes = [16, 24, 32, 48, 64, 128, 256]
  const parsedSizes = []
  
  for (let i = 0; i < count; i++) {
    const offset = 6 + i * 16
    const w = buf[offset] === 0 ? 256 : buf[offset]
    parsedSizes.push(w)
    const imgOffset = buf.readUInt32LE(offset + 12)
    const isPng = buf.slice(imgOffset, imgOffset + 8).toString('hex') === '89504e470d0a1a0a'
    if (w === 256) {
      assert(isPng, `  Frame ${w}x${w} is standard Vista+ PNG-compressed`)
    } else {
      assert(!isPng, `  Frame ${w}x${w} is uncompressed 32-bit DIB (max GDI/Shell compatibility)`)
    }
  }
  
  assert(
    JSON.stringify(parsedSizes) === JSON.stringify(expectedSizes),
    `${label} contains all required sizes: ${expectedSizes.join(', ')}`
  )
}

validateIco(localIco, 'apps/windows/resources/icon.ico')
validateIco(masterBrandIco, 'resources/brand/icon.ico')

// -------------------------------------------------------------
// Test 2: Verify Embedded Icons in Build Binaries
// -------------------------------------------------------------
console.log('\n[Test 2] Verifying Embedded PE Icons in Binaries...')

const psScript = `
Add-Type -AssemblyName System.Drawing

function Check-CenterPixel($filePath) {
    if (-not (Test-Path $filePath)) { return "NOT_FOUND" }
    try {
        $ico = [System.Drawing.Icon]::ExtractAssociatedIcon($filePath)
        $bmp = $ico.ToBitmap()
        $color = $bmp.GetPixel(16, 16)
        if ($color.B -gt 130 -and $color.R -lt 120) {
            return "QUIET_PATH"
        } elseif ($color.R -eq $color.G -and $color.G -eq $color.B) {
            return "LEGACY_BAT"
        } else {
            return "$($color.R),$($color.G),$($color.B)"
        }
    } catch {
        return "ERROR: $_"
    }
}

$obj = [PSCustomObject]@{
    BeaconScr     = Check-CenterPixel '${path.join(outMainDir, 'Beacon.scr').replace(/'/g, "''")}'
    NativeHostExe = Check-CenterPixel '${path.join(outMainDir, 'beacon-native-host.exe').replace(/'/g, "''")}'
    UnpackedExe   = Check-CenterPixel '${path.join(distDir, 'win-unpacked', 'Beacon.exe').replace(/'/g, "''")}'
    InstallerExe  = Check-CenterPixel '${path.join(distDir, 'BEACON-Setup-0.1.0.exe').replace(/'/g, "''")}'
    InstalledExe  = Check-CenterPixel '${path.join(installedDir, 'Beacon.exe').replace(/'/g, "''")}'
    StartMenuLnk  = Check-CenterPixel '${startMenuLnk.replace(/'/g, "''")}'
}
$obj | ConvertTo-Json -Compress
`

try {
  const { execFileSync } = require('child_process')
  const psOutput = execFileSync('powershell', ['-NoProfile', '-Command', psScript], {
    encoding: 'utf-8'
  })
  const results = JSON.parse(psOutput.trim())

  assert(results.BeaconScr === 'QUIET_PATH', `out/main/Beacon.scr embedded icon matches Quiet Path (got: ${results.BeaconScr})`)
  assert(results.NativeHostExe === 'QUIET_PATH', `out/main/beacon-native-host.exe embedded icon matches Quiet Path (got: ${results.NativeHostExe})`)
  assert(results.UnpackedExe === 'QUIET_PATH', `dist/win-unpacked/Beacon.exe embedded icon matches Quiet Path (got: ${results.UnpackedExe})`)
  assert(results.InstallerExe === 'QUIET_PATH', `dist/BEACON-Setup-0.1.0.exe embedded icon matches Quiet Path (got: ${results.InstallerExe})`)
  assert(results.InstalledExe === 'QUIET_PATH', `Installed Beacon.exe embedded icon matches Quiet Path (got: ${results.InstalledExe})`)
  assert(results.StartMenuLnk === 'QUIET_PATH', `Start Menu BEACON.lnk icon resolves to Quiet Path (got: ${results.StartMenuLnk})`)
} catch (err) {
  console.error('Failed to run PE icon extraction test:', err.message)
  failed++
}

// -------------------------------------------------------------
// Test 3: Verify Packaged Resources and ExtraFiles
// -------------------------------------------------------------
console.log('\n[Test 3] Verifying Packaged Resource ExtraFiles in Installer...')
const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'))
const extraFiles = pkg.build.extraFiles || []
const extraFileTargets = extraFiles.map((e) => e.to)

assert(extraFileTargets.includes('resources/icon.ico'), 'package.json extraFiles packages resources/icon.ico')
assert(extraFileTargets.includes('resources/icon.png'), 'package.json extraFiles packages resources/icon.png')
assert(extraFileTargets.includes('resources/icon-tray.png'), 'package.json extraFiles packages resources/icon-tray.png')

const installedResDir = path.join(installedDir, 'resources')
if (fs.existsSync(installedResDir)) {
  assert(fs.existsSync(path.join(installedResDir, 'icon.ico')), 'Installed directory contains resources/icon.ico')
  assert(fs.existsSync(path.join(installedResDir, 'icon.png')), 'Installed directory contains resources/icon.png')
  assert(fs.existsSync(path.join(installedResDir, 'icon-tray.png')), 'Installed directory contains resources/icon-tray.png')
}

// -------------------------------------------------------------
// Test 4: Verify Application User Model ID & Main Window Code
// -------------------------------------------------------------
console.log('\n[Test 4] Verifying AppUserModelId and Window Icon Resolution...')
const mainTs = fs.readFileSync(path.join(projectRoot, 'electron', 'main.ts'), 'utf-8')
assert(
  mainTs.includes("app.setAppUserModelId('com.jonathanvineet.beacon')"),
  'electron/main.ts sets explicit AppUserModelId for Windows taskbar & search grouping'
)
assert(
  mainTs.includes('getAppIcon()'),
  'electron/main.ts utilizes multi-candidate getAppIcon() helper for robust runtime resolution'
)

console.log('\n=============================================================')
if (failed === 0) {
  console.log(`ALL ${passed} BRAND ICON & SHELL INTEGRATION TESTS PASSED!`)
  console.log('=============================================================')
  process.exit(0)
} else {
  console.error(`FAILED: ${failed} tests failed, ${passed} passed.`)
  console.log('=============================================================')
  process.exit(1)
}
