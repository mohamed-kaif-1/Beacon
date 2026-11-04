import { ThemeOption } from '../types'

const THEME_STORAGE_KEY = 'beacon_theme_preference'
const LEGACY_THEME_STORAGE_KEY = 'helm_theme_preference'

export function getStoredTheme(): ThemeOption {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'dark' // Default to calm dark ambient theme
}

export function applyTheme(theme: ThemeOption): void {
  const root = document.documentElement
  localStorage.setItem(THEME_STORAGE_KEY, theme)

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  // Notify Electron main process if available
  if (window.beacon?.setTheme) {
    window.beacon.setTheme(theme).catch((err: unknown) => {
      console.warn('Failed to sync theme with Electron main:', err)
    })
  }
}

export function applyReducedMotion(reduced: boolean): void {
  const root = document.documentElement
  if (reduced) {
    root.classList.add('reduced-motion')
  } else {
    root.classList.remove('reduced-motion')
  }
}

export function initTheme(): () => void {
  const theme = getStoredTheme()
  applyTheme(theme)

  // Sync with central Helm settings if running in Electron
  if (window.beacon?.getSettings) {
    window.beacon.getSettings().then((settings) => {
      if (settings?.appearance) {
        applyTheme(settings.appearance.theme)
        applyReducedMotion(settings.appearance.reducedMotion)
      }
    }).catch(console.error)
  }

  const unsubSettings = window.beacon?.onSettingsChange?.((settings) => {
    if (settings?.appearance) {
      applyTheme(settings.appearance.theme)
      applyReducedMotion(settings.appearance.reducedMotion)
    }
  })

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = (): void => {
    if (getStoredTheme() === 'system') {
      applyTheme('system')
    }
  }

  mediaQuery.addEventListener('change', listener)
  return () => {
    mediaQuery.removeEventListener('change', listener)
    if (unsubSettings) unsubSettings()
  }
}
