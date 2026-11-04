import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useFocusTrap } from '../../lib/useFocusTrap'
import {
  CheckSquare,
  Plus,
  Search,
  X,
  Filter,
  Trash2,
  Loader2
} from 'lucide-react'
import { TaskItem, TaskPriority, TaskStatus, TaskFilterOptions } from '../../types'
import { TaskItemCard } from './TaskItemCard'
import { TaskModal } from './TaskModal'

interface TasksPageProps {
  initialAction?: string
}

type TabType = 'all' | 'today' | 'upcoming' | 'completed'

export const TasksPage: React.FC<TasksPageProps> = ({ initialAction }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [announcement, setAnnouncement] = useState<string | null>(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null)

  // Delete confirmation
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteModalRef = useFocusTrap<HTMLDivElement>({
    isOpen: Boolean(taskToDelete),
    onClose: () => setTaskToDelete(null)
  })

  // Fetch tasks
  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      if (window.beacon?.getTasks) {
        const filter: TaskFilterOptions = {
          view: activeTab,
          priority: priorityFilter,
          search: searchQuery
        }
        const fetched = await window.beacon.getTasks(filter)
        setTasks(fetched)
      }
    } catch (err) {
      console.error('Failed to load tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, priorityFilter, searchQuery])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Handle initialAction or navigateAction
  const initialActionHandledRef = useRef(false)
  useEffect(() => {
    if (initialAction === 'new-task' && !initialActionHandledRef.current) {
      initialActionHandledRef.current = true
      setTaskToEdit(null)
      setIsModalOpen(true)
    }
  }, [initialAction])

  useEffect(() => {
    if (window.beacon?.onNavigateAction) {
      const cleanup = window.beacon.onNavigateAction((action: string) => {
        if (action === 'new-task') {
          setTaskToEdit(null)
          setIsModalOpen(true)
        }
      })
      return cleanup
    }
  }, [])

  // Toggle complete
  const handleToggleComplete = async (id: string): Promise<void> => {
    if (!window.beacon?.toggleCompleteTask) return
    try {
      const updated = await window.beacon.toggleCompleteTask(id)
      const target = tasks.find((t) => t.id === id)
      const newStatus = updated.status === 'completed' ? 'completed' : 'pending'
      setAnnouncement(`Task "${target?.title || 'item'}" marked as ${newStatus}`)
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      )
      // If we are in 'today', 'upcoming' or 'completed' tab, reload to refresh filtered view
      if (activeTab !== 'all') {
        loadTasks()
      }
    } catch (err) {
      console.error('Failed to toggle task completion:', err)
    }
  }

  // Create or Update task
  const handleSaveTask = async (data: {
    id?: string
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
    dueDate?: number | null
  }): Promise<void> => {
    if (data.id) {
      if (!window.beacon?.updateTask) return
      await window.beacon.updateTask({
        id: data.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate
      })
    } else {
      if (!window.beacon?.createTask) return
      await window.beacon.createTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate !== null ? data.dueDate : undefined
      })
    }
    loadTasks()
  }

  // Delete task
  const handleConfirmDelete = async (): Promise<void> => {
    if (!taskToDelete || !window.beacon?.deleteTask) return
    try {
      setIsDeleting(true)
      await window.beacon.deleteTask(taskToDelete.id)
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id))
      setTaskToDelete(null)
    } catch (err) {
      console.error('Failed to delete task:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalCount = tasks.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-emerald-500" />
            Tasks & Reminders
          </h1>
          <p className="text-xs text-slate-500 dark:text-helm-muted mt-1">
            Organize daily focus, deadlines, and project milestones saved in your local SQLite store.
          </p>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(null)
            setIsModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Screen Reader Live Region for Task Status Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Progress Card if tasks exist */}
      {totalCount > 0 && (
        <div className="p-4 rounded-2xl bg-white/60 dark:bg-helm-card/60 border border-slate-200 dark:border-helm-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Overall Progress</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {completedCount} of {totalCount} completed ({completionPercentage}%)
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall tasks progress"
              className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-helm-surface overflow-hidden"
            >
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controls: Tabs, Priority Filter, Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* View Tabs */}
        <div role="tablist" aria-label="Task Filter Views" className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-helm-surface border border-slate-200/80 dark:border-helm-border/80 self-start">
          {(
            [
              { id: 'all', label: 'All Tasks' },
              { id: 'today', label: 'Due Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' }
            ] as const
          ).map((tab) => (
            <button
              type="button"
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-helm-card text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-helm-border/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority Filter and Search */}
        <div className="flex items-center gap-2.5">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-helm-muted" aria-hidden="true" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              aria-label="Filter tasks by priority"
              className="bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-helm-muted" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              aria-label="Search tasks"
              className="w-48 pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear task search"
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5 min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-helm-border text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-helm-card flex items-center justify-center text-slate-400 dark:text-helm-muted mb-3">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              {searchQuery
                ? 'No matching tasks'
                : activeTab === 'completed'
                ? 'No completed tasks'
                : activeTab === 'today'
                ? 'Nothing due today'
                : 'No tasks found'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-helm-muted max-w-sm mb-4">
              {searchQuery
                ? 'Try tweaking your search term or clear filters.'
                : activeTab === 'today'
                ? 'You are all caught up for today! Enjoy the clear schedule or add a new goal.'
                : activeTab === 'completed'
                ? 'Tasks you check off will be archived here.'
                : 'Create tasks to track action items, due dates, and priorities.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => {
                  setTaskToEdit(null)
                  setIsModalOpen(true)
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add a task
              </button>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItemCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={(t) => {
                setTaskToEdit(t)
                setIsModalOpen(true)
              }}
              onDelete={(t) => setTaskToDelete(t)}
            />
          ))
        )}
      </div>

      {/* Task Modal (Create / Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        taskToEdit={taskToEdit}
        onClose={() => {
          setIsModalOpen(false)
          setTaskToEdit(null)
        }}
        onSave={handleSaveTask}
      />

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            ref={deleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-helm-surface border border-slate-200 dark:border-helm-border shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3 text-rose-500">
              <div className="p-2.5 rounded-xl bg-rose-500/10">
                <Trash2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 id="delete-task-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Delete Task?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-helm-muted leading-relaxed mb-6">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                &ldquo;{taskToDelete.title}&rdquo;
              </strong>
              ? This action will permanently remove it from your local SQLite database.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setTaskToDelete(null)}
                className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-helm-cardHover transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Forever'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
