import React, { useEffect, useState, useCallback } from 'react'
import {
  Sun,
  Moon,
  Laptop,
  Info,
  Power,
  Globe,
  Radio,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Activity,
  HardDrive,
  Download,
  Trash2,
  FolderOpen,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Maximize2,
  Cloud,
  MapPin
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  ThemeOption,
  BrowserIntegrationStatus,
  SystemHealthSummary,
  LogEntry,
  HelmSettings,
  ScreensaverStatus,
  DeepPartial
} from '../../types'
import { applyTheme, getStoredTheme, applyReducedMotion } from '../../lib/theme'
import { formatRelativeTime } from '../../lib/date-utils'

interface SettingsPageProps {
  onOpenOnboarding?: () => void
}

const ToggleSwitch: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
}> = ({ checked, onChange, disabled, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
      checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
)

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenOnboarding }) => {
  const [settings, setSettings] = useState<HelmSettings | null>(null)
  const [theme, setThemeState] = useState<ThemeOption>(getStoredTheme())
  const [appVersion, setAppVersion] = useState<string>('0.1.0')
  const [platform, setPlatform] = useState<string>('win32')
  const [browserStatus, setBrowserStatus] = useState<BrowserIntegrationStatus | null>(null)
  const [isRetrying, setIsRetrying] = useState<boolean>(false)
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0)
  const [health, setHealth] = useState<SystemHealthSummary | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportMessage, setExportMessage] = useState<{ text: string; error?: boolean } | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false)
  const [showLogViewer, setShowLogViewer] = useState<boolean>(false)
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false)
  const [resetOnboardingChecked, setResetOnboardingChecked] = useState<boolean>(false)
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null)
  const [weatherLocInput, setWeatherLocInput] = useState<string>('')
  const [weatherSaveSuccess, setWeatherSaveSuccess] = useState<boolean>(false)
  const [screensaverStatus, setScreensaverStatus] = useState<ScreensaverStatus | null>(null)
  const [isRegisteringScr, setIsRegisteringScr] = useState<boolean>(false)
  const [scrActionFeedback, setScrActionFeedback] = useState<string | null>(null)

  const refreshScreensaverStatus = useCallback(async (): Promise<void> => {
    if (window.beacon?.getScreensaverStatus) {
      try {
        const status = await window.beacon.getScreensaverStatus()
        setScreensaverStatus(status)
      } catch (err) {
        console.error('Failed to get screensaver status:', err)
      }
    }
  }, [])

  const loadDiagnostics = useCallback(async (): Promise<void> => {
    if (window.beacon?.getSystemHealth) {
      try {
        const h = await window.beacon.getSystemHealth()
        setHealth(h)
      } catch (err) {
        console.error('Failed to load system health summary:', err)
      }
    }
    if (window.beacon?.getRecentLogs) {
      try {
        const l = await window.beacon.getRecentLogs(30)
        setLogs(l)
      } catch (err) {
        console.error('Failed to load recent logs:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (window.beacon?.getAppVersion) {
      window.beacon.getAppVersion().then(setAppVersion).catch(console.error)
    }
    if (window.beacon?.getPlatform) {
      window.beacon.getPlatform().then(setPlatform).catch(console.error)
    }
    if (window.beacon?.getBrowserStatus) {
      window.beacon.getBrowserStatus().then(setBrowserStatus).catch(console.error)
    }
    if (window.beacon?.getSettings) {
      window.beacon.getSettings().then((s) => {
        setSettings(s)
        if (s?.appearance) {
          setThemeState(s.appearance.theme)
          applyTheme(s.appearance.theme)
          applyReducedMotion(s.appearance.reducedMotion)
        }
        if (s?.ambient?.weatherLocation) {
          setWeatherLocInput(s.ambient.weatherLocation)
        }
      }).catch(console.error)
    }
    loadDiagnostics()
    refreshScreensaverStatus()

    const unsubBrowser = window.beacon?.onBrowserStatusUpdate?.((status) => {
      setBrowserStatus(status)
      if (status.retryStatus?.inProgress !== undefined) {
        setIsRetrying(status.retryStatus.inProgress)
      }
      loadDiagnostics()
    })

    const unsubSettings = window.beacon?.onSettingsChange?.((newSettings) => {
      setSettings(newSettings)
      if (newSettings?.appearance) {
        setThemeState(newSettings.appearance.theme)
        applyTheme(newSettings.appearance.theme)
        applyReducedMotion(newSettings.appearance.reducedMotion)
      }
    })

    return () => {
      if (unsubBrowser) unsubBrowser()
      if (unsubSettings) unsubSettings()
    }
  }, [loadDiagnostics])

  // Cooldown countdown timer
  useEffect(() => {
    if (!browserStatus?.retryStatus?.cooldownUntil) {
      setCooldownRemaining(0)
      return
    }

    const checkCooldown = (): void => {
      const until = browserStatus.retryStatus?.cooldownUntil || 0
      const diff = Math.max(0, Math.ceil((until - Date.now()) / 1000))
      setCooldownRemaining(diff)
    }

    checkCooldown()
    const timer = setInterval(checkCooldown, 500)
    return () => clearInterval(timer)
  }, [browserStatus?.retryStatus?.cooldownUntil])

  const handleUpdateSettings = async (partial: DeepPartial<HelmSettings>): Promise<void> => {
    if (window.beacon?.updateSettings) {
      try {
        const updated = await window.beacon.updateSettings(partial)
        setSettings(updated)
        if (partial.appearance?.theme) {
          setThemeState(partial.appearance.theme)
          applyTheme(partial.appearance.theme)
        }
        if (partial.appearance?.reducedMotion !== undefined) {
          applyReducedMotion(partial.appearance.reducedMotion)
        }
      } catch (err) {
        console.error('Failed to update settings:', err)
      }
    }
  }

  const handleResetSettings = async (): Promise<void> => {
    if (window.beacon?.resetSettings) {
      try {
        const reset = await window.beacon.resetSettings({ resetOnboarding: resetOnboardingChecked })
        setSettings(reset)
        setThemeState(reset.appearance.theme)
        applyTheme(reset.appearance.theme)
        applyReducedMotion(reset.appearance.reducedMotion)
        setShowResetConfirm(false)
        setResetSuccessMessage('Settings have been successfully restored to defaults.')
        setTimeout(() => setResetSuccessMessage(null), 5000)
      } catch (err) {
        console.error('Failed to reset settings:', err)
      }
    }
  }

  const handleRetryConnection = useCallback(async (): Promise<void> => {
    if (isRetrying || cooldownRemaining > 0) return
    setIsRetrying(true)
    try {
      if (window.beacon?.retryBrowserConnection) {
        const res = await window.beacon.retryBrowserConnection()
        setBrowserStatus(res)
      }
    } catch (err) {
      console.error('[Settings] Retry connection failed:', err)
    } finally {
      setIsRetrying(false)
    }
  }, [isRetrying, cooldownRemaining])

  const handleExportDiagnostics = async (): Promise<void> => {
    setIsExporting(true)
    setExportMessage(null)
    try {
      if (window.beacon?.exportDiagnostics) {
        const res = await window.beacon.exportDiagnostics()
        if (res.success && res.filePath) {
          setExportMessage({ text: `Diagnostics bundle exported: ${res.filePath}` })
        } else {
          setExportMessage({ text: res.error || 'Failed to export diagnostics', error: true })
        }
      }
    } catch (err) {
      console.error('Failed to export diagnostics:', err)
      setExportMessage({ text: 'Error executing diagnostics export', error: true })
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearLogs = async (): Promise<void> => {
    try {
      if (window.beacon?.clearLogs) {
        await window.beacon.clearLogs()
        setLogs([])
        setShowClearConfirm(false)
        await loadDiagnostics()
      }
    } catch (err) {
      console.error('Failed to clear logs:', err)
    }
  }

  const handleOpenLogsDir = async (): Promise<void> => {
    try {
      if (window.beacon?.openLogsDirectory) {
        await window.beacon.openLogsDirectory()
      }
    } catch (err) {
      console.error('Failed to open logs folder:', err)
    }
  }

  const handleThemeChange = (newTheme: ThemeOption): void => {
    handleUpdateSettings({ appearance: { theme: newTheme } })
  }

  const handleSaveWeatherLocation = async (locationOverride?: string): Promise<void> => {
    const loc = (locationOverride !== undefined ? locationOverride : weatherLocInput).trim()
    if (!loc) {
      console.warn('[Diagnostic:Settings] Save Weather clicked but location is empty')
      return
    }
    console.log('[Diagnostic:Settings] Save Weather Location clicked:', loc)
    setWeatherLocInput(loc)
    try {
      await handleUpdateSettings({
        ambient: {
          weatherLocation: loc
        }
      })
      console.log('[Diagnostic:Settings] handleUpdateSettings completed successfully for:', loc)
      setWeatherSaveSuccess(true)
      setTimeout(() => setWeatherSaveSuccess(false), 2500)
      // Pre-warm weather cache for immediate ambient rendering
      if (window.beacon?.getWeather) {
        console.log('[Diagnostic:Settings] Pre-warming weather cache for:', loc)
        window.beacon.getWeather(loc).then((res) => {
          console.log('[Diagnostic:Settings] Pre-warm result:', res)
        }).catch((err) => {
          console.error('[Diagnostic:Settings] Pre-warm error:', err)
        })
      }
    } catch (err) {
      console.error('[Diagnostic:Settings] Failed to save weather location:', err)
    }
  }

  const handleToggleScreensaverActive = async (active: boolean): Promise<void> => {
    setIsRegisteringScr(true)
    try {
      if (window.beacon?.setScreensaverActive) {
        await window.beacon.setScreensaverActive(active)
        await refreshScreensaverStatus()
        setScrActionFeedback(
          active
            ? 'BEACON has been registered as your active Windows screensaver!'
            : 'BEACON has been unregistered as Windows screensaver.'
        )
        setTimeout(() => setScrActionFeedback(null), 4000)
      }
    } catch (err) {
      console.error('Failed to set screensaver active:', err)
    } finally {
      setIsRegisteringScr(false)
    }
  }

  const handleOpenWindowsScreensaverDialog = async (): Promise<void> => {
    if (window.beacon?.openWindowsScreensaverSettings) {
      await window.beacon.openWindowsScreensaverSettings()
    }
  }

  const handleTestScreensaver = async (): Promise<void> => {
    if (window.beacon?.previewScreensaver) {
      await window.beacon.previewScreensaver()
    }
  }

  const getBrowserLabel = (type?: string): string => {
    switch (type) {
      case 'chrome':
        return 'Google Chrome'
      case 'edge':
        return 'Microsoft Edge'
      case 'brave':
        return 'Brave Browser'
      case 'chromium':
        return 'Chromium Browser'
      default:
        return 'Waiting for Handshake'
    }
  }

  return (
    <div className="space-y-6 max-w-3xl animate-fadeIn pb-12">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-helm-muted">
          Configure application preferences, theme, notifications, and browser extension connectivity
        </p>
      </div>

      {resetSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* 1. General & Window Lifecycle */}
      <Card
        title="General & Lifecycle"
        description="Configure desktop runtime startup, tray minimization, and closing behavior"
      >
        <div className="space-y-4 text-xs">
          {/* Launch at Windows Startup */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Power className="w-3.5 h-3.5 text-slate-400" />
                Launch at Windows Startup
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Automatically start BEACON in background when you sign in to Windows.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={settings?.general?.launchAtStartup ? 'success' : 'neutral'}>
                {settings?.general?.launchAtStartup ? 'Enabled' : 'Disabled'}
              </Badge>
              <ToggleSwitch
                checked={Boolean(settings?.general?.launchAtStartup)}
                onChange={(checked) =>
                  handleUpdateSettings({ general: { launchAtStartup: checked } })
                }
              />
            </div>
          </div>

          {/* Start Minimized */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Start Minimized in System Tray
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Launch quietly into the notification area without opening the main window.
              </div>
            </div>
            <ToggleSwitch
              checked={Boolean(settings?.general?.startMinimized)}
              onChange={(checked) =>
                handleUpdateSettings({ general: { startMinimized: checked } })
              }
            />
          </div>

          {/* Minimize to Tray */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Minimize to System Tray
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Clicking minimize hides the window to the tray instead of keeping it in the Windows taskbar.
              </div>
            </div>
            <ToggleSwitch
              checked={Boolean(settings?.general?.minimizeToTray)}
              onChange={(checked) =>
                handleUpdateSettings({ general: { minimizeToTray: checked } })
              }
            />
          </div>

          {/* Close Behavior */}
          <div className="flex items-center justify-between py-2">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200">
                Window Close Behavior
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Choose what happens when you click the window close button.
              </div>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-black/30 rounded-lg border border-slate-200/80 dark:border-helm-border/40">
              <button
                type="button"
                onClick={() => handleUpdateSettings({ general: { closeBehavior: 'tray' } })}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  settings?.general?.closeBehavior !== 'quit'
                    ? 'bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hide to Tray
              </button>
              <button
                type="button"
                onClick={() => handleUpdateSettings({ general: { closeBehavior: 'quit' } })}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  settings?.general?.closeBehavior === 'quit'
                    ? 'bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Exit Application
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Appearance */}
      <Card
        title="Appearance"
        description="Choose visual presentation, themes, and motion accessibility preferences"
      >
        <div className="space-y-4 text-xs">
          {/* Theme Selector */}
          <div>
            <div className="font-medium text-slate-800 dark:text-slate-200 mb-2">
              Color Theme
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-lg border text-xs font-medium transition-all ${
                  theme === 'system'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Laptop className="w-5 h-5" />
                <span>System Default</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-lg border text-xs font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Dark (Ambient)</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-lg border text-xs font-medium transition-all ${
                  theme === 'light'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-helm-border/30">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                Reduced Motion
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Minimizes animations, transitions, and Ambient Ken Burns pan-and-zoom effects.
              </div>
            </div>
            <ToggleSwitch
              checked={Boolean(settings?.appearance?.reducedMotion)}
              onChange={(checked) =>
                handleUpdateSettings({ appearance: { reducedMotion: checked } })
              }
            />
          </div>

          {/* Ambient Screen Board Summary */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40 text-[11px] flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Ambient Screen Board Shortcuts
              </span>
              <div className="text-slate-500 dark:text-helm-muted mt-0.5">
                Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-black/50 rounded font-mono text-[10px]">F11</kbd> for Fullscreen, <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-black/50 rounded font-mono text-[10px]">Space</kbd> to Pause, <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-black/50 rounded font-mono text-[10px]">Esc</kbd> to Exit.
              </div>
            </div>
            <Badge variant="neutral" className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-emerald-500" />
              <span>Cinematic Mode</span>
            </Badge>
          </div>
        </div>
      </Card>

      {/* 3. Ambient Weather & Atmosphere */}
      <Card
        title="Ambient Weather & Atmosphere"
        description="Configure live weather conditions, location, and temperature units for the Ambient Screen Board"
      >
        <div className="space-y-4 text-xs">
          {/* Show Weather in Ambient Board */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                Live Weather Display
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Show real-time temperature, atmospheric conditions, and weather icon on the Ambient Screen Board.
              </div>
            </div>
            <ToggleSwitch
              checked={settings?.ambient?.showWeather !== false}
              onChange={(checked) =>
                handleUpdateSettings({ ambient: { showWeather: checked } })
              }
            />
          </div>

          {/* Temperature Unit */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-slate-400" />
                Temperature Units
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Choose between Celsius (°C) and Fahrenheit (°F) display.
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/30 p-1 rounded-lg border border-slate-200 dark:border-helm-border/40">
              <button
                type="button"
                onClick={() => handleUpdateSettings({ ambient: { temperatureUnit: 'C' } })}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  settings?.ambient?.temperatureUnit !== 'F'
                    ? 'bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °C (Celsius)
              </button>
              <button
                type="button"
                onClick={() => handleUpdateSettings({ ambient: { temperatureUnit: 'F' } })}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  settings?.ambient?.temperatureUnit === 'F'
                    ? 'bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °F (Fahrenheit)
              </button>
            </div>
          </div>

          {/* Weather Location Field */}
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between">
              <label htmlFor="weather-location-input" className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Weather Location
              </label>
              {weatherSaveSuccess && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  Saved & updated!
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-helm-muted">
              Enter city name, region, or country (e.g., Chennai, Tamil Nadu, India).
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveWeatherLocation()
              }}
              className="flex gap-2 pt-1"
            >
              <input
                id="weather-location-input"
                type="text"
                value={weatherLocInput}
                onChange={(e) => setWeatherLocInput(e.target.value)}
                placeholder="e.g. Chennai, Tamil Nadu, India"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Location</span>
              </Button>
            </form>

            {/* Location Presets & Attribution */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-helm-border/30">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 dark:text-helm-muted">Quick Presets:</span>
                {[
                  'Chennai, Tamil Nadu, India',
                  'London, UK',
                  'Tokyo, Japan',
                  'New York, NY'
                ].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSaveWeatherLocation(city)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-helm-border/40 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-helm-muted pt-1">
                <span>Weather data by Open-Meteo</span>
                <span>Auto-refreshes every 15 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Windows Screensaver Integration */}
      <Card
        title="Windows Screensaver Integration"
        description="Run BEACON Ambient Screen Board as your native Windows screensaver when your workstation is idle"
      >
        <div className="space-y-4 text-xs">
          {/* Status banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  screensaverStatus?.isRegistered
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-slate-400'
                }`}
              />
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span>Windows Status:</span>
                  <Badge variant={screensaverStatus?.isRegistered ? 'success' : 'neutral'}>
                    {screensaverStatus?.isRegistered
                      ? 'BEACON is Active Screensaver'
                      : 'Not Active Screensaver'}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                  {screensaverStatus?.isRegistered
                    ? `Windows idle timeout: ${Math.round(
                        (screensaverStatus?.timeoutSeconds || 600) / 60
                      )} minutes (${screensaverStatus?.timeoutSeconds || 600}s)`
                    : 'Select BEACON in Windows Screen Saver Settings or register directly below'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                variant={screensaverStatus?.isRegistered ? 'secondary' : 'primary'}
                size="sm"
                disabled={isRegisteringScr}
                onClick={() =>
                  handleToggleScreensaverActive(!screensaverStatus?.isRegistered)
                }
              >
                {screensaverStatus?.isRegistered
                  ? 'Remove Screensaver'
                  : 'Set as Active Screensaver'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenWindowsScreensaverDialog}
              >
                Windows Screen Saver Settings
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTestScreensaver}
              >
                Test Screensaver
              </Button>
            </div>
          </div>

          {scrActionFeedback && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{scrActionFeedback}</span>
            </div>
          )}

          {/* Privacy & Content Section */}
          <div className="pt-2">
            <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-1">
              Screensaver Content & Privacy
            </div>
            <p className="text-[11px] text-slate-500 dark:text-helm-muted mb-3">
              Configure what is displayed while your workstation is idle. Personal notes, tasks, and browser watches are hidden by default for office privacy.
            </p>

            <div className="space-y-3">
              {/* Show Clock & Time */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
                <div className="pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Show Digital Clock & Time
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    Display current time with smooth typography during screensaver.
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings?.screensaver?.showClock !== false}
                  onChange={(checked) =>
                    handleUpdateSettings({ screensaver: { showClock: checked } })
                  }
                />
              </div>

              {/* Show Date */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
                <div className="pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Show Date
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    Display full weekday and calendar date.
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings?.screensaver?.showDate !== false}
                  onChange={(checked) =>
                    handleUpdateSettings({ screensaver: { showDate: checked } })
                  }
                />
              </div>

              {/* Show Weather */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
                <div className="pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Show Live Weather
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    Display local temperature and atmospheric conditions.
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings?.screensaver?.showWeather !== false}
                  onChange={(checked) =>
                    handleUpdateSettings({ screensaver: { showWeather: checked } })
                  }
                />
              </div>

              {/* Show Calm Quote */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
                <div className="pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Show Daily Quote
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    Display rotating mindful philosophical quotes.
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings?.screensaver?.showQuote !== false}
                  onChange={(checked) =>
                    handleUpdateSettings({ screensaver: { showQuote: checked } })
                  }
                />
              </div>

              {/* Show Pending Tasks (Privacy sensitive) */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
                <div className="pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>Show Pending Tasks</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-normal">
                      Privacy-sensitive
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    Display incomplete task titles on the screensaver (max 3–5, prioritized by urgency and due date). Task descriptions and notes are strictly omitted. Note: Task titles may be visible to anyone near your workstation.
                  </div>
                </div>
                <ToggleSwitch
                  checked={Boolean(settings?.screensaver?.showTasks)}
                  onChange={(checked) =>
                    handleUpdateSettings({ screensaver: { showTasks: checked } })
                  }
                />
              </div>

              {/* Show Browser Watch Feed (Privacy sensitive) */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
                <div className="pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>Show Browser Watch Feed</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-normal">
                      Privacy-sensitive
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    Display monitored browser tabs on the screensaver (disabled by default for office privacy).
                  </div>
                </div>
                <ToggleSwitch
                  checked={Boolean(settings?.screensaver?.showWatches)}
                  onChange={(checked) =>
                    handleUpdateSettings({ screensaver: { showWatches: checked } })
                  }
                />
              </div>

              {/* Exit on Mouse Move */}
              <div className="flex items-center justify-between py-2">
                <div className="pr-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Exit on Mouse Movement
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    Automatically dismiss screensaver when mouse is moved (uses an 800ms grace period and distance threshold to prevent accidental dismissal).
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings?.screensaver?.exitOnMouseMove !== false}
                  onChange={(checked) =>
                    handleUpdateSettings({ screensaver: { exitOnMouseMove: checked } })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Notifications */}
      <Card
        title="Notifications"
        description="Configure desktop notification banners and alert chimes for browser updates"
      >
        <div className="space-y-4 text-xs">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-slate-400" />
                Desktop Notifications
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Display native Windows notifications when web monitor stages or attention states trigger.
              </div>
            </div>
            <ToggleSwitch
              checked={settings?.notifications?.enabled !== false}
              onChange={(checked) =>
                handleUpdateSettings({ notifications: { enabled: checked } })
              }
            />
          </div>

          {/* Notification Sound */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40">
            <div className="pr-4">
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                {settings?.notifications?.sound !== false ? (
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                Notification Sound
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                Play default Windows chime sound when displaying a notification alert.
              </div>
            </div>
            <ToggleSwitch
              checked={settings?.notifications?.sound !== false}
              disabled={settings?.notifications?.enabled === false}
              onChange={(checked) =>
                handleUpdateSettings({ notifications: { sound: checked } })
              }
            />
          </div>

          {/* OS Permission Badge */}
          <div className="flex items-center justify-between py-1">
            <div className="text-[11px] text-slate-500 dark:text-helm-muted">
              Windows Notification System Status
            </div>
            <Badge variant="success" className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              Supported on Windows 10 & 11
            </Badge>
          </div>
        </div>
      </Card>

      {/* 4. Browser Integration & Native Messaging */}
      <Card
        title="Chromium Extension Integration"
        description="Windows Native Messaging Host configuration and live connection status for Chrome, Edge, and Brave"
      >
        <div className="space-y-4 text-xs">
          {/* Real-time Connection State Panel */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    browserStatus?.state === 'connected'
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse'
                      : browserStatus?.state === 'connecting'
                      ? 'bg-amber-500 animate-spin'
                      : browserStatus?.state === 'error'
                      ? 'bg-rose-500'
                      : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>
                      {browserStatus?.state === 'connected'
                        ? 'Connected to Browser'
                        : browserStatus?.state === 'connecting'
                        ? 'Connecting & Verifying...'
                        : browserStatus?.state === 'error'
                        ? 'Connection Error'
                        : 'Extension Disconnected'}
                    </span>
                    <Badge
                      variant={
                        browserStatus?.state === 'connected'
                          ? 'success'
                          : browserStatus?.state === 'connecting'
                          ? 'warning'
                          : browserStatus?.state === 'error'
                          ? 'danger'
                          : 'neutral'
                      }
                    >
                      {browserStatus?.state?.toUpperCase() || 'DISCONNECTED'}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                    {browserStatus?.state === 'connected'
                      ? `Active handshake with ${getBrowserLabel(browserStatus.browserType)}`
                      : browserStatus?.errorReason ||
                        'No communication received. Open Chrome, Edge, or Brave with the BEACON extension active.'}
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleRetryConnection}
                disabled={isRetrying || cooldownRemaining > 0}
                className="text-xs gap-1.5"
                title="Test and re-verify connection to the browser extension"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-emerald-500 ${isRetrying ? 'animate-spin' : ''}`}
                />
                <span>
                  {isRetrying
                    ? 'Checking...'
                    : cooldownRemaining > 0
                    ? `Retry in ${cooldownRemaining}s`
                    : 'Retry Connection'}
                </span>
              </Button>
            </div>

            {/* Diagnostic Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/60 dark:border-helm-border/30">
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/25 border border-slate-200/50 dark:border-helm-border/20">
                <div className="text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider">
                  Detected Browser
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {getBrowserLabel(browserStatus?.browserType)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-black/25 border border-slate-200/50 dark:border-helm-border/20">
                <div className="text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider">
                  Last Handshake
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                  {browserStatus?.lastSyncTime
                    ? formatRelativeTime(browserStatus.lastSyncTime)
                    : 'Never'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-black/25 border border-slate-200/50 dark:border-helm-border/20">
                <div className="text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider">
                  Active Watches
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                  {browserStatus?.activeWatchCount || 0} tracked
                </div>
              </div>
            </div>

            {/* Troubleshooting Alert when Disconnected or in Error */}
            {(browserStatus?.state === 'disconnected' || browserStatus?.state === 'error') && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Troubleshooting Connection</span>
                </div>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
                  <li>Open Google Chrome, Microsoft Edge, or Brave.</li>
                  <li>Ensure the BEACON extension is installed and enabled in your browser.</li>
                  <li>If recently installed, run the Native Messaging registration script below.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Registration Details */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/30">
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                Native Messaging Registration
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted">
                Registry entries in HKCU\Software\[Browser]\NativeMessagingHosts
              </div>
            </div>
            {browserStatus?.manifestInstalled ? (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Registered
              </Badge>
            ) : (
              <Badge variant="warning" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Pending Registration
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/30">
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-sky-500" />
                Local Named Pipe Channel
              </div>
              <div className="text-[11px] text-slate-500 dark:text-helm-muted">
                Fast, zero-network interprocess communication
              </div>
            </div>
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
              \\.\pipe\helm-windows-ipc
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/50 text-[11px] space-y-1.5">
            <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-emerald-500" />
              Registration Script
            </div>
            <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-black/40 p-2 rounded border border-slate-200/60 dark:border-helm-border/40 select-all">
              powershell -ExecutionPolicy Bypass -File scripts\register-native-host.ps1
            </div>
            <p className="text-slate-500 dark:text-helm-muted">
              Registers the host manifest into current user registry for all installed Chromium browsers.
            </p>
          </div>
        </div>
      </Card>

      {/* 5. Data & Privacy */}
      <Card
        title="Data, Storage & Privacy"
        description="Local storage health, diagnostic logging controls, and configuration management"
      >
        <div className="space-y-4 text-xs">
          {/* Storage & Health Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40">
              <div className="text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-emerald-500" />
                SQLite WASM DB
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>{health?.databaseHealth?.status === 'healthy' ? 'Healthy' : 'Corrupted / Init'}</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-helm-muted mt-0.5">
                {Math.round((health?.databaseHealth?.sizeBytes || 0) / 1024)} KB (v{health?.databaseHealth?.version || 1})
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40">
              <div className="text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1">
                <FileCode2 className="w-3 h-3 text-sky-500" />
                Settings Store
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>{health?.settingsHealth?.status === 'healthy' ? 'Healthy' : 'Missing'}</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-helm-muted mt-0.5">
                {health?.settingsHealth?.sizeBytes || 0} bytes
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40">
              <div className="text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-500" />
                Heap Memory
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200 mt-1">
                {health?.memoryUsageMb || 0} MB
              </div>
              <div className="text-[10px] text-slate-400 dark:text-helm-muted mt-0.5">
                {health?.arch || 'x64'} runtime
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40">
              <div className="text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-500" />
                Extension Pipe
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200 mt-1 capitalize truncate">
                {health?.extensionHealth?.state || 'Disconnected'}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-helm-muted mt-0.5">
                {health?.extensionHealth?.pipeAvailable ? 'Named Pipe Active' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3 rounded-lg bg-slate-100/80 dark:bg-black/30 border border-slate-200/60 dark:border-helm-border/30 text-[11px] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-slate-600 dark:text-helm-muted leading-relaxed">
              <strong>Zero Content Logging:</strong> Diagnostic logs and exports strictly exclude note text,
              task details, webpage contents, cookies, tokens, and Windows usernames. Only sanitized
              environment and error metrics are recorded locally.
            </div>
          </div>

          {/* Export & Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportDiagnostics}
                disabled={isExporting}
                className="text-xs gap-1.5"
                title="Export privacy-safe diagnostics bundle to %APPDATA%\Beacon\diagnostics"
              >
                <Download className={`w-3.5 h-3.5 text-sky-500 ${isExporting ? 'animate-bounce' : ''}`} />
                <span>{isExporting ? 'Exporting...' : 'Export Diagnostics'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenLogsDir}
                className="text-xs gap-1.5"
                title="Open local logs folder in Windows Explorer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Open Logs Folder</span>
              </Button>
            </div>

            <div>
              {showClearConfirm ? (
                <div className="flex items-center gap-1.5 animate-fadeIn">
                  <span className="text-[11px] text-rose-500 font-medium">Clear all logs?</span>
                  <button
                    onClick={handleClearLogs}
                    className="px-2 py-1 text-[11px] font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs gap-1.5 text-slate-500 hover:text-rose-500 dark:text-helm-muted"
                  title="Clear diagnostic log files and in-memory buffer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logs</span>
                </Button>
              )}
            </div>
          </div>

          {/* Export Result Notification */}
          {exportMessage && (
            <div
              role="status"
              aria-live="polite"
              className={`p-2.5 rounded-lg text-[11px] font-medium border select-all animate-fadeIn ${
                exportMessage.error
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {exportMessage.text}
            </div>
          )}

          {/* Expandable Recent Logs Viewer */}
          <div className="pt-2 border-t border-slate-100 dark:border-helm-border/30">
            <button
              type="button"
              aria-expanded={showLogViewer}
              aria-controls="recent-logs-list"
              onClick={() => setShowLogViewer(!showLogViewer)}
              className="flex items-center justify-between w-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded py-1 px-0.5"
            >
              <div className="flex items-center gap-2 font-medium">
                <FileCode2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Recent Diagnostics Logs ({logs.length})</span>
              </div>
              {showLogViewer ? <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
            </button>

            {showLogViewer && (
              <div id="recent-logs-list" className="mt-2.5 p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-[10px] space-y-1.5 max-h-48 overflow-y-auto border border-slate-800 animate-fadeIn">
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`font-semibold shrink-0 uppercase text-[9px] px-1 rounded ${
                          log.level === 'error'
                            ? 'bg-rose-900/60 text-rose-300'
                            : log.level === 'warn'
                            ? 'bg-amber-900/60 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-emerald-400 shrink-0">[{log.component}]</span>
                      <span className="text-slate-200 break-words flex-1">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 italic py-2 text-center">
                    No recent events or warnings recorded in memory.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Safe Reset Settings to Defaults */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-helm-border/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Settings to Defaults</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                  Restores General, Appearance, Notifications, and Ambient preferences. Notes, Tasks, and Watches are never deleted.
                </div>
              </div>

              {!showResetConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Preferences</span>
                </Button>
              ) : null}
            </div>

            {showResetConfirm && (
              <div className="mt-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-3 animate-fadeIn">
                <div className="text-rose-800 dark:text-rose-200 font-medium">
                  Confirm Resetting All Application Preferences?
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  This will reset window lifecycle, color theme, notification toggles, and ambient board settings to their defaults. Your SQLite database (Notes & Tasks) and tracked Web Watches will remain completely intact.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    id="reset-onboarding-cb"
                    checked={resetOnboardingChecked}
                    onChange={(e) => setResetOnboardingChecked(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="reset-onboarding-cb" className="cursor-pointer">
                    Also replay Welcome Onboarding Tour on next launch
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleResetSettings}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                  >
                    Yes, Reset Preferences
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-helm-surface rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 6. Getting Started & Help */}
      <Card
        title="Getting Started & Help"
        description="Review BEACON's features, key bindings, and guided tour"
      >
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="font-medium text-slate-800 dark:text-slate-200">
              Welcome Tour & Onboarding
            </div>
            <div className="text-[11px] text-slate-500 dark:text-helm-muted">
              Replay the interactive walkthrough for Ambient, Notes, Tasks, and browser monitors
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenOnboarding}
            className="text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Replay Onboarding Tour</span>
          </Button>
        </div>
      </Card>

      {/* 7. System Information */}
      <Card
        title="Application Information"
        description="Architecture and version details for this local instance"
      >
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-helm-border/30">
            <span className="text-slate-500 dark:text-helm-muted">Application Name</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">BEACON (Windows Port)</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-helm-border/30">
            <span className="text-slate-500 dark:text-helm-muted">Version</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">{appVersion}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-helm-border/30">
            <span className="text-slate-500 dark:text-helm-muted">Target Platform</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">{platform} (Windows)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500 dark:text-helm-muted">Runtime Architecture</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Electron 34 + React 18 + Vite</span>
          </div>
        </div>
      </Card>

      {/* Information Alert */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-helm-card border border-slate-200 dark:border-helm-border/60 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-helm-muted leading-relaxed">
          BEACON is designed as an ambient utility. It keeps notes, tasks, and web watches
          visible without cognitive friction. All settings and preferences are stored locally
          on your PC under <span className="font-mono text-[11px]">%APPDATA%\Beacon\settings.json</span>.
        </div>
      </div>
    </div>
  )
}
