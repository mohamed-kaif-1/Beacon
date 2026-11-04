import net from 'net'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import { Notification, shell, nativeImage } from 'electron'
import {
  BoardWatch,
  BrowserIntegrationStatus,
  ExtensionConnectionState,
  DetectedBrowserType,
  ConnectionRetryStatus,
  NativeHostMessage,
  WatcherNotifyPayload,
  WatcherBoardPayload,
  WatcherHandshakePayload
} from './types'
import {
  updateWatchesForSource,
  getAllWatches,
  getHelmDataDirectory,
  getBeaconDataDirectory
} from './watches-store'
import { loadSettings } from './settings-store'

export const BEACON_PIPE_NAME = '\\\\.\\pipe\\beacon-windows-ipc'
export const HELM_PIPE_NAME = '\\\\.\\pipe\\helm-windows-ipc'
const LEASE_DURATION_MS = 120_000 // 2 minutes active connection freshness lease
const RETRY_COOLDOWN_MS = 3_000 // 3 seconds cooldown between manual retries

export interface PipeServerCallbacks {
  onWatchesChanged?: (watches: BoardWatch[]) => void
  onStatusChanged?: (status: BrowserIntegrationStatus) => void
  onNotifyReceived?: (payload: WatcherNotifyPayload) => void
}

let server: net.Server | null = null
let fallbackServer: net.Server | null = null
let callbacks: PipeServerCallbacks = {}

// Connection State Management
let connectionState: ExtensionConnectionState = 'disconnected'
let lastSyncTimestamp: number | undefined = undefined
let lastConnectedTimestamp: number | undefined = undefined
let lastDisconnectedTimestamp: number | undefined = undefined
let currentErrorReason: string | undefined = 'No active connection from browser extension. Open Chrome, Edge, or Brave.'
let currentBrowserType: DetectedBrowserType = 'unknown'
let retryStatus: ConnectionRetryStatus = { inProgress: false }

// Multi-browser profile session tracker: Map<source, { browser: DetectedBrowserType, lastSeen: number }>
const activeSessions = new Map<string, { browser: DetectedBrowserType; lastSeen: number }>()

// Active connected sockets
const activeSockets = new Set<net.Socket>()

// Periodic lease check timer (unref'd so it doesn't block process exit)
let leaseCheckTimer: NodeJS.Timeout | null = null

export function setPipeServerCallbacks(cbs: PipeServerCallbacks): void {
  callbacks = { ...callbacks, ...cbs }
}

export function isManifestInstalled(): boolean {
  try {
    const dir = getBeaconDataDirectory()
    const beaconManifest = path.join(dir, 'com.jonathanvineet.beacon.json')
    const helmManifest = path.join(dir, 'com.jonathanvineet.helm.json')
    return fs.existsSync(beaconManifest) || fs.existsSync(helmManifest)
  } catch {
    return false
  }
}

/**
 * Sanitizes error messages to prevent leaking filesystem paths, usernames, or sensitive details
 */
