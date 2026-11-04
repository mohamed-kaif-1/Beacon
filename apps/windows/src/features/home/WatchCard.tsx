import React from 'react'
import { ExternalLink, CheckCircle, AlertCircle, Clock, Eye } from 'lucide-react'
import { BoardWatch } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

interface WatchCardProps {
  watch: BoardWatch
}

const KIND_EMOJIS: Record<string, string> = {
  delivery: '📦',
  appReview: '📱',
  access: '🔑',
  government: '🛂',
  job: '💼',
  results: '🎓',
  booking: '🎫',
  refund: '💸',
  ticket: '🎟️',
  build: '🛠️',
  product: '🏷️'
}

export const WatchCard: React.FC<WatchCardProps> = ({ watch }) => {
  const emoji = KIND_EMOJIS[watch.kind] || '👀'

  const handleOpenUrl = (): void => {
    if (!watch.url) return
    if (window.beacon?.openExternal) {
      window.beacon.openExternal(watch.url).catch(console.error)
    } else {
      window.open(watch.url, '_blank')
    }
  }

  const formatChecked = (checkedMs: number): string => {
    if (!checkedMs) return 'Recently'
    const seconds = Math.floor((Date.now() - checkedMs) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getStatusBadge = (): React.ReactNode => {
    switch (watch.state) {
      case 'attention':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Attention
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case 'done':
        return (
          <Badge variant="neutral" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Done
          </Badge>
        )
      case 'watching':
      default:
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Watching
          </Badge>
        )
    }
  }

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-helm-surface border border-slate-200/80 dark:border-helm-border/50 hover:border-slate-300 dark:hover:border-helm-border transition-all flex flex-col justify-between space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0" role="img" aria-label={watch.kind}>
            {emoji}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {watch.name}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-helm-muted">
              Checked {formatChecked(watch.checked)}
            </span>
          </div>
        </div>
        <div className="shrink-0">{getStatusBadge()}</div>
      </div>

      {/* Main Insight or Status Text */}
      <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal bg-white/60 dark:bg-black/20 p-2.5 rounded-lg border border-slate-200/50 dark:border-helm-border/30">
        {watch.quoted ? (
          <span className="italic">“{watch.text}”</span>
        ) : (
          <span>{watch.text || 'Monitoring page for changes'}</span>
        )}
      </div>

      {/* Progress Stages (if multi-step workflow) */}
      {watch.steps > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-helm-muted">
            <span>Progress</span>
            <span>
              Stage {watch.step} of {watch.steps}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={watch.step}
            aria-valuemin={0}
            aria-valuemax={watch.steps}
            aria-label={`Progress stage ${watch.step} of ${watch.steps}`}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden flex gap-0.5"
          >
            {Array.from({ length: watch.steps }).map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 transition-all ${
                  i < watch.step
                    ? watch.state === 'attention'
                      ? 'bg-rose-500'
                      : 'bg-emerald-500'
                    : 'bg-slate-300 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {watch.url && (
        <div className="pt-1 flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenUrl}
            aria-label={`Open ${watch.name} in browser`}
            className="text-[11px] py-1 px-2.5 h-auto flex items-center gap-1.5 text-slate-600 dark:text-slate-300"
          >
            <span>Open in Browser</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}

