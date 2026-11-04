import React, { useEffect, useState, useCallback } from 'react'
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { TaskItem, AmbientSettings } from '../../types'
import { formatDueDate } from '../../lib/date-utils'

interface AmbientTasksColumnProps {
  settings: AmbientSettings
  isScreensaver?: boolean
}

export const AmbientTasksColumn: React.FC<AmbientTasksColumnProps> = ({
  settings,
  isScreensaver = false
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>([])

  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      if (window.beacon?.getProductivitySummary) {
        const summary = await window.beacon.getProductivitySummary()
        // Gather and filter out completed tasks
        const combined = [...summary.todayTasks, ...summary.upcomingTasks]
        let pending = combined.filter((t) => t.status !== 'completed')

        if (isScreensaver) {
          // Screensaver mode: sort by due date urgency (overdue > today > upcoming) and priority (high > med > low)
          const now = new Date()
          const todayStr = now.toISOString().split('T')[0]
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)
          const tomorrowStr = tomorrow.toISOString().split('T')[0]

          pending.sort((a, b) => {
            const getUrgency = (t: TaskItem): number => {
              if (!t.dueDate) return 0
              const d = new Date(t.dueDate).toISOString().split('T')[0]
              if (d < todayStr) return 4 // Overdue
              if (d === todayStr) return 3 // Due today
              if (d === tomorrowStr) return 2 // Due tomorrow
              return 1 // Future
            }
            const uDiff = getUrgency(b) - getUrgency(a)
            if (uDiff !== 0) return uDiff

            const getPriority = (p?: string): number => {
              if (p === 'high') return 3
              if (p === 'medium') return 2
              return 1
            }
            const pDiff = getPriority(b.priority) - getPriority(a.priority)
            if (pDiff !== 0) return pDiff

            if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate
            return (b.createdAt || 0) - (a.createdAt || 0)
          })

          setTasks(pending.slice(0, 4))
        } else {
          setTasks(pending.slice(0, 4))
        }
      } else if (window.beacon?.getTasks) {
        const all = await window.beacon.getTasks({ view: 'all' })
        const pending = all.filter((t) => t.status !== 'completed').slice(0, 4)
        setTasks(pending)
      }
    } catch (err) {
      console.error('Failed to load ambient tasks:', err)
    }
  }, [isScreensaver])

  useEffect(() => {
    loadTasks()

    // 1. Live synchronization with database via IPC push event
    let unsub: (() => void) | undefined
    if (window.beacon?.onTasksChange) {
      unsub = window.beacon.onTasksChange(() => {
        loadTasks()
      })
    }

    // 2. Periodic background refresh
    const timer = setInterval(loadTasks, isScreensaver ? 15000 : 30000)

    return () => {
      if (unsub) unsub()
      clearInterval(timer)
    }
  }, [loadTasks, isScreensaver])

  const glassStyle: React.CSSProperties = {
    backdropFilter: `blur(${settings.frostedGlassBlur || 16}px)`,
    WebkitBackdropFilter: `blur(${settings.frostedGlassBlur || 16}px)`
  }

  // Gracefully handle empty tasks state
  if (tasks.length === 0) {
    if (!isScreensaver) {
      return null
    }

    return (
      <div className="flex flex-col space-y-2.5 max-w-sm w-full animate-fadeIn select-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl ambient-header-glass w-fit">
          <CheckSquare className="w-4 h-4 text-emerald-400 drop-shadow" />
          <h2 className="text-xs font-semibold tracking-wider uppercase text-[#F8FAFC] ambient-shadow-text">
            Pending Tasks
          </h2>
        </div>
        <div
          style={glassStyle}
          className="p-3.5 rounded-2xl ambient-card-glass text-white text-xs flex items-center gap-2.5 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 drop-shadow" />
          <span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">No pending tasks</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-3 max-w-sm w-full animate-fadeIn select-none">
      {/* Header with Localized Glass Surface */}
      <div className="inline-flex items-center justify-between w-full px-3.5 py-1.5 rounded-xl ambient-header-glass">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-400 drop-shadow" />
          <h2 className="text-xs font-semibold tracking-wider uppercase text-[#F8FAFC] ambient-shadow-text">
            {isScreensaver ? 'Pending Tasks' : 'Focus & Reminders'}
          </h2>
        </div>
        <span className="text-xs font-mono font-semibold text-emerald-300 ambient-shadow-text">
          {tasks.length} active
        </span>
      </div>

      {/* Task Cards */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const due = formatDueDate(task.dueDate)
          return (
            <div
              key={task.id}
              style={glassStyle}
              className={`p-3.5 rounded-2xl transition-all ${
                due.isOverdue
                  ? 'ambient-card-glass-overdue'
                  : due.isToday
                  ? 'ambient-card-glass-today'
                  : 'ambient-card-glass'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-semibold text-[#FFFFFF] leading-snug line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {task.title}
                </h4>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold tracking-wide shrink-0 ${
                    task.priority === 'high'
                      ? 'bg-rose-500/35 text-rose-100 border border-rose-400/50'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/35 text-amber-100 border border-amber-400/50'
                      : 'bg-sky-500/35 text-sky-100 border border-sky-400/50'
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {/* In screensaver mode: descriptions and notes are strictly omitted for privacy */}
              {!isScreensaver && task.description && (
                <p className="text-xs text-[#E2E8F0] line-clamp-1 leading-normal font-normal">
                  {task.description}
                </p>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#E2E8F0] font-medium pt-0.5">
                  {due.isOverdue ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 drop-shadow" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0 drop-shadow" />
                  )}
                  <span className={due.isOverdue ? 'text-rose-200 font-semibold' : 'text-[#E2E8F0] font-medium'}>
                    {due.label}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
