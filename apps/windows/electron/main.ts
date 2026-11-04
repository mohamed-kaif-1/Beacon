import { app, BrowserWindow, nativeImage, shell, protocol, net, screen } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import path from 'path'
import fs from 'fs'
import { registerIpcHandlers, unregisterIpcHandlers } from './ipc'
import { createSystemTray, destroySystemTray, updateTrayWatches, updateTrayStatus } from './tray'
import {
  startPipeServer,
  stopPipeServer,
  setPipeServerCallbacks,
  getBrowserIntegrationStatus
} from './pipe-server'
import { ensureNativeMessagingHostRegistered } from './native-host-installer'
import { getAllWatches } from './watches-store'
import { loadSettings, syncSystemPreferences } from './settings-store'
import { IPC_CHANNELS } from './types'
import { logger } from './logger'
import {
  initScreensaverManager,
  enterScreensaverMode,
  exitScreensaverMode,
  isScreensaverActive,
  setScreensaverOnly,
  logScreensaverEvent,
  stopScreensaverControlServer
} from './screensaver-manager'

// Register custom scheme as privileged before app.ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'beacon-wallpaper',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      bypassCSP: false
    }
  },
  {
    scheme: 'helm-wallpaper',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      bypassCSP: false
    }
  }
])

// Enforce single application instance on Windows
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  console.log('[BEACON Main] Another instance is already running. Quitting.')
  app.quit()
  process.exit(0)
}

// Set explicit Application User Model ID for Windows Search, Taskbar grouping, and Start Menu alignment
if (process.platform === 'win32') {
  app.setAppUserModelId('com.jonathanvineet.beacon')
}

let mainWindow: BrowserWindow | null = null
let isQuitting = false

function getAppIcon(): Electron.NativeImage {
  const candidates: string[] = []
  if (process.resourcesPath) {
    candidates.push(
      path.join(process.resourcesPath, 'resources', 'icon.ico'),
      path.join(process.resourcesPath, 'icon.ico'),
      path.join(process.resourcesPath, 'resources', 'icon.png'),
      path.join(process.resourcesPath, 'icon.png')
    )
  }
  candidates.push(
    path.join(__dirname, '../../resources/icon.ico'),
    path.join(__dirname, '../../resources/icon.png')
  )

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const img = nativeImage.createFromPath(candidate)
      if (!img.isEmpty()) {
        return img
      }
    }
  }

  console.warn('[BEACON Main] Primary window icon not found in candidate paths')
  return nativeImage.createEmpty()
}

