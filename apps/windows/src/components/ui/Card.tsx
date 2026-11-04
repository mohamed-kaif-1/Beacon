import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  description,
  action
}) => {
  return (
    <div
      className={`rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 shadow-sm transition-all duration-200 ${className}`}
    >
      {(title || description || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-helm-border/50 px-5 py-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-helm-muted">
                {description}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

