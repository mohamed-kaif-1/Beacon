export type NavigationRoute = 'home' | 'ambient' | 'notes' | 'tasks' | 'settings'

export type ThemeOption = 'system' | 'light' | 'dark'

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

// Phase 5.3 Diagnostics Types
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
  theme: ThemeOption
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
  | 'cosmic-space'
  | 'aurora'
  | 'starry-night'
  | 'campfire'
  | 'moonlit'
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

// Phase 4 Types
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

export interface SystemStatus {
  desktopCore: 'running' | 'stopped'
  systemTray: 'active' | 'inactive'
  browserExtension: 'not-connected' | 'connected'
  ambientBoard: 'planned' | 'live'
  notesTasks: 'planned' | 'live'
}

