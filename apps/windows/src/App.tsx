import React, { useEffect, useRef, useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './features/home/HomePage'
import { SettingsPage } from './features/settings/SettingsPage'
import { AmbientBoardPage } from './features/ambient/AmbientBoardPage'
import { NotesPage } from './features/notes/NotesPage'
import { TasksPage } from './features/tasks/TasksPage'
import { OnboardingModal } from './features/onboarding/OnboardingModal'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { NavigationRoute } from './types'
import { initTheme } from './lib/theme'

export const App: React.FC = () => {
  const isInitialScreensaver =
    typeof window !== 'undefined' &&
    Boolean(window.location.hash.includes('screensaver'))

  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>(
    isInitialScreensaver ? 'ambient' : 'home'
  )
  const [isFullscreen, setIsFullscreen] = useState<boolean>(isInitialScreensaver)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)
  const [isScreensaver, setIsScreensaver] = useState<boolean>(isInitialScreensaver)
  const previousRouteRef = useRef<NavigationRoute>('home')

  useEffect(() => {
    // Initialize theme system
    const cleanupTheme = initTheme()

    // Check first-run onboarding status
    if (window.beacon?.isOnboardingCompleted) {
      window.beacon
        .isOnboardingCompleted()
        .then((completed) => {
          if (!completed) {
            setShowOnboarding(true)
          }
        })
        .catch((err) => {
          console.error('[BEACON App] Failed to check onboarding status:', err)
        })
    }

    // Listen for navigation triggers from the Electron system tray
    let cleanupNavigation: (() => void) | undefined
    if (window.beacon?.onNavigate) {
      cleanupNavigation = window.beacon.onNavigate((route: string) => {
        if (
          route === 'home' ||
          route === 'ambient' ||
          route === 'notes' ||
          route === 'tasks' ||
          route === 'settings'
        ) {
          setCurrentRoute(route)
        }
      })
    }

    // Listen for quick action triggers (e.g. new-note, new-task)
    let cleanupAction: (() => void) | undefined
    if (window.beacon?.onNavigateAction) {
      cleanupAction = window.beacon.onNavigateAction((action: string) => {
        setPendingAction(action)
      })
    }

    // Check and listen for window fullscreen state changes
    if (window.beacon?.isFullscreen) {
      window.beacon.isFullscreen().then(setIsFullscreen).catch(console.error)
    }

    let cleanupFullscreen: (() => void) | undefined
    if (window.beacon?.onFullscreenChange) {
      cleanupFullscreen = window.beacon.onFullscreenChange((fs) => {
        setIsFullscreen(fs)
      })
    }

    // Check initial screensaver status
    if (window.beacon?.isScreensaverMode) {
      window.beacon
        .isScreensaverMode()
        .then((active) => {
          if (active) {
            setIsScreensaver(true)
            setCurrentRoute('ambient')
          }
        })
        .catch(console.error)
    }

    // Subscribe to live screensaver activation / exit events
    let cleanupScreensaver: (() => void) | undefined
    if (window.beacon?.onScreensaverChange) {
      cleanupScreensaver = window.beacon.onScreensaverChange((active) => {
        setIsScreensaver(active)
        if (active) {
          setCurrentRoute((prev) => {
            previousRouteRef.current = prev
            return 'ambient'
          })
        } else {
          setCurrentRoute(previousRouteRef.current || 'home')
          if (typeof window !== 'undefined' && window.location.hash.includes('screensaver')) {
            try {
              window.history.replaceState(null, '', window.location.pathname)
            } catch {}
          }
        }
      })
    }

    return () => {
      cleanupTheme()
      if (cleanupNavigation) cleanupNavigation()
      if (cleanupAction) cleanupAction()
      if (cleanupFullscreen) cleanupFullscreen()
      if (cleanupScreensaver) cleanupScreensaver()
    }
  }, [])

  // Clear pendingAction once handled or route switched
  const handleRouteChange = (route: NavigationRoute, action?: string): void => {
    setCurrentRoute(route)
    if (action) {
      setPendingAction(action)
    }
  }

  // If screensaver is active, render dedicated fullscreen borderless Ambient screen with guaranteed fail-safe background
  if (isScreensaver) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-[#080811] bg-gradient-to-b from-[#0a1218] via-[#10222a] to-[#070e13] select-none cursor-none">
        <ErrorBoundary
          fallbackTitle="Ambient Screensaver"
          onReset={() => {
            const exitFn = window.beacon?.exitScreensaver || window.helm?.exitScreensaver
            if (exitFn) {
              exitFn().catch(console.error)
            } else {
              handleRouteChange('home')
            }
          }}
        >
          <AmbientBoardPage
            onNavigate={handleRouteChange}
            isFullscreen={true}
            setIsFullscreen={setIsFullscreen}
            isScreensaver={true}
          />
        </ErrorBoundary>
      </div>
    )
  }

  // If in fullscreen and viewing ambient, render completely borderless without sidebar
  if (isFullscreen && currentRoute === 'ambient') {
    return (
      <div className="w-screen h-screen overflow-hidden bg-black select-none">
        <AmbientBoardPage
          onNavigate={handleRouteChange}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
        />
      </div>
    )
  }

  const renderContent = (): React.ReactNode => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onNavigate={handleRouteChange} />
      case 'ambient':
        return (
          <AmbientBoardPage
            onNavigate={handleRouteChange}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        )
      case 'notes':
        return <NotesPage initialAction={pendingAction ?? undefined} />
      case 'tasks':
        return <TasksPage initialAction={pendingAction ?? undefined} />
      case 'settings':
        return <SettingsPage onOpenOnboarding={() => setShowOnboarding(true)} />
      default:
        return <HomePage onNavigate={handleRouteChange} />
    }
  }

  return (
    <>
      <AppLayout currentRoute={currentRoute} onRouteChange={handleRouteChange}>
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </AppLayout>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onNavigate={handleRouteChange}
      />
    </>
  )
}
