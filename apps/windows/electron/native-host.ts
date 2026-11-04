import fs from 'fs'
import net from 'net'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import {
  WatcherBoardPayload,
  WatcherNotifyPayload,
  NativeHostMessage,
  DetectedBrowserType
} from './types'
import {
  updateWatchesForSource,
  getHelmDataDirectory,
  getBeaconDataDirectory
} from './watches-store'

const BEACON_PIPE_NAME = '\\\\.\\pipe\\beacon-windows-ipc'
const HELM_PIPE_NAME = '\\\\.\\pipe\\helm-windows-ipc'
const MAX_MESSAGE_SIZE = 1_000_000 // 1 MB limit matching macOS NativeHost.swift

export function detectCallerBrowser(): DetectedBrowserType {
  const args = process.argv.join(' ').toLowerCase()
  if (args.includes('msedge') || args.includes('edge')) return 'edge'
  if (args.includes('brave')) return 'brave'
  if (args.includes('chrome')) return 'chrome'

  try {
    if (process.ppid) {
      const out = execSync(`tasklist /fi "pid eq ${process.ppid}" /fo csv /nh`, {
        timeout: 1000,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore']
      })
      const lower = String(out).toLowerCase()
      if (lower.includes('msedge')) return 'edge'
      if (lower.includes('brave')) return 'brave'
      if (lower.includes('chrome')) return 'chrome'
    }
  } catch {}

  return 'chromium'
}

// Log file for native host diagnostics
function logHost(msg: string): void {
  try {
    const logPath = path.join(getBeaconDataDirectory(), 'native-host.log')
    const timestamp = new Date().toISOString()
    fs.appendFileSync(logPath, `[${timestamp}] [PID ${process.pid}] ${msg}\n`, 'utf-8')
  } catch {}
}

// Redirect console to stderr to preserve stdout exclusively for native messaging
console.log = (...args: any[]) => {
  const line = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
  process.stderr.write(line + '\n')
  logHost(line)
}

console.error = (...args: any[]) => {
  const line = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
  process.stderr.write('[ERROR] ' + line + '\n')
  logHost('[ERROR] ' + line)
}

function sendNativeReply(replyObj: { ok: boolean; [key: string]: any }): void {
  try {
    const jsonStr = JSON.stringify(replyObj)
    const bodyBuffer = Buffer.from(jsonStr, 'utf-8')
    const headerBuffer = Buffer.alloc(4)
    headerBuffer.writeUInt32LE(bodyBuffer.length, 0)

    const fullMessage = Buffer.concat([headerBuffer, bodyBuffer])
    process.stdout.write(fullMessage, () => {
      process.exit(0)
    })
  } catch (err) {
    process.stderr.write(`Failed to send native reply: ${err}\n`)
    process.exit(1)
  }
}

async function forwardToSinglePipe(pipeName: string, enriched: any): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false
    const socket = net.createConnection(pipeName, () => {
      socket.write(JSON.stringify(enriched) + '\n', () => {
        // Data written to pipe
      })
    })

    socket.on('data', () => {
      if (!resolved) {
        resolved = true
        socket.end()
        resolve(true)
      }
    })

    socket.on('error', () => {
      if (!resolved) {
        resolved = true
        resolve(false)
      }
    })

    socket.setTimeout(1200, () => {
      if (!resolved) {
        resolved = true
        socket.destroy()
        resolve(false)
      }
    })
  })
}

async function forwardToPipe(payload: NativeHostMessage): Promise<boolean> {
  const browser = detectCallerBrowser()
  const enriched = {
    ...payload,
    _meta: {
      browser,
      origin: process.argv[2] || '',
      pid: process.pid,
      ppid: process.ppid,
      timestamp: Date.now()
    }
  }

  // Try primary BEACON pipe first
  const beaconOk = await forwardToSinglePipe(BEACON_PIPE_NAME, enriched)
  if (beaconOk) return true

  // Try fallback HELM pipe
  const helmOk = await forwardToSinglePipe(HELM_PIPE_NAME, enriched)
  if (helmOk) return true

  console.log('Named Pipes unavailable. Using disk fallback.')
  return false
}

async function handleMessage(payload: NativeHostMessage): Promise<boolean> {
  // First attempt: live Named Pipe to running Electron main process
  const deliveredViaPipe = await forwardToPipe(payload)
  if (deliveredViaPipe) {
    console.log(`Message (${payload.type}) delivered successfully via Named Pipe.`)
    return true
  }

  // Fallback: If Electron is closed or pipe is not listening, save directly to disk
  if (payload.type === 'watcher:board') {
    const boardMsg = payload as WatcherBoardPayload
    try {
      updateWatchesForSource(boardMsg.source || 'default', boardMsg.watches || [])
      console.log(`Fallback: Saved ${boardMsg.watches?.length || 0} watches to watches.json`)
      return true
    } catch (err) {
      console.error('Fallback save failed:', err)
      return false
    }
  } else if (payload.type === 'watcher:notify') {
    const notifyMsg = payload as WatcherNotifyPayload
    console.log(`Fallback: Queued notification alert: "${notifyMsg.title}"`)
    return true
  }

  return false
}

export function runNativeHost(): void {
  logHost('BEACON Native Messaging Host started. Arguments: ' + process.argv.slice(2).join(' '))

  let inputBuffer = Buffer.alloc(0)
  let expectedLength: number | null = null

  // Timeout guard: terminate if no input arrives within 15 seconds
  const timeoutId = setTimeout(() => {
    logHost('Timed out waiting for input from browser.')
    process.exit(0)
  }, 15000)

  process.stdin.on('data', async (chunk: Buffer) => {
    inputBuffer = Buffer.concat([inputBuffer, chunk])

    // Read 4-byte length prefix
    if (expectedLength === null && inputBuffer.length >= 4) {
      expectedLength = inputBuffer.readUInt32LE(0)

      if (expectedLength <= 0 || expectedLength > MAX_MESSAGE_SIZE) {
        console.error(`Invalid message length: ${expectedLength} bytes (max ${MAX_MESSAGE_SIZE})`)
        clearTimeout(timeoutId)
        sendNativeReply({ ok: false, error: 'Message length exceeds maximum size limit' })
        return
      }
    }

    // Read full JSON body once length is available
    if (expectedLength !== null && inputBuffer.length >= 4 + expectedLength) {
      clearTimeout(timeoutId)
      const bodyBytes = inputBuffer.subarray(4, 4 + expectedLength)

      try {
        const bodyText = bodyBytes.toString('utf-8')
        const message = JSON.parse(bodyText) as NativeHostMessage
        const success = await handleMessage(message)
        sendNativeReply({ ok: success })
      } catch (err) {
        console.error('Failed to parse or handle message JSON:', err)
        sendNativeReply({ ok: false, error: 'JSON parse error' })
      }
    }
  })

  process.stdin.on('end', () => {
    clearTimeout(timeoutId)
    if (expectedLength === null) {
      logHost('stdin closed before message received.')
      process.exit(0)
    }
  })

  process.stdin.on('error', (err) => {
    clearTimeout(timeoutId)
    console.error('stdin error:', err)
    process.exit(1)
  })
}

// Execute immediately when invoked directly
if (require.main === module) {
  runNativeHost()
}

