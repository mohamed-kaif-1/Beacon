import React from 'react'
import { Pin } from 'lucide-react'
import { NoteItem } from '../../types'
import { formatRelativeTime } from '../../lib/date-utils'

interface NoteItemCardProps {
  note: NoteItem
  isSelected: boolean
  onClick: () => void
}

export const NoteItemCard: React.FC<NoteItemCardProps> = ({
  note,
  isSelected,
  onClick
}) => {
  const displayTitle = note.title.trim() || 'Untitled Note'
  const isUntitled = !note.title.trim()
  const snippet = note.content.trim().slice(0, 90) || 'No additional text'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={isSelected}
      className={`w-full text-left p-3.5 rounded-xl transition-all border focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
        isSelected
          ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/40 shadow-sm'
          : 'bg-white/60 dark:bg-helm-card/60 hover:bg-slate-100 dark:hover:bg-helm-cardHover border-slate-200/80 dark:border-helm-border/70'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3
          className={`text-sm font-semibold truncate flex-1 ${
            isUntitled
              ? 'italic text-slate-400 dark:text-helm-muted'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {displayTitle}
        </h3>
        {note.isPinned && (
          <Pin className="w-3.5 h-3.5 text-emerald-500 shrink-0 fill-emerald-500/20" />
        )}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
        {snippet}
      </p>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-helm-muted">
        <span>{formatRelativeTime(note.updatedAt)}</span>
        {note.content.length > 0 && (
          <span>{note.content.length} chars</span>
        )}
      </div>
    </button>
  )
}

