import React, { useEffect, useState, useRef } from 'react'
import { useFocusTrap } from '../../lib/useFocusTrap'
import {
  Pin,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react'
import { NoteItem } from '../../types'
import { formatDateTime } from '../../lib/date-utils'

interface NoteEditorProps {
  note: NoteItem
  onUpdate: (id: string, title: string, content: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onTogglePin: (id: string) => Promise<void>
}

type SaveState = 'saved' | 'saving' | 'error'

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdate,
  onDelete,
  onTogglePin
}) => {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteModalRef = useFocusTrap<HTMLDivElement>({
    isOpen: showDeleteModal,
    onClose: () => setShowDeleteModal(false)
  })

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const currentNoteIdRef = useRef(note.id)

  // Sync state when active note changes
  useEffect(() => {
    // If there was a pending save on the old note, flush or clear
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    currentNoteIdRef.current = note.id
    setTitle(note.title)
    setContent(note.content)
    setSaveState('saved')
    setShowDeleteModal(false)
  }, [note.id])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const triggerAutosave = (newTitle: string, newContent: string): void => {
    setSaveState('saving')
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const noteIdToSave = note.id

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await onUpdate(noteIdToSave, newTitle, newContent)
        // Only update status if user hasn't switched notes
        if (currentNoteIdRef.current === noteIdToSave) {
          setSaveState('saved')
        }
      } catch (err) {
        console.error('Failed to autosave note:', err)
        if (currentNoteIdRef.current === noteIdToSave) {
          setSaveState('error')
        }
      }
    }, 350)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTitle = e.target.value
    setTitle(newTitle)
    triggerAutosave(newTitle, content)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newContent = e.target.value
    setContent(newContent)
    triggerAutosave(title, newContent)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true)
      await onDelete(note.id)
      setShowDeleteModal(false)
    } catch (err) {
      console.error('Failed to delete note:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/70 dark:bg-helm-surface/80 rounded-2xl border border-slate-200 dark:border-helm-border/80 shadow-sm overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200/80 dark:border-helm-border/80 bg-slate-50/60 dark:bg-helm-card/40">
        <div className="flex items-center gap-3">
          {/* Save Status Badge (Live region for screen readers) */}
          <div role="status" aria-live="polite" className="flex items-center gap-1.5 text-xs">
            {saveState === 'saved' && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                Saved
              </span>
            )}
            {saveState === 'saving' && (
              <span className="inline-flex items-center gap-1 text-amber-500 font-medium animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                Saving...
              </span>
            )}
            {saveState === 'error' && (
              <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Error saving
              </span>
            )}
          </div>

          <span className="text-slate-300 dark:text-helm-border" aria-hidden="true">•</span>

          <span className="text-[11px] text-slate-400 dark:text-helm-muted flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            Edited {formatDateTime(note.updatedAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onTogglePin(note.id)}
            title={note.isPinned ? 'Unpin note' : 'Pin to top'}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note to top'}
            className={`p-2 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
              note.isPinned
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 dark:text-helm-muted hover:bg-slate-200/60 dark:hover:bg-helm-cardHover'
            }`}
          >
            <Pin
              aria-hidden="true"
              className={`w-4 h-4 ${note.isPinned ? 'fill-emerald-500/30' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            title="Delete note"
            aria-label="Delete note"
            className="p-2 rounded-lg text-slate-500 dark:text-helm-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          aria-label="Note title"
          maxLength={200}
          className="w-full text-xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted/60 focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded px-1"
        />

        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing notes, ideas, or markdown checklists..."
          aria-label="Note content"
          maxLength={100000}
          className="w-full flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-helm-muted/50 leading-relaxed font-sans focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded p-1"
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            ref={deleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-note-title"
            className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-helm-surface border border-slate-200 dark:border-helm-border shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3 text-rose-500">
              <div className="p-2.5 rounded-xl bg-rose-500/10">
                <Trash2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 id="delete-note-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Delete Note?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-helm-muted leading-relaxed mb-6">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                &ldquo;{title.trim() || 'Untitled Note'}&rdquo;
              </strong>
              ? This action will permanently remove it from your local SQLite database.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
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
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
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
