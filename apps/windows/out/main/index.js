"use strict";
const electron = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const watchesStore = require("./chunks/watches-store-BWldNrop.js");
const net = require("net");
const child_process = require("child_process");
const os = require("os");
const crypto = require("crypto");
const initSqlJs = require("sql.js");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const net__namespace = /* @__PURE__ */ _interopNamespaceDefault(net);
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
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
const MAX_LOG_SIZE_BYTES = 1048576;
const MAX_BACKUP_FILES = 3;
const MAX_RING_BUFFER_ENTRIES = 100;
const LOG_LEVEL_SEVERITY = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
function redactSensitiveText(input) {
  if (input === null || input === void 0) return "";
  let text = typeof input === "string" ? input : String(input);
  text = text.replace(/([a-zA-Z]:\\Users\\)[^\s\\/"':]+(\\.*)?/gi, "$1<redacted>$2");
  text = text.replace(/(\/(?:home|Users)\/)[^\s\/"':]+(\/.*)?/gi, "$1<redacted>$2");
  text = text.replace(/(bearer\s+)[a-zA-Z0-9_\-\.]{6,}/gi, "$1<redacted>");
  text = text.replace(/(authorization[=:]\s*(?!bearer))['"]?[^\s'"&,]+/gi, "$1<redacted>");
  text = text.replace(/((?:api[_-]?key|access[_-]?token|auth[_-]?token|token|secret|password|passwd)[=:]\s*['"]?)[^\s'"&,]+/gi, "$1<redacted>");
  text = text.replace(/([?&](?:token|key|secret|auth|apikey|access_token)=)[^&\s]+/gi, "$1<redacted>");
  return text;
}
class LoggerService {
  minLevel = "info";
  logDir;
  activeLogPath;
  ringBuffer = [];
  constructor(customDir) {
    this.logDir = customDir || path.join(watchesStore.getBeaconDataDirectory(), "logs");
    this.activeLogPath = path.join(this.logDir, "beacon.log");
  }
  setLevel(level) {
    this.minLevel = level;
  }
  getLevel() {
    return this.minLevel;
  }
  getLogsDirectory() {
    return this.logDir;
  }
  getActiveLogPath() {
    return this.activeLogPath;
  }
  ensureDirectory() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch {
    }
  }
  /**
   * Log rotation: rotates helm.log -> helm.1.log -> helm.2.log when file exceeds 1 MB
   */
  checkAndRotate() {
    try {
      if (!fs.existsSync(this.activeLogPath)) return;
      const stats = fs.statSync(this.activeLogPath);
      if (stats.size < MAX_LOG_SIZE_BYTES) return;
      for (let i = MAX_BACKUP_FILES - 1; i >= 1; i--) {
        const older = path.join(this.logDir, `beacon.${i}.log`);
        const newer = path.join(this.logDir, `beacon.${i + 1}.log`);
        if (fs.existsSync(older)) {
          try {
            if (fs.existsSync(newer)) fs.unlinkSync(newer);
            fs.renameSync(older, newer);
          } catch {
          }
        }
      }
      const firstBackup = path.join(this.logDir, "beacon.1.log");
      if (fs.existsSync(firstBackup)) {
        try {
          fs.unlinkSync(firstBackup);
        } catch {
        }
      }
      fs.renameSync(this.activeLogPath, firstBackup);
    } catch {
    }
  }
  log(level, component, message, ...args) {
    if (LOG_LEVEL_SEVERITY[level] < LOG_LEVEL_SEVERITY[this.minLevel]) {
      return;
    }
    const timestamp = Date.now();
    const isoTime = new Date(timestamp).toISOString();
    let fullMsg = redactSensitiveText(message);
    if (args && args.length > 0) {
      const formattedArgs = args.map((a) => {
        if (a instanceof Error) {
          return redactSensitiveText(a.message || a.toString());
        }
        if (typeof a === "object") {
          try {
            return redactSensitiveText(JSON.stringify(a));
          } catch {
            return "[Object]";
          }
        }
        return redactSensitiveText(String(a));
      });
      fullMsg += " " + formattedArgs.join(" ");
    }
    const entry = {
      timestamp,
      level,
      component,
      message: fullMsg
    };
    this.ringBuffer.push(entry);
    if (this.ringBuffer.length > MAX_RING_BUFFER_ENTRIES) {
      this.ringBuffer.shift();
    }
    const formattedLine = `[${isoTime}] [${level.toUpperCase()}] [${component}] ${fullMsg}`;
    if (level === "error") {
      console.error(formattedLine);
    } else if (level === "warn") {
      console.warn(formattedLine);
    } else {
      console.log(formattedLine);
    }
    try {
      this.ensureDirectory();
      this.checkAndRotate();
      fs.appendFileSync(this.activeLogPath, formattedLine + "\n", "utf-8");
    } catch {
    }
  }
  debug(component, message, ...args) {
    this.log("debug", component, message, ...args);
  }
  info(component, message, ...args) {
    this.log("info", component, message, ...args);
  }
  warn(component, message, ...args) {
    this.log("warn", component, message, ...args);
  }
  error(component, message, ...args) {
    this.log("error", component, message, ...args);
  }
  getRecentLogs(limit = 50) {
    const lim = Math.max(1, Math.min(MAX_RING_BUFFER_ENTRIES, limit));
    return this.ringBuffer.slice(-lim);
  }
  clearLogs() {
    this.ringBuffer = [];
    try {
      if (fs.existsSync(this.logDir)) {
        const files = fs.readdirSync(this.logDir);
        for (const file of files) {
          if ((file.startsWith("beacon") || file.startsWith("helm")) && file.endsWith(".log")) {
            try {
              fs.unlinkSync(path.join(this.logDir, file));
            } catch {
            }
          }
        }
      }
      return true;
    } catch {
      return false;
    }
  }
  async openLogsFolder() {
    this.ensureDirectory();
    try {
      await electron.shell.openPath(this.logDir);
    } catch (err) {
      this.error("Logger", "Failed to open logs folder in explorer", err);
    }
  }
  exportDiagnosticsBundle(healthSummary) {
    try {
      const diagDir = path.join(watchesStore.getBeaconDataDirectory(), "diagnostics");
      if (!fs.existsSync(diagDir)) {
        fs.mkdirSync(diagDir, { recursive: true });
      }
      const bundle = {
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        systemHealth: healthSummary,
        recentLogs: this.getRecentLogs(100)
      };
      const fileName = `beacon-diagnostics-${Date.now()}.json`;
      const exportPath = path.join(diagDir, fileName);
      fs.writeFileSync(exportPath, JSON.stringify(bundle, null, 2), "utf-8");
      this.info("Logger", `Exported sanitized diagnostics bundle to: ${exportPath}`);
      return {
        success: true,
        filePath: exportPath,
        bundle
      };
    } catch (err) {
      this.error("Logger", "Failed to generate diagnostics export bundle", err);
      return {
        success: false,
        error: redactSensitiveText(err?.message || "Failed to export diagnostics")
      };
    }
  }
}
const logger = new LoggerService();
const DEFAULT_AMBIENT_SETTINGS = {
  slideshowInterval: 30,
  transitionDuration: 2,
  kenBurnsEnabled: true,
  wallpaperSource: "built-in",
  customWallpaperFolder: "",
  selectedWallpaperIndex: 0,
  showClock: true,
  showDate: true,
  use24Hour: false,
  showWeather: true,
  weatherLocation: "London",
  temperatureUnit: "C",
  showWatches: true,
  showTasks: true,
  showQuote: true,
  frostedGlassBlur: 16,
  backgroundDim: 0.1
};
const DEFAULT_GENERAL_SETTINGS = {
  launchAtStartup: false,
  startMinimized: false,
  minimizeToTray: false,
  closeBehavior: "tray"
};
const DEFAULT_APPEARANCE_SETTINGS = {
  theme: "system",
  reducedMotion: false
};
const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  sound: true
};
const DEFAULT_SCREENSAVER_SETTINGS = {
  enabled: true,
  showClock: true,
  showDate: true,
  showWeather: true,
  showQuote: true,
  showTasks: false,
  showWatches: false,
  exitOnMouseMove: true
};
const DEFAULT_SETTINGS = {
  version: 1,
  general: DEFAULT_GENERAL_SETTINGS,
  appearance: DEFAULT_APPEARANCE_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  ambient: DEFAULT_AMBIENT_SETTINGS,
  screensaver: DEFAULT_SCREENSAVER_SETTINGS,
  onboardingCompleted: false
};
function getSettingsFilePath() {
  return path.join(watchesStore.getBeaconDataDirectory(), "settings.json");
}
function validateAndMigrateSettings(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_SETTINGS };
  }
  const generalSrc = raw.general && typeof raw.general === "object" ? raw.general : {};
  const general = {
    launchAtStartup: typeof generalSrc.launchAtStartup === "boolean" ? generalSrc.launchAtStartup : DEFAULT_GENERAL_SETTINGS.launchAtStartup,
    startMinimized: typeof generalSrc.startMinimized === "boolean" ? generalSrc.startMinimized : DEFAULT_GENERAL_SETTINGS.startMinimized,
    minimizeToTray: typeof generalSrc.minimizeToTray === "boolean" ? generalSrc.minimizeToTray : DEFAULT_GENERAL_SETTINGS.minimizeToTray,
    closeBehavior: generalSrc.closeBehavior === "quit" || generalSrc.closeBehavior === "tray" ? generalSrc.closeBehavior : DEFAULT_GENERAL_SETTINGS.closeBehavior
  };
  const appearanceSrc = raw.appearance && typeof raw.appearance === "object" ? raw.appearance : {};
  const legacyTheme = typeof raw.theme === "string" ? raw.theme : void 0;
  const rawTheme = appearanceSrc.theme || legacyTheme;
  const theme = rawTheme === "light" || rawTheme === "dark" || rawTheme === "system" ? rawTheme : DEFAULT_APPEARANCE_SETTINGS.theme;
  const appearance = {
    theme,
    reducedMotion: typeof appearanceSrc.reducedMotion === "boolean" ? appearanceSrc.reducedMotion : DEFAULT_APPEARANCE_SETTINGS.reducedMotion
  };
  const notifSrc = raw.notifications && typeof raw.notifications === "object" ? raw.notifications : {};
  const notifications = {
    enabled: typeof notifSrc.enabled === "boolean" ? notifSrc.enabled : DEFAULT_NOTIFICATION_SETTINGS.enabled,
    sound: typeof notifSrc.sound === "boolean" ? notifSrc.sound : DEFAULT_NOTIFICATION_SETTINGS.sound
  };
  const ambientSrc = raw.ambient && typeof raw.ambient === "object" ? raw.ambient : {};
  const ambient = {
    slideshowInterval: typeof ambientSrc.slideshowInterval === "number" && ambientSrc.slideshowInterval >= 5 ? ambientSrc.slideshowInterval : DEFAULT_AMBIENT_SETTINGS.slideshowInterval,
    transitionDuration: typeof ambientSrc.transitionDuration === "number" && ambientSrc.transitionDuration >= 0.1 ? ambientSrc.transitionDuration : DEFAULT_AMBIENT_SETTINGS.transitionDuration,
    kenBurnsEnabled: typeof ambientSrc.kenBurnsEnabled === "boolean" ? ambientSrc.kenBurnsEnabled : DEFAULT_AMBIENT_SETTINGS.kenBurnsEnabled,
    wallpaperSource: ambientSrc.wallpaperSource === "custom-folder" ? "custom-folder" : "built-in",
    customWallpaperFolder: typeof ambientSrc.customWallpaperFolder === "string" ? ambientSrc.customWallpaperFolder : "",
    selectedWallpaperIndex: typeof ambientSrc.selectedWallpaperIndex === "number" && ambientSrc.selectedWallpaperIndex >= 0 ? ambientSrc.selectedWallpaperIndex : 0,
    showClock: typeof ambientSrc.showClock === "boolean" ? ambientSrc.showClock : DEFAULT_AMBIENT_SETTINGS.showClock,
    showDate: typeof ambientSrc.showDate === "boolean" ? ambientSrc.showDate : DEFAULT_AMBIENT_SETTINGS.showDate,
    use24Hour: typeof ambientSrc.use24Hour === "boolean" ? ambientSrc.use24Hour : DEFAULT_AMBIENT_SETTINGS.use24Hour,
    showWeather: typeof ambientSrc.showWeather === "boolean" ? ambientSrc.showWeather : DEFAULT_AMBIENT_SETTINGS.showWeather,
    weatherLocation: typeof ambientSrc.weatherLocation === "string" && ambientSrc.weatherLocation.trim() ? ambientSrc.weatherLocation.trim() : DEFAULT_AMBIENT_SETTINGS.weatherLocation,
    temperatureUnit: ambientSrc.temperatureUnit === "F" ? "F" : "C",
    showWatches: typeof ambientSrc.showWatches === "boolean" ? ambientSrc.showWatches : DEFAULT_AMBIENT_SETTINGS.showWatches,
    showTasks: typeof ambientSrc.showTasks === "boolean" ? ambientSrc.showTasks : DEFAULT_AMBIENT_SETTINGS.showTasks,
    showQuote: typeof ambientSrc.showQuote === "boolean" ? ambientSrc.showQuote : DEFAULT_AMBIENT_SETTINGS.showQuote,
    frostedGlassBlur: typeof ambientSrc.frostedGlassBlur === "number" && ambientSrc.frostedGlassBlur >= 0 ? ambientSrc.frostedGlassBlur : DEFAULT_AMBIENT_SETTINGS.frostedGlassBlur,
    backgroundDim: typeof ambientSrc.backgroundDim === "number" && ambientSrc.backgroundDim >= 0 && ambientSrc.backgroundDim <= 1 ? Math.min(ambientSrc.backgroundDim, 0.25) : DEFAULT_AMBIENT_SETTINGS.backgroundDim
  };
  const screensaverSrc = raw.screensaver && typeof raw.screensaver === "object" ? raw.screensaver : {};
  const screensaver = {
    enabled: typeof screensaverSrc.enabled === "boolean" ? screensaverSrc.enabled : DEFAULT_SCREENSAVER_SETTINGS.enabled,
    showClock: typeof screensaverSrc.showClock === "boolean" ? screensaverSrc.showClock : DEFAULT_SCREENSAVER_SETTINGS.showClock,
    showDate: typeof screensaverSrc.showDate === "boolean" ? screensaverSrc.showDate : DEFAULT_SCREENSAVER_SETTINGS.showDate,
    showWeather: typeof screensaverSrc.showWeather === "boolean" ? screensaverSrc.showWeather : DEFAULT_SCREENSAVER_SETTINGS.showWeather,
    showQuote: typeof screensaverSrc.showQuote === "boolean" ? screensaverSrc.showQuote : DEFAULT_SCREENSAVER_SETTINGS.showQuote,
    showTasks: typeof screensaverSrc.showTasks === "boolean" ? screensaverSrc.showTasks : DEFAULT_SCREENSAVER_SETTINGS.showTasks,
    showWatches: typeof screensaverSrc.showWatches === "boolean" ? screensaverSrc.showWatches : DEFAULT_SCREENSAVER_SETTINGS.showWatches,
    exitOnMouseMove: typeof screensaverSrc.exitOnMouseMove === "boolean" ? screensaverSrc.exitOnMouseMove : DEFAULT_SCREENSAVER_SETTINGS.exitOnMouseMove
  };
  const onboardingCompleted = typeof raw.onboardingCompleted === "boolean" ? raw.onboardingCompleted : false;
  return {
    version: 1,
    general,
    appearance,
    notifications,
    ambient,
    screensaver,
    onboardingCompleted
  };
}
function syncSystemPreferences(settings) {
  try {
    if (electron.app && typeof electron.app.setLoginItemSettings === "function") {
      const execPath = process.execPath;
      electron.app.setLoginItemSettings({
        openAtLogin: settings.general.launchAtStartup,
        openAsHidden: settings.general.startMinimized,
        path: execPath,
        args: settings.general.startMinimized ? ["--hidden"] : []
      });
      logger.info(
        "SettingsStore",
        `Synced Windows startup: openAtLogin=${settings.general.launchAtStartup}, startMinimized=${settings.general.startMinimized}`
      );
    }
  } catch (err) {
    logger.warn("SettingsStore", "Failed to synchronize Windows login item settings:", err);
  }
  try {
    if (electron.nativeTheme) {
      electron.nativeTheme.themeSource = settings.appearance.theme;
    }
  } catch (err) {
    logger.warn("SettingsStore", "Failed to synchronize nativeTheme:", err);
  }
}
function loadSettings() {
  const filePath = getSettingsFilePath();
  if (!fs.existsSync(filePath)) {
    return { ...DEFAULT_SETTINGS };
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return validateAndMigrateSettings(parsed);
  } catch (err) {
    logger.warn("SettingsStore", "Failed to parse settings.json, backing up corrupted file", err);
    try {
      const backupPath = `${filePath}.corrupted.${Date.now()}`;
      fs.copyFileSync(filePath, backupPath);
      logger.info("SettingsStore", `Backed up corrupted settings to ${backupPath}`);
    } catch {
    }
    const defaultSettings = { ...DEFAULT_SETTINGS };
    saveSettings(defaultSettings);
    return defaultSettings;
  }
}
function saveSettings(settings) {
  const filePath = getSettingsFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = path.join(dir, `settings.${process.pid}.${Date.now()}.tmp`);
  try {
    fs.writeFileSync(tempPath, JSON.stringify(settings, null, 2), "utf-8");
    try {
      fs.renameSync(tempPath, filePath);
    } catch {
      fs.copyFileSync(tempPath, filePath);
      fs.unlinkSync(tempPath);
    }
    syncSystemPreferences(settings);
  } catch (err) {
    logger.error("SettingsStore", "Failed to write settings.json atomically:", err);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {
      }
    }
  }
}
function updateSettings(partial) {
  const current = loadSettings();
  const merged = {
    version: 1,
    general: {
      ...current.general,
      ...partial.general || {}
    },
    appearance: {
      ...current.appearance,
      ...partial.appearance || {}
    },
    notifications: {
      ...current.notifications,
      ...partial.notifications || {}
    },
    ambient: {
      ...current.ambient,
      ...partial.ambient || {}
    },
    screensaver: {
      ...current.screensaver,
      ...partial.screensaver || {}
    },
    onboardingCompleted: partial.onboardingCompleted !== void 0 ? Boolean(partial.onboardingCompleted) : current.onboardingCompleted
  };
  const validated = validateAndMigrateSettings(merged);
  saveSettings(validated);
  return validated;
}
function resetSettings(options) {
  const current = loadSettings();
  const resetOnboarding = Boolean(options?.resetOnboarding);
  const resetTarget = {
    version: 1,
    general: { ...DEFAULT_GENERAL_SETTINGS },
    appearance: { ...DEFAULT_APPEARANCE_SETTINGS },
    notifications: { ...DEFAULT_NOTIFICATION_SETTINGS },
    ambient: { ...DEFAULT_AMBIENT_SETTINGS },
    screensaver: { ...DEFAULT_SCREENSAVER_SETTINGS },
    onboardingCompleted: resetOnboarding ? false : current.onboardingCompleted
  };
  saveSettings(resetTarget);
  logger.info(
    "SettingsStore",
    `Settings reset to defaults. Onboarding preserved: ${!resetOnboarding}`
  );
  return resetTarget;
}
function isOnboardingCompleted() {
  return loadSettings().onboardingCompleted;
}
function setOnboardingCompleted(completed) {
  updateSettings({ onboardingCompleted: completed });
}
function loadAmbientSettings() {
  return loadSettings().ambient;
}
function updateAmbientSettings(partial) {
  const updated = updateSettings({ ambient: partial });
  return updated.ambient;
}
function getSettingsHealth() {
  const filePath = getSettingsFilePath();
  if (!fs.existsSync(filePath)) {
    return { status: "missing", sizeBytes: 0 };
  }
  let sizeBytes = 0;
  try {
    sizeBytes = fs.statSync(filePath).size;
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { status: "healthy", sizeBytes };
    }
    return { status: "corrupted", sizeBytes };
  } catch {
    return { status: "corrupted", sizeBytes };
  }
}
function getScrExecutablePath() {
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  const candidates = [
    // 1. Packaged next to Beacon.exe in app directory
    path.join(path.dirname(process.execPath), "Beacon.scr"),
    path.join(path.dirname(process.execPath), "Helm.scr"),
    // 2. LocalAppData Programs installation directory
    path.join(localAppData, "Programs", "Beacon", "Beacon.scr"),
    path.join(localAppData, "Programs", "Helm", "Helm.scr"),
    // 3. Dev output directory
    path.join(__dirname, "Beacon.scr"),
    path.join(__dirname, "Helm.scr"),
    path.join(__dirname, "..", "..", "out", "main", "Beacon.scr"),
    path.join(__dirname, "..", "..", "out", "main", "Helm.scr"),
    path.join(__dirname, "..", "..", "resources", "Beacon.scr"),
    path.join(__dirname, "..", "..", "resources", "Helm.scr"),
    path.join(__dirname, "..", "..", "resources", "screensaver", "Beacon.scr"),
    path.join(__dirname, "..", "..", "resources", "screensaver", "Helm.scr")
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) return c;
    } catch {
    }
  }
  return path.join(localAppData, "Programs", "Beacon", "Beacon.scr");
}
function getWindowsScreensaverStatus() {
  const scrPath = getScrExecutablePath();
  let isRegistered = false;
  let activeScreensaverPath = "";
  let timeoutSeconds = 600;
  let screenSaveActive = false;
  try {
    const stdout = child_process.execSync('reg query "HKCU\\Control Panel\\Desktop" /s', {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 3e3
    });
    const scrMatch = stdout.match(/SCRNSAVE\.EXE\s+REG_SZ\s+(.*)/i);
    if (scrMatch && scrMatch[1]) {
      activeScreensaverPath = scrMatch[1].trim();
      const normalizedActive = path.normalize(activeScreensaverPath).toLowerCase();
      const normalizedHelm = path.normalize(scrPath).toLowerCase();
      isRegistered = normalizedActive === normalizedHelm || normalizedActive.endsWith("beacon.scr") || normalizedActive.endsWith("helm.scr");
    }
    const activeMatch = stdout.match(/ScreenSaveActive\s+REG_SZ\s+([01])/i);
    if (activeMatch && activeMatch[1]) {
      screenSaveActive = activeMatch[1].trim() === "1";
    }
    const timeoutMatch = stdout.match(/ScreenSaveTimeOut\s+REG_SZ\s+(\d+)/i);
    if (timeoutMatch && timeoutMatch[1]) {
      timeoutSeconds = parseInt(timeoutMatch[1].trim(), 10) || 600;
    }
  } catch (err) {
    logger.warn("SettingsStore", "Failed to query screensaver registry values:", err);
  }
  return {
    isRegistered,
    scrPath,
    activeScreensaverPath,
    timeoutSeconds,
    screenSaveActive
  };
}
function setWindowsScreensaverActive(active) {
  const scrPath = getScrExecutablePath();
  try {
    if (active) {
      if (!fs.existsSync(scrPath)) {
        logger.warn("SettingsStore", `Screensaver file not found on disk at: ${scrPath}`);
      }
      child_process.execSync(`reg add "HKCU\\Control Panel\\Desktop" /v SCRNSAVE.EXE /t REG_SZ /d "${scrPath}" /f`, {
        stdio: "ignore",
        timeout: 3e3
      });
      child_process.execSync(`reg add "HKCU\\Control Panel\\Desktop" /v ScreenSaveActive /t REG_SZ /d "1" /f`, {
        stdio: "ignore",
        timeout: 3e3
      });
      logger.info("SettingsStore", `Registered BEACON as active Windows screensaver: ${scrPath}`);
    } else {
      child_process.execSync('reg delete "HKCU\\Control Panel\\Desktop" /v SCRNSAVE.EXE /f', {
        stdio: "ignore",
        timeout: 3e3
      });
      logger.info("SettingsStore", "Unregistered BEACON as Windows screensaver");
    }
    return true;
  } catch (err) {
    logger.error("SettingsStore", "Failed to update screensaver registry settings:", err);
    return false;
  }
}
function openWindowsScreensaverDialog() {
  try {
    const scrPath = getScrExecutablePath();
    if (fs.existsSync(scrPath)) {
      child_process.spawn("rundll32.exe", ["desk.cpl,InstallScreenSaver", scrPath], {
        detached: true,
        stdio: "ignore"
      }).unref();
    } else {
      child_process.spawn("control", ["desk.cpl,,@screensaver"], {
        detached: true,
        stdio: "ignore"
      }).unref();
    }
  } catch (err) {
    logger.warn("SettingsStore", "Failed to open Windows Screen Saver dialog:", err);
  }
}
const BEACON_PIPE_NAME = "\\\\.\\pipe\\beacon-windows-ipc";
const HELM_PIPE_NAME = "\\\\.\\pipe\\helm-windows-ipc";
const LEASE_DURATION_MS = 12e4;
const RETRY_COOLDOWN_MS = 3e3;
let server = null;
let fallbackServer = null;
let callbacks = {};
let connectionState = "disconnected";
let lastSyncTimestamp = void 0;
let lastConnectedTimestamp = void 0;
let lastDisconnectedTimestamp = void 0;
let currentErrorReason = "No active connection from browser extension. Open Chrome, Edge, or Brave.";
let currentBrowserType = "unknown";
let retryStatus = { inProgress: false };
const activeSessions = /* @__PURE__ */ new Map();
const activeSockets = /* @__PURE__ */ new Set();
let leaseCheckTimer = null;
function setPipeServerCallbacks(cbs) {
  callbacks = { ...callbacks, ...cbs };
}
function isManifestInstalled() {
  try {
    const dir = watchesStore.getBeaconDataDirectory();
    const beaconManifest = path.join(dir, "com.jonathanvineet.beacon.json");
    const helmManifest = path.join(dir, "com.jonathanvineet.helm.json");
    return fs.existsSync(beaconManifest) || fs.existsSync(helmManifest);
  } catch {
    return false;
  }
}
function sanitizeErrorReason(reason) {
  if (!reason) return void 0;
  return reason.replace(/[a-zA-Z]:\\[^\s"'<>]+/g, "<path>").replace(/\/Users\/[^\s"'<>]+/g, "<path>").replace(/\\Users\\[^\s"'<>]+/g, "<path>").slice(0, 160);
}
function notifyStatusChanged() {
  if (callbacks.onStatusChanged) {
    try {
      callbacks.onStatusChanged(getBrowserIntegrationStatus());
    } catch (err) {
      console.error("[BEACON Pipe] Error notifying status change:", err);
    }
  }
}
function checkConnectionLease() {
  const now = Date.now();
  let removedAny = false;
  for (const [key, session] of activeSessions.entries()) {
    if (now - session.lastSeen > LEASE_DURATION_MS) {
      activeSessions.delete(key);
      removedAny = true;
    }
  }
  if (connectionState === "connected") {
    const isStillFresh = activeSessions.size > 0 || lastSyncTimestamp !== void 0 && now - lastSyncTimestamp <= LEASE_DURATION_MS;
    if (!isStillFresh) {
      connectionState = "disconnected";
      lastDisconnectedTimestamp = now;
      currentErrorReason = "Extension connection lease expired (no recent communication)";
      console.log("[BEACON Pipe] Connection transitioned to disconnected due to inactivity");
      notifyStatusChanged();
    } else if (removedAny) {
      notifyStatusChanged();
    }
  }
}
function getBrowserIntegrationStatus() {
  const allWatches = watchesStore.getAllWatches();
  const activeWatches = allWatches.filter((w) => w.state !== "done");
  const attentionWatches = allWatches.filter((w) => w.state === "attention");
  const isConnected = connectionState === "connected";
  return {
    state: connectionState,
    connected: isConnected,
    lastSyncTime: lastSyncTimestamp,
    lastConnectedTime: lastConnectedTimestamp,
    lastDisconnectedTime: lastDisconnectedTimestamp,
    errorReason: sanitizeErrorReason(currentErrorReason),
    browserType: currentBrowserType,
    retryStatus: { ...retryStatus },
    activeWatchCount: activeWatches.length,
    attentionCount: attentionWatches.length,
    manifestInstalled: isManifestInstalled(),
    pipeAvailable: !!server && server.listening
  };
}
function handleNotification(payload) {
  const settings = loadSettings();
  if (!settings.notifications.enabled) {
    console.log("[BEACON Pipe] OS desktop notification suppressed per user preferences");
    if (callbacks.onNotifyReceived) {
      callbacks.onNotifyReceived(payload);
    }
    return;
  }
  const title = (payload.title || "BEACON Alert").slice(0, 80);
  const message = (payload.message || "").slice(0, 300);
  const url2 = payload.url;
  console.log(`[BEACON Pipe] Displaying notification: "${title}" - "${message}" (sound: ${settings.notifications.sound})`);
  try {
    if (electron.Notification.isSupported()) {
      const iconPath = path.join(__dirname, "../../resources/icon.png");
      let notifIcon = electron.nativeImage.createFromPath(iconPath);
      if (notifIcon.isEmpty()) {
        notifIcon = electron.nativeImage.createEmpty();
      }
      const notif = new electron.Notification({
        title,
        body: message,
        icon: notifIcon,
        silent: !settings.notifications.sound
      });
      if (url2 && (url2.startsWith("http://") || url2.startsWith("https://"))) {
        notif.on("click", () => {
          electron.shell.openExternal(url2).catch((err) => {
            console.error("[BEACON Pipe] Failed to open notification URL:", err);
          });
        });
      }
      notif.show();
    } else {
      console.warn("[BEACON Pipe] System notifications are not supported on this host.");
    }
  } catch (err) {
    console.error("[BEACON Pipe] Error showing notification:", err);
  }
  if (callbacks.onNotifyReceived) {
    callbacks.onNotifyReceived(payload);
  }
}
function detectBrowserTypeFromPayload(parsed) {
  if (parsed.browser && typeof parsed.browser === "string") {
    const b = parsed.browser.toLowerCase();
    if (b.includes("edge")) return "edge";
    if (b.includes("brave")) return "brave";
    if (b.includes("chrome")) return "chrome";
    if (b.includes("chromium")) return "chromium";
  }
  if (parsed._meta && typeof parsed._meta === "object" && parsed._meta.browser) {
    const b = String(parsed._meta.browser).toLowerCase();
    if (b.includes("edge")) return "edge";
    if (b.includes("brave")) return "brave";
    if (b.includes("chrome")) return "chrome";
    if (b.includes("chromium")) return "chromium";
  }
  return "chromium";
}
function processClientMessage(messageText) {
  let parsed;
  try {
    parsed = JSON.parse(messageText);
  } catch (err) {
    console.error("[BEACON Pipe] Failed to parse message JSON from pipe client:", err?.message);
    connectionState = "error";
    currentErrorReason = "Malformed JSON payload received from native messaging host";
    notifyStatusChanged();
    return { ok: false, error: "Malformed JSON payload" };
  }
  if (!parsed || typeof parsed !== "object" || typeof parsed.type !== "string") {
    connectionState = "error";
    currentErrorReason = "Invalid payload format: missing message type";
    notifyStatusChanged();
    return { ok: false, error: "Invalid payload format" };
  }
  const now = Date.now();
  const source = parsed.source || "default";
  const detectedBrowser = detectBrowserTypeFromPayload(parsed);
  if (parsed.type === "watcher:disconnect") {
    activeSessions.delete(source);
    if (activeSessions.size === 0) {
      connectionState = "disconnected";
      lastDisconnectedTimestamp = now;
      currentErrorReason = "Browser extension closed or unhooked";
    }
    console.log(`[BEACON Pipe] Extension disconnected from source "${source}"`);
    notifyStatusChanged();
    return { ok: true };
  }
  activeSessions.set(source, { browser: detectedBrowser, lastSeen: now });
  lastSyncTimestamp = now;
  lastConnectedTimestamp = now;
  currentBrowserType = detectedBrowser;
  connectionState = "connected";
  currentErrorReason = void 0;
  if (parsed.type === "watcher:handshake" || parsed.type === "watcher:ping") {
    console.log(`[BEACON Pipe] Handshake confirmed with ${detectedBrowser} (source: ${source})`);
    notifyStatusChanged();
    return { ok: true };
  }
  if (parsed.type === "watcher:board") {
    const boardPayload = parsed;
    const updatedWatches = watchesStore.updateWatchesForSource(
      boardPayload.source || "default",
      boardPayload.watches || []
    );
    console.log(
      `[BEACON Pipe] Received ${boardPayload.watches?.length || 0} watches from source "${boardPayload.source || "default"}". Total active: ${updatedWatches.length}`
    );
    if (callbacks.onWatchesChanged) {
      callbacks.onWatchesChanged(updatedWatches);
    }
    notifyStatusChanged();
    return { ok: true, count: updatedWatches.length };
  }
  if (parsed.type === "watcher:notify") {
    const notifyPayload = parsed;
    handleNotification(notifyPayload);
    notifyStatusChanged();
    return { ok: true };
  }
  console.warn("[BEACON Pipe] Unknown message type received:", parsed?.type);
  return { ok: false, error: "Unknown message type" };
}
async function checkIsAnyChromiumRunning() {
  return new Promise((resolve) => {
    child_process.execFile("tasklist", ["/fo", "csv", "/nh"], { timeout: 1500, windowsHide: true }, (err, stdout) => {
      if (err) {
        resolve(true);
        return;
      }
      const lower = (stdout || "").toLowerCase();
      const running = lower.includes("chrome.exe") || lower.includes("msedge.exe") || lower.includes("brave.exe");
      resolve(running);
    });
  });
}
async function retryBrowserConnection() {
  const now = Date.now();
  if (retryStatus.cooldownUntil && now < retryStatus.cooldownUntil) {
    console.log("[BEACON Pipe] Reconnect request blocked by active cooldown");
    return getBrowserIntegrationStatus();
  }
  retryStatus = {
    inProgress: true,
    lastAttemptTime: now,
    cooldownUntil: now + RETRY_COOLDOWN_MS
  };
  connectionState = "connecting";
  currentErrorReason = void 0;
  notifyStatusChanged();
  try {
    if (!isManifestInstalled()) {
      connectionState = "error";
      lastDisconnectedTimestamp = Date.now();
      currentErrorReason = "Native messaging manifest is not registered for Chromium browsers";
      return getBrowserIntegrationStatus();
    }
    if (!server || !server.listening) {
      const started = await startPipeServer();
      if (!started) {
        connectionState = "error";
        lastDisconnectedTimestamp = Date.now();
        currentErrorReason = "Named Pipe server could not be started on " + HELM_PIPE_NAME;
        return getBrowserIntegrationStatus();
      }
    }
    const isBrowserRunning = await checkIsAnyChromiumRunning();
    await new Promise((r) => setTimeout(r, 600));
    if (connectionState === "connected") {
      return getBrowserIntegrationStatus();
    }
    connectionState = "disconnected";
    lastDisconnectedTimestamp = Date.now();
    if (!isBrowserRunning) {
      currentErrorReason = "No Chromium browser (Chrome, Edge, Brave) is currently running";
    } else {
      currentErrorReason = "Browser is running, but BEACON extension has not established a handshake yet";
    }
  } catch (err) {
    connectionState = "error";
    lastDisconnectedTimestamp = Date.now();
    currentErrorReason = sanitizeErrorReason(err?.message || "Error executing connection recovery");
  } finally {
    retryStatus.inProgress = false;
    notifyStatusChanged();
  }
  return getBrowserIntegrationStatus();
}
function setupClientSocket(socket) {
  activeSockets.add(socket);
  let buffer = "";
  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf-8");
    if (buffer.includes("\n")) {
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
          const res = processClientMessage(trimmed);
          try {
            socket.write(JSON.stringify(res) + "\n");
          } catch {
          }
        }
      }
    }
  });
  socket.on("end", () => {
    activeSockets.delete(socket);
    const trimmed = buffer.trim();
    if (trimmed) {
      const res = processClientMessage(trimmed);
      try {
        socket.write(JSON.stringify(res) + "\n");
      } catch {
      }
    }
  });
  socket.on("close", () => {
    activeSockets.delete(socket);
  });
  socket.on("error", (err) => {
    activeSockets.delete(socket);
    console.error("[BEACON Pipe] Client socket error:", err?.message);
    if (connectionState === "connected" && activeSockets.size === 0) {
      connectionState = "error";
      lastDisconnectedTimestamp = Date.now();
      currentErrorReason = `Pipe socket error: ${sanitizeErrorReason(err?.message)}`;
      notifyStatusChanged();
    }
  });
}
function startPipeServer() {
  return new Promise((resolve) => {
    if (server && server.listening) {
      resolve(true);
      return;
    }
    if (!leaseCheckTimer) {
      leaseCheckTimer = setInterval(checkConnectionLease, 15e3);
      leaseCheckTimer.unref();
    }
    server = net.createServer(setupClientSocket);
    server.on("error", (err) => {
      console.error("[BEACON Pipe] Primary server error on Named Pipe:", err?.message);
      connectionState = "error";
      lastDisconnectedTimestamp = Date.now();
      currentErrorReason = `Named Pipe server error: ${sanitizeErrorReason(err?.message)}`;
      server = null;
      notifyStatusChanged();
      resolve(false);
    });
    server.listen(BEACON_PIPE_NAME, () => {
      console.log(`[BEACON Pipe] Primary Named Pipe server listening on ${BEACON_PIPE_NAME}`);
      try {
        fallbackServer = net.createServer(setupClientSocket);
        fallbackServer.on("error", (err) => {
          console.warn("[BEACON Pipe] Fallback Named Pipe server error (non-fatal):", err?.message);
        });
        fallbackServer.listen(HELM_PIPE_NAME, () => {
          console.log(`[BEACON Pipe] Backward-compatible fallback listening on ${HELM_PIPE_NAME}`);
        });
      } catch (err) {
        console.warn("[BEACON Pipe] Could not start fallback pipe listener:", err);
      }
      notifyStatusChanged();
      resolve(true);
    });
  });
}
function stopPipeServer() {
  if (leaseCheckTimer) {
    clearInterval(leaseCheckTimer);
    leaseCheckTimer = null;
  }
  for (const socket of activeSockets) {
    try {
      socket.destroy();
    } catch {
    }
  }
  activeSockets.clear();
  if (server) {
    try {
      server.close();
    } catch (err) {
      console.error("[BEACON Pipe] Error stopping server:", err);
    }
    server = null;
  }
  if (fallbackServer) {
    try {
      fallbackServer.close();
    } catch (err) {
      console.error("[BEACON Pipe] Error stopping fallback server:", err);
    }
    fallbackServer = null;
  }
  console.log("[BEACON Pipe] Named Pipe servers stopped.");
  connectionState = "disconnected";
  currentErrorReason = "Named Pipe server stopped";
  notifyStatusChanged();
}
let isScreensaverRunning = false;
let isScreensaverOnlySession = false;
let isTransitioningExit = false;
let screensaverReadyResolve = null;
let getWindowRef = () => null;
let ctrlServer = null;
let cursorPollTimer = null;
let initialCursorPoint = null;
let activationTime = 0;
let previousState = {
  wasVisible: false,
  wasMinimized: false,
  wasFullScreen: false,
  bounds: { x: 0, y: 0, width: 1100, height: 750 }
};
function logScreensaverEvent(message) {
  try {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const line = `[${timestamp}] [Electron] ${message}\r
`;
    const logDir = path__namespace.join(electron.app.getPath("appData"), "Beacon", "logs");
    if (!fs__namespace.existsSync(logDir)) fs__namespace.mkdirSync(logDir, { recursive: true });
    fs__namespace.appendFileSync(path__namespace.join(logDir, "screensaver.log"), line, "utf-8");
    const tempLog = path__namespace.join(os__namespace.tmpdir(), "BeaconScreensaver.log");
    fs__namespace.appendFileSync(tempLog, line, "utf-8");
  } catch {
  }
  logger.info("Screensaver", message);
}
let fallbackCtrlServer = null;
function handleControlSocket(socket) {
  let buffer = "";
  socket.on("data", (data) => {
    buffer += data.toString("utf-8");
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const rawLine of lines) {
      const command = rawLine.trim().toUpperCase();
      if (!command) continue;
      logScreensaverEvent(`Screensaver control pipe received command: ${command}`);
      if (command === "ACTIVATE") {
        try {
          socket.write("OK\n");
        } catch {
        }
        enterScreensaverMode().catch((err) => {
          logScreensaverEvent(`Error entering screensaver mode: ${err}`);
        });
      } else if (command === "DEACTIVATE" || command === "EXIT") {
        try {
          socket.write("OK\n");
        } catch {
        }
        exitScreensaverMode().catch((err) => {
          logScreensaverEvent(`Error exiting screensaver mode: ${err}`);
        });
      } else if (command === "CONFIG") {
        try {
          socket.write("OK\n");
        } catch {
        }
        const win = getWindowRef();
        if (win && !win.isDestroyed()) {
          if (win.isMinimized()) win.restore();
          if (!win.isVisible()) win.show();
          win.focus();
          win.webContents.send(IPC_CHANNELS.NAVIGATE, "settings");
        }
      } else if (command === "PING") {
        try {
          socket.write("PONG\n");
        } catch {
        }
      }
    }
  });
  socket.on("error", (err) => {
    logScreensaverEvent(`Control pipe socket notice: ${err.message}`);
  });
}
function startScreensaverControlServer() {
  const username = process.env.USERNAME || "";
  const primaryPipePath = `\\\\.\\pipe\\beacon-screensaver-ctrl-${username}`;
  const fallbackPipePath = `\\\\.\\pipe\\helm-screensaver-ctrl-${username}`;
  try {
    if (ctrlServer) {
      try {
        ctrlServer.close();
      } catch {
      }
      ctrlServer = null;
    }
    if (fallbackCtrlServer) {
      try {
        fallbackCtrlServer.close();
      } catch {
      }
      fallbackCtrlServer = null;
    }
    ctrlServer = net__namespace.createServer(handleControlSocket);
    ctrlServer.listen(primaryPipePath, () => {
      logScreensaverEvent(`Primary screensaver control named pipe listening on: ${primaryPipePath}`);
    });
    ctrlServer.on("error", (err) => {
      logScreensaverEvent(`Primary screensaver control pipe server error: ${err.message}`);
    });
    try {
      fallbackCtrlServer = net__namespace.createServer(handleControlSocket);
      fallbackCtrlServer.listen(fallbackPipePath, () => {
        logScreensaverEvent(`Fallback screensaver control named pipe listening on: ${fallbackPipePath}`);
      });
      fallbackCtrlServer.on("error", (err) => {
        logScreensaverEvent(`Fallback screensaver control pipe notice (non-fatal): ${err.message}`);
      });
    } catch {
    }
  } catch (err) {
    logScreensaverEvent(`Failed to initialize screensaver control server: ${err}`);
  }
}
function stopScreensaverControlServer() {
  if (ctrlServer) {
    try {
      ctrlServer.close();
      logScreensaverEvent("Primary screensaver control named pipe closed");
    } catch {
    }
    ctrlServer = null;
  }
  if (fallbackCtrlServer) {
    try {
      fallbackCtrlServer.close();
      logScreensaverEvent("Fallback screensaver control named pipe closed");
    } catch {
    }
    fallbackCtrlServer = null;
  }
}
function startCursorWatchdog() {
  stopCursorWatchdog();
  activationTime = Date.now();
  try {
    initialCursorPoint = electron.screen.getCursorScreenPoint();
  } catch {
    initialCursorPoint = null;
  }
  cursorPollTimer = setInterval(() => {
    if (!isScreensaverRunning || isTransitioningExit) {
      stopCursorWatchdog();
      return;
    }
    if (Date.now() - activationTime < 1200) {
      try {
        const pt = electron.screen.getCursorScreenPoint();
        if (Math.abs(pt.x) < 1e4 && Math.abs(pt.y) < 1e4) {
          initialCursorPoint = pt;
        }
      } catch {
      }
      return;
    }
    try {
      const current = electron.screen.getCursorScreenPoint();
      if (!initialCursorPoint) {
        initialCursorPoint = current;
        return;
      }
      if (Math.abs(current.x) > 1e4 || Math.abs(current.y) > 1e4 || Math.abs(initialCursorPoint.x) > 1e4 || Math.abs(initialCursorPoint.y) > 1e4) {
        initialCursorPoint = current;
        return;
      }
      const dx = current.x - initialCursorPoint.x;
      const dy = current.y - initialCursorPoint.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 5e3) {
        initialCursorPoint = current;
        return;
      }
      if (dist >= 25) {
        logScreensaverEvent(
          `Main process cursor polling detected mouse movement (${Math.round(dist)}px); dismissing screensaver`
        );
        stopCursorWatchdog();
        exitScreensaverMode();
      }
    } catch {
    }
  }, 80);
}
function stopCursorWatchdog() {
  if (cursorPollTimer) {
    clearInterval(cursorPollTimer);
    cursorPollTimer = null;
  }
}
function registerGlobalExitShortcuts() {
  try {
    electron.globalShortcut.unregisterAll();
    const accelerators = ["Escape", "Space", "Return", "MediaPlayPause"];
    electron.globalShortcut.registerAll(accelerators, () => {
      logScreensaverEvent("Main process global shortcut detected dismissal key; exiting screensaver");
      exitScreensaverMode();
    });
  } catch (err) {
    logScreensaverEvent(`Failed to register global shortcuts: ${err}`);
  }
}
function unregisterGlobalExitShortcuts() {
  try {
    electron.globalShortcut.unregisterAll();
  } catch {
  }
}
function initScreensaverManager(mainWindowGetter2, screensaverOnly = false) {
  getWindowRef = mainWindowGetter2;
  isScreensaverOnlySession = screensaverOnly;
  logScreensaverEvent(`initScreensaverManager: screensaverOnly=${screensaverOnly}`);
  startScreensaverControlServer();
  try {
    electron.powerMonitor.on("lock-screen", () => {
      logScreensaverEvent("powerMonitor detected lock-screen; immediately dismissing screensaver");
      if (isScreensaverRunning) {
        const win = getWindowRef();
        if (win && !win.isDestroyed()) {
          try {
            win.setAlwaysOnTop(false);
          } catch {
          }
        }
        exitScreensaverMode();
      }
    });
    electron.powerMonitor.on("suspend", () => {
      logScreensaverEvent("powerMonitor detected suspend; immediately dismissing screensaver");
      if (isScreensaverRunning) {
        const win = getWindowRef();
        if (win && !win.isDestroyed()) {
          try {
            win.setAlwaysOnTop(false);
          } catch {
          }
        }
        exitScreensaverMode();
      }
    });
    electron.app.on("session-end", () => {
      logScreensaverEvent("app detected session-end; immediately dismissing screensaver");
      if (isScreensaverRunning) {
        const win = getWindowRef();
        if (win && !win.isDestroyed()) {
          try {
            win.setAlwaysOnTop(false);
          } catch {
          }
        }
        exitScreensaverMode();
      }
    });
  } catch (err) {
    logScreensaverEvent(`Failed to bind powerMonitor listeners: ${err}`);
  }
}
function isScreensaverActive() {
  return isScreensaverRunning;
}
function setScreensaverOnly(value) {
  isScreensaverOnlySession = value;
}
function notifyScreensaverExitPipe() {
  const username = process.env.USERNAME || "";
  const pipes = [
    `\\\\.\\pipe\\beacon-screensaver-exit-${username}`,
    `\\\\.\\pipe\\helm-screensaver-exit-${username}`
  ];
  for (const pipePath of pipes) {
    try {
      const client = net__namespace.connect(pipePath, () => {
        logScreensaverEvent(`Connected to launcher exit pipe (${pipePath}); signaling EXIT`);
        try {
          client.write("EXIT\n");
          client.end();
        } catch {
        }
      });
      client.on("error", () => {
      });
    } catch {
    }
  }
}
let isRendererScreensaverReady = false;
function notifyScreensaverReady() {
  logScreensaverEvent("Received SCREENSAVER_READY signal from renderer");
  isRendererScreensaverReady = true;
  if (screensaverReadyResolve) {
    screensaverReadyResolve();
    screensaverReadyResolve = null;
  }
}
async function enterScreensaverMode() {
  const win = getWindowRef();
  if (!win || win.isDestroyed()) {
    logScreensaverEvent("enterScreensaverMode called but mainWindow is null or destroyed");
    return;
  }
  if (isScreensaverRunning) {
    logScreensaverEvent("enterScreensaverMode called but screensaver is already active");
    return;
  }
  isTransitioningExit = false;
  previousState = {
    wasVisible: win.isVisible(),
    wasMinimized: win.isMinimized(),
    wasFullScreen: win.isFullScreen(),
    bounds: win.getBounds()
  };
  isScreensaverRunning = true;
  logScreensaverEvent(
    `Entering screensaver mode (fullscreen ambient). Previous window state: visible=${previousState.wasVisible}, minimized=${previousState.wasMinimized}, fullScreen=${previousState.wasFullScreen}`
  );
  try {
    win.setOpacity(0);
  } catch {
  }
  if (win.isMinimized()) {
    try {
      win.restore();
    } catch {
    }
  }
  try {
    const activeDisplay = electron.screen.getDisplayNearestPoint(electron.screen.getCursorScreenPoint()) || electron.screen.getPrimaryDisplay();
    if (activeDisplay && activeDisplay.bounds) {
      win.setBounds(activeDisplay.bounds);
    }
  } catch (err) {
    logScreensaverEvent(`Error setting display bounds: ${err}`);
  }
  try {
    win.setFullScreen(true);
  } catch (err) {
    logScreensaverEvent(`Error setting fullscreen: ${err}`);
  }
  try {
    win.setAlwaysOnTop(true, "screen-saver");
  } catch {
    try {
      win.setAlwaysOnTop(true);
    } catch {
    }
  }
  try {
    if (!win.isVisible()) {
      win.showInactive();
    }
  } catch (err) {
    logScreensaverEvent(`Notice showing window at opacity 0: ${err}`);
  }
  try {
    win.webContents.send(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, true);
    logScreensaverEvent("Dispatched SCREENSAVER_STATE_CHANGE(true) to renderer");
  } catch (err) {
    logScreensaverEvent(`Failed to dispatch screensaver state change to renderer: ${err}`);
  }
  if (!isRendererScreensaverReady) {
    await new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        screensaverReadyResolve = null;
        resolve();
      };
      screensaverReadyResolve = done;
      const timer = setTimeout(() => {
        logScreensaverEvent("Screensaver readiness handshake timed out (500ms fallback) - revealing window");
        done();
      }, 500);
    });
  }
  try {
    win.setFullScreen(true);
    win.show();
    win.focus();
    win.setOpacity(1);
    logScreensaverEvent("Ambient mounted & confirmed: window revealed directly in fullscreen screensaver mode (zero flash)");
  } catch (err) {
    logScreensaverEvent(`Error revealing screensaver window: ${err}`);
  }
  startCursorWatchdog();
  registerGlobalExitShortcuts();
}
async function exitScreensaverMode() {
  if (!isScreensaverRunning || isTransitioningExit) {
    logScreensaverEvent("exitScreensaverMode called but screensaver is not active or already exiting");
    return;
  }
  isTransitioningExit = true;
  isScreensaverRunning = false;
  logScreensaverEvent("Screensaver dismissed: initiating smooth exit transition...");
  stopCursorWatchdog();
  unregisterGlobalExitShortcuts();
  const win = getWindowRef();
  if (!win || win.isDestroyed()) {
    logScreensaverEvent("Window unavailable during exit; signaling pipe and concluding");
    notifyScreensaverExitPipe();
    if (isScreensaverOnlySession) {
      electron.app.quit();
    }
    isTransitioningExit = false;
    return;
  }
  let isReducedMotion = false;
  try {
    const currentSettings = loadSettings();
    const animSettings = electron.systemPreferences.getAnimationSettings ? electron.systemPreferences.getAnimationSettings() : null;
    isReducedMotion = Boolean(animSettings?.prefersReducedMotion) || Boolean(currentSettings.appearance?.reducedMotion);
  } catch {
  }
  const FADE_DURATION_MS = isReducedMotion ? 0 : 300;
  const STEP_INTERVAL_MS = 20;
  const TOTAL_STEPS = Math.max(1, Math.round(FADE_DURATION_MS / STEP_INTERVAL_MS));
  logScreensaverEvent(
    `Exit transition animation: duration=${FADE_DURATION_MS}ms, reducedMotion=${isReducedMotion}`
  );
  if (FADE_DURATION_MS > 0) {
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const opacity = 1 - step / TOTAL_STEPS;
      try {
        win.setOpacity(Math.max(0, opacity));
      } catch {
      }
      await new Promise((resolve) => setTimeout(resolve, STEP_INTERVAL_MS));
    }
  }
  try {
    win.setOpacity(0);
  } catch {
  }
  logScreensaverEvent(
    `Fade-out complete. Restoring prior state: wasVisible=${previousState.wasVisible}, wasMinimized=${previousState.wasMinimized}, wasFullScreen=${previousState.wasFullScreen}`
  );
  try {
    win.setAlwaysOnTop(false);
  } catch {
  }
  if (isScreensaverOnlySession) {
    logScreensaverEvent("Screensaver-only session completed: hiding window, notifying pipe, and quitting BEACON");
    notifyScreensaverExitPipe();
    try {
      win.hide();
    } catch {
    }
    electron.app.quit();
    isTransitioningExit = false;
    return;
  }
  if (!previousState.wasVisible || previousState.wasMinimized) {
    try {
      win.hide();
      win.setFullScreen(false);
      if (previousState.bounds) {
        win.setBounds(previousState.bounds);
      }
      win.setOpacity(1);
    } catch {
    }
    logScreensaverEvent("Restored previous state: hidden to system tray without windowed flash");
  } else {
    try {
      win.setFullScreen(previousState.wasFullScreen);
      if (!previousState.wasFullScreen && previousState.bounds) {
        win.setBounds(previousState.bounds);
      }
      win.setOpacity(1);
      win.focus();
    } catch {
    }
    logScreensaverEvent("Restored previous state: visible on desktop");
  }
  isRendererScreensaverReady = false;
  try {
    win.webContents.send(IPC_CHANNELS.SCREENSAVER_STATE_CHANGE, false);
    logScreensaverEvent("Dispatched SCREENSAVER_STATE_CHANGE(false) to renderer");
  } catch (err) {
    logScreensaverEvent(`Failed to dispatch screensaver state change: ${err}`);
  }
  notifyScreensaverExitPipe();
  isTransitioningExit = false;
}
const BUILT_IN_WALLPAPERS = [
  // ==========================================
  // Category A: Deep Space & Milky Way (5)
  // ==========================================
  {
    id: "space-milky-way-core",
    name: "Milky Way Core",
    subtitle: "Galaxy Heart Stretching Across the Night Sky",
    category: "cosmic-space",
    author: "Denis Degioanni",
    type: "built-in",
    url: "beacon-wallpaper://builtin/space-milky-way-core.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-milky-way-core.jpg"
  },
  { id: "space-deep-nebula", name: "Deep Space Nebula", subtitle: "Indigo and Violet Gas Cloud Formation", category: "cosmic-space", author: "Jeremy Thomas", type: "built-in", url: "beacon-wallpaper://builtin/space-deep-nebula.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-deep-nebula.jpg" },
  { id: "space-stellar-void", name: "Stellar Void", subtitle: "Thousands of Distant Stars in Deep Space", category: "cosmic-space", author: "Bryan Goff", type: "built-in", url: "beacon-wallpaper://builtin/space-stellar-void.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-stellar-void.jpg" },
  { id: "space-cosmic-dust", name: "Cosmic Dust Clouds", subtitle: "Dimensional Deep Space Silhouette", category: "cosmic-space", author: "Jeremy Thomas", type: "built-in", url: "beacon-wallpaper://builtin/space-cosmic-dust.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-cosmic-dust.jpg" },
  { id: "space-orbital-horizon", name: "Orbital Night", subtitle: "Earth at Night from Orbit with Atmospheric Glow", category: "cosmic-space", author: "NASA", type: "built-in", url: "beacon-wallpaper://builtin/space-orbital-horizon.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-orbital-horizon.jpg" },
  // Category B: Aurora Borealis (5)
  { id: "aurora-emerald-night", name: "Emerald Aurora", subtitle: "Green Northern Lights over Scandinavian Mountains", category: "aurora", author: "Jonatan Pie", type: "built-in", url: "beacon-wallpaper://builtin/aurora-emerald-night.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-emerald-night.jpg" },
  { id: "aurora-violet-dream", name: "Violet Aurora Dream", subtitle: "Deep Violet and Indigo Northern Sky", category: "aurora", author: "Tobias Bjorkli", type: "built-in", url: "beacon-wallpaper://builtin/aurora-violet-dream.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-violet-dream.jpg" },
  { id: "aurora-arctic-lake", name: "Arctic Lake Aurora", subtitle: "Northern Lights Reflected in Still Water", category: "aurora", author: "Lightscape", type: "built-in", url: "beacon-wallpaper://builtin/aurora-arctic-lake.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-arctic-lake.jpg" },
  { id: "aurora-pine-silhouette", name: "Forest Aurora", subtitle: "Northern Lights Behind Pine Forest Silhouette", category: "aurora", author: "Jonatan Pie", type: "built-in", url: "beacon-wallpaper://builtin/aurora-pine-silhouette.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-pine-silhouette.jpg" },
  { id: "aurora-cosmic-blue", name: "Cosmic Blue Aurora", subtitle: "Deep Blue and Teal Aurora Waves", category: "aurora", author: "Nelly Volkovich", type: "built-in", url: "beacon-wallpaper://builtin/aurora-cosmic-blue.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-cosmic-blue.jpg" },
  // Category C: Starry Night Landscapes (5)
  { id: "night-mountain-stars", name: "Mountain Starscape", subtitle: "Rugged Peaks Beneath a Spectacular Star-Filled Sky", category: "starry-night", author: "Arto Marttinen", type: "built-in", url: "beacon-wallpaper://builtin/night-mountain-stars.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-mountain-stars.jpg" },
  { id: "night-alpine-lake", name: "Alpine Lake Stars", subtitle: "Milky Way Reflected in Still Mountain Waters", category: "starry-night", author: "David Marcu", type: "built-in", url: "beacon-wallpaper://builtin/night-alpine-lake.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-alpine-lake.jpg" },
  { id: "night-desert-milky-way", name: "Desert Milky Way", subtitle: "Extraordinary Star Density over Dark Desert", category: "starry-night", author: "Luca Bravo", type: "built-in", url: "beacon-wallpaper://builtin/night-desert-milky-way.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-desert-milky-way.jpg" },
  { id: "night-misty-forest", name: "Misty Forest Night", subtitle: "Atmospheric Midnight Fog and Moonlight", category: "starry-night", author: "Felix Mittermeier", type: "built-in", url: "beacon-wallpaper://builtin/night-misty-forest.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-misty-forest.jpg" },
  { id: "night-ocean-horizon", name: "Ocean Night Horizon", subtitle: "Vast Dark Ocean Under a Starlit Midnight Sky", category: "starry-night", author: "Patrick Fore", type: "built-in", url: "beacon-wallpaper://builtin/night-ocean-horizon.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-ocean-horizon.jpg" },
  // Category D: Cozy Campfire & Night Sanctuary (5)
  { id: "campfire-starry-sky", name: "Campfire & Stars", subtitle: "Warm Amber Flame Beneath Millions of Stars", category: "campfire", author: "Mohamed Nohassi", type: "built-in", url: "beacon-wallpaper://builtin/campfire-starry-sky.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-starry-sky.jpg" },
  { id: "campfire-mountain-retreat", name: "Mountain Campsite", subtitle: "Quiet Firelight and the Milky Way Overhead", category: "campfire", author: "Zach Lezniewicz", type: "built-in", url: "beacon-wallpaper://builtin/campfire-mountain-retreat.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-mountain-retreat.jpg" },
  { id: "campfire-pine-forest", name: "Pine Forest Campfire", subtitle: "Secluded Fire Among Tall Trees at Night", category: "campfire", author: "David Marcu", type: "built-in", url: "beacon-wallpaper://builtin/campfire-pine-forest.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-pine-forest.jpg" },
  { id: "campfire-lakeside", name: "Lakeside Campfire", subtitle: "Warm Light Reflected Across Dark Water", category: "campfire", author: "Tim Foster", type: "built-in", url: "beacon-wallpaper://builtin/campfire-lakeside.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-lakeside.jpg" },
  { id: "campfire-cosmic-night", name: "Cosmic Campsite", subtitle: "Minimal Silhouette Beneath a Spectacular Sky", category: "campfire", author: "Free To Use Sounds", type: "built-in", url: "beacon-wallpaper://builtin/campfire-cosmic-night.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-cosmic-night.jpg" },
  // Category E: Moonlit Nature (5)
  { id: "moonlit-japanese-forest", name: "Japanese Moonlit Forest", subtitle: "Peaceful Forest Beneath Soft Moonlight", category: "moonlit", author: "Lukasz Szmigiel", type: "built-in", url: "beacon-wallpaper://builtin/moonlit-japanese-forest.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-japanese-forest.jpg" },
  { id: "moonlit-bamboo-grove", name: "Moonlit Bamboo", subtitle: "Dark Bamboo Grove with Delicate Moonbeams", category: "moonlit", author: "kazuend", type: "built-in", url: "beacon-wallpaper://builtin/moonlit-bamboo-grove.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-bamboo-grove.jpg" },
  { id: "moonlit-waterfall", name: "Nighttime Waterfall", subtitle: "Cinematic Cascade with Natural Atmospheric Mist", category: "moonlit", author: "Ben Guerin", type: "built-in", url: "beacon-wallpaper://builtin/moonlit-waterfall.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-waterfall.jpg" },
  { id: "moonlit-sakura", name: "Midnight Sakura", subtitle: "Cherry Blossom Silhouettes Under Violet Sky", category: "moonlit", author: "Redd Francisco", type: "built-in", url: "beacon-wallpaper://builtin/moonlit-sakura.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-sakura.jpg" },
  { id: "moonlit-cloud-sea", name: "Mountain Cloud Sea", subtitle: "Peaks Rising Above a Sea of Clouds at Night", category: "moonlit", author: "Kace Rodriguez", type: "built-in", url: "beacon-wallpaper://builtin/moonlit-cloud-sea.jpg", thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-cloud-sea.jpg" }
];
const ALLOWED_EXTENSIONS = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp"]);
function scanWallpaperDirectory(folderPath) {
  if (!folderPath || !fs.existsSync(folderPath)) {
    return [];
  }
  try {
    const stats = fs.statSync(folderPath);
    if (!stats.isDirectory()) return [];
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    const items = [];
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ALLOWED_EXTENSIONS.has(ext)) {
          const fullPath = path.join(folderPath, entry.name);
          const name = path.basename(entry.name, ext);
          const url2 = `beacon-wallpaper://${encodeURIComponent(fullPath)}`;
          items.push({
            id: `file-${Buffer.from(fullPath).toString("base64").replace(/=/g, "")}`,
            name,
            type: "file",
            url: url2,
            category: "custom"
          });
        }
      }
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error(`[BEACON WallpaperManager] Error scanning directory "${folderPath}":`, err);
    return [];
  }
}
function getActiveWallpapers() {
  const settings = loadAmbientSettings();
  if (settings.wallpaperSource === "custom-folder" && settings.customWallpaperFolder) {
    const customItems = scanWallpaperDirectory(settings.customWallpaperFolder);
    if (customItems.length > 0) {
      return customItems;
    }
  }
  return BUILT_IN_WALLPAPERS;
}
async function openWallpaperDirectoryDialog(window) {
  if (!window || window.isDestroyed()) {
    return { canceled: true };
  }
  const result = await electron.dialog.showOpenDialog(window, {
    title: "Select Wallpaper Folder for BEACON Ambient",
    properties: ["openDirectory", "dontAddToRecent"]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }
  const selectedPath = result.filePaths[0];
  const wallpapers = scanWallpaperDirectory(selectedPath);
  updateAmbientSettings({
    wallpaperSource: wallpapers.length > 0 ? "custom-folder" : "built-in",
    customWallpaperFolder: selectedPath,
    selectedWallpaperIndex: 0
  });
  return {
    canceled: false,
    folderPath: selectedPath,
    wallpapers
  };
}
function parseWmoCode(code, isDay = 1) {
  if (code === void 0 || code === null) {
    return { description: "Clear", conditionCode: "clear" };
  }
  switch (code) {
    case 0:
      return { description: isDay ? "Clear sky" : "Clear night", conditionCode: "clear" };
    case 1:
      return { description: "Mainly clear", conditionCode: "clear" };
    case 2:
      return { description: "Partly cloudy", conditionCode: "cloudy" };
    case 3:
      return { description: "Overcast", conditionCode: "cloudy" };
    case 45:
      return { description: "Fog", conditionCode: "fog" };
    case 48:
      return { description: "Depositing rime fog", conditionCode: "fog" };
    case 51:
      return { description: "Light drizzle", conditionCode: "rain" };
    case 53:
      return { description: "Moderate drizzle", conditionCode: "rain" };
    case 55:
      return { description: "Dense drizzle", conditionCode: "rain" };
    case 56:
    case 57:
      return { description: "Freezing drizzle", conditionCode: "snow" };
    case 61:
      return { description: "Slight rain", conditionCode: "rain" };
    case 63:
      return { description: "Moderate rain", conditionCode: "rain" };
    case 65:
      return { description: "Heavy rain", conditionCode: "rain" };
    case 66:
    case 67:
      return { description: "Freezing rain", conditionCode: "snow" };
    case 71:
      return { description: "Slight snow fall", conditionCode: "snow" };
    case 73:
      return { description: "Moderate snow fall", conditionCode: "snow" };
    case 75:
      return { description: "Heavy snow fall", conditionCode: "snow" };
    case 77:
      return { description: "Snow grains", conditionCode: "snow" };
    case 80:
      return { description: "Slight rain showers", conditionCode: "rain" };
    case 81:
      return { description: "Moderate rain showers", conditionCode: "rain" };
    case 82:
      return { description: "Violent rain showers", conditionCode: "rain" };
    case 85:
      return { description: "Slight snow showers", conditionCode: "snow" };
    case 86:
      return { description: "Heavy snow showers", conditionCode: "snow" };
    case 95:
      return { description: "Thunderstorm", conditionCode: "thunder" };
    case 96:
    case 99:
      return { description: "Thunderstorm with hail", conditionCode: "thunder" };
    default:
      return { description: "Clear", conditionCode: "clear" };
  }
}
class OpenMeteoWeatherProvider {
  cache = /* @__PURE__ */ new Map();
  geoCache = /* @__PURE__ */ new Map();
  cacheTTLMs = 15 * 60 * 1e3;
  // 15-minute weather cache
  geoTTLMs = 24 * 60 * 60 * 1e3;
  // 24-hour geocode cache
  clearCache() {
    this.cache.clear();
    this.geoCache.clear();
  }
  getCachedEntry(location) {
    const key = (location || "").trim().toLowerCase();
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }
  async geocodeLocation(location) {
    const trimmed = location.trim();
    if (!trimmed) return null;
    const cacheKey = trimmed.toLowerCase();
    const cachedGeo = this.geoCache.get(cacheKey);
    if (cachedGeo && Date.now() < cachedGeo.expiresAt) {
      return cachedGeo.result;
    }
    try {
      const fetchWithTimeout = async (query) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8e3);
        const url2 = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        logger.info("Weather", `[OpenMeteo:Geocode] Initiating request: query="${query}", URL=${redactSensitiveText(url2)}`);
        try {
          const res = await fetch(url2, {
            headers: {
              Accept: "application/json",
              "User-Agent": "BEACON-Desktop/0.1.0 (https://github.com/jonathanvineet/beacon)"
            },
            signal: controller.signal
          });
          logger.info("Weather", `[OpenMeteo:Geocode] HTTP response status: ${res.status} ${res.statusText}`);
          if (!res.ok) {
            logger.warn("Weather", `[OpenMeteo:Geocode] Non-200 status received: ${res.status}`);
            return null;
          }
          const parsed = await res.json();
          logger.info("Weather", `[OpenMeteo:Geocode] Result count: ${parsed?.results?.length ?? 0}`);
          return parsed;
        } catch (err) {
          logger.error("Weather", `[OpenMeteo:Geocode] Fetch error for "${query}": ${err?.message}`, err?.stack);
          throw err;
        } finally {
          clearTimeout(timer);
        }
      };
      let data = await fetchWithTimeout(trimmed);
      if ((!data || !data.results || data.results.length === 0) && trimmed.includes(",")) {
        const primaryCity = trimmed.split(",")[0].trim();
        if (primaryCity && primaryCity.toLowerCase() !== trimmed.toLowerCase()) {
          logger.info("Weather", `[OpenMeteo:Geocode] Trying primary city segment fallback: "${primaryCity}"`);
          try {
            data = await fetchWithTimeout(primaryCity);
          } catch {
          }
        }
      }
      if (!data || !data.results || data.results.length === 0) {
        logger.warn("Weather", `[OpenMeteo:Geocode] No coordinates found for location: "${trimmed}"`);
        return null;
      }
      const match = data.results[0];
      const name = match.name || trimmed;
      const admin1 = match.admin1 ? match.admin1 + ", " : "";
      const country = match.country || "";
      const displayName = country ? `${name}, ${admin1}${country}` : name;
      const result = {
        latitude: match.latitude,
        longitude: match.longitude,
        displayName
      };
      logger.info("Weather", `[OpenMeteo:Geocode] Successfully resolved: "${displayName}" -> lat=${result.latitude}, lon=${result.longitude}`);
      this.geoCache.set(cacheKey, {
        result,
        expiresAt: Date.now() + this.geoTTLMs
      });
      return result;
    } catch (err) {
      logger.error("Weather", `[OpenMeteo:Geocode] Exception during geocoding "${trimmed}": ${err?.message}`, err?.stack);
      return null;
    }
  }
  async getWeather(location) {
    const loc = (location || "").trim();
    if (!loc) {
      logger.info("Weather", "[OpenMeteo:Forecast] Empty location string provided, returning null");
      return null;
    }
    const cacheKey = loc.toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      logger.info("Weather", `[OpenMeteo:Forecast] Returning cached weather for "${loc}" (valid until ${new Date(cached.expiresAt).toISOString()})`);
      return cached.data;
    }
    const geo = await this.geocodeLocation(loc);
    if (!geo) {
      if (cached) {
        logger.warn("Weather", `[OpenMeteo:Forecast] Geocoding failed, returning stale cache with isStale=true for "${loc}"`);
        return { ...cached.data, isStale: true };
      }
      logger.warn("Weather", `[OpenMeteo:Forecast] Geocoding returned null, no weather data available for "${loc}"`);
      return null;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8e3);
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
      logger.info("Weather", `[OpenMeteo:Forecast] Requesting forecast: ${redactSensitiveText(forecastUrl)}`);
      const response = await fetch(forecastUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BEACON-Desktop/0.1.0 (https://github.com/jonathanvineet/beacon)"
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      logger.info("Weather", `[OpenMeteo:Forecast] HTTP response status: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        logger.warn("Weather", `[OpenMeteo:Forecast] Forecast API returned status ${response.status} for ${loc}`);
        if (cached) {
          return { ...cached.data, isStale: true };
        }
        return null;
      }
      const json = await response.json();
      const cur = json.current;
      if (!cur) {
        logger.warn("Weather", "[OpenMeteo:Forecast] Invalid forecast payload received (missing .current)");
        if (cached) {
          return { ...cached.data, isStale: true };
        }
        return null;
      }
      const temp2m = typeof cur.temperature_2m === "number" ? cur.temperature_2m : 0;
      const tempC = Math.round(temp2m);
      const tempF = Math.round(tempC * 9 / 5 + 32);
      const wmo = parseWmoCode(cur.weather_code, cur.is_day);
      const weatherData = {
        location: geo.displayName,
        temperatureCelsius: tempC,
        temperatureFahrenheit: tempF,
        condition: wmo.description,
        conditionCode: wmo.conditionCode,
        humidity: typeof cur.relative_humidity_2m === "number" ? cur.relative_humidity_2m : void 0,
        windSpeedKmh: typeof cur.wind_speed_10m === "number" ? Math.round(cur.wind_speed_10m) : void 0,
        updatedAt: Date.now(),
        isStale: false,
        attribution: "Weather data by Open-Meteo"
      };
      logger.info(
        "Weather",
        `[OpenMeteo:Forecast] Success: loc="${weatherData.location}", temp=${tempC}°C / ${tempF}°F, code=${cur.weather_code} (${wmo.description}), humidity=${weatherData.humidity}%, wind=${weatherData.windSpeedKmh}km/h`
      );
      this.cache.set(cacheKey, {
        data: weatherData,
        expiresAt: Date.now() + this.cacheTTLMs
      });
      return weatherData;
    } catch (err) {
      if (err.name === "AbortError") {
        logger.warn("Weather", `[OpenMeteo:Forecast] Forecast request timed out after 8s for "${loc}"`);
      } else {
        logger.error("Weather", `[OpenMeteo:Forecast] Forecast lookup error for "${loc}": ${err?.message}`, err?.stack);
      }
      if (cached) {
        logger.info("Weather", `[OpenMeteo:Forecast] Serving stale cache data for "${loc}"`);
        return { ...cached.data, isStale: true };
      }
      return null;
    }
  }
}
const defaultWeatherProvider = new OpenMeteoWeatherProvider();
let dbInstance = null;
let dbInitPromise = null;
function getDatabaseFilePath() {
  const dir = watchesStore.getBeaconDataDirectory();
  const beaconDb = path.join(dir, "beacon.db");
  const helmDb = path.join(dir, "helm.db");
  if (!fs.existsSync(beaconDb) && fs.existsSync(helmDb)) {
    try {
      fs.copyFileSync(helmDb, beaconDb);
      logger.info("Database", "Migrated helm.db to beacon.db successfully");
    } catch (err) {
      logger.error("Database", "Failed to copy helm.db to beacon.db, falling back to helm.db", err);
      return helmDb;
    }
  }
  return beaconDb;
}
function persistDatabase() {
  if (!dbInstance) return;
  const filePath = getDatabaseFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const binaryArray = dbInstance.export();
  const buffer = Buffer.from(binaryArray);
  const tempPath = path.join(dir, `beacon.db.${process.pid}.${Date.now()}.tmp`);
  try {
    fs.writeFileSync(tempPath, buffer);
    try {
      fs.renameSync(tempPath, filePath);
    } catch {
      fs.copyFileSync(tempPath, filePath);
      fs.unlinkSync(tempPath);
    }
  } catch (err) {
    console.error("[BEACON DB] Failed to persist database to disk:", err);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {
      }
    }
  }
}
function runMigrations(db) {
  db.run("PRAGMA foreign_keys = ON;");
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
  let currentVersion = 0;
  const versionStmt = db.prepare("SELECT MAX(version) as v FROM schema_migrations");
  if (versionStmt.step()) {
    const row = versionStmt.getAsObject();
    currentVersion = typeof row.v === "number" ? row.v : 0;
  }
  versionStmt.free();
  if (currentVersion < 1) {
    console.log("[BEACON DB] Applying migration version 1...");
    db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        is_pinned INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned DESC);

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        due_date INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        completed_at INTEGER
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notes_pinned_updated ON notes(is_pinned DESC, updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tasks_status_due ON tasks(status, due_date);

      INSERT INTO schema_migrations (version, applied_at)
      VALUES (1, datetime('now'));
    `);
    persistDatabase();
  }
  if (currentVersion < 2) {
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_notes_pinned_updated ON notes(is_pinned DESC, updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tasks_status_due ON tasks(status, due_date);

      INSERT INTO schema_migrations (version, applied_at)
      VALUES (2, datetime('now'));
    `);
    persistDatabase();
  }
}
async function getDatabase() {
  if (dbInstance) return dbInstance;
  if (dbInitPromise) return dbInitPromise;
  dbInitPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: (file) => {
        const candidates = [
          path.join(process.resourcesPath || "", "app.asar.unpacked", "node_modules", "sql.js", "dist", file),
          path.join(__dirname, "../../node_modules/sql.js/dist", file),
          path.join(__dirname, "../node_modules/sql.js/dist", file),
          path.join(process.cwd(), "node_modules", "sql.js", "dist", file)
        ];
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            return candidate;
          }
        }
        return file;
      }
    });
    const filePath = getDatabaseFilePath();
    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        dbInstance = new SQL.Database(fileBuffer);
        logger.info("Database", "Loaded existing SQLite database from disk");
      } catch (err) {
        logger.warn("Database", "Corrupted database file detected. Creating backup and initializing fresh database.", err);
        try {
          const backupPath = `${filePath}.corrupted.${Date.now()}`;
          fs.copyFileSync(filePath, backupPath);
          logger.info("Database", `Backed up corrupted database to ${backupPath}`);
        } catch {
        }
        dbInstance = new SQL.Database();
      }
    } else {
      logger.info("Database", "Initializing new SQLite database at default path");
      dbInstance = new SQL.Database();
    }
    runMigrations(dbInstance);
    return dbInstance;
  })();
  return dbInitPromise;
}
async function getDatabaseHealth() {
  const filePath = getDatabaseFilePath();
  let sizeBytes = 0;
  try {
    if (fs.existsSync(filePath)) {
      sizeBytes = fs.statSync(filePath).size;
    }
  } catch {
  }
  try {
    const db = await getDatabase();
    let version = 1;
    let noteCount = 0;
    let taskCount = 0;
    const vStmt = db.prepare("SELECT MAX(version) as v FROM schema_migrations");
    if (vStmt.step()) {
      const row = vStmt.getAsObject();
      if (typeof row.v === "number") version = row.v;
    }
    vStmt.free();
    const nCountStmt = db.prepare("SELECT COUNT(*) as c FROM notes");
    if (nCountStmt.step()) {
      const row = nCountStmt.getAsObject();
      if (typeof row.c === "number") noteCount = row.c;
    }
    nCountStmt.free();
    const tCountStmt = db.prepare("SELECT COUNT(*) as c FROM tasks");
    if (tCountStmt.step()) {
      const row = tCountStmt.getAsObject();
      if (typeof row.c === "number") taskCount = row.c;
    }
    tCountStmt.free();
    return {
      status: "healthy",
      version,
      sizeBytes,
      noteCount,
      taskCount
    };
  } catch (err) {
    logger.error("Database", "Health check failed", err);
    return {
      status: "corrupted",
      version: 0,
      sizeBytes,
      noteCount: 0,
      taskCount: 0
    };
  }
}
async function getAllNotes(searchQuery) {
  const db = await getDatabase();
  const q = (searchQuery || "").trim().toLowerCase();
  let sql = "SELECT * FROM notes";
  const params = [];
  if (q) {
    sql += " WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ?";
    params.push(`%${q}%`, `%${q}%`);
  }
  sql += " ORDER BY is_pinned DESC, updated_at DESC";
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const notes = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    notes.push({
      id: String(row.id),
      title: String(row.title),
      content: String(row.content || ""),
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      isPinned: Boolean(row.is_pinned)
    });
  }
  stmt.free();
  return notes;
}
async function getNoteById(id) {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM notes WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return {
      id: String(row.id),
      title: String(row.title),
      content: String(row.content || ""),
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      isPinned: Boolean(row.is_pinned)
    };
  }
  stmt.free();
  return null;
}
async function createNote(input) {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const title = (input.title || "Untitled Note").trim().slice(0, 200) || "Untitled Note";
  const content = (input.content || "").slice(0, 1e5);
  const isPinned = Boolean(input.isPinned) ? 1 : 0;
  const now = Date.now();
  db.run(
    "INSERT INTO notes (id, title, content, created_at, updated_at, is_pinned) VALUES (?, ?, ?, ?, ?, ?)",
    [id, title, content, now, now, isPinned]
  );
  persistDatabase();
  return {
    id,
    title,
    content,
    createdAt: now,
    updatedAt: now,
    isPinned: Boolean(isPinned)
  };
}
async function updateNote(input) {
  const db = await getDatabase();
  const existing = await getNoteById(input.id);
  if (!existing) {
    throw new Error(`Note with id "${input.id}" not found`);
  }
  const title = input.title !== void 0 ? input.title.trim().slice(0, 200) : existing.title;
  const content = input.content !== void 0 ? input.content.slice(0, 1e5) : existing.content;
  const isPinned = input.isPinned !== void 0 ? input.isPinned ? 1 : 0 : existing.isPinned ? 1 : 0;
  const now = Date.now();
  db.run(
    "UPDATE notes SET title = ?, content = ?, is_pinned = ?, updated_at = ? WHERE id = ?",
    [title, content, isPinned, now, input.id]
  );
  persistDatabase();
  return {
    id: input.id,
    title,
    content,
    createdAt: existing.createdAt,
    updatedAt: now,
    isPinned: Boolean(isPinned)
  };
}
async function deleteNote(id) {
  const db = await getDatabase();
  db.run("DELETE FROM notes WHERE id = ?", [id]);
  persistDatabase();
  return true;
}
async function togglePinNote(id) {
  const existing = await getNoteById(id);
  if (!existing) {
    throw new Error(`Note with id "${id}" not found`);
  }
  return updateNote({ id, isPinned: !existing.isPinned });
}
async function getAllTasks(filter) {
  const db = await getDatabase();
  let sql = "SELECT * FROM tasks";
  const conditions = [];
  const params = [];
  const now = Date.now();
  (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
  const endOfDay = (/* @__PURE__ */ new Date()).setHours(23, 59, 59, 999);
  if (filter?.status && filter.status !== "all") {
    conditions.push("status = ?");
    params.push(filter.status);
  }
  if (filter?.priority && filter.priority !== "all") {
    conditions.push("priority = ?");
    params.push(filter.priority);
  }
  if (filter?.view === "completed") {
    conditions.push("status = 'completed'");
  } else if (filter?.view === "today") {
    conditions.push("status != 'completed' AND due_date IS NOT NULL AND due_date <= ?");
    params.push(endOfDay);
  } else if (filter?.view === "upcoming") {
    conditions.push("status != 'completed' AND due_date IS NOT NULL AND due_date > ?");
    params.push(endOfDay);
  }
  if (filter?.search) {
    const s = filter.search.trim().toLowerCase();
    if (s) {
      conditions.push("(LOWER(title) LIKE ? OR LOWER(description) LIKE ?)");
      params.push(`%${s}%`, `%${s}%`);
    }
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += `
    ORDER BY 
      CASE WHEN status = 'completed' THEN 1 ELSE 0 END ASC,
      CASE WHEN due_date IS NOT NULL AND due_date < ${now} AND status != 'completed' THEN 0 ELSE 1 END ASC,
      CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END ASC,
      CASE WHEN due_date IS NULL THEN 1 ELSE 0 END ASC,
      due_date ASC,
      updated_at DESC
  `;
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const tasks = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    tasks.push({
      id: String(row.id),
      title: String(row.title),
      description: String(row.description || ""),
      status: row.status,
      priority: row.priority,
      dueDate: typeof row.due_date === "number" ? row.due_date : void 0,
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      completedAt: typeof row.completed_at === "number" ? row.completed_at : void 0
    });
  }
  stmt.free();
  return tasks;
}
async function getTaskById(id) {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM tasks WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return {
      id: String(row.id),
      title: String(row.title),
      description: String(row.description || ""),
      status: row.status,
      priority: row.priority,
      dueDate: typeof row.due_date === "number" ? row.due_date : void 0,
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      completedAt: typeof row.completed_at === "number" ? row.completed_at : void 0
    };
  }
  stmt.free();
  return null;
}
async function createTask(input) {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const title = (input.title || "New Task").trim().slice(0, 200) || "New Task";
  const description = (input.description || "").slice(0, 1e4);
  const validStatuses = ["pending", "in_progress", "completed"];
  const status = validStatuses.includes(input.status) ? input.status : "pending";
  const validPriorities = ["low", "medium", "high"];
  const priority = validPriorities.includes(input.priority) ? input.priority : "medium";
  const dueDate = typeof input.dueDate === "number" && !isNaN(input.dueDate) && input.dueDate > 0 ? input.dueDate : null;
  const now = Date.now();
  const completedAt = status === "completed" ? now : null;
  db.run(
    `INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, description, status, priority, dueDate, now, now, completedAt]
  );
  persistDatabase();
  return {
    id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate || void 0,
    createdAt: now,
    updatedAt: now,
    completedAt: completedAt || void 0
  };
}
async function updateTask(input) {
  const db = await getDatabase();
  const existing = await getTaskById(input.id);
  if (!existing) {
    throw new Error(`Task with id "${input.id}" not found`);
  }
  const title = input.title !== void 0 ? input.title.trim().slice(0, 200) : existing.title;
  const description = input.description !== void 0 ? input.description.slice(0, 1e4) : existing.description;
  const validStatuses = ["pending", "in_progress", "completed"];
  const status = input.status && validStatuses.includes(input.status) ? input.status : existing.status;
  const validPriorities = ["low", "medium", "high"];
  const priority = input.priority && validPriorities.includes(input.priority) ? input.priority : existing.priority;
  let dueDate = existing.dueDate || null;
  if (input.dueDate !== void 0) {
    dueDate = typeof input.dueDate === "number" && input.dueDate > 0 ? input.dueDate : null;
  }
  let completedAt = existing.completedAt || null;
  if (status === "completed" && existing.status !== "completed") {
    completedAt = Date.now();
  } else if (status !== "completed") {
    completedAt = null;
  }
  const now = Date.now();
  db.run(
    `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = ?, completed_at = ?
     WHERE id = ?`,
    [title, description, status, priority, dueDate, now, completedAt, input.id]
  );
  persistDatabase();
  return {
    id: input.id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate || void 0,
    createdAt: existing.createdAt,
    updatedAt: now,
    completedAt: completedAt || void 0
  };
}
async function deleteTask(id) {
  const db = await getDatabase();
  db.run("DELETE FROM tasks WHERE id = ?", [id]);
  persistDatabase();
  return true;
}
async function toggleCompleteTask(id) {
  const existing = await getTaskById(id);
  if (!existing) {
    throw new Error(`Task with id "${id}" not found`);
  }
  const nextStatus = existing.status === "completed" ? "pending" : "completed";
  return updateTask({ id, status: nextStatus });
}
async function getProductivitySummary() {
  await getDatabase();
  const notes = await getAllNotes();
  const allTasks = await getAllTasks();
  const now = /* @__PURE__ */ new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  const pendingTasks = allTasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = allTasks.filter((t) => t.status === "in_progress").length;
  const completedTasks = allTasks.filter((t) => t.status === "completed").length;
  const overdueTasks = allTasks.filter(
    (t) => t.status !== "completed" && t.dueDate && t.dueDate < startOfToday
  ).length;
  const todayTasks = allTasks.filter(
    (t) => t.status !== "completed" && t.dueDate && t.dueDate >= startOfToday && t.dueDate <= endOfDay
  );
  const upcomingTasks = allTasks.filter(
    (t) => t.status !== "completed" && t.dueDate && t.dueDate > endOfDay
  );
  return {
    totalNotes: notes.length,
    recentNotes: notes.slice(0, 3),
    pendingTasks,
    inProgressTasks,
    completedTasks,
    tasksDueToday: todayTasks.length,
    overdueTasks,
    upcomingTasks: upcomingTasks.slice(0, 5),
    todayTasks: todayTasks.slice(0, 5)
  };
}
const REGISTERED_CHANNELS = [];
function unregisterIpcHandlers() {
  for (const channel of REGISTERED_CHANNELS) {
    try {
      electron.ipcMain.removeHandler(channel);
    } catch {
    }
  }
  REGISTERED_CHANNELS.length = 0;
}
function registerIpcHandlers(getMainWindow) {
  function registerHandle(channel, rawHandler) {
    electron.ipcMain.removeHandler(channel);
    const handler = (event, ...args) => {
      const win = getMainWindow();
      if (win && !win.isDestroyed() && event && event.sender && event.sender !== win.webContents) {
        logger.warn("Security", `Blocked unauthorized IPC call on channel "${channel}" from unauthorized webContents`);
        throw new Error("Unauthorized IPC sender");
      }
      return rawHandler(event, ...args);
    };
    electron.ipcMain.handle(channel, handler);
    if (!REGISTERED_CHANNELS.includes(channel)) {
      REGISTERED_CHANNELS.push(channel);
    }
  }
  registerHandle(IPC_CHANNELS.APP_GET_VERSION, () => {
    return electron.app.getVersion();
  });
  registerHandle(IPC_CHANNELS.APP_GET_PLATFORM, () => {
    return process.platform;
  });
  registerHandle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
    const window = getMainWindow();
    if (window && !window.isDestroyed()) {
      const current = loadSettings();
      if (current.general.minimizeToTray) {
        window.hide();
      } else {
        window.minimize();
      }
    }
  });
  registerHandle(IPC_CHANNELS.WINDOW_CLOSE, () => {
    const window = getMainWindow();
    if (window && !window.isDestroyed()) {
      window.close();
    }
  });
  registerHandle(IPC_CHANNELS.WINDOW_SET_FULLSCREEN, (_event, fullscreen) => {
    const window = getMainWindow();
    if (window && !window.isDestroyed()) {
      window.setFullScreen(Boolean(fullscreen));
    }
  });
  registerHandle(IPC_CHANNELS.WINDOW_IS_FULLSCREEN, () => {
    const window = getMainWindow();
    return window && !window.isDestroyed() ? window.isFullScreen() : false;
  });
  registerHandle(IPC_CHANNELS.SHELL_OPEN_EXTERNAL, async (_event, url2) => {
    if (typeof url2 !== "string") {
      throw new Error("Invalid URL parameter: must be a string");
    }
    try {
      const parsed = new URL(url2);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error(`Forbidden protocol: ${parsed.protocol}. Only http and https are permitted.`);
      }
      await electron.shell.openExternal(url2);
    } catch (err) {
      console.error("[BEACON IPC] Failed to open external URL:", err);
      throw err;
    }
  });
  registerHandle(IPC_CHANNELS.THEME_GET, () => {
    return loadSettings().appearance.theme;
  });
  registerHandle(IPC_CHANNELS.THEME_SET, (_event, theme) => {
    if (theme !== "system" && theme !== "light" && theme !== "dark") {
      throw new Error('Invalid theme: must be "system", "light", or "dark"');
    }
    electron.nativeTheme.themeSource = theme;
    updateSettings({ appearance: { theme } });
  });
  registerHandle(IPC_CHANNELS.WATCHES_GET, () => {
    return watchesStore.getAllWatches();
  });
  registerHandle(IPC_CHANNELS.BROWSER_STATUS_GET, () => {
    return getBrowserIntegrationStatus();
  });
  registerHandle(IPC_CHANNELS.BROWSER_RECONNECT, async () => {
    return retryBrowserConnection();
  });
  registerHandle(IPC_CHANNELS.AMBIENT_GET_SETTINGS, () => {
    return loadAmbientSettings();
  });
  registerHandle(IPC_CHANNELS.AMBIENT_SET_SETTINGS, (_event, settings) => {
    if (!settings || typeof settings !== "object") {
      throw new Error("Invalid settings payload");
    }
    logger.info("Settings", `[Diagnostic:IPC] AMBIENT_SET_SETTINGS payload: ${JSON.stringify(settings)}`);
    const updated = updateAmbientSettings(settings);
    logger.info("Settings", `[Diagnostic:IPC] AMBIENT_SET_SETTINGS persisted. New location: "${updated.weatherLocation}"`);
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, loadSettings());
    }
    return updated;
  });
  registerHandle(IPC_CHANNELS.AMBIENT_SELECT_WALLPAPER_DIR, async () => {
    return openWallpaperDirectoryDialog(getMainWindow());
  });
  registerHandle(IPC_CHANNELS.AMBIENT_GET_WALLPAPERS, () => {
    return getActiveWallpapers();
  });
  registerHandle(IPC_CHANNELS.WEATHER_GET, async (_event, locArg) => {
    const settings = loadAmbientSettings();
    const targetLoc = typeof locArg === "string" && locArg.trim() ? locArg.trim() : settings.weatherLocation;
    logger.info("IPC", `[Diagnostic:IPC] WEATHER_GET called. Raw arg: "${locArg}", Saved location: "${settings.weatherLocation}", Effective target: "${targetLoc}"`);
    try {
      const data = await defaultWeatherProvider.getWeather(targetLoc);
      logger.info("IPC", `[Diagnostic:IPC] WEATHER_GET completed. Result: ${data ? `Success (${data.location}, ${data.temperatureCelsius}°C / ${data.temperatureFahrenheit}°F, ${data.condition})` : "null"}`);
      return data;
    } catch (err) {
      logger.error("IPC", `[Diagnostic:IPC] WEATHER_GET error: ${err?.message}`, err?.stack);
      return null;
    }
  });
  registerHandle(IPC_CHANNELS.ONBOARDING_GET, () => {
    return isOnboardingCompleted();
  });
  registerHandle(IPC_CHANNELS.ONBOARDING_SET, (_event, completed) => {
    setOnboardingCompleted(Boolean(completed));
  });
  registerHandle(IPC_CHANNELS.SETTINGS_GET, () => {
    return loadSettings();
  });
  registerHandle(IPC_CHANNELS.SETTINGS_UPDATE, (_event, partial) => {
    if (!partial || typeof partial !== "object") {
      throw new Error("Invalid settings payload: must be an object");
    }
    logger.info("Settings", `[Diagnostic:IPC] SETTINGS_UPDATE payload: ${JSON.stringify(partial)}`);
    const updated = updateSettings(partial);
    logger.info("Settings", `[Diagnostic:IPC] SETTINGS_UPDATE persisted. Location: "${updated.ambient.weatherLocation}"`);
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, updated);
    }
    return updated;
  });
  registerHandle(IPC_CHANNELS.SETTINGS_RESET, (_event, options) => {
    const opts = options && typeof options === "object" ? options : void 0;
    const reset = resetSettings(opts);
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.SETTINGS_CHANGED, reset);
    }
    return reset;
  });
  registerHandle(IPC_CHANNELS.NOTES_GET_ALL, async (_event, queryArg) => {
    const q = typeof queryArg === "string" ? queryArg : void 0;
    return getAllNotes(q);
  });
  registerHandle(IPC_CHANNELS.NOTES_GET_BY_ID, async (_event, idArg) => {
    if (typeof idArg !== "string" || !idArg.trim()) {
      throw new Error("Invalid note ID");
    }
    return getNoteById(idArg.trim());
  });
  registerHandle(IPC_CHANNELS.NOTES_CREATE, async (_event, inputArg) => {
    if (!inputArg || typeof inputArg !== "object") {
      throw new Error("Invalid note input payload");
    }
    const input = inputArg;
    return createNote(input);
  });
  registerHandle(IPC_CHANNELS.NOTES_UPDATE, async (_event, inputArg) => {
    if (!inputArg || typeof inputArg !== "object") {
      throw new Error("Invalid note update payload");
    }
    const input = inputArg;
    if (!input.id || typeof input.id !== "string") {
      throw new Error("Note ID is required for update");
    }
    return updateNote(input);
  });
  registerHandle(IPC_CHANNELS.NOTES_DELETE, async (_event, idArg) => {
    if (typeof idArg !== "string" || !idArg.trim()) {
      throw new Error("Invalid note ID");
    }
    return deleteNote(idArg.trim());
  });
  registerHandle(IPC_CHANNELS.NOTES_TOGGLE_PIN, async (_event, idArg) => {
    if (typeof idArg !== "string" || !idArg.trim()) {
      throw new Error("Invalid note ID");
    }
    return togglePinNote(idArg.trim());
  });
  registerHandle(IPC_CHANNELS.TASKS_GET_ALL, async (_event, filterArg) => {
    const filter = filterArg && typeof filterArg === "object" ? filterArg : void 0;
    return getAllTasks(filter);
  });
  registerHandle(IPC_CHANNELS.TASKS_GET_BY_ID, async (_event, idArg) => {
    if (typeof idArg !== "string" || !idArg.trim()) {
      throw new Error("Invalid task ID");
    }
    return getTaskById(idArg.trim());
  });
  registerHandle(IPC_CHANNELS.TASKS_CREATE, async (_event, inputArg) => {
    if (!inputArg || typeof inputArg !== "object") {
      throw new Error("Invalid task input payload");
    }
    const input = inputArg;
    const res = await createTask(input);
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED);
    return res;
  });
  registerHandle(IPC_CHANNELS.TASKS_UPDATE, async (_event, inputArg) => {
    if (!inputArg || typeof inputArg !== "object") {
      throw new Error("Invalid task update payload");
    }
    const input = inputArg;
    if (!input.id || typeof input.id !== "string") {
      throw new Error("Task ID is required for update");
    }
    const res = await updateTask(input);
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED);
    return res;
  });
  registerHandle(IPC_CHANNELS.TASKS_DELETE, async (_event, idArg) => {
    if (typeof idArg !== "string" || !idArg.trim()) {
      throw new Error("Invalid task ID");
    }
    const res = await deleteTask(idArg.trim());
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED);
    return res;
  });
  registerHandle(IPC_CHANNELS.TASKS_TOGGLE_COMPLETE, async (_event, idArg) => {
    if (typeof idArg !== "string" || !idArg.trim()) {
      throw new Error("Invalid task ID");
    }
    const res = await toggleCompleteTask(idArg.trim());
    getMainWindow()?.webContents.send(IPC_CHANNELS.TASKS_CHANGED);
    return res;
  });
  registerHandle(IPC_CHANNELS.PRODUCTIVITY_SUMMARY_GET, async () => {
    return getProductivitySummary();
  });
  async function computeSystemHealthSummary() {
    const dbHealth = await getDatabaseHealth();
    const settingsHealth = getSettingsHealth();
    const extStatus = getBrowserIntegrationStatus();
    const mem = process.memoryUsage();
    return {
      appVersion: electron.app.getVersion(),
      electronVersion: process.versions.electron || "unknown",
      chromeVersion: process.versions.chrome || "unknown",
      nodeVersion: process.versions.node || "unknown",
      platform: process.platform,
      arch: process.arch,
      memoryUsageMb: Math.round(mem.heapUsed / 1024 / 1024 * 10) / 10,
      databaseHealth: dbHealth,
      settingsHealth,
      extensionHealth: {
        state: extStatus.state,
        browserType: extStatus.browserType,
        manifestInstalled: extStatus.manifestInstalled,
        pipeAvailable: extStatus.pipeAvailable,
        lastSyncTime: extStatus.lastSyncTime,
        errorReason: extStatus.errorReason
      }
    };
  }
  registerHandle(IPC_CHANNELS.DIAGNOSTICS_GET_HEALTH, async () => {
    return computeSystemHealthSummary();
  });
  registerHandle(IPC_CHANNELS.DIAGNOSTICS_GET_LOGS, (_event, limitArg) => {
    const limit = typeof limitArg === "number" && limitArg > 0 ? limitArg : 50;
    return logger.getRecentLogs(limit);
  });
  registerHandle(IPC_CHANNELS.DIAGNOSTICS_EXPORT, async () => {
    const summary = await computeSystemHealthSummary();
    const result = logger.exportDiagnosticsBundle(summary);
    return {
      success: result.success,
      filePath: result.filePath,
      error: result.error
    };
  });
  registerHandle(IPC_CHANNELS.DIAGNOSTICS_CLEAR_LOGS, () => {
    const success = logger.clearLogs();
    logger.info("Diagnostics", "Diagnostic logs cleared by user request");
    return success;
  });
  registerHandle(IPC_CHANNELS.DIAGNOSTICS_OPEN_LOGS_DIR, async () => {
    await logger.openLogsFolder();
  });
  registerHandle(IPC_CHANNELS.SCREENSAVER_IS_ACTIVE, () => {
    return isScreensaverActive();
  });
  registerHandle(IPC_CHANNELS.SCREENSAVER_EXIT, () => {
    exitScreensaverMode();
  });
  registerHandle(IPC_CHANNELS.SCREENSAVER_READY, () => {
    notifyScreensaverReady();
  });
  registerHandle(IPC_CHANNELS.SCREENSAVER_GET_STATUS, () => {
    return getWindowsScreensaverStatus();
  });
  registerHandle(IPC_CHANNELS.SCREENSAVER_SET_ACTIVE, (_event, activeArg) => {
    const active = typeof activeArg === "boolean" ? activeArg : true;
    const success = setWindowsScreensaverActive(active);
    const current = loadSettings();
    updateSettings({
      screensaver: {
        ...current.screensaver,
        enabled: active
      }
    });
    return success;
  });
  registerHandle(IPC_CHANNELS.SCREENSAVER_OPEN_SETTINGS, () => {
    openWindowsScreensaverDialog();
  });
  registerHandle(IPC_CHANNELS.SCREENSAVER_START_PREVIEW, () => {
    enterScreensaverMode();
  });
}
let tray = null;
let currentWatches = [];
let currentStatus = null;
let mainWindowGetter = null;
let quitHandler = null;
function restoreAndFocus(window) {
  if (!window || window.isDestroyed()) return;
  if (window.isMinimized()) window.restore();
  if (!window.isVisible()) window.show();
  window.focus();
}
function rebuildTrayMenu() {
  if (!tray || !mainWindowGetter || !quitHandler) return;
  mainWindowGetter();
  const activeWatches = currentWatches.filter((w) => w.state !== "done");
  const attentionWatches = currentWatches.filter((w) => w.state === "attention");
  const extStatus = currentStatus?.state === "connected" ? ` • Extension: ${currentStatus.browserType && currentStatus.browserType !== "unknown" ? currentStatus.browserType : "Connected"}` : "";
  if (attentionWatches.length > 0) {
    tray.setToolTip(`BEACON • ${attentionWatches.length} item${attentionWatches.length === 1 ? "" : "s"} need attention${extStatus}`);
  } else if (activeWatches.length > 0) {
    tray.setToolTip(`BEACON • ${activeWatches.length} active watch${activeWatches.length === 1 ? "" : "es"}${extStatus}`);
  } else {
    tray.setToolTip(`BEACON • Ambient Productivity${extStatus}`);
  }
  const menuItems = [
    {
      label: "Open BEACON",
      click: () => {
        restoreAndFocus(mainWindowGetter ? mainWindowGetter() : null);
      }
    },
    {
      label: "Ambient Screen Board",
      click: () => {
        const win = mainWindowGetter ? mainWindowGetter() : null;
        restoreAndFocus(win);
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, "ambient");
        }
      }
    },
    {
      label: "Notes",
      click: () => {
        const win = mainWindowGetter ? mainWindowGetter() : null;
        restoreAndFocus(win);
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, "notes");
        }
      }
    },
    {
      label: "Tasks",
      click: () => {
        const win = mainWindowGetter ? mainWindowGetter() : null;
        restoreAndFocus(win);
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, "tasks");
        }
      }
    },
    { type: "separator" },
    {
      label: "+ New Note",
      click: () => {
        const win = mainWindowGetter ? mainWindowGetter() : null;
        restoreAndFocus(win);
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, "notes");
          win.webContents.send(IPC_CHANNELS.NAVIGATE_ACTION, "new-note");
        }
      }
    },
    {
      label: "+ New Task",
      click: () => {
        const win = mainWindowGetter ? mainWindowGetter() : null;
        restoreAndFocus(win);
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, "tasks");
          win.webContents.send(IPC_CHANNELS.NAVIGATE_ACTION, "new-task");
        }
      }
    }
  ];
  const highlightWatches = attentionWatches.length > 0 ? attentionWatches : activeWatches;
  if (highlightWatches.length > 0) {
    menuItems.push({ type: "separator" });
    const topWatches = highlightWatches.slice(0, 3);
    for (const w of topWatches) {
      const statePrefix = w.state === "attention" ? "⚠️ " : "● ";
      const label = `${statePrefix}${w.name.slice(0, 28)}: ${w.text.slice(0, 24)}`;
      menuItems.push({
        label,
        click: () => {
          if (w.url && (w.url.startsWith("http://") || w.url.startsWith("https://"))) {
            electron.shell.openExternal(w.url).catch(console.error);
          } else {
            restoreAndFocus(mainWindowGetter ? mainWindowGetter() : null);
          }
        }
      });
    }
  }
  const statusLabel = currentStatus?.state === "connected" ? `● Extension Connected (${currentStatus.browserType || "Chromium"})` : currentStatus?.state === "connecting" ? "◌ Extension Connecting..." : currentStatus?.state === "error" ? "▲ Extension Connection Error" : "○ Extension Disconnected";
  menuItems.push(
    { type: "separator" },
    {
      label: statusLabel,
      enabled: false
    },
    {
      label: "Settings",
      click: () => {
        const win = mainWindowGetter ? mainWindowGetter() : null;
        restoreAndFocus(win);
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, "settings");
        }
      }
    },
    { type: "separator" },
    {
      label: "Quit BEACON",
      click: () => {
        if (quitHandler) quitHandler();
      }
    }
  );
  const contextMenu = electron.Menu.buildFromTemplate(menuItems);
  tray.setContextMenu(contextMenu);
}
function updateTrayWatches(watches) {
  currentWatches = watches;
  rebuildTrayMenu();
}
function updateTrayStatus(status) {
  currentStatus = status;
  rebuildTrayMenu();
}
function createSystemTray(getMainWindow, onQuit) {
  if (tray) {
    tray.destroy();
    tray = null;
  }
  mainWindowGetter = getMainWindow;
  quitHandler = onQuit;
  const trayCandidates = [];
  if (process.resourcesPath) {
    trayCandidates.push(
      path.join(process.resourcesPath, "resources", "icon-tray.png"),
      path.join(process.resourcesPath, "icon-tray.png"),
      path.join(process.resourcesPath, "resources", "icon.png"),
      path.join(process.resourcesPath, "icon.png")
    );
  }
  trayCandidates.push(
    path.join(__dirname, "../../resources/icon-tray.png"),
    path.join(__dirname, "../../resources/icon.png")
  );
  let icon = electron.nativeImage.createEmpty();
  for (const p of trayCandidates) {
    if (fs.existsSync(p)) {
      const candidate = electron.nativeImage.createFromPath(p);
      if (!candidate.isEmpty()) {
        icon = candidate;
        break;
      }
    }
  }
  if (icon.isEmpty()) {
    console.warn("[BEACON Tray] Primary tray icon not found. Using fallback icon.");
  }
  tray = new electron.Tray(icon);
  rebuildTrayMenu();
  tray.on("click", () => {
    const window = getMainWindow();
    if (!window || window.isDestroyed()) return;
    if (window.isVisible() && !window.isMinimized() && window.isFocused()) {
      window.hide();
    } else {
      restoreAndFocus(window);
    }
  });
  return tray;
}
function destroySystemTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
const EXTENSION_ID = "popaljneofbfhillkaogepicefmnmdll";
const BEACON_HOST_NAME = "com.jonathanvineet.beacon";
const HELM_HOST_NAME = "com.jonathanvineet.helm";
function findNativeHostBinary() {
  const appDataBeacon = watchesStore.getBeaconDataDirectory();
  const appDataBin = path.join(appDataBeacon, "bin");
  const legacyBin = path.join(watchesStore.getHelmDataDirectory(), "bin");
  const candidates = [];
  const installDir = path.dirname(process.execPath);
  candidates.push(path.join(installDir, "beacon-native-host.exe"));
  candidates.push(path.join(installDir, "beacon-native-host.bat"));
  candidates.push(path.join(installDir, "helm-native-host.exe"));
  candidates.push(path.join(installDir, "helm-native-host.bat"));
  candidates.push(path.join(installDir, "resources", "beacon-native-host.exe"));
  candidates.push(path.join(installDir, "resources", "helm-native-host.exe"));
  candidates.push(path.join(appDataBin, "beacon-native-host.exe"));
  candidates.push(path.join(appDataBin, "beacon-native-host.bat"));
  candidates.push(path.join(legacyBin, "helm-native-host.exe"));
  candidates.push(path.join(legacyBin, "helm-native-host.bat"));
  candidates.push(path.join(__dirname, "beacon-native-host.exe"));
  candidates.push(path.join(__dirname, "beacon-native-host.bat"));
  candidates.push(path.join(__dirname, "helm-native-host.exe"));
  candidates.push(path.join(__dirname, "helm-native-host.bat"));
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  return null;
}
function ensureNativeMessagingHostRegistered() {
  try {
    const hostPath = findNativeHostBinary();
    if (!hostPath) {
      return { ok: false, error: "helm-native-host binary not found" };
    }
    const appDataBeacon = watchesStore.getBeaconDataDirectory();
    const hostsToRegister = [
      { name: BEACON_HOST_NAME, desc: "BEACON: shows watched pages on the board" },
      { name: HELM_HOST_NAME, desc: "Helm: shows watched pages on the board" }
    ];
    let primaryManifestPath = "";
    for (const hostInfo of hostsToRegister) {
      const manifestPath = path.join(appDataBeacon, `${hostInfo.name}.json`);
      if (!primaryManifestPath) primaryManifestPath = manifestPath;
      const manifestContent = {
        name: hostInfo.name,
        description: hostInfo.desc,
        path: hostPath,
        type: "stdio",
        allowed_origins: [`chrome-extension://${EXTENSION_ID}/`]
      };
      let needsWrite = true;
      try {
        if (fs.existsSync(manifestPath)) {
          const existing = fs.readFileSync(manifestPath, "utf-8");
          if (JSON.stringify(JSON.parse(existing)) === JSON.stringify(manifestContent)) {
            needsWrite = false;
          }
        }
      } catch {
      }
      if (needsWrite) {
        fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2), "utf-8");
      }
      const browserKeys = [
        `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${hostInfo.name}`,
        `HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\${hostInfo.name}`,
        `HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\${hostInfo.name}`
      ];
      for (const key of browserKeys) {
        child_process.execFile("reg.exe", ["add", key, "/ve", "/t", "REG_SZ", "/d", manifestPath, "/f"], {
          windowsHide: true,
          timeout: 2e3
        }, (err) => {
          if (err) {
            console.warn(`[BEACON NativeHost] Non-fatal: Failed to register key ${key}:`, err);
          }
        });
      }
    }
    console.log(`[BEACON NativeHost] Dual registration verified: ${primaryManifestPath} -> ${hostPath}`);
    return { ok: true, manifestPath: primaryManifestPath, hostPath };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[BEACON NativeHost] Registration error:", message);
    return { ok: false, error: message };
  }
}
electron.protocol.registerSchemesAsPrivileged([
  {
    scheme: "beacon-wallpaper",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      bypassCSP: false
    }
  },
  {
    scheme: "helm-wallpaper",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      bypassCSP: false
    }
  }
]);
const gotTheLock = electron.app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log("[BEACON Main] Another instance is already running. Quitting.");
  electron.app.quit();
  process.exit(0);
}
if (process.platform === "win32") {
  electron.app.setAppUserModelId("com.jonathanvineet.beacon");
}
let mainWindow = null;
let isQuitting = false;
function getAppIcon() {
  const candidates = [];
  if (process.resourcesPath) {
    candidates.push(
      path.join(process.resourcesPath, "resources", "icon.ico"),
      path.join(process.resourcesPath, "icon.ico"),
      path.join(process.resourcesPath, "resources", "icon.png"),
      path.join(process.resourcesPath, "icon.png")
    );
  }
  candidates.push(
    path.join(__dirname, "../../resources/icon.ico"),
    path.join(__dirname, "../../resources/icon.png")
  );
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const img = electron.nativeImage.createFromPath(candidate);
      if (!img.isEmpty()) {
        return img;
      }
    }
  }
  console.warn("[BEACON Main] Primary window icon not found in candidate paths");
  return electron.nativeImage.createEmpty();
}
function createWindow() {
  const appIcon = getAppIcon();
  const settings = loadSettings();
  const isHiddenLaunch = process.argv.includes("--hidden") || process.argv.includes("-hidden");
  const isScreensaverLaunch = process.argv.includes("--screensaver") || process.argv.includes("-screensaver");
  const isScreensaverConfigLaunch = process.argv.includes("--screensaver-config") || process.argv.includes("-screensaver-config");
  const isFromInstaller = process.argv.includes("--from-installer") || process.argv.includes("--updated");
  const shouldStartMinimized = !isFromInstaller && (settings.general.startMinimized || isHiddenLaunch);
  let winBounds = { width: 1100, height: 750, x: void 0, y: void 0 };
  if (isScreensaverLaunch) {
    try {
      const activeDisplay = electron.screen.getDisplayNearestPoint(electron.screen.getCursorScreenPoint()) || electron.screen.getPrimaryDisplay();
      if (activeDisplay && activeDisplay.bounds) {
        winBounds = {
          x: activeDisplay.bounds.x,
          y: activeDisplay.bounds.y,
          width: activeDisplay.bounds.width,
          height: activeDisplay.bounds.height
        };
      }
    } catch (err) {
      console.warn("[BEACON Main] Failed to query display bounds for screensaver window:", err);
    }
  }
  mainWindow = new electron.BrowserWindow({
    x: winBounds.x,
    y: winBounds.y,
    width: winBounds.width,
    height: winBounds.height,
    minWidth: isScreensaverLaunch ? void 0 : 900,
    minHeight: isScreensaverLaunch ? void 0 : 600,
    title: "BEACON",
    icon: appIcon,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#080811",
    fullscreen: isScreensaverLaunch,
    opacity: isScreensaverLaunch ? 0 : 1,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow.once("ready-to-show", () => {
    if (isScreensaverLaunch) {
      logger.info("Main", "BEACON launched in screensaver mode");
      enterScreensaverMode();
    } else if (isScreensaverConfigLaunch) {
      logger.info("Main", "BEACON launched in screensaver config mode");
      mainWindow?.show();
      mainWindow?.webContents.send(IPC_CHANNELS.NAVIGATE, "settings");
    } else if (!shouldStartMinimized) {
      mainWindow?.show();
      if (isFromInstaller) {
        mainWindow?.focus();
        logger.info("Main", "BEACON launched from installer: window displayed and focused");
      }
    } else {
      logger.info("Main", "BEACON launched in minimized/tray mode");
    }
  });
  mainWindow.on("minimize", () => {
    if (isScreensaverActive()) {
      logger.info("Main", "Ignored minimize event while screensaver is active");
      return;
    }
    const current = loadSettings();
    if (current.general.minimizeToTray) {
      mainWindow?.hide();
      logger.info("Main", "Window minimized to system tray");
    }
  });
  mainWindow.on("close", (event) => {
    if (isQuitting) return;
    const current = loadSettings();
    if (current.general.closeBehavior === "quit") {
      isQuitting = true;
      destroySystemTray();
      stopPipeServer();
      unregisterIpcHandlers();
      electron.app.quit();
    } else {
      event.preventDefault();
      mainWindow?.hide();
      logger.info("Main", "Window hidden to system tray on close");
    }
  });
  mainWindow.on("enter-full-screen", () => {
    mainWindow?.webContents.send(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, true);
  });
  mainWindow.on("leave-full-screen", () => {
    mainWindow?.webContents.send(IPC_CHANNELS.WINDOW_FULLSCREEN_CHANGE, false);
  });
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    logger.error("Renderer", `Renderer process terminated unexpectedly (${details.reason}, code: ${details.exitCode})`);
    if (isScreensaverActive()) {
      logScreensaverEvent(`Renderer terminated during screensaver (${details.reason}); immediately exiting screensaver mode`);
      exitScreensaverMode();
    }
    if (details.reason !== "clean-exit" && !isQuitting) {
      logger.info("Renderer", "Initiating automatic renderer window recovery...");
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed() && !isQuitting) {
          if (process.env["ELECTRON_RENDERER_URL"]) {
            mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
          } else {
            mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
          }
        }
      }, 500);
    }
  });
  mainWindow.webContents.on("unresponsive", () => {
    logger.warn("Renderer", "Main browser window has become unresponsive");
    if (isScreensaverActive()) {
      logScreensaverEvent("Renderer unresponsive while screensaver active; immediately exiting screensaver mode");
      exitScreensaverMode();
    }
  });
  mainWindow.webContents.on("will-navigate", (event, url2) => {
    const isDevUrl = process.env["ELECTRON_RENDERER_URL"] && url2.startsWith(process.env["ELECTRON_RENDERER_URL"]);
    if (!isDevUrl && !url2.startsWith("file://")) {
      event.preventDefault();
      console.warn("[BEACON Security] Blocked unexpected window navigation to:", url2);
    }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https://") || url2.startsWith("http://")) {
      electron.shell.openExternal(url2).catch((err) => {
        console.error("[BEACON Security] Failed to open external link:", err);
      });
    }
    return { action: "deny" };
  });
  mainWindow.webContents.on("console-message", (_event, level, message) => {
    if (level >= 3) {
      logger.error("Renderer", message);
    } else if (level === 2) {
      logger.warn("Renderer", message);
    } else if (message.includes("Diagnostic") || message.includes("Ambient") || message.includes("Wallpaper")) {
      logger.info("Renderer", message);
    }
  });
  if (process.env["ELECTRON_RENDERER_URL"]) {
    const targetUrl = isScreensaverLaunch ? `${process.env["ELECTRON_RENDERER_URL"]}#screensaver` : process.env["ELECTRON_RENDERER_URL"];
    mainWindow.loadURL(targetUrl);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "../renderer/index.html"),
      isScreensaverLaunch ? { hash: "screensaver" } : void 0
    );
  }
  return mainWindow;
}
electron.app.whenReady().then(async () => {
  logScreensaverEvent("Electron ready: initializing core runtime services");
  console.log("[BEACON Main] Application ready. Initializing core services...");
  const getBuiltinWallpapersDir = () => {
    const candidates = [
      process.resourcesPath ? path.join(process.resourcesPath, "wallpapers") : null,
      process.resourcesPath ? path.join(process.resourcesPath, "resources/wallpapers") : null,
      path.join(electron.app.getAppPath(), "resources/wallpapers"),
      path.join(__dirname, "../../resources/wallpapers"),
      path.join(__dirname, "../resources/wallpapers"),
      path.join(process.cwd(), "apps/windows/resources/wallpapers"),
      path.join(process.cwd(), "resources/wallpapers")
    ].filter(Boolean);
    for (const cand of candidates) {
      if (fs.existsSync(cand)) return cand;
    }
    return path.join(__dirname, "../../resources/wallpapers");
  };
  const handleWallpaperRequest = (request) => {
    try {
      const rawPath = request.url.replace(/^(?:beacon-wallpaper|helm-wallpaper):\/\//, "");
      let decodedPath = decodeURIComponent(rawPath);
      if (decodedPath.startsWith("builtin/") || decodedPath.startsWith("builtin:")) {
        const subPath = decodedPath.replace(/^builtin[\/:]/, "");
        decodedPath = path.join(getBuiltinWallpapersDir(), subPath);
      }
      if (!path.isAbsolute(decodedPath)) {
        return new Response("Invalid path", { status: 400 });
      }
      const ext = path.extname(decodedPath).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp"].includes(ext)) {
        return new Response("Forbidden file type", { status: 403 });
      }
      if (!fs.existsSync(decodedPath)) {
        logger.warn("Protocol", `Wallpaper file not found on disk: "${decodedPath}"`);
        const thumbCandidate = path.join(getBuiltinWallpapersDir(), "thumbnails", path.basename(decodedPath));
        if (fs.existsSync(thumbCandidate)) {
          logger.info("Protocol", `Serving thumbnail fallback for "${decodedPath}"`);
          return electron.net.fetch(url.pathToFileURL(thumbCandidate).toString());
        }
        return new Response("File not found", { status: 404 });
      }
      return electron.net.fetch(url.pathToFileURL(decodedPath).toString());
    } catch (err) {
      logger.error("Protocol", `Error serving wallpaper: ${err?.message}`, err?.stack);
      return new Response("Not found", { status: 404 });
    }
  };
  electron.protocol.handle("beacon-wallpaper", handleWallpaperRequest);
  electron.protocol.handle("helm-wallpaper", handleWallpaperRequest);
  registerIpcHandlers(() => mainWindow);
  const isScreensaverLaunch = process.argv.includes("--screensaver") || process.argv.includes("-screensaver");
  initScreensaverManager(() => mainWindow, isScreensaverLaunch);
  const initialWatches = watchesStore.getAllWatches();
  createWindow();
  const initialSettings = loadSettings();
  syncSystemPreferences(initialSettings);
  createSystemTray(
    () => mainWindow,
    () => {
      console.log("[BEACON Main] Quit requested from system tray");
      isQuitting = true;
      stopScreensaverControlServer();
      destroySystemTray();
      stopPipeServer();
      unregisterIpcHandlers();
      electron.app.quit();
    }
  );
  updateTrayWatches(initialWatches);
  updateTrayStatus(getBrowserIntegrationStatus());
  setPipeServerCallbacks({
    onWatchesChanged: (watches) => {
      updateTrayWatches(watches);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC_CHANNELS.WATCHES_UPDATE, watches);
      }
    },
    onStatusChanged: (status) => {
      updateTrayStatus(status);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC_CHANNELS.BROWSER_STATUS_UPDATE, status);
      }
    }
  });
  await startPipeServer();
  setImmediate(() => {
    try {
      ensureNativeMessagingHostRegistered();
    } catch (err) {
      console.warn("[BEACON Main] Non-critical: Failed to ensure native host registration on launch:", err);
    }
  });
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
});
electron.app.on("second-instance", (_event, commandLine) => {
  const isScreensaverReq = commandLine.some((arg) => arg.includes("--screensaver") || arg.includes("-screensaver"));
  const isScreensaverConfigReq = commandLine.some((arg) => arg.includes("--screensaver-config") || arg.includes("-screensaver-config"));
  if (isScreensaverReq) {
    logScreensaverEvent("Second instance requested screensaver mode via commandLine: " + JSON.stringify(commandLine));
    enterScreensaverMode();
    return;
  }
  if (isScreensaverConfigReq) {
    logScreensaverEvent("Second instance requested screensaver configuration");
    if (isScreensaverActive()) {
      setScreensaverOnly(false);
      exitScreensaverMode();
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send(IPC_CHANNELS.NAVIGATE, "settings");
    }
    return;
  }
  if (isScreensaverActive()) {
    logScreensaverEvent("Second instance requested normal application mode while screensaver active: transitioning");
    setScreensaverOnly(false);
    exitScreensaverMode();
  }
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    if (!mainWindow.isVisible()) mainWindow.show();
    mainWindow.focus();
  }
});
electron.app.on("window-all-closed", () => {
});
electron.app.on("before-quit", () => {
  isQuitting = true;
  stopScreensaverControlServer();
  destroySystemTray();
  stopPipeServer();
});
process.on("uncaughtException", (error) => {
  logger.error("Main", "Uncaught Exception in main process:", error);
});
process.on("unhandledRejection", (reason) => {
  logger.error("Main", "Unhandled Promise Rejection in main process:", reason);
});
