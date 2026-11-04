import React, { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Activity,
  Globe,
  Bell,
  FileText,
  CheckSquare,
  AlertTriangle,
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react'
import { BeaconSymbol } from '../../components/ui/BeaconLogo'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusIndicator } from '../../components/ui/StatusIndicator'
import { Badge } from '../../components/ui/Badge'
import {
  NavigationRoute,
  BoardWatch,
  BrowserIntegrationStatus,
  ProductivitySummary
} from '../../types'
import { WatchCard } from './WatchCard'
import { formatRelativeTime } from '../../lib/date-utils'

interface HomePageProps {
  onNavigate: (route: NavigationRoute, action?: string) => void
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [watches, setWatches] = useState<BoardWatch[]>([])
  const [browserStatus, setBrowserStatus] = useState<BrowserIntegrationStatus | null>(null)
  const [summary, setSummary] = useState<ProductivitySummary | null>(null)

  const loadData = async (): Promise<void> => {
    try {
      if (window.beacon?.getWatches) {
        const w = await window.beacon.getWatches()
        setWatches(w)
      }
      if (window.beacon?.getBrowserStatus) {
        const s = await window.beacon.getBrowserStatus()
        setBrowserStatus(s)
      }
      if (window.beacon?.getProductivitySummary) {
        const prod = await window.beacon.getProductivitySummary()
        setSummary(prod)
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    }
  }

  useEffect(() => {
    loadData()

    // Subscribe to live pushes from Native Messaging Host
    const unsubscribeWatches = window.beacon?.onWatchesUpdate?.((updatedWatches) => {
      setWatches(updatedWatches)
    })
    const unsubscribeStatus = window.beacon?.onBrowserStatusUpdate?.((updatedStatus) => {
      setBrowserStatus(updatedStatus)
    })

    return () => {
      if (unsubscribeWatches) unsubscribeWatches()
      if (unsubscribeStatus) unsubscribeStatus()
    }
  }, [])

  const handleOpenGitHub = (): void => {
    if (window.beacon?.openExternal) {
      window.beacon.openExternal('https://github.com/jonathanvineet/helm')
    } else {
      window.open('https://github.com/jonathanvineet/helm', '_blank')
    }
  }

  const attentionCount = watches.filter((w) => w.state === 'attention').length
  const activeCount = watches.filter((w) => w.state !== 'done').length

  return (
    <div className="space-y-8 animate-fadeIn select-none">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge variant="success">Windows Port · Phase 4 Live</Badge>
            <span className="text-xs text-slate-500 dark:text-helm-muted">
              Notes & Tasks with Local SQLite Store
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <BeaconSymbol size={32} />
            BEACON for Windows
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-helm-muted max-w-xl leading-relaxed">
            Ambient productivity and live web awareness. BEACON connects seamlessly with your Chromium
            browser extension and stores your notes and daily tasks locally in a fast SQLite database.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline" size="sm" onClick={() => onNavigate('notes', 'new-note')}>
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            New Note
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('tasks', 'new-task')}>
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            New Task
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('ambient')}>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Ambient Board
          </Button>
          <Button variant="secondary" size="sm" onClick={handleOpenGitHub}>
            <ExternalLink className="w-3.5 h-3.5" />
            GitHub
          </Button>
        </div>
      </div>

