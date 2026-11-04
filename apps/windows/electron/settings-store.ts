import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync, spawn } from 'child_process'
import { app, nativeTheme } from 'electron'
import {
  AmbientSettings,
  SettingsHealth,
  HelmSettings,
  GeneralSettings,
  AppearanceSettings,
  NotificationSettings,
  ScreensaverSettings,
  ScreensaverStatus,
  DeepPartial
} from './types'
import { getHelmDataDirectory, getBeaconDataDirectory } from './watches-store'
import { logger } from './logger'

export const DEFAULT_AMBIENT_SETTINGS: AmbientSettings = {
  slideshowInterval: 30,
  transitionDuration: 2.0,
  kenBurnsEnabled: true,
  wallpaperSource: 'built-in',
  customWallpaperFolder: '',
  selectedWallpaperIndex: 0,
  showClock: true,
  showDate: true,
  use24Hour: false,
  showWeather: true,
  weatherLocation: 'London',
  temperatureUnit: 'C',
  showWatches: true,
  showTasks: true,
  showQuote: true,
  frostedGlassBlur: 16,
  backgroundDim: 0.35
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  launchAtStartup: false,
  startMinimized: false,
  minimizeToTray: false,
  closeBehavior: 'tray'
}

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  theme: 'system',
  reducedMotion: false
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  sound: true
}

export const DEFAULT_SCREENSAVER_SETTINGS: ScreensaverSettings = {
  enabled: true,
  showClock: true,
  showDate: true,
  showWeather: true,
  showQuote: true,
  showTasks: false,
  showWatches: false,
  exitOnMouseMove: true
}

export const DEFAULT_SETTINGS: HelmSettings = {
  version: 1,
  general: DEFAULT_GENERAL_SETTINGS,
  appearance: DEFAULT_APPEARANCE_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  ambient: DEFAULT_AMBIENT_SETTINGS,
  screensaver: DEFAULT_SCREENSAVER_SETTINGS,
  onboardingCompleted: false
}

export function getSettingsFilePath(): string {
  return path.join(getBeaconDataDirectory(), 'settings.json')
}

/**
 * Validates, repairs, and migrates raw settings JSON to the canonical HelmSettings schema
 */
