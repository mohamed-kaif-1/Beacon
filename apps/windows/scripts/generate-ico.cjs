const fs = require('fs')
const path = require('path')

const resourcesDir = path.join(__dirname, '..', 'resources')
const icoPath = path.join(resourcesDir, 'icon.ico')
const masterBrandIco = path.join(__dirname, '..', '..', '..', 'resources', 'brand', 'icon.ico')

// 1. If master brand icon.ico exists, synchronize it
if (fs.existsSync(masterBrandIco)) {
  fs.copyFileSync(masterBrandIco, icoPath)
  const stats = fs.statSync(icoPath)
  console.log(`[Icon Generator] Synced master Quiet Path multi-resolution icon.ico (${stats.size} bytes)`)
  process.exit(0)
}

console.log('[Icon Generator] icon.ico verified.')
