const electron = require('electron')
const app = electron.app
const protocol = electron.protocol
const net = electron.net
const ipcMain = electron.ipcMain
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const fs = require('fs')
const { pathToFileURL } = require('url')

// Register wallpaper custom protocols
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'beacon-wallpaper',
    privileges: { secure: true, standard: true, supportFetchAPI: true }
  },
  {
    scheme: 'helm-wallpaper',
    privileges: { secure: true, standard: true, supportFetchAPI: true }
  }
])

const outDir = 'C:\\Users\\moham\\.gemini\\antigravity\\brain\\95817787-9215-43dd-a3a5-b13236795e48\\screensaver-screenshots'
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const wallpapers = [
  { id: 'space-milky-way-core', index: 0, name: 'space-milky-way' },
  { id: 'aurora-emerald-night', index: 5, name: 'aurora-emerald' },
  { id: 'night-mountain-stars', index: 10, name: 'night-mountain' },
  { id: 'campfire-starry-sky', index: 15, name: 'campfire-stars' },
  { id: 'moonlit-japanese-forest', index: 20, name: 'moonlit-forest' }
]

const BUILT_IN_LIST = [
  { id: 'space-milky-way-core', name: 'Milky Way Core', category: 'cosmic-space', type: 'built-in', url: 'beacon-wallpaper://builtin/space-milky-way-core.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-milky-way-core.jpg' },
  { id: 'space-deep-nebula', name: 'Deep Space Nebula', category: 'cosmic-space', type: 'built-in', url: 'beacon-wallpaper://builtin/space-deep-nebula.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-deep-nebula.jpg' },
  { id: 'space-stellar-void', name: 'Stellar Void', category: 'cosmic-space', type: 'built-in', url: 'beacon-wallpaper://builtin/space-stellar-void.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-stellar-void.jpg' },
  { id: 'space-cosmic-dust', name: 'Cosmic Dust Clouds', category: 'cosmic-space', type: 'built-in', url: 'beacon-wallpaper://builtin/space-cosmic-dust.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-cosmic-dust.jpg' },
  { id: 'space-orbital-horizon', name: 'Orbital Night', category: 'cosmic-space', type: 'built-in', url: 'beacon-wallpaper://builtin/space-orbital-horizon.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-orbital-horizon.jpg' },
  { id: 'aurora-emerald-night', name: 'Emerald Aurora', category: 'aurora', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-emerald-night.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-emerald-night.jpg' },
  { id: 'aurora-violet-dream', name: 'Violet Aurora Dream', category: 'aurora', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-violet-dream.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-violet-dream.jpg' },
  { id: 'aurora-arctic-lake', name: 'Arctic Lake Aurora', category: 'aurora', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-arctic-lake.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-arctic-lake.jpg' },
  { id: 'aurora-pine-silhouette', name: 'Forest Aurora', category: 'aurora', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-pine-silhouette.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-pine-silhouette.jpg' },
  { id: 'aurora-cosmic-blue', name: 'Cosmic Blue Aurora', category: 'aurora', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-cosmic-blue.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-cosmic-blue.jpg' },
  { id: 'night-mountain-stars', name: 'Mountain Starscape', category: 'starry-night', type: 'built-in', url: 'beacon-wallpaper://builtin/night-mountain-stars.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-mountain-stars.jpg' },
  { id: 'night-alpine-lake', name: 'Alpine Lake Stars', category: 'starry-night', type: 'built-in', url: 'beacon-wallpaper://builtin/night-alpine-lake.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-alpine-lake.jpg' },
  { id: 'night-desert-milky-way', name: 'Desert Milky Way', category: 'starry-night', type: 'built-in', url: 'beacon-wallpaper://builtin/night-desert-milky-way.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-desert-milky-way.jpg' },
  { id: 'night-misty-forest', name: 'Misty Forest Night', category: 'starry-night', type: 'built-in', url: 'beacon-wallpaper://builtin/night-misty-forest.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-misty-forest.jpg' },
  { id: 'night-ocean-horizon', name: 'Ocean Night Horizon', category: 'starry-night', type: 'built-in', url: 'beacon-wallpaper://builtin/night-ocean-horizon.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-ocean-horizon.jpg' },
  { id: 'campfire-starry-sky', name: 'Campfire & Stars', category: 'campfire', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-starry-sky.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-starry-sky.jpg' },
  { id: 'campfire-mountain-retreat', name: 'Mountain Campsite', category: 'campfire', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-mountain-retreat.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-mountain-retreat.jpg' },
  { id: 'campfire-pine-forest', name: 'Pine Forest Campfire', category: 'campfire', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-pine-forest.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-pine-forest.jpg' },
  { id: 'campfire-lakeside', name: 'Lakeside Campfire', category: 'campfire', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-lakeside.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-lakeside.jpg' },
  { id: 'campfire-cosmic-night', name: 'Cosmic Campsite', category: 'campfire', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-cosmic-night.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-cosmic-night.jpg' },
  { id: 'moonlit-japanese-forest', name: 'Japanese Moonlit Forest', category: 'moonlit', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-japanese-forest.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-japanese-forest.jpg' },
  { id: 'moonlit-bamboo-grove', name: 'Moonlit Bamboo', category: 'moonlit', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-bamboo-grove.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-bamboo-grove.jpg' },
  { id: 'moonlit-waterfall', name: 'Nighttime Waterfall', category: 'moonlit', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-waterfall.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-waterfall.jpg' },
  { id: 'moonlit-sakura', name: 'Midnight Sakura', category: 'moonlit', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-sakura.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-sakura.jpg' },
  { id: 'moonlit-cloud-sea', name: 'Mountain Cloud Sea', category: 'moonlit', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-cloud-sea.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-cloud-sea.jpg' }
]

app.whenReady().then(async () => {
  const wallpaperDir = path.resolve(__dirname, '..', 'resources', 'wallpapers')

  // Register protocol handlers
  const handleReq = (req) => {
    const raw = req.url.replace(/^(?:beacon-wallpaper|helm-wallpaper):\/\//, '')
    let decoded = decodeURIComponent(raw)
    if (decoded.startsWith('builtin/') || decoded.startsWith('builtin:')) {
      const sub = decoded.replace(/^builtin[\/:]/, '')
      decoded = path.join(wallpaperDir, sub)
    }
    const fileUrl = pathToFileURL(decoded).toString()
    console.log('[Capture Req]', req.url, '->', fileUrl, 'exists:', fs.existsSync(decoded))
    return net.fetch(fileUrl)
  }

  protocol.handle('beacon-wallpaper', handleReq)
  protocol.handle('helm-wallpaper', handleReq)

  ipcMain.handle('theme:get', () => 'dark')
  ipcMain.handle('theme:set', () => {})
  ipcMain.handle('onboarding:get', () => true)
  ipcMain.handle('watches:get', () => [])

  let currentWallpaperIndex = 0
  const getSettingsData = () => ({
    general: { launchAtStartup: false, startMinimized: false, minimizeToTray: false, closeBehavior: 'tray' },
    appearance: { theme: 'system', reducedMotion: false },
    ambient: {
      slideshowInterval: 30,
      transitionDuration: 0.5,
      kenBurnsEnabled: false,
      wallpaperSource: 'built-in',
      customWallpaperFolder: '',
      selectedWallpaperIndex: currentWallpaperIndex,
      showClock: true,
      showDate: true,
      use24Hour: false,
      showWeather: true,
      weatherLocation: 'San Francisco, US',
      temperatureUnit: 'F',
      showWatches: false,
      showTasks: true,
      showQuote: true,
      frostedGlassBlur: 16,
      backgroundDim: 0.10
    },
    screensaver: {
      enabled: true,
      showClock: true,
      showDate: true,
      showWeather: true,
      showTasks: true,
      showWatches: false,
      showQuote: true,
      timeoutMinutes: 5,
      exitOnMouseMove: true
    }
  })

  ipcMain.handle('settings:get', () => getSettingsData())
  ipcMain.handle('ambient:get-settings', () => getSettingsData().ambient)

  ipcMain.handle('weather:get', () => ({
    location: 'San Francisco',
    temperatureCelsius: 16,
    temperatureFahrenheit: 61,
    condition: 'Clear Night',
    conditionCode: 'clear',
    lastUpdated: Date.now(),
    isStale: false
  }))

  ipcMain.handle('productivity:summary-get', () => ({
    todayTasks: [
      { id: '1', title: 'Deep Work: Finalize core system architecture', status: 'pending', priority: 'high', dueDate: Date.now() - 3600000 },
      { id: '2', title: 'Prepare brand release package & assets', status: 'pending', priority: 'medium', dueDate: Date.now() + 7200000 }
    ],
    upcomingTasks: [
      { id: '3', title: 'Publish release documentation and user guide', status: 'pending', priority: 'low', dueDate: Date.now() + 86400000 }
    ]
  }))

  ipcMain.handle('ambient:get-wallpapers', () => BUILT_IN_LIST)

  ipcMain.handle('screensaver:is-active', () => true)
  ipcMain.handle('window:is-fullscreen', () => true)
  ipcMain.handle('screensaver:ready', () => {})
  ipcMain.handle('ambient:set-settings', () => {})

  const htmlPath = path.join(__dirname, '../out/renderer/index.html')

  const targetArg = process.argv[2] ? parseInt(process.argv[2], 10) : 0
  const wp = wallpapers[targetArg] || wallpapers[0]

  console.log(`Rendering screensaver with wallpaper: ${wp.name} (${wp.id})...`)
  currentWallpaperIndex = wp.index

  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    frame: false,
    backgroundColor: '#080811',
    webPreferences: {
      preload: path.join(__dirname, '../out/preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  await win.loadFile(htmlPath, { hash: 'screensaver' })
  // Allow time for image decoding, fonts, and render
  await new Promise((resolve) => setTimeout(resolve, 3500))

  const image = await win.webContents.capturePage()
  const filePath = path.join(outDir, `screensaver-${wp.name}.png`)
  fs.writeFileSync(filePath, image.toPNG())
  console.log(`Saved screenshot: ${filePath} (${image.toPNG().length} bytes)`)

  console.log(`Screenshot ${wp.name} captured successfully!`)
  app.quit()
})
