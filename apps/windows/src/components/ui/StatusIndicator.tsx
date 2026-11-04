import React from 'react'

export type StatusVariant = 'active' | 'warning' | 'pending' | 'inactive' | 'info'

interface StatusIndicatorProps {
  label: string
  statusText?: string
  variant?: StatusVariant
  pulse?: boolean
  className?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  statusText,
  variant = 'active',
  pulse = false,
  className = ''
}) => {
  const dotColors = {
    active: 'bg-emerald-500',
    warning: 'bg-rose-500',
    pending: 'bg-amber-500',
    inactive: 'bg-slate-400 dark:bg-slate-500',
    info: 'bg-sky-500'
  }[variant]

  const pulseColors = {
    active: 'bg-emerald-400',
    warning: 'bg-rose-400',
    pending: 'bg-amber-400',
    inactive: 'bg-slate-300',
    info: 'bg-sky-400'
  }[variant]

  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/50 ${className}`}>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors}`} />
        </span>
        {statusText && (
          <span className="text-xs font-mono text-slate-500 dark:text-helm-muted">
            {statusText}
          </span>
        )}
      </div>
    </div>
  )
}

