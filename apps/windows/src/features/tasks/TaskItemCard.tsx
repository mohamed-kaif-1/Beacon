import React from 'react'
import {
  Check,
  Calendar,
  AlertTriangle,
  Pencil,
  Trash2,
  PlayCircle
} from 'lucide-react'
import { TaskItem, TaskPriority } from '../../types'
import { formatDueDate } from '../../lib/date-utils'

interface TaskItemCardProps {
  task: TaskItem
  onToggleComplete: (id: string) => void
  onEdit: (task: TaskItem) => void
  onDelete: (task: TaskItem) => void
}

export const TaskItemCard: React.FC<TaskItemCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const isCompleted = task.status === 'completed'
  const isInProgress = task.status === 'in_progress'
  const dueDateInfo = formatDueDate(task.dueDate)

  const priorityStyles: Record<TaskPriority, { badge: string; text: string }> = {
    high: {
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
      text: 'High'
    },
    medium: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
      text: 'Medium'
    },
    low: {
      badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25',
      text: 'Low'
    }
  }

  return (
    <div
      className={`group flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
        isCompleted
          ? 'bg-slate-50/50 dark:bg-helm-surface/40 border-slate-200/60 dark:border-helm-border/50 opacity-75'
          : 'bg-white/80 dark:bg-helm-card/70 hover:bg-white dark:hover:bg-helm-card border-slate-200/80 dark:border-helm-border/80 shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isCompleted}
        aria-label={`Mark "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        onClick={() => onToggleComplete(task.id)}
        className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
          isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-helm-surface'
        }`}
      >
        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-sm font-medium leading-snug break-words ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-helm-muted'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h3>

          {/* Quick Action Buttons (visible on hover and keyboard focus) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => onEdit(task)}
              title="Edit task"
              aria-label={`Edit task "${task.title}"`}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-helm-cardHover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              title="Delete task"
              aria-label={`Delete task "${task.title}"`}
              className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {task.description && (
          <p
            className={`text-xs leading-relaxed line-clamp-2 ${
              isCompleted
                ? 'text-slate-400/80 dark:text-helm-muted/60'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Metadata row: Priority, Status, Due Date */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          {/* Priority Pill */}
          <span
            className={`px-2 py-0.5 rounded-full border font-medium ${priorityStyles[task.priority].badge}`}
          >
            {priorityStyles[task.priority].text}
          </span>

          {/* In-Progress Pill */}
          {isInProgress && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 font-medium">
              <PlayCircle className="w-3 h-3" />
              In Progress
            </span>
          )}

          {/* Due Date Indicator */}
          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${
                isCompleted
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                  : dueDateInfo.isOverdue
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  : dueDateInfo.isToday
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-slate-100 dark:bg-helm-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-helm-border'
              }`}
            >
              {dueDateInfo.isOverdue && !isCompleted ? (
                <AlertTriangle className="w-3 h-3 text-rose-500" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {dueDateInfo.label}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
