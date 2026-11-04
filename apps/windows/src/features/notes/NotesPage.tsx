import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  Search,
  Plus,
  FileText,
  Pin,
  X,
  Loader2,
  Sparkles
} from 'lucide-react'
import { NoteItem } from '../../types'
import { NoteItemCard } from './NoteItemCard'
import { NoteEditor } from './NoteEditor'

interface NotesPageProps {
  initialAction?: string
}

export const NotesPage: React.FC<NotesPageProps> = ({ initialAction }) => {
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch notes from main process SQLite database
  const loadNotes = useCallback(async (query?: string): Promise<NoteItem[]> => {
    try {
      if (window.beacon?.getNotes) {
        const fetched = await window.beacon.getNotes(query)
        setNotes(fetched)
        return fetched
      }
    } catch (err) {
      console.error('Failed to load notes:', err)
    } finally {
      setIsLoading(false)
    }
    return []
  }, [])

  // Initial load
  useEffect(() => {
    loadNotes(searchQuery)
  }, [loadNotes, searchQuery])

  // Select initial note if none selected
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id)
    } else if (notes.length > 0 && selectedNoteId) {
      // If selected note is no longer in notes list, select first
      if (!notes.some((n) => n.id === selectedNoteId)) {
        setSelectedNoteId(notes[0].id)
      }
    } else if (notes.length === 0) {
      setSelectedNoteId(null)
    }
  }, [notes, selectedNoteId])

  // Handler for creating a new note
  const handleCreateNote = async (): Promise<void> => {
    if (isCreating || !window.beacon?.createNote) return
    try {
      setIsCreating(true)
      const newNote = await window.beacon.createNote({
        title: '',
        content: '',
        isPinned: false
      })
      // Prepend to notes list and select
      setNotes((prev) => [newNote, ...prev])
      setSelectedNoteId(newNote.id)
    } catch (err) {
      console.error('Failed to create note:', err)
    } finally {
      setIsCreating(false)
    }
  }

  // Handle initialAction or navigateAction
  const initialActionHandledRef = useRef(false)
  useEffect(() => {
    if (initialAction === 'new-note' && !initialActionHandledRef.current) {
      initialActionHandledRef.current = true
      handleCreateNote()
    }
  }, [initialAction])

  useEffect(() => {
    if (window.beacon?.onNavigateAction) {
      const cleanup = window.beacon.onNavigateAction((action: string) => {
        if (action === 'new-note') {
          handleCreateNote()
        }
      })
      return cleanup
    }
  }, [])

  // Update note content / title
  const handleUpdateNote = async (id: string, title: string, content: string): Promise<void> => {
    if (!window.beacon?.updateNote) return
    const updated = await window.beacon.updateNote({ id, title, content })
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
    )
  }

  // Toggle pin
  const handleTogglePin = async (id: string): Promise<void> => {
    if (!window.beacon?.togglePinNote) return
    const updated = await window.beacon.togglePinNote(id)
    // Reload to maintain proper sort order (pinned first)
    loadNotes(searchQuery)
    setSelectedNoteId(updated.id)
  }

  // Delete note
  const handleDeleteNote = async (id: string): Promise<void> => {
    if (!window.beacon?.deleteNote) return
    await window.beacon.deleteNote(id)
    setNotes((prev) => {
      const nextNotes = prev.filter((n) => n.id !== id)
      if (selectedNoteId === id) {
        setSelectedNoteId(nextNotes.length > 0 ? nextNotes[0].id : null)
      }
      return nextNotes
    })
  }

  const pinnedNotes = notes.filter((n) => n.isPinned)
  const otherNotes = notes.filter((n) => !n.isPinned)
  const selectedNote = notes.find((n) => n.id === selectedNoteId)

  return (
    <div className="h-[calc(100vh-5rem)] flex gap-5 animate-fadeIn select-none">
      {/* Left Column: Note List & Search */}
      <div className="w-80 flex flex-col h-full bg-slate-50/70 dark:bg-helm-surface/60 rounded-2xl border border-slate-200 dark:border-helm-border/80 p-3.5 space-y-3">
        {/* Header & New Note Button */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Notes
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-helm-muted">
              {notes.length} note{notes.length === 1 ? '' : 's'} saved locally
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateNote}
            disabled={isCreating}
            aria-label="Create new note"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            {isCreating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            New Note
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-helm-muted" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
            className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Notes Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-helm-card flex items-center justify-center text-slate-400 dark:text-helm-muted mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {searchQuery ? 'No matching notes' : 'No notes yet'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-helm-muted leading-relaxed mb-4">
                {searchQuery
                  ? 'Try searching for something else or clear the query.'
                  : 'Capture ideas, checklists, and snippets saved directly in SQLite.'}
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
                  onClick={handleCreateNote}
                  className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-medium hover:bg-emerald-600/20"
                >
                  Create your first note
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Pinned Notes Section */}
              {pinnedNotes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400/90">
                    <Pin className="w-3 h-3 fill-emerald-500/20" />
                    Pinned
                  </div>
                  <div className="space-y-1.5">
                    {pinnedNotes.map((note) => (
                      <NoteItemCard
                        key={note.id}
                        note={note}
                        isSelected={note.id === selectedNoteId}
                        onClick={() => setSelectedNoteId(note.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Notes Section */}
              {otherNotes.length > 0 && (
                <div className="space-y-1.5">
                  {pinnedNotes.length > 0 && (
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-helm-muted">
                      Notes
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {otherNotes.map((note) => (
                      <NoteItemCard
                        key={note.id}
                        note={note}
                        isSelected={note.id === selectedNoteId}
                        onClick={() => setSelectedNoteId(note.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Column: Note Editor or Empty View */}
      <div className="flex-1 h-full">
        {selectedNote ? (
          <NoteEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
            onTogglePin={handleTogglePin}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-300 dark:border-helm-border/80 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Select or create a note
            </h3>
            <p className="text-xs text-slate-500 dark:text-helm-muted max-w-sm leading-relaxed mb-6">
              Write down your thoughts, markdown checklists, and project scratchpads. Everything is persisted locally in your secure SQLite database.
            </p>
            <button
              onClick={handleCreateNote}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Note
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

