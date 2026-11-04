import fs from 'fs'
import path from 'path'
import { execFile, execFileSync } from 'child_process'
import { getHelmDataDirectory, getBeaconDataDirectory } from './watches-store'

const EXTENSION_ID = 'popaljneofbfhillkaogepicefmnmdll'
export const BEACON_HOST_NAME = 'com.jonathanvineet.beacon'
export const HELM_HOST_NAME = 'com.jonathanvineet.helm'
const HOST_NAME = BEACON_HOST_NAME

export interface RegistrationResult {
  ok: boolean
  manifestPath?: string
  hostPath?: string
  error?: string
}

export function findNativeHostBinary(): string | null {
  const appDataBeacon = getBeaconDataDirectory()
  const appDataBin = path.join(appDataBeacon, 'bin')
  const legacyBin = path.join(getHelmDataDirectory(), 'bin')

  const candidates: string[] = []

  // Packaged app path: beacon-native-host.exe resides next to Beacon.exe
  const installDir = path.dirname(process.execPath)
  candidates.push(path.join(installDir, 'beacon-native-host.exe'))
  candidates.push(path.join(installDir, 'beacon-native-host.bat'))
  candidates.push(path.join(installDir, 'helm-native-host.exe'))
  candidates.push(path.join(installDir, 'helm-native-host.bat'))
  candidates.push(path.join(installDir, 'resources', 'beacon-native-host.exe'))
  candidates.push(path.join(installDir, 'resources', 'helm-native-host.exe'))

  // AppData bin path: %APPDATA%\Beacon\bin\beacon-native-host.exe
  candidates.push(path.join(appDataBin, 'beacon-native-host.exe'))
  candidates.push(path.join(appDataBin, 'beacon-native-host.bat'))
  candidates.push(path.join(legacyBin, 'helm-native-host.exe'))
  candidates.push(path.join(legacyBin, 'helm-native-host.bat'))

  // Development path: out/main/beacon-native-host.exe or helm-native-host.exe
  candidates.push(path.join(__dirname, 'beacon-native-host.exe'))
  candidates.push(path.join(__dirname, 'beacon-native-host.bat'))
  candidates.push(path.join(__dirname, 'helm-native-host.exe'))
  candidates.push(path.join(__dirname, 'helm-native-host.bat'))

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c
    }
  }

  return null
}

export function ensureNativeMessagingHostRegistered(): RegistrationResult {
  try {
    const hostPath = findNativeHostBinary()
    if (!hostPath) {
      return { ok: false, error: 'helm-native-host binary not found' }
    }

    const appDataBeacon = getBeaconDataDirectory()
    const hostsToRegister = [
      { name: BEACON_HOST_NAME, desc: 'BEACON: shows watched pages on the board' },
      { name: HELM_HOST_NAME, desc: 'Helm: shows watched pages on the board' }
    ]

    let primaryManifestPath = ''

    for (const hostInfo of hostsToRegister) {
      const manifestPath = path.join(appDataBeacon, `${hostInfo.name}.json`)
      if (!primaryManifestPath) primaryManifestPath = manifestPath

      const manifestContent = {
        name: hostInfo.name,
        description: hostInfo.desc,
        path: hostPath,
        type: 'stdio',
        allowed_origins: [`chrome-extension://${EXTENSION_ID}/`]
      }

      let needsWrite = true
      try {
        if (fs.existsSync(manifestPath)) {
          const existing = fs.readFileSync(manifestPath, 'utf-8')
          if (JSON.stringify(JSON.parse(existing)) === JSON.stringify(manifestContent)) {
            needsWrite = false
          }
        }
      } catch {}

      if (needsWrite) {
        fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2), 'utf-8')
      }

      const browserKeys = [
        `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${hostInfo.name}`,
        `HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\${hostInfo.name}`,
        `HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\${hostInfo.name}`
      ]

      for (const key of browserKeys) {
        execFile('reg.exe', ['add', key, '/ve', '/t', 'REG_SZ', '/d', manifestPath, '/f'], {
          windowsHide: true,
          timeout: 2000
        }, (err) => {
          if (err) {
            console.warn(`[BEACON NativeHost] Non-fatal: Failed to register key ${key}:`, err)
          }
        })
      }
    }

    console.log(`[BEACON NativeHost] Dual registration verified: ${primaryManifestPath} -> ${hostPath}`)
    return { ok: true, manifestPath: primaryManifestPath, hostPath }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[BEACON NativeHost] Registration error:', message)
    return { ok: false, error: message }
  }
}

export function unregisterNativeMessagingHost(): RegistrationResult {
  try {
    const browserKeys = [
      `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${BEACON_HOST_NAME}`,
      `HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\${BEACON_HOST_NAME}`,
      `HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\${BEACON_HOST_NAME}`,
      `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HELM_HOST_NAME}`,
      `HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\${HELM_HOST_NAME}`,
      `HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts\\${HELM_HOST_NAME}`
    ]

    for (const key of browserKeys) {
      try {
        execFileSync('reg.exe', ['delete', key, '/f'], {
          windowsHide: true,
          stdio: 'ignore'
        })
      } catch {}
    }

    const appDataHelm = getHelmDataDirectory()
    const manifestPath = path.join(appDataHelm, `${HOST_NAME}.json`)
    if (fs.existsSync(manifestPath)) {
      try {
        fs.unlinkSync(manifestPath)
      } catch {}
    }

    return { ok: true }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

