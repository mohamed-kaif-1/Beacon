/**
 * IPC channel names and type definitions for Helm Windows
 */

export const IPC_CHANNELS = {
  APP_GET_VERSION: 'app:get-version',
  APP_GET_PLATFORM: 'app:get-platform',
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_SET_FULLSCREEN: 'window:set-fullscreen',
  WINDOW_IS_FULLSCREEN: 'window:is-fullscreen',
  WINDOW_FULLSCREEN_CHANGE: 'window:fullscreen-change',
  SHELL_OPEN_EXTERNAL: 'shell:open-external',
  THEME_GET: 'theme:get',
  THEME_SET: 'theme:set',
  NAVIGATE: 'app:navigate',
  NAVIGATE_ACTION: 'app:navigate-action',
  WATCHES_GET: 'watches:get',
  WATCHES_UPDATE: 'watches:update',
  BROWSER_STATUS_GET: 'browser:status-get',
  BROWSER_STATUS_UPDATE: 'browser:status-update',
  BROWSER_RECONNECT: 'browser:reconnect',
  AMBIENT_GET_SETTINGS: 'ambient:get-settings',
  AMBIENT_SET_SETTINGS: 'ambient:set-settings',
  AMBIENT_SELECT_WALLPAPER_DIR: 'ambient:select-wallpaper-dir',
  AMBIENT_GET_WALLPAPERS: 'ambient:get-wallpapers',
  WEATHER_GET: 'weather:get',
  ONBOARDING_GET: 'onboarding:get',
  ONBOARDING_SET: 'onboarding:set',
  SETTINGS_GET: 'settings:get',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_RESET: 'settings:reset',
  SETTINGS_CHANGED: 'settings:changed',
  NOTES_GET_ALL: 'notes:get-all',
  NOTES_GET_BY_ID: 'notes:get-by-id',
  NOTES_CREATE: 'notes:create',
  NOTES_UPDATE: 'notes:update',
  NOTES_DELETE: 'notes:delete',
  NOTES_TOGGLE_PIN: 'notes:toggle-pin',
  TASKS_GET_ALL: 'tasks:get-all',
  TASKS_GET_BY_ID: 'tasks:get-by-id',
  TASKS_CREATE: 'tasks:create',
  TASKS_UPDATE: 'tasks:update',
  TASKS_DELETE: 'tasks:delete',
  TASKS_TOGGLE_COMPLETE: 'tasks:toggle-complete',
  TASKS_CHANGED: 'tasks:changed',
  PRODUCTIVITY_SUMMARY_GET: 'productivity:summary-get',
  DIAGNOSTICS_GET_HEALTH: 'diagnostics:get-health',
  DIAGNOSTICS_GET_LOGS: 'diagnostics:get-logs',
  DIAGNOSTICS_EXPORT: 'diagnostics:export',
  DIAGNOSTICS_CLEAR_LOGS: 'diagnostics:clear-logs',
  DIAGNOSTICS_OPEN_LOGS_DIR: 'diagnostics:open-logs-dir',
  SCREENSAVER_IS_ACTIVE: 'screensaver:is-active',
  SCREENSAVER_EXIT: 'screensaver:exit',
  SCREENSAVER_GET_STATUS: 'screensaver:get-status',
  SCREENSAVER_SET_ACTIVE: 'screensaver:set-active',
  SCREENSAVER_OPEN_SETTINGS: 'screensaver:open-settings',
  SCREENSAVER_START_PREVIEW: 'screensaver:start-preview',
  SCREENSAVER_STATE_CHANGE: 'screensaver:state-change',
  SCREENSAVER_READY: 'screensaver:ready'
} as const

export type ThemeMode = 'system' | 'light' | 'dark'

export type WatchState = 'attention' | 'pending' | 'watching' | 'done'

export interface BoardWatch {
  name: string
  text: string
  quoted: boolean
  state: WatchState
  since: number
  checked: number
  kind: string
  step: number
  steps: number
  url?: string
  due?: number
  dueHasTime: boolean
  finished?: number
}

export interface WatcherNotifyPayload {
  type: 'watcher:notify'
  id?: string
  title: string
  message: string
  url?: string
  kind?: string
}

export interface WatcherBoardPayload {
  type: 'watcher:board'
  source: string
  watches: BoardWatch[]
}

export interface WatcherHandshakePayload {
  type: 'watcher:handshake' | 'watcher:ping'
  source?: string
  browser?: DetectedBrowserType
}

export interface WatcherDisconnectPayload {
  type: 'watcher:disconnect'
  source?: string
  browser?: DetectedBrowserType
}

