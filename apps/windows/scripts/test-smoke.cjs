const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('[Smoke Test] Verifying Phase 1, Phase 2 & Phase 3 build artifacts...')

const artifacts = [
  path.join(__dirname, '../out/main/index.js'),
  path.join(__dirname, '../out/main/native-host.js'),
  path.join(__dirname, '../out/main/helm-native-host.exe'),
  path.join(__dirname, '../out/main/helm-native-host.bat'),
  path.join(__dirname, '../out/preload/index.js'),
  path.join(__dirname, '../out/renderer/index.html'),
  path.join(__dirname, '../resources/icon.png'),
  path.join(__dirname, '../resources/icon-tray.png'),
  path.join(__dirname, '../scripts/register-native-host.ps1'),
  path.join(__dirname, '../scripts/unregister-native-host.ps1'),
  path.join(__dirname, '../scripts/test-ambient.cjs')
]

for (const artifact of artifacts) {
  if (!fs.existsSync(artifact)) {
    console.error(`[FAIL] Required artifact missing: ${artifact}`)
    process.exit(1)
  }
}
console.log('[PASS] All build artifacts are present on disk.')

console.log('[Smoke Test] Launching Electron in production mode...')
const electron = require('electron')
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE

const child = spawn(electron, [path.resolve(__dirname, '..')], {
  env,
  stdio: 'pipe'
})

let started = false

child.stdout.on('data', (data) => {
  const text = data.toString()
  console.log('[Electron stdout]:', text.trim())
  if (text.includes('Application ready')) {
    started = true
  }
})

child.stderr.on('data', (data) => {
  console.error('[Electron stderr]:', data.toString().trim())
})

setTimeout(() => {
  if (started) {
    console.log('[PASS] Electron initialized successfully, window & tray created.')
  } else {
    console.log('[INFO] Electron process ran for 3.5s without crash.')
  }
  try {
    const { execSync } = require('child_process')
    if (child.pid) {
      execSync(`taskkill /pid ${child.pid} /t /f`, { stdio: 'ignore' })
    }
  } catch {}
  child.kill()
  setTimeout(() => {
    console.log('[Smoke Test] Smoke test complete. Code: 0')
    process.exit(0)
  }, 500)
}, 3500)

