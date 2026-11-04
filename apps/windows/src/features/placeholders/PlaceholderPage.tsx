import React from 'react'
import { Monitor, FileText, CheckSquare, Clock } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { NavigationRoute } from '../../types'

interface PlaceholderPageProps {
  route: NavigationRoute
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ route }) => {
  const meta = {
    ambient: {
      title: 'Ambient Screen & Screensaver',
      subtitle: 'Full-screen ambient awareness board with photo slideshow',
      icon: Monitor,
      phase: 'Phase 3',
      description:
        'The ambient board displays your notes, reminders, and monitored browser watches over a calm, slow-panning Ken Burns photo slideshow on frosted glass. On Windows, this will run as a native .scr screensaver across all connected displays.',
      highlights: [
        'Hardware-accelerated CSS and WebGL Ken Burns photo animation',
        'Dynamic multi-column frosted glass cards with live countdown timers',
        'Automatic screen sleep detection and multi-monitor synchronization'
      ]
    },
    notes: {
      title: 'Notes Board',
      subtitle: 'Structured notes and rich checklist cards',
      icon: FileText,
      phase: 'Phase 4',
      description:
        'A distraction-free card-based notes surface. On macOS, this reads Apple Notes. For the Windows port, Phase 4 will introduce a local SQLite-backed notes store supporting Markdown, nested checklists, headings, and instant search.',
      highlights: [
        'Interactive checklists with completed-item counters',
        'Local SQLite persistence with zero cloud synchronisation overhead',
        'Auto-tiled responsive card grid designed for large displays'
      ]
    },
    tasks: {
      title: 'Tasks & Reminders',
      subtitle: 'To-do queues with due dates and progress tracking',
      icon: CheckSquare,
      phase: 'Phase 4',
      description:
        'A dedicated task overview tracking daily progress and upcoming deadlines. Tasks are visualized with overdue warnings, completion ratios, and integration with the Windows system tray status count.',
      highlights: [
        'Progress bar displaying tasks completed today vs. remaining',
        'Relative countdown badges ("in 20 min", "today", "tomorrow")',
        'Optional integration with Microsoft To Do via local tokens'
      ]
    },
    home: {
      title: 'Home',
      subtitle: '',
      icon: Monitor,
      phase: '',
      description: '',
      highlights: []
    },
    settings: {
      title: 'Settings',
      subtitle: '',
      icon: Monitor,
      phase: '',
      description: '',
      highlights: []
    }
  }[route]

  const Icon = meta.icon

  return (
    <div className="space-y-6 max-w-3xl animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-helm-card border border-slate-300/40 dark:border-helm-border/80 text-emerald-500">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {meta.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-helm-muted">
              {meta.subtitle}
            </p>
          </div>
        </div>
        <Badge variant="warning">{meta.phase} Feature</Badge>
      </div>

      <Card>
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {meta.description}
          </p>

          <div className="border-t border-slate-100 dark:border-helm-border/50 pt-4">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Planned Capabilities for {meta.phase}
            </h4>
            <ul className="space-y-2">
              {meta.highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-500 dark:text-helm-muted"
                >
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

