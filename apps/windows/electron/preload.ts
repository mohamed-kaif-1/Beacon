import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import {
  IPC_CHANNELS,
  HelmAPI,
  ThemeMode,
  BoardWatch,
  BrowserIntegrationStatus,
  AmbientSettings,
  WeatherData,
  WallpaperItem,
  NoteItem,
  CreateNoteInput,
  UpdateNoteInput,
  TaskItem,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterOptions,
  ProductivitySummary,
  SystemHealthSummary,
  LogEntry,
  HelmSettings,
  DeepPartial,
  ScreensaverStatus
} from './types'

const api: HelmAPI = {
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION)
  },

  getPlatform: (): Promise<string> => {
    return ipcRenderer.invoke(IPC_CHANNELS.APP_GET_PLATFORM)
  },

  minimizeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE)
  },

  closeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE)
  },

  setFullscreen: (fullscreen: boolean): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_SET_FULLSCREEN, fullscreen)
  },

  isFullscreen: (): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_FULLSCREEN)
  },

  onFullscreenChange: (callback: (fullscreen: boolean) => void): (() => void) => {
    const subscription = (_event: IpcRendererEvent, fullscreen: boolean): void => {
      callback(fullscreen)
    }
    ipcRenderer.on(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, subscription)
    }
  },

  openExternal: (url: string): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SHELL_OPEN_EXTERNAL, url)
  },

  getTheme: (): Promise<ThemeMode> => {
    return ipcRenderer.invoke(IPC_CHANNELS.THEME_GET)
  },

  setTheme: (theme: ThemeMode): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.THEME_SET, theme)
  },

  onNavigate: (callback: (route: string) => void): (() => void) => {
    const subscription = (_event: IpcRendererEvent, route: string): void => {
      callback(route)
    }
    ipcRenderer.on(IPC_CHANNELS.NAVIGATE, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.NAVIGATE, subscription)
    }
  },

  onNavigateAction: (callback: (action: string) => void): (() => void) => {
    const subscription = (_event: IpcRendererEvent, action: string): void => {
      callback(action)
    }
    ipcRenderer.on(IPC_CHANNELS.NAVIGATE_ACTION, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.NAVIGATE_ACTION, subscription)
    }
  },

  getWatches: (): Promise<BoardWatch[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WATCHES_GET)
  },

  onWatchesUpdate: (callback: (watches: BoardWatch[]) => void): (() => void) => {
    const subscription = (_event: IpcRendererEvent, watches: BoardWatch[]): void => {
      callback(watches)
    }
    ipcRenderer.on(IPC_CHANNELS.WATCHES_UPDATE, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.WATCHES_UPDATE, subscription)
    }
  },

  getBrowserStatus: (): Promise<BrowserIntegrationStatus> => {
    return ipcRenderer.invoke(IPC_CHANNELS.BROWSER_STATUS_GET)
  },

  onBrowserStatusUpdate: (callback: (status: BrowserIntegrationStatus) => void): (() => void) => {
    const subscription = (_event: IpcRendererEvent, status: BrowserIntegrationStatus): void => {
      callback(status)
    }
    ipcRenderer.on(IPC_CHANNELS.BROWSER_STATUS_UPDATE, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.BROWSER_STATUS_UPDATE, subscription)
    }
  },

  retryBrowserConnection: (): Promise<BrowserIntegrationStatus> => {
    return ipcRenderer.invoke(IPC_CHANNELS.BROWSER_RECONNECT)
  },

  getAmbientSettings: (): Promise<AmbientSettings> => {
    return ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_GET_SETTINGS)
  },

  setAmbientSettings: (settings: Partial<AmbientSettings>): Promise<AmbientSettings> => {
    return ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_SET_SETTINGS, settings)
  },

  selectWallpaperDirectory: (): Promise<{ canceled: boolean; folderPath?: string; wallpapers?: WallpaperItem[] }> => {
    return ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_SELECT_WALLPAPER_DIR)
  },

  getWallpapers: (): Promise<WallpaperItem[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_GET_WALLPAPERS)
  },

  getWeather: (location?: string): Promise<WeatherData | null> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WEATHER_GET, location)
  },

  // Onboarding
  isOnboardingCompleted: (): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.ONBOARDING_GET)
  },

  setOnboardingCompleted: (completed: boolean): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.ONBOARDING_SET, completed)
  },

  // Centralized Application Settings (Phase 5.4)
  getSettings: (): Promise<HelmSettings> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET)
  },

  updateSettings: (partial: DeepPartial<HelmSettings>): Promise<HelmSettings> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_UPDATE, partial)
  },

  resetSettings: (options?: { resetOnboarding?: boolean }): Promise<HelmSettings> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_RESET, options)
  },

  onSettingsChange: (callback: (settings: HelmSettings) => void): (() => void) => {
    const subscription = (_event: IpcRendererEvent, settings: HelmSettings): void => {
      callback(settings)
    }
    ipcRenderer.on(IPC_CHANNELS.SETTINGS_CHANGED, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.SETTINGS_CHANGED, subscription)
    }
  },

  // Notes
  getNotes: (query?: string): Promise<NoteItem[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET_ALL, query)
  },

  getNoteById: (id: string): Promise<NoteItem | null> => {
    return ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET_BY_ID, id)
  },

  createNote: (input: CreateNoteInput): Promise<NoteItem> => {
    return ipcRenderer.invoke(IPC_CHANNELS.NOTES_CREATE, input)
  },

  updateNote: (input: UpdateNoteInput): Promise<NoteItem> => {
    return ipcRenderer.invoke(IPC_CHANNELS.NOTES_UPDATE, input)
  },

  deleteNote: (id: string): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.NOTES_DELETE, id)
  },

  togglePinNote: (id: string): Promise<NoteItem> => {
    return ipcRenderer.invoke(IPC_CHANNELS.NOTES_TOGGLE_PIN, id)
  },

  // Tasks
  getTasks: (filter?: TaskFilterOptions): Promise<TaskItem[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.TASKS_GET_ALL, filter)
  },

  getTaskById: (id: string): Promise<TaskItem | null> => {
    return ipcRenderer.invoke(IPC_CHANNELS.TASKS_GET_BY_ID, id)
  },

  createTask: (input: CreateTaskInput): Promise<TaskItem> => {
    return ipcRenderer.invoke(IPC_CHANNELS.TASKS_CREATE, input)
  },

  updateTask: (input: UpdateTaskInput): Promise<TaskItem> => {
    return ipcRenderer.invoke(IPC_CHANNELS.TASKS_UPDATE, input)
  },

  deleteTask: (id: string): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.TASKS_DELETE, id)
  },

  toggleCompleteTask: (id: string): Promise<TaskItem> => {
    return ipcRenderer.invoke(IPC_CHANNELS.TASKS_TOGGLE_COMPLETE, id)
  },

  onTasksChange: (callback: () => void): (() => void) => {
    const subscription = (): void => {
      callback()
    }
    ipcRenderer.on(IPC_CHANNELS.TASKS_CHANGED, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASKS_CHANGED, subscription)
    }
  },

  getProductivitySummary: (): Promise<ProductivitySummary> => {
    return ipcRenderer.invoke(IPC_CHANNELS.PRODUCTIVITY_SUMMARY_GET)
  },

  // Diagnostics & System Health
  getSystemHealth: (): Promise<SystemHealthSummary> => {
    return ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_GET_HEALTH)
  },

  getRecentLogs: (limit?: number): Promise<LogEntry[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_GET_LOGS, limit)
  },

  exportDiagnostics: (): Promise<{ success: boolean; filePath?: string; error?: string }> => {
    return ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_EXPORT)
  },

  clearLogs: (): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_CLEAR_LOGS)
  },

  openLogsDirectory: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_OPEN_LOGS_DIR)
  },

  // Screensaver (Phase 6)
  isScreensaverMode: (): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_IS_ACTIVE)
  },

  exitScreensaver: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_EXIT)
  },

  getScreensaverStatus: (): Promise<ScreensaverStatus> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_GET_STATUS)
  },

  setScreensaverActive: (active: boolean): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_SET_ACTIVE, active)
  },

  openWindowsScreensaverSettings: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_OPEN_SETTINGS)
  },

  previewScreensaver: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_START_PREVIEW)
  },

  onScreensaverChange: (callback: (active: boolean) => void): (() => void) => {
    const subscription = (_event: IpcRendererEvent, active: boolean): void => {
      callback(active)
    }
    ipcRenderer.on(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, subscription)
    }
  },

  notifyScreensaverReady: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_READY)
  }
}

// Expose controlled, secure BEACON API (and backward-compatible 'helm' alias) to renderer process
contextBridge.exposeInMainWorld('beacon', api)
contextBridge.exposeInMainWorld('helm', api)
