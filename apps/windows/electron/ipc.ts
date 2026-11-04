import { app, BrowserWindow, ipcMain, shell, nativeTheme } from 'electron'
import {
  IPC_CHANNELS,
  AmbientSettings,
  CreateNoteInput,
  UpdateNoteInput,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterOptions
} from './types'
import { getAllWatches } from './watches-store'
import {
  getBrowserIntegrationStatus,
  retryBrowserConnection
} from './pipe-server'
import {
  loadSettings,
  updateSettings,
  resetSettings,
  loadAmbientSettings,
  updateAmbientSettings,
  isOnboardingCompleted,
  setOnboardingCompleted,
  getSettingsHealth,
  getWindowsScreensaverStatus,
  setWindowsScreensaverActive,
  openWindowsScreensaverDialog
} from './settings-store'
import {
  isScreensaverActive,
  exitScreensaverMode,
  enterScreensaverMode,
  notifyScreensaverReady
} from './screensaver-manager'
import {
  getActiveWallpapers,
  openWallpaperDirectoryDialog
} from './wallpaper-manager'
import { defaultWeatherProvider } from './weather-provider'
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleCompleteTask,
  getProductivitySummary,
  getDatabaseHealth
} from './database'
import { logger, redactSensitiveText } from './logger'
import { SystemHealthSummary } from './types'

const REGISTERED_CHANNELS: string[] = []

export function unregisterIpcHandlers(): void {
  for (const channel of REGISTERED_CHANNELS) {
    try {
      ipcMain.removeHandler(channel)
    } catch {}
  }
  REGISTERED_CHANNELS.length = 0
}

