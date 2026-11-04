import fs from 'fs'
import path from 'path'
import os from 'os'
import { BoardWatch, WatchState } from './types'

export interface SourceWatches {
  updated: string
  watches: BoardWatch[]
}

export interface WatchesStoreData {
  sources: Record<string, SourceWatches>
}

export function getBeaconDataDirectory(): string {
  const base = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
  const beaconDir = path.join(base, 'Beacon')
  const helmDir = path.join(base, 'Helm')

  // Auto-migration: if Beacon directory doesn't exist but Helm directory exists, migrate
  if (!fs.existsSync(beaconDir)) {
    try {
      fs.mkdirSync(beaconDir, { recursive: true })
      if (fs.existsSync(helmDir)) {
        const entries = fs.readdirSync(helmDir)
        for (const entry of entries) {
          const srcPath = path.join(helmDir, entry)
          const destPath = path.join(beaconDir, entry)
          try {
            const stat = fs.statSync(srcPath)
            if (stat.isDirectory()) {
              fs.cpSync(srcPath, destPath, { recursive: true })
            } else {
              fs.copyFileSync(srcPath, destPath)
            }
          } catch (copyErr) {
            console.error('[BEACON Migration] Failed to copy entry during migration:', entry, copyErr)
          }
        }
        // Also ensure beacon.db is created from helm.db if helm.db was copied
        const helmDb = path.join(beaconDir, 'helm.db')
        const beaconDb = path.join(beaconDir, 'beacon.db')
        if (fs.existsSync(helmDb) && !fs.existsSync(beaconDb)) {
          fs.copyFileSync(helmDb, beaconDb)
        }
      }
    } catch (err) {
      console.error('[BEACON Storage] Failed to initialize Beacon data directory:', err)
    }
  }

  return beaconDir
}

export const getHelmDataDirectory = getBeaconDataDirectory

export function getWatchesFilePath(): string {
  return path.join(getBeaconDataDirectory(), 'watches.json')
}

export function sanitizeWatch(raw: any): BoardWatch | null {
  if (!raw || typeof raw !== 'object') return null
  const name = typeof raw.name === 'string' ? raw.name.slice(0, 80).trim() : ''
  if (!name) return null

  const text = typeof raw.text === 'string' ? raw.text.slice(0, 300) : ''
  const quoted = Boolean(raw.quoted)

  const rawState = String(raw.state || 'watching')
  const validStates: WatchState[] = ['attention', 'pending', 'watching', 'done']
  const state: WatchState = validStates.includes(rawState as WatchState)
    ? (rawState as WatchState)
    : 'watching'

  const since = typeof raw.since === 'number' && !isNaN(raw.since) ? raw.since : Date.now()
  const checked = typeof raw.checked === 'number' && !isNaN(raw.checked) ? raw.checked : Date.now()
  const kind = typeof raw.kind === 'string' ? raw.kind.slice(0, 20) : 'general'
  const step = typeof raw.step === 'number' && !isNaN(raw.step) ? Math.max(0, Math.min(20, Math.floor(raw.step))) : 0
  const steps = typeof raw.steps === 'number' && !isNaN(raw.steps) ? Math.max(0, Math.min(20, Math.floor(raw.steps))) : 0

  let url: string | undefined = undefined
  if (typeof raw.url === 'string' && (raw.url.startsWith('http://') || raw.url.startsWith('https://'))) {
    url = raw.url.slice(0, 2000)
  }

  const due = typeof raw.due === 'number' && !isNaN(raw.due) && raw.due > 0 ? raw.due : undefined
  const dueHasTime = Boolean(raw.dueHasTime)
  const finished = typeof raw.finished === 'number' && !isNaN(raw.finished) && raw.finished > 0 ? raw.finished : undefined

  return {
    name,
    text,
    quoted,
    state,
    since,
    checked,
    kind,
    step,
    steps,
    url,
    due,
    dueHasTime,
    finished
  }
}

export function loadWatchesStore(): WatchesStoreData {
  const filePath = getWatchesFilePath()
  if (!fs.existsSync(filePath)) {
    return { sources: {} }
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    if (data && typeof data === 'object' && typeof data.sources === 'object') {
      return data as WatchesStoreData
    }
  } catch (err) {
    console.error('[BEACON WatchesStore] Failed to read watches.json:', err)
  }

  return { sources: {} }
}

export function saveWatchesStore(data: WatchesStoreData): void {
  const filePath = getWatchesFilePath()
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const tempPath = path.join(dir, `watches.${process.pid}.${Date.now()}.tmp`)
  const json = JSON.stringify(data, null, 2)

  try {
    fs.writeFileSync(tempPath, json, 'utf-8')
    // Atomic rename on Windows
    try {
      fs.renameSync(tempPath, filePath)
    } catch {
      // In case destination exists and rename throws on older systems
      fs.copyFileSync(tempPath, filePath)
      fs.unlinkSync(tempPath)
    }
  } catch (err) {
    console.error('[BEACON WatchesStore] Failed to write watches.json atomically:', err)
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath)
      } catch {}
    }
    throw err
  }
}

export function updateWatchesForSource(source: string, rawWatches: any[]): BoardWatch[] {
  const sanitizedSource = (source || 'default').slice(0, 64)
  const cleanWatches: BoardWatch[] = []

  for (const item of rawWatches) {
    const sanitized = sanitizeWatch(item)
    if (sanitized) {
      cleanWatches.push(sanitized)
    }
  }

  const store = loadWatchesStore()
  store.sources[sanitizedSource] = {
    updated: new Date().toISOString(),
    watches: cleanWatches
  }

  // Prune profiles that have not reported in 14 days (matching Swift NativeHost.swift logic)
  const cutoff = Date.now() - 14 * 86400 * 1000
  for (const [key, val] of Object.entries(store.sources)) {
    const updateTime = new Date(val.updated).getTime()
    if (isNaN(updateTime) || updateTime < cutoff) {
      delete store.sources[key]
    }
  }

  saveWatchesStore(store)
  return flattenAndSortWatches(store)
}

export function getAllWatches(): BoardWatch[] {
  const store = loadWatchesStore()
  return flattenAndSortWatches(store)
}

export function flattenAndSortWatches(store: WatchesStoreData): BoardWatch[] {
  const cutoff = Date.now() - 14 * 86400 * 1000
  const all: BoardWatch[] = []

  for (const src of Object.values(store.sources)) {
    const updated = new Date(src.updated).getTime()
    if (!isNaN(updated) && updated >= cutoff) {
      all.push(...src.watches)
    }
  }

  // State priority: attention -> pending -> watching -> done
  const stateWeight: Record<WatchState, number> = {
    attention: 0,
    pending: 1,
    watching: 2,
    done: 3
  }

  return all.sort((a, b) => {
    const diff = stateWeight[a.state] - stateWeight[b.state]
    if (diff !== 0) return diff
    // secondary sort: newest checked first
    return b.checked - a.checked
  })
}

