import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  BoardWatch,
  AmbientSettings,
  ScreensaverSettings,
  WallpaperItem,
  NavigationRoute
} from '../../types'
import { KenBurnsSlideshow } from './KenBurnsSlideshow'
import { AmbientClockWeather } from './AmbientClockWeather'
import { AmbientWatchesColumn } from './AmbientWatchesColumn'
import { AmbientTasksColumn } from './AmbientTasksColumn'
import { AmbientControls } from './AmbientControls'
import { AmbientSettingsModal } from './AmbientSettingsModal'
import { BUILT_IN_WALLPAPERS } from './wallpapers'

interface AmbientBoardPageProps {
  onNavigate: (route: NavigationRoute) => void
  isFullscreen: boolean
  setIsFullscreen: (fullscreen: boolean) => void
  isScreensaver?: boolean
}

const DEFAULT_SETTINGS: AmbientSettings = {
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

export const AmbientBoardPage: React.FC<AmbientBoardPageProps> = ({
  onNavigate,
  isFullscreen,
  setIsFullscreen,
  isScreensaver = false
}) => {
  const [settings, setSettings] = useState<AmbientSettings>(DEFAULT_SETTINGS)
  const [screensaverSettings, setScreensaverSettings] = useState<ScreensaverSettings | null>(null)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false)
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>(BUILT_IN_WALLPAPERS)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [animVariant, setAnimVariant] = useState<'a' | 'b' | 'c' | 'd'>('a')
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [watches, setWatches] = useState<BoardWatch[]>([])
  const [controlsVisible, setControlsVisible] = useState<boolean>(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [isWindowVisible, setIsWindowVisible] = useState<boolean>(!document.hidden)
  const [isDismissing, setIsDismissing] = useState<boolean>(false)

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 1. Initial Data Fetching
  useEffect(() => {
    if (window.beacon?.getAmbientSettings) {
      window.beacon.getAmbientSettings().then((s) => {
        console.log('[Diagnostic:Ambient] Loaded ambient settings from disk:', s)
        setSettings(s)
        setIsSettingsLoaded(true)
        if (s.slideshowInterval === 0) setIsPlaying(false)
        if (typeof s.selectedWallpaperIndex === 'number') {
          setCurrentIndex(s.selectedWallpaperIndex)
        }
      }).catch((err) => {
        console.error('[Diagnostic:Ambient] Failed to load ambient settings:', err)
        setIsSettingsLoaded(true)
      })
    } else {
      setIsSettingsLoaded(true)
    }

    if (window.beacon?.getSettings) {
      window.beacon.getSettings().then((s) => {
        if (s?.screensaver) {
          setScreensaverSettings(s.screensaver)
        }
      }).catch(console.error)
    }

    if (window.beacon?.getWallpapers) {
      window.beacon.getWallpapers().then((items) => {
        if (items && items.length > 0) setWallpapers(items)
      }).catch(console.error)
    }

    if (window.beacon?.getWatches) {
      window.beacon.getWatches().then(setWatches).catch(console.error)
    }

    // Subscribe to live watch updates
    const unsubWatches = window.beacon?.onWatchesUpdate?.((updated) => {
      setWatches(updated)
    })

    // Subscribe to live settings changes (e.g. from SettingsPage)
    const unsubSettings = window.beacon?.onSettingsChange?.((newSettings) => {
      if (newSettings?.ambient) {
        setSettings((prev) => ({ ...prev, ...newSettings.ambient }))
      }
      if (newSettings?.screensaver) {
        setScreensaverSettings(newSettings.screensaver)
      }
    })

    return () => {
      if (unsubWatches) unsubWatches()
      if (unsubSettings) unsubSettings()
    }
  }, [])

  // 1b. Handshake: notify Electron main process that Ambient is mounted and ready for display
  useEffect(() => {
    if (isScreensaver) {
      const notify = window.beacon?.notifyScreensaverReady || window.helm?.notifyScreensaverReady
      if (notify) {
        // Double requestAnimationFrame ensures Chromium has computed layout, painted to the raster surface,
        // and presented the composited frame to the GPU swapchain backbuffer before Electron reveals the window.
        let rafId1: number
        let rafId2: number
        let cancelled = false
        rafId1 = requestAnimationFrame(() => {
          if (cancelled) return
          rafId2 = requestAnimationFrame(() => {
            if (cancelled) return
            notify().catch(console.error)
          })
        })
        return () => {
          cancelled = true
          if (rafId1) cancelAnimationFrame(rafId1)
          if (rafId2) cancelAnimationFrame(rafId2)
        }
      }
    }
  }, [isScreensaver])

  // 2. Wallpaper Navigation with smooth cross-fade
  const goToWallpaper = useCallback((newIndex: number): void => {
    if (wallpapers.length === 0) return
    const safeIndex = (newIndex + wallpapers.length) % wallpapers.length
    if (safeIndex === currentIndex) return

    setPreviousIndex(currentIndex)
    setCurrentIndex(safeIndex)
    setIsTransitioning(true)
    const VARIANTS: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd']
    setAnimVariant((prev) => {
      const nextIdx = (VARIANTS.indexOf(prev) + 1) % VARIANTS.length
      return VARIANTS[nextIdx]
    })

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false)
      transitionTimerRef.current = null
    }, (settings.transitionDuration || 2.0) * 1000)

    // Save selection
    if (window.beacon?.setAmbientSettings) {
      window.beacon.setAmbientSettings({ selectedWallpaperIndex: safeIndex }).catch(console.error)
    }
  }, [currentIndex, wallpapers.length, settings.transitionDuration])

  const handleNext = useCallback((): void => {
    goToWallpaper(currentIndex + 1)
  }, [currentIndex, goToWallpaper])

  const handlePrev = useCallback((): void => {
    goToWallpaper(currentIndex - 1)
  }, [currentIndex, goToWallpaper])

  // Monitor document visibility to pause timers when window is minimized or hidden in tray
  useEffect(() => {
    const handleVisibility = (): void => {
      setIsWindowVisible(!document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    }
  }, [])

  // 3. Slideshow Timer (automatically paused when window is minimized/hidden in tray)
  useEffect(() => {
    if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current)

    if (isPlaying && isWindowVisible && settings.slideshowInterval > 0 && wallpapers.length > 1) {
      slideshowTimerRef.current = setInterval(() => {
        handleNext()
      }, settings.slideshowInterval * 1000)
    }

    return () => {
      if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current)
    }
  }, [isPlaying, isWindowVisible, settings.slideshowInterval, wallpapers.length, handleNext])

  // 4. Inactivity & Controls Auto-Hide
  const resetIdleTimer = useCallback((): void => {
    setControlsVisible(true)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      if (!isSettingsOpen) {
        setControlsVisible(false)
      }
    }, 3000)
  }, [isSettingsOpen])

  useEffect(() => {
    const onMouseMove = (): void => resetIdleTimer()
    window.addEventListener('mousemove', onMouseMove)
    resetIdleTimer()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [resetIdleTimer])

  // 5. Fullscreen Toggle
  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (window.beacon?.setFullscreen) {
      const target = !isFullscreen
      await window.beacon.setFullscreen(target)
      setIsFullscreen(target)
    }
  }, [isFullscreen, setIsFullscreen])

  // 6. Keyboard Shortcuts (when not in screensaver mode)
  useEffect(() => {
    if (isScreensaver) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      // Do not intercept shortcut keys if user is typing in an input or textarea
      const target = e.target as HTMLElement | null
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      if (isEditable && e.key !== 'Escape') {
        return
      }

      // Escape key behavior
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false)
        } else if (isFullscreen) {
          if (window.beacon?.setFullscreen) {
            window.beacon.setFullscreen(false)
          }
          setIsFullscreen(false)
        } else {
          onNavigate('home')
        }
        return
      }

      // F11 Fullscreen toggle
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
        return
      }

      // Space: Play/Pause
      if (e.code === 'Space' && !isSettingsOpen) {
        e.preventDefault()
        setIsPlaying((prev) => !prev)
        return
      }

      // Arrow keys
      if (e.key === 'ArrowRight' && !isSettingsOpen) {
        handleNext()
      } else if (e.key === 'ArrowLeft' && !isSettingsOpen) {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isScreensaver, isSettingsOpen, isFullscreen, toggleFullscreen, onNavigate, handleNext, handlePrev, setIsFullscreen])

  // 6b. Screensaver Exit Listeners (Physical screen coordinate threshold, grace period, any key/click)
  useEffect(() => {
    if (!isScreensaver) return

    let isExiting = false
    const startTime = Date.now()
    const GRACE_PERIOD_MS = 600
    const DISTANCE_THRESHOLD = 15
    let initialPos: { x: number; y: number } | null = null

    const triggerExit = (reason: string): void => {
      if (isExiting) return
      isExiting = true
      setIsDismissing(true)
      console.log(`[Screensaver] Dismissal triggered by user input: ${reason}`)
      if (window.beacon?.exitScreensaver) {
        window.beacon.exitScreensaver().catch(console.error)
      } else {
        onNavigate('home')
      }
    }

    const handleMouseMove = (e: MouseEvent): void => {
      if (screensaverSettings?.exitOnMouseMove === false) return

      // During grace period (600ms), continuously record the settled cursor position on the physical monitor
      if (Date.now() - startTime < GRACE_PERIOD_MS) {
        initialPos = { x: e.screenX, y: e.screenY }
        return
      }

      if (!initialPos) {
        initialPos = { x: e.screenX, y: e.screenY }
        return
      }

      // Calculate distance moved using physical monitor coordinates (screenX/screenY)
      // to avoid synthetic jumps caused by window resizing or fullscreen transitions
      const dx = e.screenX - initialPos.x
      const dy = e.screenY - initialPos.y
      const dist = Math.hypot(dx, dy)

      if (dist >= DISTANCE_THRESHOLD) {
        triggerExit(`mouse movement (${Math.round(dist)}px)`)
      }
    }

    const handlePointerDown = (): void => {
      if (Date.now() - startTime < 400) return
      triggerExit('pointer/click')
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (Date.now() - startTime < 400) return
      e.preventDefault()
      triggerExit(`key press (${e.key})`)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isScreensaver, screensaverSettings?.exitOnMouseMove, onNavigate])

  // 7. Settings Updates
  const handleUpdateSettings = async (updated: Partial<AmbientSettings>): Promise<void> => {
    const merged = { ...settings, ...updated }
    setSettings(merged)
    if (typeof updated.slideshowInterval === 'number') {
      setIsPlaying(updated.slideshowInterval > 0)
    }
    if (window.beacon?.setAmbientSettings) {
      await window.beacon.setAmbientSettings(updated)
    }
    if (updated.wallpaperSource) {
      const refreshed = await window.beacon.getWallpapers()
      if (refreshed && refreshed.length > 0) {
        setWallpapers(refreshed)
        setCurrentIndex(0)
      }
    }
  }

  // 8. Custom Wallpaper Folder Selection
  const handleSelectCustomFolder = async (): Promise<void> => {
    if (window.beacon?.selectWallpaperDirectory) {
      const res = await window.beacon.selectWallpaperDirectory()
      if (!res.canceled && res.wallpapers && res.wallpapers.length > 0) {
        setWallpapers(res.wallpapers)
        setCurrentIndex(0)
        setSettings((prev) => ({
          ...prev,
          wallpaperSource: 'custom-folder',
          customWallpaperFolder: res.folderPath || prev.customWallpaperFolder
        }))
      }
    }
  }

  const currentWallpaper = wallpapers[currentIndex] || BUILT_IN_WALLPAPERS[0]
  const previousWallpaper = previousIndex !== null ? wallpapers[previousIndex] : null
  const nextIndex = wallpapers.length > 0 ? (currentIndex + 1) % wallpapers.length : 0
  const nextWallpaper = wallpapers[nextIndex] || null

  // In screensaver mode, apply screensaver-specific privacy and display preferences
  const effectiveSettings: AmbientSettings = isScreensaver
    ? {
        ...settings,
        showClock: screensaverSettings?.showClock ?? true,
        showDate: screensaverSettings?.showDate ?? true,
        showWeather: screensaverSettings?.showWeather ?? true,
        showQuote: screensaverSettings?.showQuote ?? true,
        // Privacy-first: Tasks and Watches hidden on screensaver unless explicitly opted-in
        showTasks: screensaverSettings?.showTasks ?? false,
        showWatches: screensaverSettings?.showWatches ?? false
      }
    : settings

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#080811] transition-opacity duration-300 ease-out ${
        isFullscreen ? 'fixed inset-0 z-40' : 'min-h-[620px] rounded-2xl'
      } ${isScreensaver || (!controlsVisible && isFullscreen) ? 'cursor-none select-none' : ''} ${
        isDismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Ken Burns Hardware-Accelerated Slideshow Layer */}
      <KenBurnsSlideshow
        currentWallpaper={currentWallpaper}
        previousWallpaper={previousWallpaper}
        nextWallpaper={nextWallpaper}
        isTransitioning={isTransitioning}
        transitionDuration={effectiveSettings.transitionDuration}
        kenBurnsEnabled={effectiveSettings.kenBurnsEnabled}
        backgroundDim={effectiveSettings.backgroundDim}
        animationVariant={animVariant}
      />

      {/* 1b. Directional Readability Scrims (protecting top header and bottom widget zones while leaving center 100% open) */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 z-[5] pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-500"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 z-[5] pointer-events-none bg-gradient-to-t from-black/80 via-black/35 to-transparent transition-opacity duration-500"
        aria-hidden="true"
      />

      {/* 2. Frosted Glass Ambient Board Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 lg:p-12 overflow-y-auto">
        {/* Top Header: Clock, Date, Weather & Quote */}
        <AmbientClockWeather
          settings={effectiveSettings}
          settingsLoaded={isSettingsLoaded}
          isScreensaver={isScreensaver}
          onOpenSettings={() => {
            if (!isScreensaver) setIsSettingsOpen(true)
          }}
        />

        {/* Center / Body Area */}
        <div className="flex-1 flex flex-col lg:flex-row items-end justify-between py-6 gap-6">
          {/* Left / Bottom-Left: Live Tasks Column if enabled */}
          {effectiveSettings.showTasks ? (
            <div className="w-full lg:w-auto">
              <AmbientTasksColumn settings={effectiveSettings} isScreensaver={isScreensaver} />
            </div>
          ) : (
            <div className="hidden lg:block flex-1" />
          )}

          {/* Right Column: Live Frosted Glass Watches Feed */}
          {effectiveSettings.showWatches && (
            <div className="w-full lg:w-auto">
              <AmbientWatchesColumn watches={watches} settings={effectiveSettings} />
            </div>
          )}
        </div>

        {/* Bottom spacer for floating controls */}
        <div className="h-10 shrink-0" />
      </div>

      {/* 3. Floating Overlay Controls Bar (Hidden during screensaver mode) */}
      {!isScreensaver && (
        <AmbientControls
          visible={controlsVisible}
          isFullscreen={isFullscreen}
          isPlaying={isPlaying}
          currentWallpaperIndex={currentIndex}
          totalWallpapers={wallpapers.length}
          currentWallpaperTitle={currentWallpaper.name}
          onPrevWallpaper={handlePrev}
          onNextWallpaper={handleNext}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onToggleFullscreen={toggleFullscreen}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onExitAmbient={() => {
            if (isFullscreen) {
              if (window.beacon?.setFullscreen) window.beacon.setFullscreen(false)
              setIsFullscreen(false)
            }
            onNavigate('home')
          }}
        />
      )}

      {/* 4. Ambient Settings Modal (Not shown in screensaver mode) */}
      {!isScreensaver && (
        <AmbientSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onSelectCustomFolder={handleSelectCustomFolder}
          wallpapers={wallpapers}
        />
      )}
    </div>
  )
}