export function validateAndMigrateSettings(raw: any): HelmSettings {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_SETTINGS }
  }

  // 1. General Settings
  const generalSrc = raw.general && typeof raw.general === 'object' ? raw.general : {}
  const general: GeneralSettings = {
    launchAtStartup:
      typeof generalSrc.launchAtStartup === 'boolean'
        ? generalSrc.launchAtStartup
        : DEFAULT_GENERAL_SETTINGS.launchAtStartup,
    startMinimized:
      typeof generalSrc.startMinimized === 'boolean'
        ? generalSrc.startMinimized
        : DEFAULT_GENERAL_SETTINGS.startMinimized,
    minimizeToTray:
      typeof generalSrc.minimizeToTray === 'boolean'
        ? generalSrc.minimizeToTray
        : DEFAULT_GENERAL_SETTINGS.minimizeToTray,
    closeBehavior:
      generalSrc.closeBehavior === 'quit' || generalSrc.closeBehavior === 'tray'
        ? generalSrc.closeBehavior
        : DEFAULT_GENERAL_SETTINGS.closeBehavior
  }

  // 2. Appearance Settings (handle legacy top-level `theme`)
  const appearanceSrc = raw.appearance && typeof raw.appearance === 'object' ? raw.appearance : {}
  const legacyTheme = typeof raw.theme === 'string' ? raw.theme : undefined
  const rawTheme = appearanceSrc.theme || legacyTheme
  const theme =
    rawTheme === 'light' || rawTheme === 'dark' || rawTheme === 'system'
      ? rawTheme
      : DEFAULT_APPEARANCE_SETTINGS.theme

  const appearance: AppearanceSettings = {
    theme,
    reducedMotion:
      typeof appearanceSrc.reducedMotion === 'boolean'
        ? appearanceSrc.reducedMotion
        : DEFAULT_APPEARANCE_SETTINGS.reducedMotion
  }

  // 3. Notification Settings
  const notifSrc = raw.notifications && typeof raw.notifications === 'object' ? raw.notifications : {}
  const notifications: NotificationSettings = {
    enabled:
      typeof notifSrc.enabled === 'boolean'
        ? notifSrc.enabled
        : DEFAULT_NOTIFICATION_SETTINGS.enabled,
    sound:
      typeof notifSrc.sound === 'boolean'
        ? notifSrc.sound
        : DEFAULT_NOTIFICATION_SETTINGS.sound
  }

  // 4. Ambient Settings
  const ambientSrc = raw.ambient && typeof raw.ambient === 'object' ? raw.ambient : {}
  const ambient: AmbientSettings = {
    slideshowInterval:
      typeof ambientSrc.slideshowInterval === 'number' && ambientSrc.slideshowInterval >= 5
        ? ambientSrc.slideshowInterval
        : DEFAULT_AMBIENT_SETTINGS.slideshowInterval,
    transitionDuration:
      typeof ambientSrc.transitionDuration === 'number' && ambientSrc.transitionDuration >= 0.1
        ? ambientSrc.transitionDuration
        : DEFAULT_AMBIENT_SETTINGS.transitionDuration,
    kenBurnsEnabled:
      typeof ambientSrc.kenBurnsEnabled === 'boolean'
        ? ambientSrc.kenBurnsEnabled
        : DEFAULT_AMBIENT_SETTINGS.kenBurnsEnabled,
    wallpaperSource: ambientSrc.wallpaperSource === 'custom-folder' ? 'custom-folder' : 'built-in',
    customWallpaperFolder:
      typeof ambientSrc.customWallpaperFolder === 'string' ? ambientSrc.customWallpaperFolder : '',
    selectedWallpaperIndex:
      typeof ambientSrc.selectedWallpaperIndex === 'number' && ambientSrc.selectedWallpaperIndex >= 0
        ? ambientSrc.selectedWallpaperIndex
        : 0,
    showClock:
      typeof ambientSrc.showClock === 'boolean'
        ? ambientSrc.showClock
        : DEFAULT_AMBIENT_SETTINGS.showClock,
    showDate:
      typeof ambientSrc.showDate === 'boolean'
        ? ambientSrc.showDate
        : DEFAULT_AMBIENT_SETTINGS.showDate,
    use24Hour:
      typeof ambientSrc.use24Hour === 'boolean'
        ? ambientSrc.use24Hour
        : DEFAULT_AMBIENT_SETTINGS.use24Hour,
    showWeather:
      typeof ambientSrc.showWeather === 'boolean'
        ? ambientSrc.showWeather
        : DEFAULT_AMBIENT_SETTINGS.showWeather,
    weatherLocation:
      typeof ambientSrc.weatherLocation === 'string' && ambientSrc.weatherLocation.trim()
        ? ambientSrc.weatherLocation.trim()
        : DEFAULT_AMBIENT_SETTINGS.weatherLocation,
    temperatureUnit: ambientSrc.temperatureUnit === 'F' ? 'F' : 'C',
    showWatches:
      typeof ambientSrc.showWatches === 'boolean'
        ? ambientSrc.showWatches
        : DEFAULT_AMBIENT_SETTINGS.showWatches,
    showTasks:
      typeof ambientSrc.showTasks === 'boolean'
        ? ambientSrc.showTasks
        : DEFAULT_AMBIENT_SETTINGS.showTasks,
    showQuote:
      typeof ambientSrc.showQuote === 'boolean'
        ? ambientSrc.showQuote
        : DEFAULT_AMBIENT_SETTINGS.showQuote,
    frostedGlassBlur:
      typeof ambientSrc.frostedGlassBlur === 'number' && ambientSrc.frostedGlassBlur >= 0
        ? ambientSrc.frostedGlassBlur
        : DEFAULT_AMBIENT_SETTINGS.frostedGlassBlur,
    backgroundDim:
      typeof ambientSrc.backgroundDim === 'number' &&
      ambientSrc.backgroundDim >= 0 &&
      ambientSrc.backgroundDim <= 1
        ? ambientSrc.backgroundDim
        : DEFAULT_AMBIENT_SETTINGS.backgroundDim
  }

  // 5. Screensaver Settings (Phase 6)
  const screensaverSrc =
    raw.screensaver && typeof raw.screensaver === 'object' ? raw.screensaver : {}
  const screensaver: ScreensaverSettings = {
    enabled:
      typeof screensaverSrc.enabled === 'boolean'
        ? screensaverSrc.enabled
        : DEFAULT_SCREENSAVER_SETTINGS.enabled,
    showClock:
      typeof screensaverSrc.showClock === 'boolean'
        ? screensaverSrc.showClock
        : DEFAULT_SCREENSAVER_SETTINGS.showClock,
    showDate:
      typeof screensaverSrc.showDate === 'boolean'
        ? screensaverSrc.showDate
        : DEFAULT_SCREENSAVER_SETTINGS.showDate,
    showWeather:
      typeof screensaverSrc.showWeather === 'boolean'
        ? screensaverSrc.showWeather
        : DEFAULT_SCREENSAVER_SETTINGS.showWeather,
    showQuote:
      typeof screensaverSrc.showQuote === 'boolean'
        ? screensaverSrc.showQuote
        : DEFAULT_SCREENSAVER_SETTINGS.showQuote,
    showTasks:
      typeof screensaverSrc.showTasks === 'boolean'
        ? screensaverSrc.showTasks
        : DEFAULT_SCREENSAVER_SETTINGS.showTasks,
    showWatches:
      typeof screensaverSrc.showWatches === 'boolean'
        ? screensaverSrc.showWatches
        : DEFAULT_SCREENSAVER_SETTINGS.showWatches,
    exitOnMouseMove:
      typeof screensaverSrc.exitOnMouseMove === 'boolean'
        ? screensaverSrc.exitOnMouseMove
        : DEFAULT_SCREENSAVER_SETTINGS.exitOnMouseMove
  }

  // 6. Onboarding
  const onboardingCompleted =
    typeof raw.onboardingCompleted === 'boolean' ? raw.onboardingCompleted : false

  return {
    version: 1,
    general,
    appearance,
    notifications,
    ambient,
    screensaver,
    onboardingCompleted
  }
}

