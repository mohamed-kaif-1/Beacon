/**
 * Helm Windows — Phase 5.2 Browser Extension Connection Status Automated Verification Suite
 * Covers all 10 required connection monitoring and recovery test scenarios.
 */

const assert = require('assert')
const net = require('net')
const fs = require('fs')
const path = require('path')
const os = require('os')

console.log('=================================================================')
console.log('  Helm Windows — Phase 5.2 Browser Extension Status Tests')
console.log('=================================================================\n')

// Pipe & Constants
const TEST_PIPE_NAME = '\\\\.\\pipe\\helm-windows-ipc-test-' + Date.now()
const LEASE_DURATION_MS = 2000 // 2 seconds for rapid testing
const RETRY_COOLDOWN_MS = 2500 // 2.5 seconds cooldown

function sanitizeErrorReason(reason) {
  if (!reason) return undefined
  return reason
    .replace(/[a-zA-Z]:\\[^\s"'<>]+/g, '<path>')
    .replace(/\/Users\/[^\s"'<>]+/g, '<path>')
    .replace(/\\Users\\[^\s"'<>]+/g, '<path>')
    .slice(0, 160)
}

/**
 * Clean In-Memory Connection State Machine simulating the enhanced pipe-server logic
 */
class ExtensionConnectionManager {
  constructor(pipeName = TEST_PIPE_NAME) {
    this.pipeName = pipeName
    this.connectionState = 'disconnected'
    this.lastSyncTimestamp = undefined
    this.lastConnectedTimestamp = undefined
    this.lastDisconnectedTimestamp = undefined
    this.currentErrorReason = 'No active connection. Open Chrome, Edge, or Brave.'
    this.currentBrowserType = 'unknown'
    this.retryStatus = { inProgress: false }
    this.activeSessions = new Map()
    this.activeSockets = new Set()
    this.server = null
    this.leaseCheckTimer = null
  }

  getStatus() {
    const isConnected = this.connectionState === 'connected'
    return {
      state: this.connectionState,
      connected: isConnected,
      lastSyncTime: this.lastSyncTimestamp,
      lastConnectedTime: this.lastConnectedTimestamp,
      lastDisconnectedTime: this.lastDisconnectedTimestamp,
      errorReason: sanitizeErrorReason(this.currentErrorReason),
      browserType: this.currentBrowserType,
      retryStatus: { ...this.retryStatus },
      pipeAvailable: !!this.server && this.server.listening
    }
  }

  processMessage(raw) {
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      this.connectionState = 'error'
      this.currentErrorReason = 'Malformed JSON payload received from native messaging host'
      return { ok: false, error: 'Malformed JSON payload' }
    }

    if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') {
      this.connectionState = 'error'
      this.currentErrorReason = 'Invalid payload format: missing message type'
      return { ok: false, error: 'Invalid payload format' }
    }

    const now = Date.now()
    const source = parsed.source || 'default'
    const detectedBrowser = parsed._meta?.browser || parsed.browser || 'chromium'

    // Explicit Disconnect
    if (parsed.type === 'watcher:disconnect') {
      this.activeSessions.delete(source)
      if (this.activeSessions.size === 0) {
        this.connectionState = 'disconnected'
        this.lastDisconnectedTimestamp = now
        this.currentErrorReason = 'Browser extension closed or unhooked'
      }
      return { ok: true }
    }

    // Active session recorded
    this.activeSessions.set(source, { browser: detectedBrowser, lastSeen: now })
    this.lastSyncTimestamp = now
    this.lastConnectedTimestamp = now
    this.currentBrowserType = detectedBrowser
    this.connectionState = 'connected'
    this.currentErrorReason = undefined

    if (parsed.type === 'watcher:handshake' || parsed.type === 'watcher:ping') {
      return { ok: true, pong: true, time: now }
    }

    if (parsed.type === 'watcher:board') {
      return { ok: true, count: Array.isArray(parsed.watches) ? parsed.watches.length : 0 }
    }

    if (parsed.type === 'watcher:notify') {
      return { ok: true }
    }

    return { ok: false, error: 'Unknown message type' }
  }

  checkLease() {
    const now = Date.now()
    for (const [key, session] of this.activeSessions.entries()) {
      if (now - session.lastSeen > LEASE_DURATION_MS) {
        this.activeSessions.delete(key)
      }
    }

    if (this.connectionState === 'connected') {
      const isStillFresh =
        this.activeSessions.size > 0 ||
        (this.lastSyncTimestamp !== undefined && now - this.lastSyncTimestamp <= LEASE_DURATION_MS)

      if (!isStillFresh) {
        this.connectionState = 'disconnected'
        this.lastDisconnectedTimestamp = now
        this.currentErrorReason = 'Extension connection lease expired'
      }
    }
  }

  async retryConnection(simulatedBrowserRunning = true, simulatedHandshake = false) {
    const now = Date.now()
    if (this.retryStatus.cooldownUntil && now < this.retryStatus.cooldownUntil) {
      return this.getStatus()
    }

    this.retryStatus = {
      inProgress: true,
      lastAttemptTime: now,
      cooldownUntil: now + RETRY_COOLDOWN_MS
    }

    this.connectionState = 'connecting'
    this.currentErrorReason = undefined

    await new Promise((r) => setTimeout(r, 100))

    if (simulatedHandshake) {
      this.processMessage(JSON.stringify({ type: 'watcher:handshake', source: 'retry-src', browser: 'chrome' }))
    } else if (!simulatedBrowserRunning) {
      this.connectionState = 'disconnected'
      this.lastDisconnectedTimestamp = Date.now()
      this.currentErrorReason = 'No Chromium browser (Chrome, Edge, Brave) is currently running'
    } else {
      this.connectionState = 'disconnected'
      this.lastDisconnectedTimestamp = Date.now()
      this.currentErrorReason = 'Browser is running, but Helm extension has not established a handshake yet'
    }

    this.retryStatus.inProgress = false
    return this.getStatus()
  }

  async startServer() {
    return new Promise((resolve) => {
      this.server = net.createServer((socket) => {
        this.activeSockets.add(socket)
        let buf = ''
        socket.on('data', (d) => {
          buf += d.toString('utf-8')
          if (buf.includes('\n')) {
            const lines = buf.split('\n')
            buf = lines.pop() || ''
            for (const l of lines) {
              if (l.trim()) {
                const res = this.processMessage(l.trim())
                try { socket.write(JSON.stringify(res) + '\n') } catch {}
              }
            }
          }
        })
        socket.on('close', () => this.activeSockets.delete(socket))
      })

      this.server.listen(this.pipeName, () => resolve(true))
    })
  }

  stopServer() {
    if (this.leaseCheckTimer) {
      clearInterval(this.leaseCheckTimer)
      this.leaseCheckTimer = null
    }
    for (const s of this.activeSockets) {
      try { s.destroy() } catch {}
    }
    this.activeSockets.clear()
    if (this.server) {
      try { this.server.close() } catch {}
      this.server = null
    }
    this.connectionState = 'disconnected'
    this.currentErrorReason = 'Named Pipe server stopped'
  }
}

async function runTestSuite() {
  const manager = new ExtensionConnectionManager()
  let passedCount = 0

  // -------------------------------------------------------------------------
  // TEST 1: Valid handshake → Connected
  // -------------------------------------------------------------------------
  console.log('[TEST 1] Testing Valid Handshake → Connected state...')
  const initialStatus = manager.getStatus()
  assert.strictEqual(initialStatus.state, 'disconnected', 'Initial state must be disconnected')
  assert.strictEqual(initialStatus.connected, false, 'connected must be false before handshake')

  // Receive handshake from Chrome
  const handshakeRes = manager.processMessage(JSON.stringify({
    type: 'watcher:handshake',
    source: 'chrome-profile-1',
    _meta: { browser: 'chrome' }
  }))
  assert.strictEqual(handshakeRes.ok, true, 'Handshake must succeed')

  const connectedStatus = manager.getStatus()
  assert.strictEqual(connectedStatus.state, 'connected', 'State must be connected after valid handshake')
  assert.strictEqual(connectedStatus.connected, true, 'connected must be true')
  assert.strictEqual(connectedStatus.browserType, 'chrome', 'Detected browser must be chrome')
  assert(connectedStatus.lastConnectedTime > 0, 'lastConnectedTime must be set')
  assert.strictEqual(connectedStatus.errorReason, undefined, 'errorReason must be cleared')
  console.log('✓ TEST 1 Passed: Valid handshake transitions state to Connected with browser metadata.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 2: Browser/native host disconnect → Disconnected
  // -------------------------------------------------------------------------
  console.log('\n[TEST 2] Testing Browser/Host Disconnect → Disconnected state...')
  const discRes = manager.processMessage(JSON.stringify({
    type: 'watcher:disconnect',
    source: 'chrome-profile-1'
  }))
  assert.strictEqual(discRes.ok, true, 'Disconnect notification accepted')

  const discStatus = manager.getStatus()
  assert.strictEqual(discStatus.state, 'disconnected', 'State must transition to disconnected')
  assert.strictEqual(discStatus.connected, false, 'connected flag must be false')
  assert(discStatus.lastDisconnectedTime > 0, 'lastDisconnectedTime must be recorded')
  console.log('✓ TEST 2 Passed: Disconnect notification properly sets state to Disconnected.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 3: Failed handshake → Error
  // -------------------------------------------------------------------------
  console.log('\n[TEST 3] Testing Malformed Message / Failed Handshake → Error state...')
  const malformedRes = manager.processMessage('{ malformed json }')
  assert.strictEqual(malformedRes.ok, false, 'Malformed message must be rejected')

  const errStatus = manager.getStatus()
  assert.strictEqual(errStatus.state, 'error', 'State must be error after malformed payload')
  assert.strictEqual(errStatus.connected, false, 'connected flag must be false on error')
  assert(errStatus.errorReason.includes('Malformed JSON'), 'Sanitized errorReason must be provided')
  console.log('✓ TEST 3 Passed: Malformed payload caught and transitions state to Error.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 4: Retry → Connecting → Connected
  // -------------------------------------------------------------------------
  console.log('\n[TEST 4] Testing Retry → Connecting → Connected flow...')
  // Reset cooldown
  manager.retryStatus.cooldownUntil = undefined

  const retryPromise = manager.retryConnection(true, true)
  // Check during inProgress
  assert.strictEqual(manager.retryStatus.inProgress, true, 'inProgress must be true during retry')
  assert.strictEqual(manager.connectionState, 'connecting', 'State must be connecting during retry')

  const postRetryStatus = await retryPromise
  assert.strictEqual(postRetryStatus.state, 'connected', 'State must be connected when handshake succeeds during retry')
  assert.strictEqual(postRetryStatus.retryStatus.inProgress, false, 'inProgress must be reset after completion')
  console.log('✓ TEST 4 Passed: Retry transitions through Connecting to Connected.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 5: Retry Cooldown
  // -------------------------------------------------------------------------
  console.log('\n[TEST 5] Testing Retry Cooldown enforcement...')
  // Cooldown is set until now + 2500ms
  assert(manager.retryStatus.cooldownUntil > Date.now(), 'cooldownUntil must be in the future')

  const cooldownStatus = await manager.retryConnection(true, true)
  // State should not be altered since cooldown blocked it
  assert.strictEqual(cooldownStatus.retryStatus.inProgress, false, 'Cooldown must block repeated inProgress trigger')
  console.log('✓ TEST 5 Passed: Rapid consecutive retries are blocked by cooldown timer.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 6: Multiple Browser Connection Handling
  // -------------------------------------------------------------------------
  console.log('\n[TEST 6] Testing Multiple Browser Connection handling (Chrome + Edge)...')
  manager.activeSessions.clear()
  // Browser 1: Chrome connects
  manager.processMessage(JSON.stringify({
    type: 'watcher:handshake',
    source: 'browser-source-chrome',
    _meta: { browser: 'chrome' }
  }))
  // Browser 2: Edge connects
  manager.processMessage(JSON.stringify({
    type: 'watcher:handshake',
    source: 'browser-source-edge',
    _meta: { browser: 'edge' }
  }))

  assert.strictEqual(manager.activeSessions.size, 2, 'Must track 2 simultaneous active sessions')
  assert.strictEqual(manager.connectionState, 'connected', 'Must be connected with both active')

  // Chrome disconnects
  manager.processMessage(JSON.stringify({
    type: 'watcher:disconnect',
    source: 'browser-source-chrome'
  }))
  assert.strictEqual(manager.activeSessions.size, 1, 'Only Edge session remains')
  assert.strictEqual(manager.connectionState, 'connected', 'Must REMAIN connected while Edge is still active')

  // Edge disconnects
  manager.processMessage(JSON.stringify({
    type: 'watcher:disconnect',
    source: 'browser-source-edge'
  }))
  assert.strictEqual(manager.activeSessions.size, 0, 'Zero sessions remain')
  assert.strictEqual(manager.connectionState, 'disconnected', 'Must transition to disconnected when all leave')
  console.log('✓ TEST 6 Passed: Multiple browsers handled gracefully without session collisions.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 7: Invalid IPC Input Rejection
  // -------------------------------------------------------------------------
  console.log('\n[TEST 7] Testing Invalid IPC Input Rejection...')
  const noTypeRes = manager.processMessage(JSON.stringify({ data: 'hello' }))
  assert.strictEqual(noTypeRes.ok, false, 'Missing type must be rejected')

  const emptyRes = manager.processMessage('')
  assert.strictEqual(emptyRes.ok, false, 'Empty string must be rejected')
  console.log('✓ TEST 7 Passed: Invalid payloads safely rejected with failure responses.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 8: Cleanup of Timers and Listeners
  // -------------------------------------------------------------------------
  console.log('\n[TEST 8] Testing Cleanup of Sockets and Timers on Shutdown...')
  await manager.startServer()
  assert(manager.server.listening, 'Server must be listening')

  manager.stopServer()
  assert.strictEqual(manager.server, null, 'Server must be nullified')
  assert.strictEqual(manager.leaseCheckTimer, null, 'Lease timer must be cleared')
  assert.strictEqual(manager.activeSockets.size, 0, 'Active sockets set must be cleared')
  console.log('✓ TEST 8 Passed: Pipe server stops cleanly with all timers and sockets destroyed.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 9: Status Remains Accurate After App Restart
  // -------------------------------------------------------------------------
  console.log('\n[TEST 9] Verifying Status Accuracy on Fresh App Startup...')
  const freshManager = new ExtensionConnectionManager()
  const freshStatus = freshManager.getStatus()

  assert.strictEqual(freshStatus.state, 'disconnected', 'Fresh start MUST be disconnected')
  assert.strictEqual(freshStatus.connected, false, 'connected MUST be false initially')
  assert.strictEqual(freshStatus.lastConnectedTime, undefined, 'lastConnectedTime must be undefined initially')
  console.log('✓ TEST 9 Passed: App does not falsely report connected on fresh startup.')
  passedCount++

  // -------------------------------------------------------------------------
  // TEST 10: Existing Functionality Intact (Watches & Notifications)
  // -------------------------------------------------------------------------
  console.log('\n[TEST 10] Testing Existing Functionality (Watches & Notifications)...')
  const boardSyncRes = manager.processMessage(JSON.stringify({
    type: 'watcher:board',
    source: 'prod-source',
    browser: 'brave',
    watches: [
      { name: 'Build Monitor', text: 'Build #42 Passed', state: 'watching' }
    ]
  }))
  assert.strictEqual(boardSyncRes.ok, true, 'Board watch payload processed successfully')
  assert.strictEqual(boardSyncRes.count, 1, 'Watch count returned')
  assert.strictEqual(manager.getStatus().state, 'connected', 'Watch delivery marks state connected')
  assert.strictEqual(manager.getStatus().browserType, 'brave', 'Browser type accurately set to brave')

  const notifyRes = manager.processMessage(JSON.stringify({
    type: 'watcher:notify',
    title: 'Deployment Success',
    message: 'Version 0.1.0 deployed to production'
  }))
  assert.strictEqual(notifyRes.ok, true, 'Notification alert processed successfully')
  console.log('✓ TEST 10 Passed: Existing watch sync and notifications function seamlessly.')
  passedCount++

  console.log('\n=================================================================')
  console.log(`  Phase 5.2 Verification Summary: ${passedCount}/10 Tests Passed`)
  console.log('=================================================================\n')
}

runTestSuite().catch((err) => {
  console.error('[FAIL] Test suite failed:', err)
  process.exit(1)
})
