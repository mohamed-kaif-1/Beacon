import React from 'react'
import {
  Home,
  Monitor,
  FileText,
  CheckSquare,
  Settings
} from 'lucide-react'
import { NavigationRoute } from '../../types'
import { BeaconSymbol } from '../ui/BeaconLogo'

interface SidebarProps {
  currentRoute: NavigationRoute
  onRouteChange: (route: NavigationRoute) => void
}

interface NavItem {
  id: NavigationRoute
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onRouteChange }) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ambient', label: 'Ambient', icon: Monitor, badge: 'Live' },
    { id: 'notes', label: 'Notes', icon: FileText, badge: 'Live' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: 'Live' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <aside className="w-64 flex flex-col h-full bg-slate-100/80 dark:bg-helm-surface border-r border-slate-200 dark:border-helm-border/80 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200/60 dark:border-helm-border/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0e0f22] border border-indigo-500/30 shadow-sm p-1">
          <BeaconSymbol size={26} />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-[0.22em] text-slate-900 dark:text-slate-100 uppercase">
            BEACON
          </h1>
          <p className="text-[10px] font-medium tracking-wider text-indigo-500 dark:text-indigo-400">
            Find Your Focus
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav aria-label="Main Navigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-helm-muted/70 uppercase">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentRoute === item.id

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onRouteChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                isActive
                  ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-helm-cardHover hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  aria-hidden="true"
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-helm-muted'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700/60">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* System Tray Status Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-helm-border/60">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-200/50 dark:bg-helm-card border border-slate-300/40 dark:border-helm-border/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Tray Resident
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-helm-muted font-mono">
            v0.1.0
          </span>
        </div>
      </div>
    </aside>
  )
}