export type NativeHostMessage =
  | WatcherNotifyPayload
  | WatcherBoardPayload
  | WatcherHandshakePayload
  | WatcherDisconnectPayload

export type ExtensionConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error'

export type DetectedBrowserType = 'chrome' | 'edge' | 'brave' | 'chromium' | 'unknown'

export interface ConnectionRetryStatus {
  inProgress: boolean
  cooldownUntil?: number
  lastAttemptTime?: number
}

export interface BrowserIntegrationStatus {
  state: ExtensionConnectionState
  connected: boolean
  lastSyncTime?: number
  lastConnectedTime?: number
  lastDisconnectedTime?: number
  errorReason?: string
  browserType?: DetectedBrowserType
  retryStatus?: ConnectionRetryStatus
  activeWatchCount: number
  attentionCount: number
  manifestInstalled: boolean
  pipeAvailable: boolean
}

// ----------------------------------------------------
// Phase 5.3: Error Handling & Diagnostics Types
// ----------------------------------------------------

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: number
  level: LogLevel
  component: string
  message: string
}

export interface DatabaseHealth {
  status: 'healthy' | 'corrupted' | 'uninitialized'
  version: number
  sizeBytes: number
  noteCount: number
  taskCount: number
}

export interface SettingsHealth {
  status: 'healthy' | 'corrupted' | 'missing'
  sizeBytes: number
}

export interface SystemHealthSummary {
  appVersion: string
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
  platform: string
  arch: string
  memoryUsageMb: number
  databaseHealth: DatabaseHealth
  settingsHealth: SettingsHealth
  extensionHealth: {
    state: string
    browserType?: string
    manifestInstalled: boolean
    pipeAvailable: boolean
    lastSyncTime?: number
    errorReason?: string
  }
}

export interface DiagnosticBundle {
  generatedAt: string
  systemHealth: SystemHealthSummary
  recentLogs: LogEntry[]
}

export interface GeneralSettings {
  launchAtStartup: boolean
  startMinimized: boolean
  minimizeToTray: boolean
  closeBehavior: 'tray' | 'quit'
}

export interface AppearanceSettings {
  theme: ThemeMode
  reducedMotion: boolean
}

export interface NotificationSettings {
  enabled: boolean
  sound: boolean
}

export interface ScreensaverSettings {
  enabled: boolean
  showClock: boolean
  showDate: boolean
  showWeather: boolean
  showQuote: boolean
  showTasks: boolean
  showWatches: boolean
  exitOnMouseMove: boolean
}

export interface ScreensaverStatus {
  isRegistered: boolean
  scrPath: string
  activeScreensaverPath: string
  timeoutSeconds: number
  screenSaveActive: boolean
}