export function registerIpcHandlers(getMainWindow: () => BrowserWindow | null): void {
  function registerHandle(channel: string, rawHandler: Parameters<typeof ipcMain.handle>[1]): void {
    ipcMain.removeHandler(channel)
    const handler: Parameters<typeof ipcMain.handle>[1] = (event, ...args) => {
      const win = getMainWindow()
      if (win && !win.isDestroyed() && event && event.sender && event.sender !== win.webContents) {
        logger.warn('Security', `Blocked unauthorized IPC call on channel "${channel}" from unauthorized webContents`)
        throw new Error('Unauthorized IPC sender')
      }
      return rawHandler(event, ...args)
    }
    ipcMain.handle(channel, handler)
    if (!REGISTERED_CHANNELS.includes(channel)) {
      REGISTERED_CHANNELS.push(channel)
    }
  }
  // Application metadata
  registerHandle(IPC_CHANNELS.APP_GET_VERSION, () => {
    return app.getVersion()
  })

  registerHandle(IPC_CHANNELS.APP_GET_PLATFORM, () => {
    return process.platform
  })

  // Window control
  registerHandle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
    const window = getMainWindow()
    if (window && !window.isDestroyed()) {
      const current = loadSettings()
      if (current.general.minimizeToTray) {
        window.hide()
      } else {
        window.minimize()
      }
    }
  })

  registerHandle(IPC_CHANNELS.WINDOW_CLOSE, () => {
    const window = getMainWindow()
    if (window && !window.isDestroyed()) {
      window.close() // Handled by close event listener (hides to tray)
    }
  })

  // Fullscreen controls for Ambient Screen Board
  registerHandle(IPC_CHANNELS.WINDOW_SET_FULLSCREEN, (_event, fullscreen: unknown) => {
    const window = getMainWindow()
    if (window && !window.isDestroyed()) {
      window.setFullScreen(Boolean(fullscreen))
    }
  })

  registerHandle(IPC_CHANNELS.WINDOW_IS_FULLSCREEN, () => {
    const window = getMainWindow()
    return window && !window.isDestroyed() ? window.isFullScreen() : false
  })

  // Safe external URL opening
  registerHandle(IPC_CHANNELS.SHELL_OPEN_EXTERNAL, async (_event, url: unknown) => {
    if (typeof url !== 'string') {
      throw new Error('Invalid URL parameter: must be a string')
    }

    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(`Forbidden protocol: ${parsed.protocol}. Only http and https are permitted.`)
      }
      await shell.openExternal(url)
    } catch (err) {
      console.error('[BEACON IPC] Failed to open external URL:', err)
      throw err
    }
  })

  // Theme management
  registerHandle(IPC_CHANNELS.THEME_GET, () => {
    return loadSettings().appearance.theme
  })

  registerHandle(IPC_CHANNELS.THEME_SET, (_event, theme: unknown) => {
    if (theme !== 'system' && theme !== 'light' && theme !== 'dark') {
      throw new Error('Invalid theme: must be "system", "light", or "dark"')
    }
    nativeTheme.themeSource = theme
    updateSettings({ appearance: { theme } })
  })

  // Browser watches and status
  registerHandle(IPC_CHANNELS.WATCHES_GET, () => {
    return getAllWatches()
  })

  registerHandle(IPC_CHANNELS.BROWSER_STATUS_GET, () => {
    return getBrowserIntegrationStatus()
  })

  registerHandle(IPC_CHANNELS.BROWSER_RECONNECT, async () => {
    return retryBrowserConnection()
  })

  // Ambient Screen Board: Settings & Wallpapers
  registerHandle(IPC_CHANNELS.AMBIENT_GET_SETTINGS, () => {
    return loadAmbientSettings()
  })

  registerHandle(IPC_CHANNELS.AMBIENT_SET_SETTINGS, (_event, settings: unknown) => {
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings payload')
    }
    logger.info('Settings', `[Diagnostic:IPC] AMBIENT_SET_SETTINGS payload: ${JSON.stringify(settings)}`)
    const updated = updateAmbientSettings(settings as Partial<AmbientSettings>)
    logger.info('Settings', `[Diagnostic:IPC] AMBIENT_SET_SETTINGS persisted. New location: "${updated.weatherLocation}"`)
    const win = getMainWindow()
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, loadSettings())
    }
    return updated
  })

  registerHandle(IPC_CHANNELS.AMBIENT_SELECT_WALLPAPER_DIR, async () => {
    return openWallpaperDirectoryDialog(getMainWindow())
  })

  registerHandle(IPC_CHANNELS.AMBIENT_GET_WALLPAPERS, () => {
    return getActiveWallpapers()
  })

  // Ambient Screen Board: Weather Provider
  registerHandle(IPC_CHANNELS.WEATHER_GET, async (_event, locArg: unknown) => {
    const settings = loadAmbientSettings()
    const targetLoc = (typeof locArg === 'string' && locArg.trim()) ? locArg.trim() : settings.weatherLocation
    logger.info('IPC', `[Diagnostic:IPC] WEATHER_GET called. Raw arg: "${locArg}", Saved location: "${settings.weatherLocation}", Effective target: "${targetLoc}"`)
    try {
      const data = await defaultWeatherProvider.getWeather(targetLoc)
      logger.info('IPC', `[Diagnostic:IPC] WEATHER_GET completed. Result: ${data ? `Success (${data.location}, ${data.temperatureCelsius}°C / ${data.temperatureFahrenheit}°F, ${data.condition})` : 'null'}`)
      return data
    } catch (err: any) {
      logger.error('IPC', `[Diagnostic:IPC] WEATHER_GET error: ${err?.message}`, err?.stack)
      return null
    }
  })

  // First-Run Onboarding
  registerHandle(IPC_CHANNELS.ONBOARDING_GET, () => {
    return isOnboardingCompleted()
  })

  registerHandle(IPC_CHANNELS.ONBOARDING_SET, (_event, completed: unknown) => {
    setOnboardingCompleted(Boolean(completed))
  })

  // ----------------------------------------------------
  // Application Settings & Preferences (Phase 5.4)
  // ----------------------------------------------------
  registerHandle(IPC_CHANNELS.SETTINGS_GET, () => {
    return loadSettings()
  })

  registerHandle(IPC_CHANNELS.SETTINGS_UPDATE, (_event, partial: unknown) => {
    if (!partial || typeof partial !== 'object') {
      throw new Error('Invalid settings payload: must be an object')
    }
    logger.info('Settings', `[Diagnostic:IPC] SETTINGS_UPDATE payload: ${JSON.stringify(partial)}`)
    const updated = updateSettings(partial as any)
    logger.info('Settings', `[Diagnostic:IPC] SETTINGS_UPDATE persisted. Location: "${updated.ambient.weatherLocation}"`)
    const win = getMainWindow()
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, updated)
    }
    return updated
  })

  registerHandle(IPC_CHANNELS.SETTINGS_RESET, (_event, options: unknown) => {
    const opts =
      options && typeof options === 'object'
        ? (options as { resetOnboarding?: boolean })
        : undefined
    const reset = resetSettings(opts)
    const win = getMainWindow()
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, reset)
    }
    return reset
  })

  // ----------------------------------------------------
  // Notes IPC Handlers
  // ----------------------------------------------------
  registerHandle(IPC_CHANNELS.NOTES_GET_ALL, async (_event, queryArg: unknown) => {
    const q = typeof queryArg === 'string' ? queryArg : undefined
    return getAllNotes(q)
  })

  registerHandle(IPC_CHANNELS.NOTES_GET_BY_ID, async (_event, idArg: unknown) => {
    if (typeof idArg !== 'string' || !idArg.trim()) {
      throw new Error('Invalid note ID')
    }
    return getNoteById(idArg.trim())
  })

  registerHandle(IPC_CHANNELS.NOTES_CREATE, async (_event, inputArg: unknown) => {
    if (!inputArg || typeof inputArg !== 'object') {
      throw new Error('Invalid note input payload')
    }
    const input = inputArg as CreateNoteInput
    return createNote(input)
  })

  registerHandle(IPC_CHANNELS.NOTES_UPDATE, async (_event, inputArg: unknown) => {
    if (!inputArg || typeof inputArg !== 'object') {
      throw new Error('Invalid note update payload')
    }
    const input = inputArg as UpdateNoteInput
    if (!input.id || typeof input.id !== 'string') {
      throw new Error('Note ID is required for update')
    }
    return updateNote(input)
  })

  registerHandle(IPC_CHANNELS.NOTES_DELETE, async (_event, idArg: unknown) => {
    if (typeof idArg !== 'string' || !idArg.trim()) {
      throw new Error('Invalid note ID')
    }
    return deleteNote(idArg.trim())
  })

  registerHandle(IPC_CHANNELS.NOTES_TOGGLE_PIN, async (_event, idArg: unknown) => {
    if (typeof idArg !== 'string' || !idArg.trim()) {
      throw new Error('Invalid note ID')
    }
    return togglePinNote(idArg.trim())
  })

  // ----------------------------------------------------
  // Tasks IPC Handlers
  // ----------------------------------------------------
  registerHandle(IPC_CHANNELS.TASKS_GET_ALL, async (_event, filterArg: unknown) => {
    const filter = filterArg && typeof filterArg === 'object' ? (filterArg as TaskFilterOptions) : undefined
    return getAllTasks(filter)
  })

  registerHandle(IPC_CHANNELS.TASKS_GET_BY_ID, async (_event, idArg: unknown) => {
    if (typeof idArg !== 'string' || !idArg.trim()) {
      throw new Error('Invalid task ID')
    }
    return getTaskById(idArg.trim())
  })

  registerHandle(IPC_CHANNELS.TASKS_CREATE, async (_event, inputArg: unknown) => {
    if (!inputArg || typeof inputArg !== 'object') {
      throw new Error('Invalid task input payload')
    }
    const input = inputArg as CreateTaskInput
    const res = await createTask(input)
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED)
    return res
  })

  registerHandle(IPC_CHANNELS.TASKS_UPDATE, async (_event, inputArg: unknown) => {
    if (!inputArg || typeof inputArg !== 'object') {
      throw new Error('Invalid task update payload')
    }
    const input = inputArg as UpdateTaskInput
    if (!input.id || typeof input.id !== 'string') {
      throw new Error('Task ID is required for update')
    }
    const res = await updateTask(input)
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED)
    return res
  })

  registerHandle(IPC_CHANNELS.TASKS_DELETE, async (_event, idArg: unknown) => {
    if (typeof idArg !== 'string' || !idArg.trim()) {
      throw new Error('Invalid task ID')
    }
    const res = await deleteTask(idArg.trim())
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED)
    return res
  })

  registerHandle(IPC_CHANNELS.TASKS_TOGGLE_COMPLETE, async (_event, idArg: unknown) => {
    if (typeof idArg !== 'string' || !idArg.trim()) {
      throw new Error('Invalid task ID')
    }
    const res = await toggleCompleteTask(idArg.trim())
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED)
    return res
  })

  // Productivity summary
  registerHandle(IPC_CHANNELS.PRODUCTIVITY_SUMMARY_GET, async () => {
    return getProductivitySummary()
  })

  // ----------------------------------------------------
  // Phase 5.3 Diagnostics IPC Handlers
  // ----------------------------------------------------
  async function computeSystemHealthSummary(): Promise<SystemHealthSummary> {
    const dbHealth = await getDatabaseHealth()
    const settingsHealth = getSettingsHealth()
    const extStatus = getBrowserIntegrationStatus()
    const mem = process.memoryUsage()

    return {
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron || 'unknown',
      chromeVersion: process.versions.chrome || 'unknown',
      nodeVersion: process.versions.node || 'unknown',
      platform: process.platform,
      arch: process.arch,
      memoryUsageMb: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
      databaseHealth: dbHealth,
      settingsHealth: settingsHealth,
      extensionHealth: {
        state: extStatus.state,
        browserType: extStatus.browserType,
        manifestInstalled: extStatus.manifestInstalled,
        pipeAvailable: extStatus.pipeAvailable,
        lastSyncTime: extStatus.lastSyncTime,
        errorReason: extStatus.errorReason
      }
    }
  }

  registerHandle(IPC_CHANNELS.DIAGNOSTICS_GET_HEALTH, async () => {
    return computeSystemHealthSummary()
  })

  registerHandle(IPC_CHANNELS.DIAGNOSTICS_GET_LOGS, (_event, limitArg: unknown) => {
    const limit = typeof limitArg === 'number' && limitArg > 0 ? limitArg : 50
    return logger.getRecentLogs(limit)
  })

  registerHandle(IPC_CHANNELS.DIAGNOSTICS_EXPORT, async () => {
    const summary = await computeSystemHealthSummary()
    const result = logger.exportDiagnosticsBundle(summary)
    return {
      success: result.success,
      filePath: result.filePath,
      error: result.error
    }
  })

  registerHandle(IPC_CHANNELS.DIAGNOSTICS_CLEAR_LOGS, () => {
    const success = logger.clearLogs()
    logger.info('Diagnostics', 'Diagnostic logs cleared by user request')
    return success
  })

  registerHandle(IPC_CHANNELS.DIAGNOSTICS_OPEN_LOGS_DIR, async () => {
    await logger.openLogsFolder()
  })

  // ----------------------------------------------------
  // Phase 6: Screensaver IPC Handlers
  // ----------------------------------------------------
  registerHandle(IPC_CHANNELS.SCREENSAVER_IS_ACTIVE, () => {
    return isScreensaverActive()
  })

  registerHandle(IPC_CHANNELS.SCREENSAVER_EXIT, () => {
    exitScreensaverMode()
  })

  registerHandle(IPC_CHANNELS.SCREENSAVER_READY, () => {
    notifyScreensaverReady()
  })

  registerHandle(IPC_CHANNELS.SCREENSAVER_GET_STATUS, () => {
    return getWindowsScreensaverStatus()
  })

  registerHandle(IPC_CHANNELS.SCREENSAVER_SET_ACTIVE, (_event, activeArg: unknown) => {
    const active = typeof activeArg === 'boolean' ? activeArg : true
    const success = setWindowsScreensaverActive(active)
    const current = loadSettings()
    updateSettings({
      screensaver: {
        ...current.screensaver,
        enabled: active
      }
    })
    return success
  })

  registerHandle(IPC_CHANNELS.SCREENSAVER_OPEN_SETTINGS, () => {
    openWindowsScreensaverDialog()
  })

  registerHandle(IPC_CHANNELS.SCREENSAVER_START_PREVIEW, () => {
    enterScreensaverMode()
  })
}
