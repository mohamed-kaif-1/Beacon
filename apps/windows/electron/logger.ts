import fs from 'fs'
import path from 'path'
import os from 'os'
import { app, shell } from 'electron'
import {
  LogLevel,
  LogEntry,
  SystemHealthSummary,
  DiagnosticBundle
} from './types'
import { getHelmDataDirectory, getBeaconDataDirectory } from './watches-store'

const MAX_LOG_SIZE_BYTES = 1_048_576 // 1 MB per log file
const MAX_BACKUP_FILES = 3 // Keep helm.log, helm.1.log, helm.2.log
const MAX_RING_BUFFER_ENTRIES = 100 // Last 100 logs in memory for instant diagnostic queries

const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

/**
 * Privacy & Redaction Filter
 * Strips usernames from Windows & POSIX paths, hides auth tokens, API keys, and credentials.
 */
export function redactSensitiveText(input: unknown): string {
  if (input === null || input === undefined) return ''
  let text = typeof input === 'string' ? input : String(input)

  // 1. Redact Windows user paths: C:\Users\<username>\... -> C:\Users\<redacted>\...
  text = text.replace(/([a-zA-Z]:\\Users\\)[^\s\\/"':]+(\\.*)?/gi, '$1<redacted>$2')

  // 2. Redact POSIX user paths: /home/<user>/... or /Users/<user>/...
  text = text.replace(/(\/(?:home|Users)\/)[^\s\/"':]+(\/.*)?/gi, '$1<redacted>$2')

  // 3. Redact Bearer tokens & Authorization headers
  text = text.replace(/(bearer\s+)[a-zA-Z0-9_\-\.]{6,}/gi, '$1<redacted>')
  text = text.replace(/(authorization[=:]\s*(?!bearer))['"]?[^\s'"&,]+/gi, '$1<redacted>')

  // 4. Redact API keys, tokens, secrets, and passwords
  text = text.replace(/((?:api[_-]?key|access[_-]?token|auth[_-]?token|token|secret|password|passwd)[=:]\s*['"]?)[^\s'"&,]+/gi, '$1<redacted>')

  // 5. Redact sensitive query parameters in URLs (e.g. ?token=..., &key=...)
  text = text.replace(/([?&](?:token|key|secret|auth|apikey|access_token)=)[^&\s]+/gi, '$1<redacted>')

  return text
}

export class LoggerService {
  private minLevel: LogLevel = 'info'
  private logDir: string
  private activeLogPath: string
  private ringBuffer: LogEntry[] = []

  constructor(customDir?: string) {
    this.logDir = customDir || path.join(getBeaconDataDirectory(), 'logs')
    this.activeLogPath = path.join(this.logDir, 'beacon.log')
  }

  public setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  public getLevel(): LogLevel {
    return this.minLevel
  }

  public getLogsDirectory(): string {
    return this.logDir
  }

  public getActiveLogPath(): string {
    return this.activeLogPath
  }

  private ensureDirectory(): void {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true })
      }
    } catch {
      // Fail-safe: do not throw if directory creation fails
    }
  }

  /**
   * Log rotation: rotates helm.log -> helm.1.log -> helm.2.log when file exceeds 1 MB
   */
  private checkAndRotate(): void {
    try {
      if (!fs.existsSync(this.activeLogPath)) return
      const stats = fs.statSync(this.activeLogPath)
      if (stats.size < MAX_LOG_SIZE_BYTES) return

      for (let i = MAX_BACKUP_FILES - 1; i >= 1; i--) {
        const older = path.join(this.logDir, `beacon.${i}.log`)
        const newer = path.join(this.logDir, `beacon.${i + 1}.log`)
        if (fs.existsSync(older)) {
          try {
            if (fs.existsSync(newer)) fs.unlinkSync(newer)
            fs.renameSync(older, newer)
          } catch {}
        }
      }

      const firstBackup = path.join(this.logDir, 'beacon.1.log')
      if (fs.existsSync(firstBackup)) {
        try { fs.unlinkSync(firstBackup) } catch {}
      }
      fs.renameSync(this.activeLogPath, firstBackup)
    } catch {
      // Fail-safe: rotation failure must never crash the application
    }
  }

  public log(level: LogLevel, component: string, message: string, ...args: any[]): void {
    if (LOG_LEVEL_SEVERITY[level] < LOG_LEVEL_SEVERITY[this.minLevel]) {
      return
    }

    const timestamp = Date.now()
    const isoTime = new Date(timestamp).toISOString()

    // Redact all message components
    let fullMsg = redactSensitiveText(message)
    if (args && args.length > 0) {
      const formattedArgs = args.map((a) => {
        if (a instanceof Error) {
          return redactSensitiveText(a.message || a.toString())
        }
        if (typeof a === 'object') {
          try {
            return redactSensitiveText(JSON.stringify(a))
          } catch {
            return '[Object]'
          }
        }
        return redactSensitiveText(String(a))
      })
      fullMsg += ' ' + formattedArgs.join(' ')
    }

    // 1. In-Memory Ring Buffer
    const entry: LogEntry = {
      timestamp,
      level,
      component,
      message: fullMsg
    }
    this.ringBuffer.push(entry)
    if (this.ringBuffer.length > MAX_RING_BUFFER_ENTRIES) {
      this.ringBuffer.shift()
    }

    // 2. Console Output (filtered & formatted)
    const formattedLine = `[${isoTime}] [${level.toUpperCase()}] [${component}] ${fullMsg}`
    if (level === 'error') {
      console.error(formattedLine)
    } else if (level === 'warn') {
      console.warn(formattedLine)
    } else {
      console.log(formattedLine)
    }

    // 3. Local File Persistence with Rotation
    try {
      this.ensureDirectory()
      this.checkAndRotate()
      fs.appendFileSync(this.activeLogPath, formattedLine + '\n', 'utf-8')
    } catch {
      // Fail-safe: disk write failures must never crash the host process
    }
  }

  public debug(component: string, message: string, ...args: any[]): void {
    this.log('debug', component, message, ...args)
  }

  public info(component: string, message: string, ...args: any[]): void {
    this.log('info', component, message, ...args)
  }

  public warn(component: string, message: string, ...args: any[]): void {
    this.log('warn', component, message, ...args)
  }

  public error(component: string, message: string, ...args: any[]): void {
    this.log('error', component, message, ...args)
  }

  public getRecentLogs(limit = 50): LogEntry[] {
    const lim = Math.max(1, Math.min(MAX_RING_BUFFER_ENTRIES, limit))
    return this.ringBuffer.slice(-lim)
  }

  public clearLogs(): boolean {
    this.ringBuffer = []
    try {
      if (fs.existsSync(this.logDir)) {
        const files = fs.readdirSync(this.logDir)
        for (const file of files) {
          if ((file.startsWith('beacon') || file.startsWith('helm')) && file.endsWith('.log')) {
            try {
              fs.unlinkSync(path.join(this.logDir, file))
            } catch {}
          }
        }
      }
      return true
    } catch {
      return false
    }
  }

  public async openLogsFolder(): Promise<void> {
    this.ensureDirectory()
    try {
      await shell.openPath(this.logDir)
    } catch (err) {
      this.error('Logger', 'Failed to open logs folder in explorer', err)
    }
  }

  public exportDiagnosticsBundle(healthSummary: SystemHealthSummary): { success: boolean; filePath?: string; bundle?: DiagnosticBundle; error?: string } {
    try {
      const diagDir = path.join(getBeaconDataDirectory(), 'diagnostics')
      if (!fs.existsSync(diagDir)) {
        fs.mkdirSync(diagDir, { recursive: true })
      }

      const bundle: DiagnosticBundle = {
        generatedAt: new Date().toISOString(),
        systemHealth: healthSummary,
        recentLogs: this.getRecentLogs(100)
      }

      const fileName = `beacon-diagnostics-${Date.now()}.json`
      const exportPath = path.join(diagDir, fileName)

      fs.writeFileSync(exportPath, JSON.stringify(bundle, null, 2), 'utf-8')
      this.info('Logger', `Exported sanitized diagnostics bundle to: ${exportPath}`)

      return {
        success: true,
        filePath: exportPath,
        bundle
      }
    } catch (err: any) {
      this.error('Logger', 'Failed to generate diagnostics export bundle', err)
      return {
        success: false,
        error: redactSensitiveText(err?.message || 'Failed to export diagnostics')
      }
    }
  }
}

export const logger = new LoggerService()