export function sanitizeErrorReason(reason?: string): string | undefined {
  if (!reason) return undefined
  return reason
    .replace(/[a-zA-Z]:\\[^\s"'<>]+/g, '<path>')
    .replace(/\/Users\/[^\s"'<>]+/g, '<path>')
    .replace(/\\Users\\[^\s"'<>]+/g, '<path>')
    .slice(0, 160)
}

function notifyStatusChanged(): void {
  if (callbacks.onStatusChanged) {
    try {
      callbacks.onStatusChanged(getBrowserIntegrationStatus())
    } catch (err) {
      console.error('[BEACON Pipe] Error notifying status change:', err)
    }
  }
}

/**
 * Periodic sweep of active sessions and connection lease expiration
 */
function checkConnectionLease(): void {
  const now = Date.now()
  let removedAny = false

  for (const [key, session] of activeSessions.entries()) {
    if (now - session.lastSeen > LEASE_DURATION_MS) {
      activeSessions.delete(key)
      removedAny = true
    }
  }

  if (connectionState === 'connected') {
    const isStillFresh =
      activeSessions.size > 0 ||
      (lastSyncTimestamp !== undefined && now - lastSyncTimestamp <= LEASE_DURATION_MS)

    if (!isStillFresh) {
      connectionState = 'disconnected'
      lastDisconnectedTimestamp = now
      currentErrorReason = 'Extension connection lease expired (no recent communication)'
      console.log('[BEACON Pipe] Connection transitioned to disconnected due to inactivity')
      notifyStatusChanged()
    } else if (removedAny) {
      notifyStatusChanged()
    }
  }
}

export function getBrowserIntegrationStatus(): BrowserIntegrationStatus {
  const allWatches = getAllWatches()
  const activeWatches = allWatches.filter((w) => w.state !== 'done')
  const attentionWatches = allWatches.filter((w) => w.state === 'attention')

  // Backwards compatible boolean flag: true ONLY if state is strictly 'connected'
  const isConnected = connectionState === 'connected'

  return {
    state: connectionState,
    connected: isConnected,
    lastSyncTime: lastSyncTimestamp,
    lastConnectedTime: lastConnectedTimestamp,
    lastDisconnectedTime: lastDisconnectedTimestamp,
    errorReason: sanitizeErrorReason(currentErrorReason),
    browserType: currentBrowserType,
    retryStatus: { ...retryStatus },
    activeWatchCount: activeWatches.length,
    attentionCount: attentionWatches.length,
    manifestInstalled: isManifestInstalled(),
    pipeAvailable: !!server && server.listening
  }
}

function handleNotification(payload: WatcherNotifyPayload): void {
  const settings = loadSettings()
  if (!settings.notifications.enabled) {
    console.log('[BEACON Pipe] OS desktop notification suppressed per user preferences')
    if (callbacks.onNotifyReceived) {
      callbacks.onNotifyReceived(payload)
    }
    return
  }

  const title = (payload.title || 'BEACON Alert').slice(0, 80)
  const message = (payload.message || '').slice(0, 300)
  const url = payload.url

  console.log(`[BEACON Pipe] Displaying notification: "${title}" - "${message}" (sound: ${settings.notifications.sound})`)

  try {
    if (Notification.isSupported()) {
      const iconPath = path.join(__dirname, '../../resources/icon.png')
      let notifIcon = nativeImage.createFromPath(iconPath)
      if (notifIcon.isEmpty()) {
        notifIcon = nativeImage.createEmpty()
      }

      const notif = new Notification({
        title,
        body: message,
        icon: notifIcon,
        silent: !settings.notifications.sound
      })

      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        notif.on('click', () => {
          shell.openExternal(url).catch((err) => {
            console.error('[BEACON Pipe] Failed to open notification URL:', err)
          })
        })
      }

      notif.show()
    } else {
      console.warn('[BEACON Pipe] System notifications are not supported on this host.')
    }
  } catch (err) {
    console.error('[BEACON Pipe] Error showing notification:', err)
  }

  if (callbacks.onNotifyReceived) {
    callbacks.onNotifyReceived(payload)
  }
}

function detectBrowserTypeFromPayload(parsed: any): DetectedBrowserType {
  if (parsed.browser && typeof parsed.browser === 'string') {
    const b = parsed.browser.toLowerCase()
    if (b.includes('edge')) return 'edge'
    if (b.includes('brave')) return 'brave'
    if (b.includes('chrome')) return 'chrome'
    if (b.includes('chromium')) return 'chromium'
  }
  if (parsed._meta && typeof parsed._meta === 'object' && parsed._meta.browser) {
    const b = String(parsed._meta.browser).toLowerCase()
    if (b.includes('edge')) return 'edge'
    if (b.includes('brave')) return 'brave'
    if (b.includes('chrome')) return 'chrome'
    if (b.includes('chromium')) return 'chromium'
  }
  return 'chromium'
}

export function processClientMessage(messageText: string): { ok: boolean; count?: number; error?: string } {
  let parsed: NativeHostMessage

  try {
    parsed = JSON.parse(messageText) as NativeHostMessage
  } catch (err: any) {
    console.error('[BEACON Pipe] Failed to parse message JSON from pipe client:', err?.message)
    connectionState = 'error'
    currentErrorReason = 'Malformed JSON payload received from native messaging host'
    notifyStatusChanged()
    return { ok: false, error: 'Malformed JSON payload' }
  }

  if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') {
    connectionState = 'error'
    currentErrorReason = 'Invalid payload format: missing message type'
    notifyStatusChanged()
    return { ok: false, error: 'Invalid payload format' }
  }

  const now = Date.now()
  const source = (parsed as any).source || 'default'
  const detectedBrowser = detectBrowserTypeFromPayload(parsed)

  // Explicit Disconnect notification from extension/host
  if (parsed.type === 'watcher:disconnect') {
    activeSessions.delete(source)
    if (activeSessions.size === 0) {
      connectionState = 'disconnected'
      lastDisconnectedTimestamp = now
      currentErrorReason = 'Browser extension closed or unhooked'
    }
    console.log(`[BEACON Pipe] Extension disconnected from source "${source}"`)
    notifyStatusChanged()
    return { ok: true }
  }

  // Record active session and update connection state to connected
  activeSessions.set(source, { browser: detectedBrowser, lastSeen: now })
  lastSyncTimestamp = now
  lastConnectedTimestamp = now
  currentBrowserType = detectedBrowser
  connectionState = 'connected'
  currentErrorReason = undefined

  // Handshake or ping message
  if (parsed.type === 'watcher:handshake' || parsed.type === 'watcher:ping') {
    console.log(`[BEACON Pipe] Handshake confirmed with ${detectedBrowser} (source: ${source})`)
    notifyStatusChanged()
    return { ok: true }
  }

  // Board sync message
  if (parsed.type === 'watcher:board') {
    const boardPayload = parsed as WatcherBoardPayload
    const updatedWatches = updateWatchesForSource(
      boardPayload.source || 'default',
      boardPayload.watches || []
    )

    console.log(
      `[BEACON Pipe] Received ${boardPayload.watches?.length || 0} watches from source "${boardPayload.source || 'default'}". Total active: ${updatedWatches.length}`
    )

    if (callbacks.onWatchesChanged) {
      callbacks.onWatchesChanged(updatedWatches)
    }
    notifyStatusChanged()
    return { ok: true, count: updatedWatches.length }
  }

  // Notify message
  if (parsed.type === 'watcher:notify') {
    const notifyPayload = parsed as WatcherNotifyPayload
    handleNotification(notifyPayload)
    notifyStatusChanged()
    return { ok: true }
  }

  console.warn('[BEACON Pipe] Unknown message type received:', (parsed as any)?.type)
  return { ok: false, error: 'Unknown message type' }
}

/**
 * Checks whether any supported Chromium browser process is currently executing
 */
async function checkIsAnyChromiumRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    execFile('tasklist', ['/fo', 'csv', '/nh'], { timeout: 1500, windowsHide: true }, (err, stdout) => {
      if (err) {
        // If tasklist fails or permission issue, assume browser might be running
        resolve(true)
        return
      }
      const lower = (stdout || '').toLowerCase()
      const running =
        lower.includes('chrome.exe') ||
        lower.includes('msedge.exe') ||
        lower.includes('brave.exe')
      resolve(running)
    })
  })
}

/**
 * Triggered by user or automated recovery to safely test and re-establish connection
 */
export async function retryBrowserConnection(): Promise<BrowserIntegrationStatus> {
  const now = Date.now()

  // Enforce retry cooldown to avoid rapid repeated execution
  if (retryStatus.cooldownUntil && now < retryStatus.cooldownUntil) {
    console.log('[BEACON Pipe] Reconnect request blocked by active cooldown')
    return getBrowserIntegrationStatus()
  }

  retryStatus = {
    inProgress: true,
    lastAttemptTime: now,
    cooldownUntil: now + RETRY_COOLDOWN_MS
  }

  connectionState = 'connecting'
  currentErrorReason = undefined
  notifyStatusChanged()

  try {
    // 1. Verify manifest existence
    if (!isManifestInstalled()) {
      connectionState = 'error'
      lastDisconnectedTimestamp = Date.now()
      currentErrorReason = 'Native messaging manifest is not registered for Chromium browsers'
      return getBrowserIntegrationStatus()
    }

    // 2. Ensure Named Pipe server is running
    if (!server || !server.listening) {
      const started = await startPipeServer()
      if (!started) {
        connectionState = 'error'
        lastDisconnectedTimestamp = Date.now()
        currentErrorReason = 'Named Pipe server could not be started on ' + HELM_PIPE_NAME
        return getBrowserIntegrationStatus()
      }
    }

    // 3. Check if any Chromium browser process is active
    const isBrowserRunning = await checkIsAnyChromiumRunning()

    // Allow a short window (600ms) for any incoming pipe connection to register
    await new Promise((r) => setTimeout(r, 600))

    // If handshake arrived while waiting
    if ((connectionState as ExtensionConnectionState) === 'connected') {
      return getBrowserIntegrationStatus()
    }

    // Otherwise, transition to disconnected with descriptive explanation
    connectionState = 'disconnected'
    lastDisconnectedTimestamp = Date.now()
    if (!isBrowserRunning) {
      currentErrorReason = 'No Chromium browser (Chrome, Edge, Brave) is currently running'
    } else {
      currentErrorReason = 'Browser is running, but BEACON extension has not established a handshake yet'
    }
  } catch (err: any) {
    connectionState = 'error'
    lastDisconnectedTimestamp = Date.now()
    currentErrorReason = sanitizeErrorReason(err?.message || 'Error executing connection recovery')
  } finally {
    retryStatus.inProgress = false
    notifyStatusChanged()
  }

  return getBrowserIntegrationStatus()
}

function setupClientSocket(socket: net.Socket): void {
  activeSockets.add(socket)
  let buffer = ''

  socket.on('data', (chunk) => {
    buffer += chunk.toString('utf-8')
    if (buffer.includes('\n')) {
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed) {
          const res = processClientMessage(trimmed)
          try {
            socket.write(JSON.stringify(res) + '\n')
          } catch {}
        }
      }
    }
  })

  socket.on('end', () => {
    activeSockets.delete(socket)
    const trimmed = buffer.trim()
    if (trimmed) {
      const res = processClientMessage(trimmed)
      try {
        socket.write(JSON.stringify(res) + '\n')
      } catch {}
    }
  })

  socket.on('close', () => {
    activeSockets.delete(socket)
  })

  socket.on('error', (err) => {
    activeSockets.delete(socket)
    console.error('[BEACON Pipe] Client socket error:', err?.message)
    if (connectionState === 'connected' && activeSockets.size === 0) {
      connectionState = 'error'
      lastDisconnectedTimestamp = Date.now()
      currentErrorReason = `Pipe socket error: ${sanitizeErrorReason(err?.message)}`
      notifyStatusChanged()
    }
  })
}

