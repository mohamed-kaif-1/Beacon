import { BrowserWindow, Menu, Tray, nativeImage, shell } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { IPC_CHANNELS, BoardWatch, BrowserIntegrationStatus } from './types'

let tray: Tray | null = null
let currentWatches: BoardWatch[] = []
let currentStatus: BrowserIntegrationStatus | null = null
let mainWindowGetter: (() => BrowserWindow | null) | null = null
let quitHandler: (() => void) | null = null

function restoreAndFocus(window: BrowserWindow | null): void {
  if (!window || window.isDestroyed()) return
  if (window.isMinimized()) window.restore()
  if (!window.isVisible()) window.show()
  window.focus()
}

export function rebuildTrayMenu(): void {
  if (!tray || !mainWindowGetter || !quitHandler) return

  const window = mainWindowGetter()
  const activeWatches = currentWatches.filter((w) => w.state !== 'done')
  const attentionWatches = currentWatches.filter((w) => w.state === 'attention')

  // Tooltip with extension status hint
  const extStatus =
    currentStatus?.state === 'connected'
      ? ` • Extension: ${currentStatus.browserType && currentStatus.browserType !== 'unknown' ? currentStatus.browserType : 'Connected'}`
      : ''

  if (attentionWatches.length > 0) {
    tray.setToolTip(`BEACON • ${attentionWatches.length} item${attentionWatches.length === 1 ? '' : 's'} need attention${extStatus}`)
  } else if (activeWatches.length > 0) {
    tray.setToolTip(`BEACON • ${activeWatches.length} active watch${activeWatches.length === 1 ? '' : 'es'}${extStatus}`)
  } else {
    tray.setToolTip(`BEACON • Ambient Productivity${extStatus}`)
  }

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Open BEACON',
      click: (): void => {
        restoreAndFocus(mainWindowGetter ? mainWindowGetter() : null)
      }
    },
    {
      label: 'Ambient Screen Board',
      click: (): void => {
        const win = mainWindowGetter ? mainWindowGetter() : null
        restoreAndFocus(win)
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, 'ambient')
        }
      }
    },
    {
      label: 'Notes',
      click: (): void => {
        const win = mainWindowGetter ? mainWindowGetter() : null
        restoreAndFocus(win)
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, 'notes')
        }
      }
    },
    {
      label: 'Tasks',
      click: (): void => {
        const win = mainWindowGetter ? mainWindowGetter() : null
        restoreAndFocus(win)
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, 'tasks')
        }
      }
    },
    { type: 'separator' },
    {
      label: '+ New Note',
      click: (): void => {
        const win = mainWindowGetter ? mainWindowGetter() : null
        restoreAndFocus(win)
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, 'notes')
          win.webContents.send(IPC_CHANNELS.NAVIGATE_ACTION, 'new-note')
        }
      }
    },
    {
      label: '+ New Task',
      click: (): void => {
        const win = mainWindowGetter ? mainWindowGetter() : null
        restoreAndFocus(win)
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, 'tasks')
          win.webContents.send(IPC_CHANNELS.NAVIGATE_ACTION, 'new-task')
        }
      }
    }
  ]

  // Add top watches if any exist
  const highlightWatches = attentionWatches.length > 0 ? attentionWatches : activeWatches
  if (highlightWatches.length > 0) {
    menuItems.push({ type: 'separator' })
    const topWatches = highlightWatches.slice(0, 3)
    for (const w of topWatches) {
      const statePrefix = w.state === 'attention' ? '⚠️ ' : '● '
      const label = `${statePrefix}${w.name.slice(0, 28)}: ${w.text.slice(0, 24)}`
      menuItems.push({
        label,
        click: (): void => {
          if (w.url && (w.url.startsWith('http://') || w.url.startsWith('https://'))) {
            shell.openExternal(w.url).catch(console.error)
          } else {
            restoreAndFocus(mainWindowGetter ? mainWindowGetter() : null)
          }
        }
      })
    }
  }

  const statusLabel =
    currentStatus?.state === 'connected'
      ? `● Extension Connected (${currentStatus.browserType || 'Chromium'})`
      : currentStatus?.state === 'connecting'
      ? '◌ Extension Connecting...'
      : currentStatus?.state === 'error'
      ? '▲ Extension Connection Error'
      : '○ Extension Disconnected'

  menuItems.push(
    { type: 'separator' },
    {
      label: statusLabel,
      enabled: false
    },
    {
      label: 'Settings',
      click: (): void => {
        const win = mainWindowGetter ? mainWindowGetter() : null
        restoreAndFocus(win)
        if (win && !win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.NAVIGATE, 'settings')
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit BEACON',
      click: (): void => {
        if (quitHandler) quitHandler()
      }
    }
  )

  const contextMenu = Menu.buildFromTemplate(menuItems)
  tray.setContextMenu(contextMenu)
}

export function updateTrayWatches(watches: BoardWatch[]): void {
  currentWatches = watches
  rebuildTrayMenu()
}

export function updateTrayStatus(status: BrowserIntegrationStatus): void {
  currentStatus = status
  rebuildTrayMenu()
}

export function createSystemTray(
  getMainWindow: () => BrowserWindow | null,
  onQuit: () => void
): Tray {
  if (tray) {
    tray.destroy()
    tray = null
  }

  mainWindowGetter = getMainWindow
  quitHandler = onQuit

  // Determine icon path with candidate paths across dev and packaged environments
  const trayCandidates: string[] = []
  if (process.resourcesPath) {
    trayCandidates.push(
      join(process.resourcesPath, 'resources', 'icon-tray.png'),
      join(process.resourcesPath, 'icon-tray.png'),
      join(process.resourcesPath, 'resources', 'icon.png'),
      join(process.resourcesPath, 'icon.png')
    )
  }
  trayCandidates.push(
    join(__dirname, '../../resources/icon-tray.png'),
    join(__dirname, '../../resources/icon.png')
  )

  let icon = nativeImage.createEmpty()
  for (const p of trayCandidates) {
    if (fs.existsSync(p)) {
      const candidate = nativeImage.createFromPath(p)
      if (!candidate.isEmpty()) {
        icon = candidate
        break
      }
    }
  }

  if (icon.isEmpty()) {
    console.warn('[BEACON Tray] Primary tray icon not found. Using fallback icon.')
  }

  tray = new Tray(icon)
  rebuildTrayMenu()

  // Single click restores or focuses the window on Windows
  tray.on('click', () => {
    const window = getMainWindow()
    if (!window || window.isDestroyed()) return

    if (window.isVisible() && !window.isMinimized() && window.isFocused()) {
      window.hide()
    } else {
      restoreAndFocus(window)
    }
  })

  return tray
}

export function destroySystemTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
