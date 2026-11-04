import React, { useEffect, useState } from 'react'
import { useFocusTrap } from '../../lib/useFocusTrap'
import {
  X,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Flag
} from 'lucide-react'
import { TaskItem, TaskPriority, TaskStatus } from '../../types'
import { toInputDateTimeString, fromInputDateTimeString } from '../../lib/date-utils'

interface TaskModalProps {
  isOpen: boolean
  taskToEdit?: TaskItem | null
  onClose: () => void
  onSave: (data: {
    id?: string
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
    dueDate?: number | null
  }) => Promise<void>
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  taskToEdit,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('pending')
  const [dueDateString, setDueDateString] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const trapRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose })

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description || '')
      setPriority(taskToEdit.priority)
      setStatus(taskToEdit.status)
      setDueDateString(toInputDateTimeString(taskToEdit.dueDate))
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('pending')
      setDueDateString('')
    }
    setError(null)
    setIsSaving(false)
  }, [taskToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Please provide a task title.')
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      const parsedDueDate = fromInputDateTimeString(dueDateString)

      await onSave({
        id: taskToEdit?.id,
        title: trimmedTitle,
        description: description.trim(),
        priority,
        status,
        dueDate: parsedDueDate !== undefined ? parsedDueDate : (dueDateString ? null : null)
      })

      onClose()
    } catch (err: unknown) {
      console.error('Failed to save task:', err)
      setError(err instanceof Error ? err.message : 'Failed to save task.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-lg bg-white dark:bg-helm-surface rounded-2xl border border-slate-200 dark:border-helm-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-helm-border/80 bg-slate-50/60 dark:bg-helm-card/40">
          <h2 id="task-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            {taskToEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-helm-cardHover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div role="alert" className="flex items-center gap-2 p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="task-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={200}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              id="task-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context, links, or bullet points..."
              rows={3}
              maxLength={10000}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Priority & Status Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                Priority
              </span>
              <div role="radiogroup" aria-label="Task Priority" className="grid grid-cols-3 gap-1.5">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p
                  return (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-medium rounded-lg capitalize border transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                        isSelected
                          ? p === 'high'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40 font-semibold'
                            : p === 'medium'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 font-semibold'
                            : 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/40 font-semibold'
                          : 'bg-slate-50 dark:bg-helm-card text-slate-600 dark:text-slate-400 border-slate-200 dark:border-helm-border hover:bg-slate-100 dark:hover:bg-helm-cardHover'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="task-status-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-due-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                Due Date & Time (Optional)
              </label>
              {dueDateString && (
                <button
                  type="button"
                  onClick={() => setDueDateString('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  Clear date
                </button>
              )}
            </div>
            <input
              id="task-due-input"
              type="datetime-local"
              value={dueDateString}
              onChange={(e) => setDueDateString(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-helm-border/80">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-helm-cardHover transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : taskToEdit ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
