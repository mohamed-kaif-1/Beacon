import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallbackTitle?: string
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorMessage: ''
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Sanitize message: strip filesystem paths
    const msg = error?.message
      ? error.message.replace(/[a-zA-Z]:\\[^\s"'<>]+/g, '<path>')
      : 'An unexpected user interface error occurred.'
    return {
      hasError: true,
      errorMessage: msg
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[BEACON ErrorBoundary] Caught UI error:', error, errorInfo)
  }

  handleReload = (): void => {
    this.setState({ hasError: false, errorMessage: '' })
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center bg-slate-50 dark:bg-helm-surface/50 border border-slate-200 dark:border-helm-border/60 rounded-2xl animate-fadeIn m-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            {this.props.fallbackTitle || 'Component Encountered an Issue'}
          </h2>

          <p className="text-xs text-slate-500 dark:text-helm-muted max-w-md mb-4 leading-relaxed">
            BEACON recovered safely from a component failure. Your persistent notes, tasks,
            and background settings remain intact.
          </p>

          <div className="p-3 mb-6 bg-slate-100 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-helm-border/40 text-[11px] font-mono text-slate-700 dark:text-slate-300 max-w-lg break-words select-all">
            {this.state.errorMessage}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={this.handleReload} className="gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload View</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' })
                window.location.hash = ''
              }}
              className="gap-1.5 text-xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
