import { app, BrowserWindow, systemPreferences, screen, globalShortcut, powerMonitor } from 'electron'
import * as net from 'net'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { IPC_CHANNELS } from './types'
import { logger } from './logger'
import { loadSettings } from './settings-store'

let isScreensaverRunning = false
let isScreensaverOnlySession = false
let isTransitioningExit = false
let screensaverReadyResolve: (() => void) | null = null
let getWindowRef: () => BrowserWindow | null = () => null

let ctrlServer: net.Server | null = null
let cursorPollTimer: NodeJS.Timeout | null = null
let initialCursorPoint: { x: number; y: number } | null = null
let activationTime = 0

let previousState = {
  wasVisible: false,
  wasMinimized: false,
  wasFullScreen: false,
  bounds: { x: 0, y: 0, width: 1100, height: 750 } as { x: number; y: number; width: number; height: number } | undefined
}

export function logScreensaverEvent(message: string): void {
  try {
    const timestamp = new Date().toISOString()
    const line = `[${timestamp}] [Electron] ${message}\r\n`

    // 1. %APPDATA%\Beacon\logs\screensaver.log
    const logDir = path.join(app.getPath('appData'), 'Beacon', 'logs')
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })
    fs.appendFileSync(path.join(logDir, 'screensaver.log'), line, 'utf-8')

    // 2. %TEMP%\BeaconScreensaver.log
    const tempLog = path.join(os.tmpdir(), 'BeaconScreensaver.log')
    fs.appendFileSync(tempLog, line, 'utf-8')
  } catch {}
  logger.info('Screensaver', message)
}

/**
 * Starts the control Named Pipe server that receives instant commands
 * (ACTIVATE, DEACTIVATE, CONFIG, PING) from Beacon.scr without spawning secondary processes.
 */
let fallbackCtrlServer: net.Server | null = null

function handleControlSocket(socket: net.Socket): void {
  let buffer = ''
  socket.on('data', (data) => {
    buffer += data.toString('utf-8')
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const rawLine of lines) {
      const command = rawLine.trim().toUpperCase()
      if (!command) continue
      logScreensaverEvent(`Screensaver control pipe received command: ${command}`)

      if (command === 'ACTIVATE') {
        try { socket.write('OK\n') } catch {}
        enterScreensaverMode().catch((err) => {
          logScreensaverEvent(`Error entering screensaver mode: ${err}`)
        })
      } else if (command === 'DEACTIVATE' || command === 'EXIT') {
        try { socket.write('OK\n') } catch {}
        exitScreensaverMode().catch((err) => {
          logScreensaverEvent(`Error exiting screensaver mode: ${err}`)
        })
      } else if (command === 'CONFIG') {
        try { socket.write('OK\n') } catch {}
        const win = getWindowRef()
        if (win && !win.isDestroyed()) {
          if (win.isMinimized()) win.restore()
          if (!win.isVisible()) win.show()
          win.focus()
          win.webContents.send(IPC_CHANNELS.NAVIGATE, 'settings')
        }
      } else if (command === 'PING') {
        try { socket.write('PONG\n') } catch {}
      }
    }
  })

  socket.on('error', (err) => {
    logScreensaverEvent(`Control pipe socket notice: ${err.message}`)
  })
}