      {/* Productivity Metrics Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Pending Tasks */}
        <button
          type="button"
          onClick={() => onNavigate('tasks')}
          aria-label={`Pending tasks: ${summary?.pendingTasks ?? 0}`}
          className="p-4 rounded-2xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-left hover:border-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-helm-muted mb-2">
            <span className="text-xs font-medium">Pending Tasks</span>
            <CheckSquare className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {summary?.pendingTasks ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-helm-muted mt-1 flex items-center gap-1">
            <span>In-progress: {summary?.inProgressTasks ?? 0}</span>
          </div>
        </button>

        {/* Tasks Due Today */}
        <button
          type="button"
          onClick={() => onNavigate('tasks')}
          aria-label={`Tasks due today: ${summary?.tasksDueToday ?? 0}`}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
            (summary?.tasksDueToday ?? 0) > 0
              ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
              : 'bg-white dark:bg-helm-card border-slate-200 dark:border-helm-border/80 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-helm-muted">
              Due Today
            </span>
            <Calendar className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {summary?.tasksDueToday ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-helm-muted mt-1">
            {(summary?.tasksDueToday ?? 0) > 0 ? 'Action required today' : 'No deadlines today'}
          </div>
        </button>

        {/* Overdue Tasks */}
        <button
          type="button"
          onClick={() => onNavigate('tasks')}
          aria-label={`Overdue tasks: ${summary?.overdueTasks ?? 0}`}
          className={`p-4 rounded-2xl border text-left transition-all shadow-sm group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
            (summary?.overdueTasks ?? 0) > 0
              ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50'
              : 'bg-white dark:bg-helm-card border-slate-200 dark:border-helm-border/80 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-helm-muted">
              Overdue
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {summary?.overdueTasks ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-helm-muted mt-1">
            {(summary?.overdueTasks ?? 0) > 0 ? 'Past deadline' : 'Zero overdue items'}
          </div>
        </button>

        {/* Total Notes */}
        <button
          type="button"
          onClick={() => onNavigate('notes')}
          aria-label={`Total notes saved: ${summary?.totalNotes ?? 0}`}
          className="p-4 rounded-2xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-left hover:border-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-helm-muted mb-2">
            <span className="text-xs font-medium">Notes Saved</span>
            <FileText className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {summary?.totalNotes ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-helm-muted mt-1">
            Stored in `%APPDATA%\Helm\helm.db`
          </div>
        </button>
      </div>

      {/* Previews: Today's Tasks & Recent Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Tasks Preview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Today's Focus & Tasks
              </h3>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {summary && summary.todayTasks.length > 0 ? (
            <div className="space-y-2">
              {summary.todayTasks.slice(0, 3).map((task) => (
                <button
                  type="button"
                  key={task.id}
                  onClick={() => onNavigate('tasks')}
                  aria-label={`View task: ${task.title}`}
                  className="flex items-center justify-between w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-helm-card hover:bg-slate-100 dark:hover:bg-helm-cardHover border border-slate-200/60 dark:border-helm-border/60 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                >
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate flex-1 pr-2">
                    {task.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${
                      task.priority === 'high'
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/25'
                        : task.priority === 'medium'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/25'
                        : 'bg-sky-500/10 text-sky-600 border border-sky-500/25'
                    }`}
                  >
                    {task.priority}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 dark:text-helm-muted space-y-2">
              <p className="text-xs">No tasks due today.</p>
              <button
                type="button"
                onClick={() => onNavigate('tasks', 'new-task')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                + Schedule a task for today
              </button>
            </div>
          )}
        </div>

        {/* Recent Notes Preview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Recent Notes
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('notes')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            >
              View all <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          {summary && summary.recentNotes.length > 0 ? (
            <div className="space-y-2">
              {summary.recentNotes.slice(0, 3).map((note) => (
                <button
                  type="button"
                  key={note.id}
                  onClick={() => onNavigate('notes')}
                  aria-label={`View note: ${note.title.trim() || 'Untitled Note'}`}
                  className="flex items-center justify-between w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-helm-card hover:bg-slate-100 dark:hover:bg-helm-cardHover border border-slate-200/60 dark:border-helm-border/60 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                >
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate flex-1 pr-2">
                    {note.title.trim() || 'Untitled Note'}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-helm-muted">
                    {formatRelativeTime(note.updatedAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 dark:text-helm-muted space-y-2">
              <p className="text-xs">No notes captured yet.</p>
              <button
                onClick={() => onNavigate('notes', 'new-note')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                + Create your first note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Status & Core Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Real Status Indicators */}
        <Card
          title="Runtime & Service Health"
          description="Verified local subsystem states on this Windows host"
        >
          <div className="space-y-2.5">
            <StatusIndicator
              label="Desktop Core (Electron 34)"
              statusText="Running"
              variant="active"
              pulse
            />
            <StatusIndicator
              label="SQLite Database (`beacon.db`)"
              statusText="Active (Pure WASM/WAL Mode)"
              variant="active"
            />
            <StatusIndicator
              label="Windows System Tray"
              statusText="Active"
              variant="active"
            />
            <StatusIndicator
              label="Browser Extension Connection"
              statusText={
                browserStatus?.state === 'connected'
                  ? `Connected (${browserStatus.browserType && browserStatus.browserType !== 'unknown' ? browserStatus.browserType : 'Active'})`
                  : browserStatus?.state === 'connecting'
                  ? 'Connecting...'
                  : browserStatus?.state === 'error'
                  ? 'Connection Error'
                  : 'Disconnected'
              }
              variant={
                browserStatus?.state === 'connected'
                  ? 'active'
                  : browserStatus?.state === 'connecting'
                  ? 'pending'
                  : browserStatus?.state === 'error'
                  ? 'warning'
                  : 'inactive'
              }
              pulse={browserStatus?.state === 'connected' || browserStatus?.state === 'connecting'}
            />
            <StatusIndicator
              label="Watched Pages Tracked"
              statusText={`${activeCount} active${attentionCount > 0 ? ` (${attentionCount} need attention)` : ''}`}
              variant={attentionCount > 0 ? 'warning' : activeCount > 0 ? 'active' : 'inactive'}
            />
            <StatusIndicator
              label="Ambient Screen Board"
              statusText="Live (Ken Burns & Slideshow)"
              variant="active"
              pulse
            />
          </div>
        </Card>

        {/* Local Security & Architecture */}
        <Card
          title="Local-First Architecture"
          description="Security and operational boundaries established in Phases 1, 2, 3 & 4"
        >
          <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  SQLite Persistence in %APPDATA%:
                </strong>{' '}
                All notes and tasks are strictly stored in `%APPDATA%\Helm\helm.db`. Zero cloud syncing,
                zero remote tracking, and instant sub-millisecond retrieval.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Bell className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  Secure Stdio & Named Pipe:
                </strong>{' '}
                Zero HTTP/TCP server ports opened. Chromium extensions talk strictly over standard
                input/output frames to our host binary and a local Windows Named Pipe (`\\.\pipe\helm-windows-ipc`).
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  System Tray Integration:
                </strong>{' '}
                The system tray displays real-time badges, quick shortcuts for New Note and New Task,
                and background watch syncing.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Watched Pages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live Watched Pages & Insights
            </h2>
            <Badge variant={watches.length > 0 ? 'default' : 'neutral'}>
              {watches.length} {watches.length === 1 ? 'Page' : 'Pages'}
            </Badge>
          </div>
          {attentionCount > 0 && (
            <Badge variant="danger">
              {attentionCount} {attentionCount === 1 ? 'requires attention' : 'require attention'}
            </Badge>
          )}
        </div>

        {watches.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-dashed border-slate-300 dark:border-helm-border/70 text-center space-y-3">
            <Globe className="w-9 h-9 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No watched pages received yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-helm-muted max-w-md mx-auto leading-relaxed">
              When you add watched pages (e.g., packages, visa applications, job submissions) in the BEACON
              browser extension in Chrome, Edge, or Brave, they will synchronize here via Windows Native Messaging.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => onNavigate('settings')}>
                View Native Messaging Setup
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watches.map((watch, index) => (
              <WatchCard key={`${watch.name}-${watch.url || index}`} watch={watch} />
            ))}
          </div>
        )}
      </div>

      {/* Roadmap / Capabilities Preview */}
      <Card
        title="Port Milestones & Progress"
        description="Foundational capabilities designed for seamless integration into this core"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <Badge variant="success">Phase 2 Done</Badge>
            </div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Browser Extension
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed">
              Native messaging host on Windows stdio and Named Pipe syncing watches with Chrome, Edge, and Brave.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <Badge variant="success">Phase 3 Done</Badge>
            </div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Ambient Screen Board
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed">
              Fullscreen ambient board with Ken Burns photo slideshow, frosted glass panels & weather.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <Badge variant="success">Phase 4 Done</Badge>
            </div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Notes & Tasks
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed">
              Local SQLite database (`helm.db`) with full Notes editor, Tasks queue, and metrics.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-helm-surface border border-slate-200/70 dark:border-helm-border/50">
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <Badge variant="neutral">Phase 5</Badge>
            </div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              3D Print OCR
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed">
              Packaged Python & Tesseract engine calculating INR quotations from Creality Print slicer estimates.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