/**
 * Synchronize settings with Windows OS and Electron runtime (startup registry, nativeTheme)
 */
export function syncSystemPreferences(settings: HelmSettings): void {
  try {
    if (app && typeof app.setLoginItemSettings === 'function') {
      const execPath = process.execPath
      app.setLoginItemSettings({
        openAtLogin: settings.general.launchAtStartup,
        openAsHidden: settings.general.startMinimized,
        path: execPath,
        args: settings.general.startMinimized ? ['--hidden'] : []
      })
      logger.info(
        'SettingsStore',
        `Synced Windows startup: openAtLogin=${settings.general.launchAtStartup}, startMinimized=${settings.general.startMinimized}`
      )
    }
  } catch (err) {
    logger.warn('SettingsStore', 'Failed to synchronize Windows login item settings:', err)
  }

  try {
    if (nativeTheme) {
      nativeTheme.themeSource = settings.appearance.theme
    }
  } catch (err) {
    logger.warn('SettingsStore', 'Failed to synchronize nativeTheme:', err)
  }
}

/**
 * Load settings from disk, automatically recovering and migrating if necessary
 */
export function loadSettings(): HelmSettings {
  const filePath = getSettingsFilePath()
  if (!fs.existsSync(filePath)) {
    return { ...DEFAULT_SETTINGS }
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    return validateAndMigrateSettings(parsed)
  } catch (err) {
    logger.warn('SettingsStore', 'Failed to parse settings.json, backing up corrupted file', err)
    try {
      const backupPath = `${filePath}.corrupted.${Date.now()}`
      fs.copyFileSync(filePath, backupPath)
      logger.info('SettingsStore', `Backed up corrupted settings to ${backupPath}`)
    } catch {}
    const defaultSettings = { ...DEFAULT_SETTINGS }
    saveSettings(defaultSettings)
    return defaultSettings
  }
}

/**
 * Persist settings to disk atomically using temporary file rename
 */
export function saveSettings(settings: HelmSettings): void {
  const filePath = getSettingsFilePath()
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const tempPath = path.join(dir, `settings.${process.pid}.${Date.now()}.tmp`)
  try {
    fs.writeFileSync(tempPath, JSON.stringify(settings, null, 2), 'utf-8')
    try {
      fs.renameSync(tempPath, filePath)
    } catch {
      fs.copyFileSync(tempPath, filePath)
      fs.unlinkSync(tempPath)
    }
    syncSystemPreferences(settings)
  } catch (err) {
    logger.error('SettingsStore', 'Failed to write settings.json atomically:', err)
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath)
      } catch {}
    }
  }
}

