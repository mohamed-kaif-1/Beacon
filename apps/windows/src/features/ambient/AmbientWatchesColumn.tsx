import React from 'react'
import {
  ExternalLink,
  AlertCircle,
  Clock,
  Eye,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react'
import { BoardWatch, AmbientSettings } from '../../types'

interface AmbientWatchesColumnProps {
  watches: BoardWatch[]
  settings: AmbientSettings
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

export const AmbientWatchesColumn: React.FC<AmbientWatchesColumnProps> = ({
  watches,
  settings
}) => {
  const handleOpenUrl = (url?: string): void => {
    if (!url) return
    if (window.beacon?.openExternal) {
      window.beacon.openExternal(url).catch(console.error)
    } else {
      window.open(url, '_blank')
    }
  }

  const attentionWatches = watches.filter((w) => w.state === 'attention')
  const otherWatches = watches.filter((w) => w.state !== 'attention' && w.state !== 'done')
  const doneWatches = watches.filter((w) => w.state === 'done')

  const glassStyle: React.CSSProperties = {
    backdropFilter: `blur(${settings.frostedGlassBlur}px)`,
    WebkitBackdropFilter: `blur(${settings.frostedGlassBlur}px)`
  }

  return (
    <div className="flex flex-col space-y-4 max-w-md w-full">
      {/* Header with Localized Glass Surface */}
      <div className="inline-flex items-center justify-between w-full px-3.5 py-1.5 rounded-xl ambient-header-glass">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400 drop-shadow" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#FFFFFF] ambient-shadow-text">
            Ambient Watch Feed
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 ambient-shadow-text">
          {watches.length} tracked
        </span>
      </div>

      {/* Attention / Urgent Items */}
      {attentionWatches.length > 0 && (
        <div className="space-y-2.5">
          {attentionWatches.map((w, idx) => {
            const emoji = KIND_EMOJIS[w.kind] || '⚠️'
            return (
              <div
                key={`attention-${w.name}-${idx}`}
                style={glassStyle}
                className="p-4 rounded-2xl ambient-card-glass-overdue text-white space-y-2.5 transition-all hover:border-rose-400/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0 drop-shadow">{emoji}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                        {w.name}
                      </h4>
                      <span className="text-[11px] text-rose-200 font-bold">
                        Requires Attention
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/30 text-rose-100 border border-rose-400/40">
                    <AlertCircle className="w-3 h-3" />
                    Alert
                  </span>
                </div>

                <p className="text-xs text-slate-100 leading-relaxed font-normal bg-white/10 p-2.5 rounded-xl border border-white/20">
                  {w.text}
                </p>

                {w.steps > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-200 font-medium">
                      <span>Stage</span>
                      <span className="font-semibold text-white">
                        {w.step} of {w.steps}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden flex gap-0.5">
                      {Array.from({ length: w.steps }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 ${
                            i < w.step ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-white/15'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {w.url && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenUrl(w.url)}
                      aria-label={`Review details for ${w.name}`}
                      className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded px-1.5 py-0.5"
                    >
                      <span>Review Details</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Standard Active Watches */}
      {otherWatches.length > 0 && (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {otherWatches.map((w, idx) => {
            const emoji = KIND_EMOJIS[w.kind] || '👀'
            return (
              <div
                key={`watch-${w.name}-${idx}`}
                style={glassStyle}
                className="p-3.5 rounded-2xl ambient-card-glass text-white space-y-2 hover:border-white/25 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0 drop-shadow">{emoji}</span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                      {w.name}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/25 text-emerald-200 border border-emerald-400/35">
                    {w.state === 'pending' ? <Clock className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {w.state === 'pending' ? 'Pending' : 'Watching'}
                  </span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {w.quoted ? `“${w.text}”` : w.text}
                </p>

                {w.steps > 0 && (
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium pt-0.5">
                    <span>
                      Stage {w.step} of {w.steps}
                    </span>
                    {w.url && (
                      <button
                        type="button"
                        onClick={() => handleOpenUrl(w.url)}
                        aria-label={`Open ${w.name} in browser`}
                        className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded px-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Done Watches (Recent celebrations) */}
      {doneWatches.length > 0 && otherWatches.length === 0 && attentionWatches.length === 0 && (
        <div
          style={glassStyle}
          className="p-3.5 rounded-2xl ambient-card-glass text-slate-200 shadow-md space-y-1.5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold text-white">Completed Watches</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {doneWatches.length} items recently finished. All clear for now.
          </p>
        </div>
      )}

      {/* All Clear Empty State */}
      {watches.length === 0 && (
        <div
          style={glassStyle}
          className="p-5 rounded-2xl ambient-card-glass text-center space-y-2 text-slate-200 shadow-lg"
        >
          <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
          <h4 className="text-xs font-bold text-white">All Clear</h4>
          <p className="text-[11px] text-slate-300 max-w-xs mx-auto leading-relaxed">
            No active browser watches or pending alerts. Pages monitored via Chrome, Edge, or Brave will surface here automatically.
          </p>
        </div>
      )}
    </div>
  )
}

