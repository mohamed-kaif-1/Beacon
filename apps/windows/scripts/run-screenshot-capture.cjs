const { spawnSync } = require('child_process')
const path = require('path')

const cleanEnv = { ...process.env }
delete cleanEnv.ELECTRON_RUN_AS_NODE

const electronExe = path.resolve(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.exe')
const script = path.resolve(__dirname, 'capture-screensaver-screenshots.cjs')

for (let i = 0; i < 5; i++) {
  console.log(`\n--- Running capture pass ${i + 1} of 5 ---`)
  const res = spawnSync(electronExe, [script, String(i)], {
    env: cleanEnv,
    stdio: 'inherit'
  })
  if (res.status !== 0) {
    console.error(`Pass ${i} failed with exit code ${res.status}`)
  }
}

console.log('\nAll 5 screenshot capture passes finished!')
process.exit(0)