/**
 * Deeply merge and update settings
 */
export function updateSettings(partial: DeepPartial<HelmSettings>): HelmSettings {
  const current = loadSettings()
  const merged: HelmSettings = {
    version: 1,
    general: {
      ...current.general,
      ...(partial.general || {})
    },
    appearance: {
      ...current.appearance,
      ...(partial.appearance || {})
    },
    notifications: {
      ...current.notifications,
      ...(partial.notifications || {})
    },
    ambient: {
      ...current.ambient,
      ...(partial.ambient || {})
    },
    screensaver: {
      ...current.screensaver,
      ...(partial.screensaver || {})
    },
    onboardingCompleted:
      partial.onboardingCompleted !== undefined
        ? Boolean(partial.onboardingCompleted)
        : current.onboardingCompleted
  }

  const validated = validateAndMigrateSettings(merged)
  saveSettings(validated)
  return validated
}

/**
 * Reset application settings to defaults without touching Notes, Tasks, or Browser Watches
 */
export function resetSettings(options?: { resetOnboarding?: boolean }): HelmSettings {
  const current = loadSettings()
  const resetOnboarding = Boolean(options?.resetOnboarding)

  const resetTarget: HelmSettings = {
    version: 1,
    general: { ...DEFAULT_GENERAL_SETTINGS },
    appearance: { ...DEFAULT_APPEARANCE_SETTINGS },
    notifications: { ...DEFAULT_NOTIFICATION_SETTINGS },
    ambient: { ...DEFAULT_AMBIENT_SETTINGS },
    screensaver: { ...DEFAULT_SCREENSAVER_SETTINGS },
    onboardingCompleted: resetOnboarding ? false : current.onboardingCompleted
  }

  saveSettings(resetTarget)
  logger.info(
    'SettingsStore',
    `Settings reset to defaults. Onboarding preserved: ${!resetOnboarding}`
  )
  return resetTarget
}

// ---------------------------------------------------------------------------
// Backward-compatible adapters
// ---------------------------------------------------------------------------

export function loadStoredConfig(): any {
  return loadSettings()
}

export function saveStoredConfig(config: any): void {
  const validated = validateAndMigrateSettings(config)
  saveSettings(validated)
}

export function isOnboardingCompleted(): boolean {
  return loadSettings().onboardingCompleted
}

export function setOnboardingCompleted(completed: boolean): void {
  updateSettings({ onboardingCompleted: completed })
}

export function loadAmbientSettings(): AmbientSettings {
  return loadSettings().ambient
}

export function saveAmbientSettings(settings: AmbientSettings): void {
  updateSettings({ ambient: settings })
}

export function updateAmbientSettings(partial: Partial<AmbientSettings>): AmbientSettings {
  const updated = updateSettings({ ambient: partial as any })
  return updated.ambient
}

export function getSettingsHealth(): SettingsHealth {
  const filePath = getSettingsFilePath()
  if (!fs.existsSync(filePath)) {
    return { status: 'missing', sizeBytes: 0 }
  }

  let sizeBytes = 0
  try {
    sizeBytes = fs.statSync(filePath).size
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return { status: 'healthy', sizeBytes }
    }
    return { status: 'corrupted', sizeBytes }
  } catch {
    return { status: 'corrupted', sizeBytes }
  }
}

// ---------------------------------------------------------------------------
// Phase 6: Windows Screensaver Native Integration Helpers
// ---------------------------------------------------------------------------