export function startScreensaverControlServer(): void {
  const username = process.env.USERNAME || ''
  const primaryPipePath = `\\\\.\\pipe\\beacon-screensaver-ctrl-${username}`
  const fallbackPipePath = `\\\\.\\pipe\\helm-screensaver-ctrl-${username}`

  try {
    if (ctrlServer) {
      try { ctrlServer.close() } catch {}
      ctrlServer = null
    }
    if (fallbackCtrlServer) {
      try { fallbackCtrlServer.close() } catch {}
      fallbackCtrlServer = null
    }

    ctrlServer = net.createServer(handleControlSocket)
    ctrlServer.listen(primaryPipePath, () => {
      logScreensaverEvent(`Primary screensaver control named pipe listening on: ${primaryPipePath}`)
    })
    ctrlServer.on('error', (err) => {
      logScreensaverEvent(`Primary screensaver control pipe server error: ${err.message}`)
    })

    // Backward-compatible fallback pipe server
    try {
      fallbackCtrlServer = net.createServer(handleControlSocket)
      fallbackCtrlServer.listen(fallbackPipePath, () => {
        logScreensaverEvent(`Fallback screensaver control named pipe listening on: ${fallbackPipePath}`)
      })
      fallbackCtrlServer.on('error', (err) => {
        logScreensaverEvent(`Fallback screensaver control pipe notice (non-fatal): ${err.message}`)
      })
    } catch {}
  } catch (err) {
    logScreensaverEvent(`Failed to initialize screensaver control server: ${err}`)
  }
}

export function stopScreensaverControlServer(): void {
  if (ctrlServer) {
    try {
      ctrlServer.close()
      logScreensaverEvent('Primary screensaver control named pipe closed')
    } catch {}
    ctrlServer = null
  }
  if (fallbackCtrlServer) {
    try {
      fallbackCtrlServer.close()
      logScreensaverEvent('Fallback screensaver control named pipe closed')
    } catch {}
    fallbackCtrlServer = null
  }
}

function startCursorWatchdog(): void {
  stopCursorWatchdog()
  activationTime = Date.now()
  try {
    initialCursorPoint = screen.getCursorScreenPoint()
  } catch {
    initialCursorPoint = null
  }

  // Poll cursor position every 80ms at the OS level
  cursorPollTimer = setInterval(() => {
    if (!isScreensaverRunning || isTransitioningExit) {
      stopCursorWatchdog()
      return
    }

    // 1200ms initial grace period so screensaver setup and fullscreen transitions don't accidentally self-dismiss
    if (Date.now() - activationTime < 1200) {
      try {
        const pt = screen.getCursorScreenPoint()
        if (Math.abs(pt.x) < 10000 && Math.abs(pt.y) < 10000) {
          initialCursorPoint = pt
        }
      } catch {}
      return
    }

    try {
      const current = screen.getCursorScreenPoint()
      if (!initialCursorPoint) {
        initialCursorPoint = current
        return
      }

      // Check for bogus/corrupted coordinates from OS during display switch (e.g. uninitialized stack values > 10,000)
      if (
        Math.abs(current.x) > 10000 ||
        Math.abs(current.y) > 10000 ||
        Math.abs(initialCursorPoint.x) > 10000 ||
        Math.abs(initialCursorPoint.y) > 10000
      ) {
        initialCursorPoint = current
        return
      }

      const dx = current.x - initialCursorPoint.x
      const dy = current.y - initialCursorPoint.y
      const dist = Math.hypot(dx, dy)

      // Guard against impossible leaps (> 5,000px) from virtual display changes
      if (dist > 5000) {
        initialCursorPoint = current
        return
      }

      if (dist >= 25) {
        logScreensaverEvent(
          `Main process cursor polling detected mouse movement (${Math.round(dist)}px); dismissing screensaver`
        )
        stopCursorWatchdog()
        exitScreensaverMode()
      }
    } catch {}
  }, 80)
}

function stopCursorWatchdog(): void {
  if (cursorPollTimer) {
    clearInterval(cursorPollTimer)
    cursorPollTimer = null
  }
}

function registerGlobalExitShortcuts(): void {
  try {
    globalShortcut.unregisterAll()
    const accelerators = ['Escape', 'Space', 'Return', 'MediaPlayPause']
    globalShortcut.registerAll(accelerators, () => {
      logScreensaverEvent('Main process global shortcut detected dismissal key; exiting screensaver')
      exitScreensaverMode()
    })
  } catch (err) {
    logScreensaverEvent(`Failed to register global shortcuts: ${err}`)
  }
}