function createWindow(): BrowserWindow {
  const appIcon = getAppIcon()

  const settings = loadSettings()
  const isHiddenLaunch = process.argv.includes('--hidden') || process.argv.includes('-hidden')
  const isScreensaverLaunch = process.argv.includes('--screensaver') || process.argv.includes('-screensaver')
  const isScreensaverConfigLaunch = process.argv.includes('--screensaver-config') || process.argv.includes('-screensaver-config')
  const isFromInstaller = process.argv.includes('--from-installer') || process.argv.includes('--updated')
  const shouldStartMinimized = !isFromInstaller && (settings.general.startMinimized || isHiddenLaunch)

  let winBounds = { width: 1100, height: 750, x: undefined as number | undefined, y: undefined as number | undefined }

  if (isScreensaverLaunch) {
    try {
      const activeDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) || screen.getPrimaryDisplay()
      if (activeDisplay && activeDisplay.bounds) {
        winBounds = {
          x: activeDisplay.bounds.x,
          y: activeDisplay.bounds.y,
          width: activeDisplay.bounds.width,
          height: activeDisplay.bounds.height
        }
      }
    } catch (err) {
      console.warn('[BEACON Main] Failed to query display bounds for screensaver window:', err)
    }
  }

  mainWindow = new BrowserWindow({
    x: winBounds.x,
    y: winBounds.y,
    width: winBounds.width,
    height: winBounds.height,
    minWidth: isScreensaverLaunch ? undefined : 900,
    minHeight: isScreensaverLaunch ? undefined : 600,
    title: 'BEACON',
    icon: appIcon,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#080811',
    fullscreen: isScreensaverLaunch,
    opacity: isScreensaverLaunch ? 0 : 1.0,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  // Prevent white flash on launch & respect start minimized / screensaver mode
  mainWindow.once('ready-to-show', () => {
    if (isScreensaverLaunch) {
      logger.info('Main', 'BEACON launched in screensaver mode')
      enterScreensaverMode()
    } else if (isScreensaverConfigLaunch) {
      logger.info('Main', 'BEACON launched in screensaver config mode')
      mainWindow?.show()
      mainWindow?.webContents.send(IPC_CHANNELS.NAVIGATE, 'settings')
    } else if (!shouldStartMinimized) {
      mainWindow?.show()
      if (isFromInstaller) {
        mainWindow?.focus()
        logger.info('Main', 'BEACON launched from installer: window displayed and focused')
      }
    } else {
      logger.info('Main', 'BEACON launched in minimized/tray mode')
    }
  })

  // Handle minimize: if minimizeToTray is enabled, hide window to tray instead of taskbar
  mainWindow.on('minimize', () => {
    if (isScreensaverActive()) {
      logger.info('Main', 'Ignored minimize event while screensaver is active')
      return
    }
    const current = loadSettings()
    if (current.general.minimizeToTray) {
      mainWindow?.hide()
      logger.info('Main', 'Window minimized to system tray')
    }
  })

  // Handle close: respect closeBehavior ('tray' vs 'quit')
  mainWindow.on('close', (event) => {
    if (isQuitting) return
    const current = loadSettings()
    if (current.general.closeBehavior === 'quit') {
      isQuitting = true
      destroySystemTray()
      stopPipeServer()
      unregisterIpcHandlers()
      app.quit()
    } else {
      event.preventDefault()
      mainWindow?.hide()
      logger.info('Main', 'Window hidden to system tray on close')
    }
  })

  // Track fullscreen state and inform renderer
  mainWindow.on('enter-full-screen', () => {
    mainWindow?.webContents.send(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, true)
  })

  mainWindow.on('leave-full-screen', () => {
    mainWindow?.webContents.send(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, false)
  })

  // Crash recovery: monitor renderer lifecycle and recover gracefully
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    logger.error('Renderer', `Renderer process terminated unexpectedly (${details.reason}, code: ${details.exitCode})`)
    if (isScreensaverActive()) {
      logScreensaverEvent(`Renderer terminated during screensaver (${details.reason}); immediately exiting screensaver mode`)
      exitScreensaverMode()
    }
    if (details.reason !== 'clean-exit' && !isQuitting) {
      logger.info('Renderer', 'Initiating automatic renderer window recovery...')
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed() && !isQuitting) {
          if (process.env['ELECTRON_RENDERER_URL']) {
            mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
          } else {
            mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
          }
        }
      }, 500)
    }
  })

  mainWindow.webContents.on('unresponsive', () => {
    logger.warn('Renderer', 'Main browser window has become unresponsive')
    if (isScreensaverActive()) {
      logScreensaverEvent('Renderer unresponsive while screensaver active; immediately exiting screensaver mode')
      exitScreensaverMode()
    }
  })

  // Security: Prevent unapproved in-app navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isDevUrl = process.env['ELECTRON_RENDERER_URL'] && url.startsWith(process.env['ELECTRON_RENDERER_URL'])
    if (!isDevUrl && !url.startsWith('file://')) {
      event.preventDefault()
      console.warn('[BEACON Security] Blocked unexpected window navigation to:', url)
    }
  })

  // Security: Deny window.open and open safe external URLs in user default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url).catch((err) => {
        console.error('[BEACON Security] Failed to open external link:', err)
      })
    }
    return { action: 'deny' }
  })

  // Load the React renderer
  if (process.env['ELECTRON_RENDERER_URL']) {
    const targetUrl = isScreensaverLaunch
      ? `${process.env['ELECTRON_RENDERER_URL']}#screensaver`
      : process.env['ELECTRON_RENDERER_URL']
    mainWindow.loadURL(targetUrl)
  } else {
    mainWindow.loadFile(
      join(__dirname, '../renderer/index.html'),
      isScreensaverLaunch ? { hash: 'screensaver' } : undefined
    )
  }

  return mainWindow
}