export function getScrExecutablePath(): string {
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
  const candidates = [
    // 1. Packaged next to Beacon.exe in app directory
    path.join(path.dirname(process.execPath), 'Beacon.scr'),
    path.join(path.dirname(process.execPath), 'Helm.scr'),
    // 2. LocalAppData Programs installation directory
    path.join(localAppData, 'Programs', 'Beacon', 'Beacon.scr'),
    path.join(localAppData, 'Programs', 'Helm', 'Helm.scr'),
    // 3. Dev output directory
    path.join(__dirname, 'Beacon.scr'),
    path.join(__dirname, 'Helm.scr'),
    path.join(__dirname, '..', '..', 'out', 'main', 'Beacon.scr'),
    path.join(__dirname, '..', '..', 'out', 'main', 'Helm.scr'),
    path.join(__dirname, '..', '..', 'resources', 'Beacon.scr'),
    path.join(__dirname, '..', '..', 'resources', 'Helm.scr'),
    path.join(__dirname, '..', '..', 'resources', 'screensaver', 'Beacon.scr'),
    path.join(__dirname, '..', '..', 'resources', 'screensaver', 'Helm.scr')
  ]
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) return c
    } catch {}
  }
  return path.join(localAppData, 'Programs', 'Beacon', 'Beacon.scr')
}

export function getWindowsScreensaverStatus(): ScreensaverStatus {
  const scrPath = getScrExecutablePath()
  let isRegistered = false
  let activeScreensaverPath = ''
  let timeoutSeconds = 600
  let screenSaveActive = false

  try {
    const stdout = execSync('reg query "HKCU\\Control Panel\\Desktop" /s', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000
    })

    const scrMatch = stdout.match(/SCRNSAVE\.EXE\s+REG_SZ\s+(.*)/i)
    if (scrMatch && scrMatch[1]) {
      activeScreensaverPath = scrMatch[1].trim()
      const normalizedActive = path.normalize(activeScreensaverPath).toLowerCase()
      const normalizedHelm = path.normalize(scrPath).toLowerCase()
      isRegistered =
        normalizedActive === normalizedHelm ||
        normalizedActive.endsWith('beacon.scr') ||
        normalizedActive.endsWith('helm.scr')
    }

    const activeMatch = stdout.match(/ScreenSaveActive\s+REG_SZ\s+([01])/i)
    if (activeMatch && activeMatch[1]) {
      screenSaveActive = activeMatch[1].trim() === '1'
    }

    const timeoutMatch = stdout.match(/ScreenSaveTimeOut\s+REG_SZ\s+(\d+)/i)
    if (timeoutMatch && timeoutMatch[1]) {
      timeoutSeconds = parseInt(timeoutMatch[1].trim(), 10) || 600
    }
  } catch (err) {
    logger.warn('SettingsStore', 'Failed to query screensaver registry values:', err)
  }

  return {
    isRegistered,
    scrPath,
    activeScreensaverPath,
    timeoutSeconds,
    screenSaveActive
  }
}

export function setWindowsScreensaverActive(active: boolean): boolean {
  const scrPath = getScrExecutablePath()
  try {
    if (active) {
      if (!fs.existsSync(scrPath)) {
        logger.warn('SettingsStore', `Screensaver file not found on disk at: ${scrPath}`)
      }
      execSync(`reg add "HKCU\\Control Panel\\Desktop" /v SCRNSAVE.EXE /t REG_SZ /d "${scrPath}" /f`, {
        stdio: 'ignore',
        timeout: 3000
      })
      execSync(`reg add "HKCU\\Control Panel\\Desktop" /v ScreenSaveActive /t REG_SZ /d "1" /f`, {
        stdio: 'ignore',
        timeout: 3000
      })
      logger.info('SettingsStore', `Registered BEACON as active Windows screensaver: ${scrPath}`)
    } else {
      execSync('reg delete "HKCU\\Control Panel\\Desktop" /v SCRNSAVE.EXE /f', {
        stdio: 'ignore',
        timeout: 3000
      })
      logger.info('SettingsStore', 'Unregistered BEACON as Windows screensaver')
    }
    return true
  } catch (err) {
    logger.error('SettingsStore', 'Failed to update screensaver registry settings:', err)
    return false
  }
}

export function openWindowsScreensaverDialog(): void {
  try {
    const scrPath = getScrExecutablePath()
    if (fs.existsSync(scrPath)) {
      spawn('rundll32.exe', ['desk.cpl,InstallScreenSaver', scrPath], {
        detached: true,
        stdio: 'ignore'
      }).unref()
    } else {
      spawn('control', ['desk.cpl,,@screensaver'], {
        detached: true,
        stdio: 'ignore'
      }).unref()
    }
  } catch (err) {
    logger.warn('SettingsStore', 'Failed to open Windows Screen Saver dialog:', err)
  }
}

export type BeaconSettings = HelmSettings