function unregisterGlobalExitShortcuts(): void {
  try {
    globalShortcut.unregisterAll()
  } catch {}
}

export function initScreensaverManager(
  mainWindowGetter: () => BrowserWindow | null,
  screensaverOnly: boolean = false
): void {
  getWindowRef = mainWindowGetter
  isScreensaverOnlySession = screensaverOnly
  logScreensaverEvent(`initScreensaverManager: screensaverOnly=${screensaverOnly}`)

  // Start the control pipe server for instant launcher handshake
  startScreensaverControlServer()

  // Hardware session & power event listeners to prevent any screen-trapping
  try {
    powerMonitor.on('lock-screen', () => {
      logScreensaverEvent('powerMonitor detected lock-screen; immediately dismissing screensaver')
      if (isScreensaverRunning) {
        const win = getWindowRef()
        if (win && !win.isDestroyed()) {
          try { win.setAlwaysOnTop(false) } catch {}
        }
        exitScreensaverMode()
      }
    })

    powerMonitor.on('suspend', () => {
      logScreensaverEvent('powerMonitor detected suspend; immediately dismissing screensaver')
      if (isScreensaverRunning) {
        const win = getWindowRef()
        if (win && !win.isDestroyed()) {
          try { win.setAlwaysOnTop(false) } catch {}
        }
        exitScreensaverMode()
      }
    })

    ;(app as any).on('session-end', () => {
      logScreensaverEvent('app detected session-end; immediately dismissing screensaver')
      if (isScreensaverRunning) {
        const win = getWindowRef()
        if (win && !win.isDestroyed()) {
          try { win.setAlwaysOnTop(false) } catch {}
        }
        exitScreensaverMode()
      }
    })
  } catch (err) {
    logScreensaverEvent(`Failed to bind powerMonitor listeners: ${err}`)
  }
}

export function isScreensaverActive(): boolean {
  return isScreensaverRunning
}

export function isScreensaverOnly(): boolean {
  return isScreensaverOnlySession
}

export function setScreensaverOnly(value: boolean): void {
  isScreensaverOnlySession = value
}

/**
 * Notifies the native Beacon.scr launcher through a Windows named pipe
 * that the screensaver session has ended, allowing the launcher process to exit.
 */
export function notifyScreensaverExitPipe(): void {
  const username = process.env.USERNAME || ''
  const pipes = [
    `\\\\.\\pipe\\beacon-screensaver-exit-${username}`,
    `\\\\.\\pipe\\helm-screensaver-exit-${username}`
  ]

  for (const pipePath of pipes) {
    try {
      const client = net.connect(pipePath, () => {
        logScreensaverEvent(`Connected to launcher exit pipe (${pipePath}); signaling EXIT`)
        try {
          client.write('EXIT\n')
          client.end()
        } catch {}
      })
      client.on('error', () => {
        // Expected if launcher was not listening on this specific pipe name
      })
    } catch {}
  }
}

let isRendererScreensaverReady = false

/**
 * Called when the renderer process has mounted AmbientBoardPage and is ready to paint
 */
export function notifyScreensaverReady(): void {
  logScreensaverEvent('Received SCREENSAVER_READY signal from renderer')
  isRendererScreensaverReady = true
  if (screensaverReadyResolve) {
    screensaverReadyResolve()
    screensaverReadyResolve = null
  }
}

/**
 * Activates fullscreen screensaver ambient mode seamlessly without intermediate normal-window flash.
 */
