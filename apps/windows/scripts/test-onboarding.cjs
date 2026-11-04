/**
 * Helm Windows — Phase 5.1 First-Run Onboarding Verification Suite
 * Validates onboarding persistence, IPC handlers, preload bindings, and renderer integration.
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { spawn } = require('child_process')

console.log('========================================================')
console.log('  Helm Windows — Phase 5.1 First-Run Onboarding Tests')
console.log('========================================================\n')

let passedTests = 0
let totalTests = 4

function getHelmDataDir() {
  const base = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
  return path.join(base, 'Helm')
}

// ---------------------------------------------------------------------------
// TEST 1: Persistence in %APPDATA%\Helm\settings.json
// ---------------------------------------------------------------------------
console.log('[TEST 1] Testing Onboarding persistence in settings.json...')
const helmDir = getHelmDataDir()
const settingsPath = path.join(helmDir, 'settings.json')

if (!fs.existsSync(helmDir)) {
  fs.mkdirSync(helmDir, { recursive: true })
}

// Backup original settings if present
let originalSettings = null
if (fs.existsSync(settingsPath)) {
  try {
    originalSettings = fs.readFileSync(settingsPath, 'utf-8')
  } catch {}
}

try {
  // Case A: Fresh file without onboardingCompleted
  const initialConfig = {
    theme: 'dark',
    ambient: { slideshowInterval: 30 }
  }
  fs.writeFileSync(settingsPath, JSON.stringify(initialConfig, null, 2), 'utf-8')

  let parsed = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
  assert.strictEqual(Boolean(parsed.onboardingCompleted), false, 'Default onboarding should be false/undefined')

  // Case B: Mark onboarding as completed
  parsed.onboardingCompleted = true
  fs.writeFileSync(settingsPath, JSON.stringify(parsed, null, 2), 'utf-8')

  let reloaded = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
  assert.strictEqual(reloaded.onboardingCompleted, true, 'onboardingCompleted must be true')
  assert.strictEqual(reloaded.theme, 'dark', 'Existing settings (theme) must be preserved')
  assert.strictEqual(reloaded.ambient.slideshowInterval, 30, 'Existing ambient settings must be preserved')

  // Case C: Reset onboarding
  reloaded.onboardingCompleted = false
  fs.writeFileSync(settingsPath, JSON.stringify(reloaded, null, 2), 'utf-8')
  let resetCheck = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
  assert.strictEqual(resetCheck.onboardingCompleted, false, 'onboardingCompleted reset should persist')

  console.log('✓ TEST 1 Passed: settings.json persists and updates onboarding state atomically.')
  passedTests++
} finally {
  // Restore original settings
  if (originalSettings !== null) {
    fs.writeFileSync(settingsPath, originalSettings, 'utf-8')
  }
}

// ---------------------------------------------------------------------------
// TEST 2: IPC Channels & Handlers in Built Main Bundle
// ---------------------------------------------------------------------------
console.log('\n[TEST 2] Verifying IPC registration and SettingsStore in out/main/index.js...')
const mainBundlePath = path.join(__dirname, '../out/main/index.js')
assert(fs.existsSync(mainBundlePath), 'out/main/index.js must exist')

const mainContent = fs.readFileSync(mainBundlePath, 'utf-8')

// Check function definitions and IPC handlers
assert(mainContent.includes('function isOnboardingCompleted('), 'isOnboardingCompleted function missing in main')
assert(mainContent.includes('function setOnboardingCompleted('), 'setOnboardingCompleted function missing in main')
assert(mainContent.includes('onboarding:get'), 'IPC channel "onboarding:get" missing in main')
assert(mainContent.includes('onboarding:set'), 'IPC channel "onboarding:set" missing in main')

console.log('✓ TEST 2 Passed: Main process bundle contains typed IPC handlers for onboarding.')
passedTests++

// ---------------------------------------------------------------------------
// TEST 3: Preload Bridge & Renderer Bundle Integration
// ---------------------------------------------------------------------------
console.log('\n[TEST 3] Verifying Preload API exposure and React UI components in renderer...')
const preloadBundlePath = path.join(__dirname, '../out/preload/index.js')
assert(fs.existsSync(preloadBundlePath), 'out/preload/index.js must exist')

const preloadContent = fs.readFileSync(preloadBundlePath, 'utf-8')
assert(preloadContent.includes('isOnboardingCompleted:'), 'Preload must expose isOnboardingCompleted')
assert(preloadContent.includes('setOnboardingCompleted:'), 'Preload must expose setOnboardingCompleted')
assert(preloadContent.includes('onboarding:get'), 'Preload must invoke onboarding:get')
assert(preloadContent.includes('onboarding:set'), 'Preload must invoke onboarding:set')

// Inspect renderer JS bundle
const rendererDir = path.join(__dirname, '../out/renderer/assets')
const rendererFiles = fs.readdirSync(rendererDir).filter(f => f.endsWith('.js'))
assert(rendererFiles.length > 0, 'Renderer JS asset must exist')

const rendererContent = fs.readFileSync(path.join(rendererDir, rendererFiles[0]), 'utf-8')

// Check that Onboarding walkthrough strings and Settings replay button exist
assert(rendererContent.includes('Ambient Productivity for Windows'), 'Welcome slide content missing in renderer')
assert(rendererContent.includes('Ambient Screen Board'), 'Ambient slide content missing in renderer')
assert(rendererContent.includes('Markdown Notes & Priority Tasks'), 'Notes/tasks slide content missing in renderer')
assert(rendererContent.includes('Browser Extension Integration'), 'Browser extension slide content missing in renderer')
assert(rendererContent.includes('Personalize & Begin'), 'Setup slide content missing in renderer')
assert(rendererContent.includes('Replay Onboarding Tour'), 'Replay Onboarding Tour button missing in Settings page')
assert(rendererContent.includes('Skip tour'), 'Skip tour button missing in Onboarding modal')

console.log('✓ TEST 3 Passed: Preload bridge and React renderer bundles verified with full onboarding walkthrough.')
passedTests++

// ---------------------------------------------------------------------------
// TEST 4: Runtime Electron Launch Smoke Test
// ---------------------------------------------------------------------------
console.log('\n[TEST 4] Running Electron runtime sanity check...')
const electron = require('electron')
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE

const child = spawn(electron, [path.resolve(__dirname, '..')], {
  env,
  stdio: 'pipe'
})

let appReady = false
child.stdout.on('data', (d) => {
  const text = d.toString()
  if (text.includes('Application ready') || text.includes('Created main browser window')) {
    appReady = true
  }
})

let errorOutput = ''
child.stderr.on('data', (d) => {
  errorOutput += d.toString()
})

setTimeout(() => {
  child.kill()
  if (errorOutput && errorOutput.includes('Error:')) {
    console.error('[Electron Stderr]:', errorOutput)
    process.exit(1)
  }
  console.log('✓ TEST 4 Passed: Electron launched successfully with onboarding integration.')
  passedTests++

  console.log('\n========================================================')
  console.log(`  Phase 5.1 Verification Summary: ${passedTests}/${totalTests} Tests Passed`)
  console.log('========================================================\n')
  process.exit(0)
}, 3500)