// Lifecycle management
app.whenReady().then(async () => {
  logScreensaverEvent('Electron ready: initializing core runtime services')
  console.log('[BEACON Main] Application ready. Initializing core services...')

  // Helper to locate local built-in wallpaper assets in development and production
  const getBuiltinWallpapersDir = (): string => {
    if (process.resourcesPath) {
      const prodPath1 = path.join(process.resourcesPath, 'wallpapers')
      if (fs.existsSync(prodPath1)) return prodPath1
      const prodPath2 = path.join(process.resourcesPath, 'resources/wallpapers')
      if (fs.existsSync(prodPath2)) return prodPath2
    }
    const devPath = path.join(__dirname, '../../resources/wallpapers')
    if (fs.existsSync(devPath)) return devPath
    return devPath
  }

  // Register custom protocol handler for local wallpaper files (dual: beacon-wallpaper & helm-wallpaper)
  const handleWallpaperRequest = (request: Request) => {
    try {
      const rawPath = request.url.replace(/^(?:beacon-wallpaper|helm-wallpaper):\/\//, '')
      let decodedPath = decodeURIComponent(rawPath)

      // Resolve 'builtin/' prefix to local resource wallpaper directory
      if (decodedPath.startsWith('builtin/') || decodedPath.startsWith('builtin:')) {
        const subPath = decodedPath.replace(/^builtin[\/:]/, '')
        decodedPath = path.join(getBuiltinWallpapersDir(), subPath)
      }

      // Strict validation: absolute path and image extension
      if (!path.isAbsolute(decodedPath)) {
        return new Response('Invalid path', { status: 400 })
      }

      const ext = path.extname(decodedPath).toLowerCase()
      if (!['.jpg', '.jpeg', '.png', '.webp', '.avif', '.bmp'].includes(ext)) {
        return new Response('Forbidden file type', { status: 403 })
      }

      if (!fs.existsSync(decodedPath)) {
        console.warn('[BEACON Protocol] Wallpaper file not found on disk:', decodedPath)
        return new Response('File not found', { status: 404 })
      }

      return net.fetch(pathToFileURL(decodedPath).toString())
    } catch (err) {
      console.error('[BEACON Protocol] Error serving wallpaper:', err)
      return new Response('Not found', { status: 404 })
    }
  }

  protocol.handle('beacon-wallpaper', handleWallpaperRequest)
  protocol.handle('helm-wallpaper', handleWallpaperRequest)

  // Register secure typed IPC handlers
  registerIpcHandlers(() => mainWindow)

  // Initialize screensaver manager
  const isScreensaverLaunch = process.argv.includes('--screensaver') || process.argv.includes('-screensaver')
  initScreensaverManager(() => mainWindow, isScreensaverLaunch)

  // Initialize initial watches cache
  const initialWatches = getAllWatches()

  // Create main window
  createWindow()

  // Synchronize startup & appearance preferences with Windows OS
  const initialSettings = loadSettings()
  syncSystemPreferences(initialSettings)

  // Initialize Windows system tray
  createSystemTray(
    () => mainWindow,
    () => {
      console.log('[BEACON Main] Quit requested from system tray')
      isQuitting = true
      stopScreensaverControlServer()
      destroySystemTray()
      stopPipeServer()
      unregisterIpcHandlers()
      app.quit()
    }
  )

  // Apply initial watches & connection status to tray
  updateTrayWatches(initialWatches)
  updateTrayStatus(getBrowserIntegrationStatus())

  // Configure callbacks for live browser extension sync
  setPipeServerCallbacks({
    onWatchesChanged: (watches) => {
      updateTrayWatches(watches)
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC_CHANNELS.WATCHES_UPDATE, watches)
      }
    },
    onStatusChanged: (status) => {
      updateTrayStatus(status)
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC_CHANNELS.BROWSER_STATUS_UPDATE, status)
      }
    }
  })

  // Start Windows Named Pipe server for Native Messaging Host
  await startPipeServer()

  // Defer Chromium Native Messaging host registration to avoid blocking critical startup path
  setImmediate(() => {
    try {
      ensureNativeMessagingHostRegistered()
    } catch (err) {
      console.warn('[BEACON Main] Non-critical: Failed to ensure native host registration on launch:', err)
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })
})

// Handle second instance attempt: focus existing window or handle screensaver triggers
app.on('second-instance', (_event, commandLine) => {
  const isScreensaverReq = commandLine.some((arg) => arg.includes('--screensaver') || arg.includes('-screensaver'))
  const isScreensaverConfigReq = commandLine.some((arg) => arg.includes('--screensaver-config') || arg.includes('-screensaver-config'))

  if (isScreensaverReq) {
    logScreensaverEvent('Second instance requested screensaver mode via commandLine: ' + JSON.stringify(commandLine))
    enterScreensaverMode()
    return
  }

  if (isScreensaverConfigReq) {
    logScreensaverEvent('Second instance requested screensaver configuration')
    if (isScreensaverActive()) {
      setScreensaverOnly(false)
      exitScreensaverMode()
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      if (!mainWindow.isVisible()) mainWindow.show()
      mainWindow.focus()
      mainWindow.webContents.send(IPC_CHANNELS.NAVIGATE, 'settings')
    }
    return
  }

  // Second instance requested normal mode: if screensaver is active, dismiss it and return to app
  if (isScreensaverActive()) {
    logScreensaverEvent('Second instance requested normal application mode while screensaver active: transitioning')
    setScreensaverOnly(false)
    exitScreensaverMode()
  }

  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    if (!mainWindow.isVisible()) mainWindow.show()
    mainWindow.focus()
  }
})

// Prevent app from closing when all windows are closed (kept alive in system tray)
app.on('window-all-closed', () => {
  // On Windows, BEACON stays alive in the notification area / system tray
})

app.on('before-quit', () => {
  isQuitting = true
  stopScreensaverControlServer()
  destroySystemTray()
  stopPipeServer()
})

// Catch uncaught errors gracefully and write to structured diagnostic logger
process.on('uncaughtException', (error) => {
  logger.error('Main', 'Uncaught Exception in main process:', error)
})

process.on('unhandledRejection', (reason) => {
  logger.error('Main', 'Unhandled Promise Rejection in main process:', reason)
})
