const assert = require('assert')
const fs = require('fs')
const path = require('path')

// Simple binary JPEG dimensions parser
function getJpegDimensions(filePath) {
  const buf = fs.readFileSync(filePath)
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) {
    throw new Error('Not a valid JPEG: ' + filePath)
  }

  let offset = 2
  while (offset < buf.length) {
    if (buf[offset] !== 0xFF) {
      offset++
      continue
    }
    const marker = buf[offset + 1]
    if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
      const height = buf.readUInt16BE(offset + 5)
      const width = buf.readUInt16BE(offset + 7)
      return { width, height }
    }
    const len = buf.readUInt16BE(offset + 2)
    offset += 2 + len
  }
  throw new Error('Could not find SOF marker in JPEG: ' + filePath)
}

function runWallpaperTests() {
  console.log('=== BEACON Windows: Ambient Wallpaper Asset Validation Suite ===\n')

  const projectRoot = path.resolve(__dirname, '..')
  const wallpapersDir = path.join(projectRoot, 'resources', 'wallpapers')
  const thumbsDir = path.join(wallpapersDir, 'thumbnails')

  // TEST 1: Directory Existence
  console.log('[Test 1] Verifying local wallpaper storage directories...')
  assert(fs.existsSync(wallpapersDir), 'wallpapers directory must exist at ' + wallpapersDir)
  assert(fs.existsSync(thumbsDir), 'thumbnails directory must exist at ' + thumbsDir)
  console.log('  [PASS] Wallpaper directories exist locally.')

  // Import BUILT_IN_WALLPAPERS from electron manager or renderer
  const wpManagerPath = path.join(projectRoot, 'electron', 'wallpaper-manager.ts')
  const wallpapersContent = fs.readFileSync(wpManagerPath, 'utf-8')

  // Extract all IDs from BUILT_IN_WALLPAPERS
  const idMatches = [...wallpapersContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1])
  // Filter out custom file- id pattern
  const builtInIds = idMatches.filter(id => !id.startsWith('file-'))

  console.log(`\n[Test 2] Validating 25 built-in wallpaper IDs (found ${builtInIds.length})...`)
  assert.strictEqual(builtInIds.length, 25, 'Must contain exactly 25 built-in wallpapers')
  console.log('  [PASS] Exactly 25 wallpaper definitions present.')

  // TEST 3: Physical Image Verification (2560x1440)
  console.log('\n[Test 3] Verifying 25 high-resolution 2560x1440 photographs...')
  let totalWallpaperBytes = 0

  for (const id of builtInIds) {
    const file = path.join(wallpapersDir, `${id}.jpg`)
    assert(fs.existsSync(file), `Wallpaper image missing for ID "${id}": ${file}`)
    const stat = fs.statSync(file)
    assert(stat.size > 100000, `Wallpaper image too small for ID "${id}" (${stat.size} bytes)`)
    const dims = getJpegDimensions(file)
    assert.strictEqual(dims.width, 2560, `Width of ${id}.jpg must be 2560, got ${dims.width}`)
    assert.strictEqual(dims.height, 1440, `Height of ${id}.jpg must be 1440, got ${dims.height}`)
    totalWallpaperBytes += stat.size
    console.log(`  [PASS] ${id}.jpg: 2560x1440 (${Math.round(stat.size / 1024)} KB)`)
  }
  console.log(`  Total High-Res Photography Footprint: ${Math.round(totalWallpaperBytes / 1024 / 1024 * 10) / 10} MB`)

  // TEST 4: Physical Thumbnail Verification (480x270)
  console.log('\n[Test 4] Verifying 25 gallery thumbnails (480x270)...')
  let totalThumbBytes = 0

  for (const id of builtInIds) {
    const file = path.join(thumbsDir, `${id}.jpg`)
    assert(fs.existsSync(file), `Thumbnail missing for ID "${id}": ${file}`)
    const stat = fs.statSync(file)
    const dims = getJpegDimensions(file)
    assert.strictEqual(dims.width, 480, `Width of thumb ${id}.jpg must be 480, got ${dims.width}`)
    assert.strictEqual(dims.height, 270, `Height of thumb ${id}.jpg must be 270, got ${dims.height}`)
    totalThumbBytes += stat.size
  }
  console.log(`  [PASS] All 25 thumbnails verified at 480x270 (${Math.round(totalThumbBytes / 1024)} KB total)`)

  // TEST 5: Protocol URL Canonicalization (No external http/https dependencies)
  console.log('\n[Test 5] Validating canonical local protocol URIs...')
  const rendererWpPath = path.join(projectRoot, 'src', 'features', 'ambient', 'wallpapers.ts')
  const rendererContent = fs.readFileSync(rendererWpPath, 'utf-8')

  assert(!wallpapersContent.includes('https://images.unsplash.com'), 'wallpaper-manager.ts must not contain Unsplash URLs')
  assert(!rendererContent.includes('https://images.unsplash.com'), 'wallpapers.ts must not contain Unsplash URLs')
  assert(wallpapersContent.includes('beacon-wallpaper://builtin/'), 'wallpaper-manager.ts must use beacon-wallpaper://builtin/ scheme')
  assert(rendererContent.includes('beacon-wallpaper://builtin/'), 'wallpapers.ts must use beacon-wallpaper://builtin/ scheme')
  console.log('  [PASS] Both main process and renderer use local beacon-wallpaper:// protocol with zero external dependencies.')

  // TEST 6: Category Breakdown
  console.log('\n[Test 6] Verifying 5 aesthetic nighttime categories count (5 each)...')
  const categories = [
    { name: 'cosmic-space', expected: 5 },
    { name: 'aurora', expected: 5 },
    { name: 'starry-night', expected: 5 },
    { name: 'campfire', expected: 5 },
    { name: 'moonlit', expected: 5 }
  ]

  for (const cat of categories) {
    const count = (wallpapersContent.match(new RegExp(`category:\\s*['"]${cat.name}['"]`, 'g')) || []).length
    assert.strictEqual(count, cat.expected, `Category ${cat.name} must have ${cat.expected} wallpapers, found ${count}`)
    console.log(`  [PASS] Category "${cat.name}": ${count} / ${cat.expected}`)
  }

  // TEST 7: Packaging extraFiles Verification
  console.log('\n[Test 7] Verifying package.json extraFiles bundles resources/wallpapers...')
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'))
  const extraFiles = pkg.build.extraFiles || []
  const hasWallpapers = extraFiles.some(f => f.from === 'resources/wallpapers')
  assert(hasWallpapers, 'package.json extraFiles must include resources/wallpapers')
  console.log('  [PASS] package.json includes resources/wallpapers in production bundle extraFiles.')

  console.log('\n=============================================================')
  console.log('ALL 7 AMBIENT WALLPAPER ASSET TESTS PASSED SUCCESSFULLY!')
  console.log('=============================================================\n')
}

try {
  runWallpaperTests()
} catch (err) {
  console.error('\n❌ Wallpaper test failed:', err.message)
  process.exit(1)
}