export interface HelmSettings {
  version: number
  general: GeneralSettings
  appearance: AppearanceSettings
  notifications: NotificationSettings
  ambient: AmbientSettings
  screensaver: ScreensaverSettings
  onboardingCompleted: boolean
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface AmbientSettings {
  slideshowInterval: number
  transitionDuration: number
  kenBurnsEnabled: boolean
  wallpaperSource: 'built-in' | 'custom-folder'
  customWallpaperFolder: string
  selectedWallpaperIndex: number
  showClock: boolean
  showDate: boolean
  use24Hour: boolean
  showWeather: boolean
  weatherLocation: string
  temperatureUnit: 'C' | 'F'
  showWatches: boolean
  showTasks: boolean
  showQuote: boolean
  frostedGlassBlur: number
  backgroundDim: number
}

export interface WeatherData {
  location: string
  temperatureCelsius: number
  temperatureFahrenheit: number
  condition: string
  conditionCode: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog' | 'wind'
  humidity?: number
  windSpeedKmh?: number
  updatedAt: number
  isStale?: boolean
  attribution?: string
}

export type WallpaperCategory =
  | 'cinematic-nature'
  | 'dark-moody'
  | 'japanese-zen'
  | 'cosmic-space'
  | 'cozy-atmospheric'
  | 'abstract-minimal'
  | 'custom'

export interface WallpaperItem {
  id: string
  name: string
  type: 'built-in' | 'file'
  url: string
  thumbnailUrl?: string
  category?: WallpaperCategory
  subtitle?: string
  author?: string
}

// ----------------------------------------------------
// Phase 4: Notes & Tasks System Types
// ----------------------------------------------------

export interface NoteItem {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  isPinned: boolean
}

export interface CreateNoteInput {
  title: string
  content?: string
  isPinned?: boolean
}

export interface UpdateNoteInput {
  id: string
  title?: string
  content?: string
  isPinned?: boolean
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface TaskItem {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: number
  createdAt: number
  updatedAt: number
  completedAt?: number
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: number
}

export interface UpdateTaskInput {
  id: string
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: number | null
  completedAt?: number | null
}

export interface TaskFilterOptions {
  status?: TaskStatus | 'all'
  priority?: TaskPriority | 'all'
  view?: 'all' | 'today' | 'upcoming' | 'completed'
  search?: string
}

export interface ProductivitySummary {
  totalNotes: number
  recentNotes: NoteItem[]
  pendingTasks: number
  inProgressTasks: number
  completedTasks: number
  tasksDueToday: number
  overdueTasks: number
  upcomingTasks: TaskItem[]
  todayTasks: TaskItem[]
}

export type BeaconSettings = HelmSettings

export interface HelmAPI {
  getAppVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  setFullscreen: (fullscreen: boolean) => Promise<void>
  isFullscreen: () => Promise<boolean>
  onFullscreenChange: (callback: (fullscreen: boolean) => void) => () => void
  openExternal: (url: string) => Promise<void>
  getTheme: () => Promise<ThemeMode>
  setTheme: (theme: ThemeMode) => Promise<void>
  onNavigate: (callback: (route: string) => void) => () => void
  onNavigateAction: (callback: (action: string) => void) => () => void
  getWatches: () => Promise<BoardWatch[]>
  onWatchesUpdate: (callback: (watches: BoardWatch[]) => void) => () => void
  getBrowserStatus: () => Promise<BrowserIntegrationStatus>
  onBrowserStatusUpdate: (callback: (status: BrowserIntegrationStatus) => void) => () => void
  retryBrowserConnection: () => Promise<BrowserIntegrationStatus>
  getAmbientSettings: () => Promise<AmbientSettings>
  setAmbientSettings: (settings: Partial<AmbientSettings>) => Promise<AmbientSettings>
  selectWallpaperDirectory: () => Promise<{ canceled: boolean; folderPath?: string; wallpapers?: WallpaperItem[] }>
  getWallpapers: () => Promise<WallpaperItem[]>
  getWeather: (location?: string) => Promise<WeatherData | null>
  // Onboarding
  isOnboardingCompleted: () => Promise<boolean>
  setOnboardingCompleted: (completed: boolean) => Promise<void>
  // Settings
  getSettings: () => Promise<HelmSettings>
  updateSettings: (partial: DeepPartial<HelmSettings>) => Promise<HelmSettings>
  resetSettings: (options?: { resetOnboarding?: boolean }) => Promise<HelmSettings>
  onSettingsChange: (callback: (settings: HelmSettings) => void) => () => void
  // Notes
  getNotes: (query?: string) => Promise<NoteItem[]>
  getNoteById: (id: string) => Promise<NoteItem | null>
  createNote: (input: CreateNoteInput) => Promise<NoteItem>
  updateNote: (input: UpdateNoteInput) => Promise<NoteItem>
  deleteNote: (id: string) => Promise<boolean>
  togglePinNote: (id: string) => Promise<NoteItem>
  // Tasks
  getTasks: (filter?: TaskFilterOptions) => Promise<TaskItem[]>
  getTaskById: (id: string) => Promise<TaskItem | null>
  createTask: (input: CreateTaskInput) => Promise<TaskItem>
  updateTask: (input: UpdateTaskInput) => Promise<TaskItem>
  deleteTask: (id: string) => Promise<boolean>
  toggleCompleteTask: (id: string) => Promise<TaskItem>
  onTasksChange?: (callback: () => void) => () => void
  getProductivitySummary: () => Promise<ProductivitySummary>
  // Diagnostics & System Health
  getSystemHealth: () => Promise<SystemHealthSummary>
  getRecentLogs: (limit?: number) => Promise<LogEntry[]>
  exportDiagnostics: () => Promise<{ success: boolean; filePath?: string; error?: string }>
  clearLogs: () => Promise<boolean>
  openLogsDirectory: () => Promise<void>
  // Screensaver (Phase 6)
  isScreensaverMode: () => Promise<boolean>
  exitScreensaver: () => Promise<void>
  getScreensaverStatus: () => Promise<ScreensaverStatus>
  setScreensaverActive: (active: boolean) => Promise<boolean>
  openWindowsScreensaverSettings: () => Promise<void>
  previewScreensaver: () => Promise<void>
  onScreensaverChange: (callback: (active: boolean) => void) => () => void
  notifyScreensaverReady?: () => Promise<void>
}

export type BeaconAPI = HelmAPI

declare global {
  interface Window {
    helm: HelmAPI
    beacon: BeaconAPI
  }
}
