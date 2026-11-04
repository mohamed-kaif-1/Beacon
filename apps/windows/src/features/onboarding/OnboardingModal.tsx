import React, { useState, useEffect, useCallback } from 'react'
import { useFocusTrap } from '../../lib/useFocusTrap'
import {
  Sparkles,
  Layers,
  FileText,
  CheckSquare,
  Globe,
  Radio,
  Sun,
  Moon,
  Laptop,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Play,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { BeaconSymbol } from '../../components/ui/BeaconLogo'
import { Button } from '../../components/ui/Button'
import { NavigationRoute, ThemeOption } from '../../types'
import { applyTheme, getStoredTheme } from '../../lib/theme'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (route: NavigationRoute, action?: string) => void
}

interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  badge: string
}

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to BEACON',
    subtitle: 'Calm ambient awareness & local-first desktop productivity',
    badge: 'Introduction'
  },
  {
    id: 'ambient',
    title: 'Ambient Screen Board',
    subtitle: 'Cinematic full-screen visual canvas and living standby display',
    badge: 'Ambient Canvas'
  },
  {
    id: 'notes-tasks',
    title: 'Notes & Actionable Tasks',
    subtitle: 'Instant markdown notes and organized task lists with SQLite storage',
    badge: 'Productivity'
  },
  {
    id: 'browser',
    title: 'Chromium Extension & Watches',
    subtitle: 'Live web monitors and Native Messaging for Chrome, Edge, and Brave',
    badge: 'Web Monitoring'
  },
  {
    id: 'setup',
    title: 'Personalize & Get Started',
    subtitle: 'Configure your appearance and dive into your new workspace',
    badge: 'Quick Setup'
  }
]

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(getStoredTheme())

  const handleFinish = useCallback(async () => {
    try {
      if (window.beacon?.setOnboardingCompleted) {
        await window.beacon.setOnboardingCompleted(true)
      }
    } catch (err) {
      console.error('[Onboarding] Failed to persist completion flag:', err)
    }
    onClose()
  }, [onClose])

  const trapRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose: handleFinish })

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleFinish()
    }
  }, [currentStep, handleFinish])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  // Handle keyboard navigation: Esc to close, Arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleFinish()
      } else if (e.key === 'ArrowRight' && currentStep < STEPS.length - 1) {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        e.preventDefault()
        handleBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep, handleNext, handleBack, handleFinish])

  if (!isOpen) return null

  const handleThemeChange = (newTheme: ThemeOption): void => {
    setSelectedTheme(newTheme)
    applyTheme(newTheme)
  }

  const handleQuickAction = (route: NavigationRoute, action?: string): void => {
    handleFinish()
    if (onNavigate) {
      onNavigate(route, action)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to BEACON Onboarding Tour"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div
        ref={trapRef}
        className="relative w-full max-w-2xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-helm-border/40 bg-slate-50/50 dark:bg-helm-surface/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0e0f22] flex items-center justify-center border border-indigo-500/30 p-1">
              <BeaconSymbol size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  BEACON Windows
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                  {STEPS[currentStep].badge}
                </span>
              </div>
              <div role="status" aria-live="polite" className="text-[11px] text-slate-500 dark:text-helm-muted">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            title="Skip onboarding tour (Esc)"
            aria-label="Skip onboarding tour"
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-helm-muted dark:hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <span>Skip tour</span>
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Step Progress Dots Bar */}
        <div className="w-full bg-slate-100 dark:bg-black/30 h-1">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step Content Area */}
        <div className="p-6 md:p-8 flex-1 min-h-[380px] flex flex-col justify-between">
          {/* Slide 1: Welcome */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Welcome to BEACON</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Ambient Productivity for Windows
                </h2>
                <p className="text-sm text-slate-600 dark:text-helm-muted leading-relaxed">
                  BEACON keeps your essential workflow context—ambient visuals, time, weather,
                  markdown notes, task queues, and live web monitors—effortlessly visible
                  without cognitive clutter or intrusive distractions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Ambient Board
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-helm-muted">
                    Cinematic Ken Burns photo slideshows, time, and weather standby.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Notes & Tasks
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-helm-muted">
                    Fast SQLite-backed markdown notes, priority tasks, and filters.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Web Watches
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-helm-muted">
                    Monitor web pages with native browser messaging in Chrome & Edge.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-600 dark:text-helm-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>100% Local-First & Private:</strong> All your notes, tasks, and settings are stored locally on your machine in <code className="text-slate-800 dark:text-slate-200">%APPDATA%\Beacon</code>.
                </span>
              </div>
            </div>
          )}

          {/* Slide 2: Ambient Screen Board */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-medium border border-sky-500/20">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Cinematic Immersion</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Ambient Screen Board
                </h2>
                <p className="text-sm text-slate-600 dark:text-helm-muted leading-relaxed">
                  Turn your secondary display or inactive desktop into a calm, living canvas.
                  BEACON combines hardware-accelerated animations with glanceable productivity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Ken Burns Motion & Photography
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                      Subtle pan-and-zoom animations with smooth cross-fades. Choose from built-in high-resolution photography or select any custom folder on your computer.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Frosted Glass Productivity HUD
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                      Floating live clock, local weather conditions, active task summaries, and web watches overlaid on a customizable frosted blur.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Quick Ambient Controls
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                      Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-black/40 rounded border border-slate-300 dark:border-helm-border text-[10px] font-mono">F11</kbd> for borderless fullscreen, <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-black/40 rounded border border-slate-300 dark:border-helm-border text-[10px] font-mono">Space</kbd> to pause or resume slideshows, and <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-black/40 rounded border border-slate-300 dark:border-helm-border text-[10px] font-mono">← / →</kbd> to change slides.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3: Notes & Tasks */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Local SQLite Foundation</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Markdown Notes & Priority Tasks
                </h2>
                <p className="text-sm text-slate-600 dark:text-helm-muted leading-relaxed">
                  Capture thoughts instantly and track your daily priorities without leaving your desk.
                  Designed for speed, zero startup lag, and offline reliability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Markdown Notes
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-600 dark:text-helm-muted space-y-1.5 list-disc list-inside">
                    <li>Pin critical notes to the top of your list</li>
                    <li>Instant live search across titles and content</li>
                    <li>Auto-saves edits safely as you type</li>
                    <li>Quick capture action from the Windows Tray</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Actionable Tasks
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-600 dark:text-helm-muted space-y-1.5 list-disc list-inside">
                    <li>Filter by Today, Upcoming, or Completed</li>
                    <li>Priority indicators: High, Medium, Low</li>
                    <li>Due dates with overdue highlights</li>
                    <li>Synchronized with the Ambient Board HUD</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200/60 dark:border-helm-border/30 text-xs text-slate-600 dark:text-helm-muted flex items-center justify-between">
                <span>Tray Quick Actions:</span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Right-click tray icon → &quot;New Note&quot; or &quot;New Task&quot;
                </span>
              </div>
            </div>
          )}

          {/* Slide 4: Browser Extension */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/20">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Native Messaging Channel</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Browser Extension Integration
                </h2>
                <p className="text-sm text-slate-600 dark:text-helm-muted leading-relaxed">
                  BEACON connects with your everyday Chromium browser to bring real-time web awareness directly to your desktop.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Zero-Network Named Pipe IPC
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                      BEACON communicates with Chrome, Microsoft Edge, and Brave via an ultra-fast local Windows Named Pipe (<code className="font-mono text-[10px]">\\.\pipe\helm-windows-ipc</code>). No external ports or cloud servers are used.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Live Watch Monitors
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-helm-muted mt-0.5">
                      Monitor build pipelines, ticket status, shipments, and price changes. When a watch item triggers attention, BEACON delivers a native Windows desktop notification.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                Extension registration scripts and live connection status can be verified anytime in <strong>Settings → Chromium Extension Integration</strong>.
              </div>
            </div>
          )}

          {/* Slide 5: Quick Setup & Start */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Setup Complete</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Personalize & Begin
                </h2>
                <p className="text-sm text-slate-600 dark:text-helm-muted leading-relaxed">
                  Choose your theme preference and select where you would like to start. You can replay this tour anytime from Settings.
                </p>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Theme Appearance
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleThemeChange('system')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                      selectedTheme === 'system'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    <span>System Default</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('dark')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                      selectedTheme === 'dark'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark (Ambient)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('light')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                      selectedTheme === 'light'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* Where to start buttons */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quick Start Destinations
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickAction('ambient')}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-helm-border bg-slate-50 dark:bg-helm-surface text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Open Ambient Board</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAction('notes', 'new-note')}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-helm-border bg-slate-50 dark:bg-helm-surface text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-500" />
                    <span>Create First Note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAction('tasks', 'new-task')}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-helm-border bg-slate-50 dark:bg-helm-surface text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
                    <span>Add First Task</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-helm-border/40 bg-slate-50/50 dark:bg-helm-surface/30">
          <div role="tablist" aria-label="Onboarding tour steps" className="flex items-center gap-1.5">
            {STEPS.map((step, idx) => (
              <button
                type="button"
                key={step.id}
                role="tab"
                onClick={() => setCurrentStep(idx)}
                aria-selected={idx === currentStep}
                aria-label={`Step ${idx + 1}: ${step.title}`}
                title={step.title}
                className={`h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                  idx === currentStep
                    ? 'w-6 bg-emerald-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {currentStep > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBack}
                className="gap-1.5 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                className="gap-1.5 text-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleFinish}
                className="gap-1.5 text-xs shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Get Started with BEACON</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

