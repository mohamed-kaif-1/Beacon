import React from 'react'
import { Sidebar } from './Sidebar'
import { NavigationRoute } from '../../types'

interface AppLayoutProps {
  currentRoute: NavigationRoute
  onRouteChange: (route: NavigationRoute) => void
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRoute,
  onRouteChange,
  children
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-helm-dark text-slate-800 dark:text-slate-100">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar currentRoute={currentRoute} onRouteChange={onRouteChange} />
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col h-full overflow-y-auto focus:outline-none">
        <div className="flex-1 p-8 max-w-5xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