export async function enterScreensaverMode(): Promise<void> {
  const win = getWindowRef()
  if (!win || win.isDestroyed()) {
    logScreensaverEvent('enterScreensaverMode called but mainWindow is null or destroyed')
    return
  }
  if (isScreensaverRunning) {
    logScreensaverEvent('enterScreensaverMode called but screensaver is already active')
    return
  }

  isTransitioningExit = false
  previousState = {
    wasVisible: win.isVisible(),
    wasMinimized: win.isMinimized(),
    wasFullScreen: win.isFullScreen(),
    bounds: win.getBounds()
  }

  isScreensaverRunning = true
  logScreensaverEvent(
    `Entering screensaver mode (fullscreen ambient). Previous window state: visible=${previousState.wasVisible}, minimized=${previousState.wasMinimized}, fullScreen=${previousState.wasFullScreen}`
  )

  // 1. Immediately clamp opacity to 0 so no windowed frame or route transition is ever visible
  try {
    win.setOpacity(0)
  } catch {}

  // 2. If window was minimized, restore while opacity=0 so Windows DWM un-minimize animation does not flash
  if (win.isMinimized()) {
    try {
      win.restore()
    } catch {}
  }

  // 3. Pre-configure native display bounds and fullscreen mode while opacity=0
  try {
    const activeDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) || screen.getPrimaryDisplay()
    if (activeDisplay && activeDisplay.bounds) {
      win.setBounds(activeDisplay.bounds)
    }
  } catch (err) {
    logScreensaverEvent(`Error setting display bounds: ${err}`)
  }

  try {
    win.setFullScreen(true)
  } catch (err) {
    logScreensaverEvent(`Error setting fullscreen: ${err}`)
  }

  try {
    win.setAlwaysOnTop(true, 'screen-saver')
  } catch {
    try {
      win.setAlwaysOnTop(true)
    } catch {}
  }

  // 4. Present window to OS at opacity 0 so Chromium's layout & compositor engine actively paints
  // the dark Ambient screen to the GPU swapchain backbuffer without exposing any unpainted frame.
  try {
    if (!win.isVisible()) {
      win.showInactive()
    }
  } catch (err) {
    logScreensaverEvent(`Notice showing window at opacity 0: ${err}`)
  }

  // 5. Notify renderer to switch to Screensaver Ambient view
  try {
    win.webContents.send(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, true)
    logScreensaverEvent('Dispatched SCREENSAVER_STATE_CHANGE(true) to renderer')
  } catch (err) {
    logScreensaverEvent(`Failed to dispatch screensaver state change to renderer: ${err}`)
  }

  // 6. Wait for renderer to confirm that Ambient has mounted, laid out, and composited to GPU (with 500ms safety fallback)
  if (!isRendererScreensaverReady) {
    await new Promise<void>((resolve) => {
      let settled = false
      const done = (): void => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        screensaverReadyResolve = null
        resolve()
      }
      screensaverReadyResolve = done
      const timer = setTimeout(() => {
        logScreensaverEvent('Screensaver readiness handshake timed out (500ms fallback) - revealing window')
        done()
      }, 500)
    })
  }

  // 7. Ensure fullscreen bounds and reveal directly in fullscreen screensaver mode (zero flash, zero intermediate window)
  try {
    win.setFullScreen(true)
    win.show()
    win.focus()
    win.setOpacity(1.0)
    logScreensaverEvent('Ambient mounted & confirmed: window revealed directly in fullscreen screensaver mode (zero flash)')
  } catch (err) {
    logScreensaverEvent(`Error revealing screensaver window: ${err}`)
  }

  // 8. Arm main-process hardware fail-safe watchdogs
  startCursorWatchdog()
  registerGlobalExitShortcuts()
}

/**
 * Gracefully exits screensaver mode with a smooth fade-out transition (250-400ms),
 * unblocks the native launcher, and cleanly restores the previous window state without flickering.
 */