export function startPipeServer(): Promise<boolean> {
  return new Promise((resolve) => {
    if (server && server.listening) {
      resolve(true)
      return
    }

    // Start background lease check timer
    if (!leaseCheckTimer) {
      leaseCheckTimer = setInterval(checkConnectionLease, 15_000)
      leaseCheckTimer.unref()
    }

    server = net.createServer(setupClientSocket)

    server.on('error', (err: any) => {
      console.error('[BEACON Pipe] Primary server error on Named Pipe:', err?.message)
      connectionState = 'error'
      lastDisconnectedTimestamp = Date.now()
      currentErrorReason = `Named Pipe server error: ${sanitizeErrorReason(err?.message)}`
      server = null
      notifyStatusChanged()
      resolve(false)
    })

    server.listen(BEACON_PIPE_NAME, () => {
      console.log(`[BEACON Pipe] Primary Named Pipe server listening on ${BEACON_PIPE_NAME}`)

      // Also listen on fallback legacy pipe for backward compatibility
      try {
        fallbackServer = net.createServer(setupClientSocket)
        fallbackServer.on('error', (err: any) => {
          console.warn('[BEACON Pipe] Fallback Named Pipe server error (non-fatal):', err?.message)
        })
        fallbackServer.listen(HELM_PIPE_NAME, () => {
          console.log(`[BEACON Pipe] Backward-compatible fallback listening on ${HELM_PIPE_NAME}`)
        })
      } catch (err) {
        console.warn('[BEACON Pipe] Could not start fallback pipe listener:', err)
      }

      notifyStatusChanged()
      resolve(true)
    })
  })
}

export function stopPipeServer(): void {
  if (leaseCheckTimer) {
    clearInterval(leaseCheckTimer)
    leaseCheckTimer = null
  }

  for (const socket of activeSockets) {
    try {
      socket.destroy()
    } catch {}
  }
  activeSockets.clear()

  if (server) {
    try {
      server.close()
    } catch (err) {
      console.error('[BEACON Pipe] Error stopping server:', err)
    }
    server = null
  }

  if (fallbackServer) {
    try {
      fallbackServer.close()
    } catch (err) {
      console.error('[BEACON Pipe] Error stopping fallback server:', err)
    }
    fallbackServer = null
  }

  console.log('[BEACON Pipe] Named Pipe servers stopped.')
  connectionState = 'disconnected'
  currentErrorReason = 'Named Pipe server stopped'
  notifyStatusChanged()
}
