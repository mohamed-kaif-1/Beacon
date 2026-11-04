"use strict";
const electron = require("electron");
const IPC_CHANNELS = {
  APP_GET_VERSION: "app:get-version",
  APP_GET_PLATFORM: "app:get-platform",
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_CLOSE: "window:close",
  WINDOW_SET_FULLSCREEN: "window:set-fullscreen",
  WINDOW_IS_FULLSCREEN: "window:is-fullscreen",
  WINDOW_FULLSCREEN_CHANGE: "window:fullscreen-change",
  SHELL_OPEN_EXTERNAL: "shell:open-external",
  THEME_GET: "theme:get",
  THEME_SET: "theme:set",
  NAVIGATE: "app:navigate",
  NAVIGATE_ACTION: "app:navigate-action",
  WATCHES_GET: "watches:get",
  WATCHES_UPDATE: "watches:update",
  BROWSER_STATUS_GET: "browser:status-get",
  BROWSER_STATUS_UPDATE: "browser:status-update",
  BROWSER_RECONNECT: "browser:reconnect",
  AMBIENT_GET_SETTINGS: "ambient:get-settings",
  AMBIENT_SET_SETTINGS: "ambient:set-settings",
  AMBIENT_SELECT_WALLPAPER_DIR: "ambient:select-wallpaper-dir",
  AMBIENT_GET_WALLPAPERS: "ambient:get-wallpapers",
  WEATHER_GET: "weather:get",
  ONBOARDING_GET: "onboarding:get",
  ONBOARDING_SET: "onboarding:set",
  SETTINGS_GET: "settings:get",
  SETTINGS_UPDATE: "settings:update",
  SETTINGS_RESET: "settings:reset",
  SETTINGS_CHANGED: "settings:changed",
  NOTES_GET_ALL: "notes:get-all",
  NOTES_GET_BY_ID: "notes:get-by-id",
  NOTES_CREATE: "notes:create",
  NOTES_UPDATE: "notes:update",
  NOTES_DELETE: "notes:delete",
  NOTES_TOGGLE_PIN: "notes:toggle-pin",
  TASKS_GET_ALL: "tasks:get-all",
  TASKS_GET_BY_ID: "tasks:get-by-id",
  TASKS_CREATE: "tasks:create",
  TASKS_UPDATE: "tasks:update",
  TASKS_DELETE: "tasks:delete",
  TASKS_TOGGLE_COMPLETE: "tasks:toggle-complete",
  TASKS_CHANGED: "tasks:changed",
  PRODUCTIVITY_SUMMARY_GET: "productivity:summary-get",
  DIAGNOSTICS_GET_HEALTH: "diagnostics:get-health",
  DIAGNOSTICS_GET_LOGS: "diagnostics:get-logs",
  DIAGNOSTICS_EXPORT: "diagnostics:export",
  DIAGNOSTICS_CLEAR_LOGS: "diagnostics:clear-logs",
  DIAGNOSTICS_OPEN_LOGS_DIR: "diagnostics:open-logs-dir",
  SCREENSAVER_IS_ACTIVE: "screensaver:is-active",
  SCREENSAVER_EXIT: "screensaver:exit",
  SCREENSAVER_GET_STATUS: "screensaver:get-status",
  SCREENSAVER_SET_ACTIVE: "screensaver:set-active",
  SCREENSAVER_OPEN_SETTINGS: "screensaver:open-settings",
  SCREENSAVER_START_PREVIEW: "screensaver:start-preview",
  SCREENSAVER_STATE_CHANGE: "screensaver:state-change",
  SCREENSAVER_READY: "screensaver:ready"
};
const api = {
  getAppVersion: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION);
  },
  getPlatform: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.APP_GET_PLATFORM);
  },
  minimizeWindow: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE);
  },
  closeWindow: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE);
  },
  setFullscreen: (fullscreen) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_SET_FULLSCREEN, fullscreen);
  },
  isFullscreen: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_FULLSCREEN);
  },
  onFullscreenChange: (callback) => {
    const subscription = (_event, fullscreen) => {
      callback(fullscreen);
    };
    electron.ipcRenderer.on(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, subscription);
    };
  },
  openExternal: (url) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SHELL_OPEN_EXTERNAL, url);
  },
  getTheme: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.THEME_GET);
  },
  setTheme: (theme) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.THEME_SET, theme);
  },
  onNavigate: (callback) => {
    const subscription = (_event, route) => {
      callback(route);
    };
    electron.ipcRenderer.on(IPC_CHANNELS.NAVIGATE, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.NAVIGATE, subscription);
    };
  },
  onNavigateAction: (callback) => {
    const subscription = (_event, action) => {
      callback(action);
    };
    electron.ipcRenderer.on(IPC_CHANNELS.NAVIGATE_ACTION, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.NAVIGATE_ACTION, subscription);
    };
  },
  getWatches: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.WATCHES_GET);
  },
  onWatchesUpdate: (callback) => {
    const subscription = (_event, watches) => {
      callback(watches);
    };
    electron.ipcRenderer.on(IPC_CHANNELS.WATCHES_UPDATE, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.WATCHES_UPDATE, subscription);
    };
  },
  getBrowserStatus: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.BROWSER_STATUS_GET);
  },
  onBrowserStatusUpdate: (callback) => {
    const subscription = (_event, status) => {
      callback(status);
    };
    electron.ipcRenderer.on(IPC_CHANNELS.BROWSER_STATUS_UPDATE, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.BROWSER_STATUS_UPDATE, subscription);
    };
  },
  retryBrowserConnection: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.BROWSER_RECONNECT);
  },
  getAmbientSettings: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_GET_SETTINGS);
  },
  setAmbientSettings: (settings) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_SET_SETTINGS, settings);
  },
  selectWallpaperDirectory: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_SELECT_WALLPAPER_DIR);
  },
  getWallpapers: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.AMBIENT_GET_WALLPAPERS);
  },
  getWeather: (location) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.WEATHER_GET, location);
  },
  // Onboarding
  isOnboardingCompleted: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.ONBOARDING_GET);
  },
  setOnboardingCompleted: (completed) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.ONBOARDING_SET, completed);
  },
  // Centralized Application Settings (Phase 5.4)
  getSettings: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET);
  },
  updateSettings: (partial) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_UPDATE, partial);
  },
  resetSettings: (options) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_RESET, options);
  },
  onSettingsChange: (callback) => {
    const subscription = (_event, settings) => {
      callback(settings);
    };
    electron.ipcRenderer.on(IPC_CHANNELS.SETTINGS_CHANGED, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.SETTINGS_CHANGED, subscription);
    };
  },
  // Notes
  getNotes: (query) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET_ALL, query);
  },
  getNoteById: (id) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET_BY_ID, id);
  },
  createNote: (input) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.NOTES_CREATE, input);
  },
  updateNote: (input) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.NOTES_UPDATE, input);
  },
  deleteNote: (id) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.NOTES_DELETE, id);
  },
  togglePinNote: (id) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.NOTES_TOGGLE_PIN, id);
  },
  // Tasks
  getTasks: (filter) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.TASKS_GET_ALL, filter);
  },
  getTaskById: (id) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.TASKS_GET_BY_ID, id);
  },
  createTask: (input) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.TASKS_CREATE, input);
  },
  updateTask: (input) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.TASKS_UPDATE, input);
  },
  deleteTask: (id) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.TASKS_DELETE, id);
  },
  toggleCompleteTask: (id) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.TASKS_TOGGLE_COMPLETE, id);
  },
  onTasksChange: (callback) => {
    const subscription = () => {
      callback();
    };
    electron.ipcRenderer.on(IPC_CHANNELS.TASKS_CHANGED, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.TASKS_CHANGED, subscription);
    };
  },
  getProductivitySummary: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.PRODUCTIVITY_SUMMARY_GET);
  },
  // Diagnostics & System Health
  getSystemHealth: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_GET_HEALTH);
  },
  getRecentLogs: (limit) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_GET_LOGS, limit);
  },
  exportDiagnostics: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_EXPORT);
  },
  clearLogs: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_CLEAR_LOGS);
  },
  openLogsDirectory: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.DIAGNOSTICS_OPEN_LOGS_DIR);
  },
  // Screensaver (Phase 6)
  isScreensaverMode: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_IS_ACTIVE);
  },
  exitScreensaver: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_EXIT);
  },
  getScreensaverStatus: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_GET_STATUS);
  },
  setScreensaverActive: (active) => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_SET_ACTIVE, active);
  },
  openWindowsScreensaverSettings: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_OPEN_SETTINGS);
  },
  previewScreensaver: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_START_PREVIEW);
  },
  onScreensaverChange: (callback) => {
    const subscription = (_event, active) => {
      callback(active);
    };
    electron.ipcRenderer.on(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, subscription);
    return () => {
      electron.ipcRenderer.removeListener(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, subscription);
    };
  },
  notifyScreensaverReady: () => {
    return electron.ipcRenderer.invoke(IPC_CHANNELS.SCREENSAVER_READY);
  }
};
electron.contextBridge.exposeInMainWorld("beacon", api);
electron.contextBridge.exposeInMainWorld("helm", api);