export async function exitScreensaverMode(): Promise<void> {
  if (!isScreensaverRunning || isTransitioningExit) {
    logScreensaverEvent('exitScreensaverMode called but screensaver is not active or already exiting')
    return
  }

  isTransitioningExit = true
  isScreensaverRunning = false
  logScreensaverEvent('Screensaver dismissed: initiating smooth exit transition...')

  // Immediately disarm main process watchdogs
  stopCursorWatchdog()
  unregisterGlobalExitShortcuts()

  const win = getWindowRef()
  if (!win || win.isDestroyed()) {
    logScreensaverEvent('Window unavailable during exit; signaling pipe and concluding')
    notifyScreensaverExitPipe()
    if (isScreensaverOnlySession) {
      app.quit()
    }
    isTransitioningExit = false
    return
  }

  // Check reduced motion preference (OS accessibility preference or user setting)
  let isReducedMotion = false
  try {
    const currentSettings = loadSettings()
    const animSettings = systemPreferences.getAnimationSettings ? systemPreferences.getAnimationSettings() : null
    isReducedMotion =
      Boolean(animSettings?.prefersReducedMotion) ||
      Boolean(currentSettings.appearance?.reducedMotion)
  } catch {}

  const FADE_DURATION_MS = isReducedMotion ? 0 : 300
  const STEP_INTERVAL_MS = 20
  const TOTAL_STEPS = Math.max(1, Math.round(FADE_DURATION_MS / STEP_INTERVAL_MS))

  logScreensaverEvent(
    `Exit transition animation: duration=${FADE_DURATION_MS}ms, reducedMotion=${isReducedMotion}`
  )

  // 1. Graceful fade-out of the top-level window opacity
  if (FADE_DURATION_MS > 0) {
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const opacity = 1 - step / TOTAL_STEPS
      try {
        win.setOpacity(Math.max(0, opacity))
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, STEP_INTERVAL_MS))
    }
  }

  // Clamp opacity to 0 during window reconfiguration to avoid any visible resizing or flash
  try {
    win.setOpacity(0)
  } catch {}

  logScreensaverEvent(
    `Fade-out complete. Restoring prior state: wasVisible=${previousState.wasVisible}, wasMinimized=${previousState.wasMinimized}, wasFullScreen=${previousState.wasFullScreen}`
  )

  // Disarm screensaver z-order
  try {
    win.setAlwaysOnTop(false)
  } catch {}

  // 2. Screensaver-only session (started via Beacon.scr when Helm was closed)
  if (isScreensaverOnlySession) {
    logScreensaverEvent('Screensaver-only session completed: hiding window, notifying pipe, and quitting BEACON')
    notifyScreensaverExitPipe()
    try {
      win.hide()
    } catch {}
    app.quit()
    isTransitioningExit = false
    return
  }

  // 3. Helm was already running before screensaver: accurately restore prior state
  if (!previousState.wasVisible || previousState.wasMinimized) {
    // Was in system tray or minimized: hide first while transparent, un-fullscreen, restore opacity
    try {
      win.hide()
      win.setFullScreen(false)
      if (previousState.bounds) {
        win.setBounds(previousState.bounds)
      }
      win.setOpacity(1.0)
    } catch {}
    logScreensaverEvent('Restored previous state: hidden to system tray without windowed flash')
  } else {
    // Was visible on desktop: restore fullscreen state and restore opacity
    try {
      win.setFullScreen(previousState.wasFullScreen)
      if (!previousState.wasFullScreen && previousState.bounds) {
        win.setBounds(previousState.bounds)
      }
      win.setOpacity(1.0)
      win.focus()
    } catch {}
    logScreensaverEvent('Restored previous state: visible on desktop')
  }

  // Reset renderer screensaver ready flag for subsequent activations
  isRendererScreensaverReady = false

  // Inform renderer that screensaver is inactive so it restores prior route
  try {
    win.webContents.send(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, false)
    logScreensaverEvent('Dispatched SCREENSAVER_STATE_CHANGE(false) to renderer')
  } catch (err) {
    logScreensaverEvent(`Failed to dispatch screensaver state change: ${err}`)
  }

  // Unblock Beacon.scr waiting on the exit pipe AFTER all animation and cleanup are complete
  notifyScreensaverExitPipe()
  isTransitioningExit = false
}
