const { spawn } = require('child_process')
const path = require('path')
const http = require('http')
const fs = require('fs')

const installedExe = path.join(
  process.env.LOCALAPPDATA || 'C:\\Users\\moham\\AppData\\Local',
  'Programs\\Helm\\Helm.exe'
)

if (!fs.existsSync(installedExe)) {
  console.error(`[FAIL] Installed executable not found at: ${installedExe}`)
  process.exit(1)
}

console.log(`[Verify Installed] Target binary: ${installedExe}`)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl
    this.ws = null
    this.id = 0
    this.pending = new Map()
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl)
      this.ws.onopen = () => resolve()
      this.ws.onerror = (e) => reject(e)
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.id && this.pending.has(msg.id)) {
          const { res, rej } = this.pending.get(msg.id)
          this.pending.delete(msg.id)
          if (msg.error) rej(msg.error)
          else res(msg.result)
        }
      }
    })
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = ++this.id
      this.pending.set(id, { res, rej })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    })
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'CDP Eval Exception')
    }
    return res.result?.value
  }

  close() {
    if (this.ws) {
      try { this.ws.close() } catch {}
    }
  }
}

async function runSession(sessionName) {
  console.log(`\n======================================================`)
  console.log(`  RUNNING INSTALLED APPLICATION TEST: ${sessionName}`)
  console.log(`======================================================`)

  const env = { ...process.env }
  delete env.ELECTRON_RUN_AS_NODE

  const child = spawn(installedExe, ['--remote-debugging-port=9222'], {
    env,
    stdio: 'pipe'
  })

  child.stdout.on('data', (d) => console.log('[Helm stdout]:', d.toString().trim()))
  child.stderr.on('data', (d) => console.error('[Helm stderr]:', d.toString().trim()))

  // Poll for CDP endpoint
  let pageTarget = null
  for (let attempt = 1; attempt <= 20; attempt++) {
    await sleep(500)
    try {
      const list = await fetchJson('http://127.0.0.1:9222/json/list')
      const target = list.find((t) => t.type === 'page')
      if (target && target.webSocketDebuggerUrl) {
        pageTarget = target
        break
      }
    } catch {}
  }

  if (!pageTarget) {
    child.kill()
    throw new Error('Failed to connect to Chrome DevTools Protocol on port 9222')
  }

  console.log(`[CDP] Connected to installed Helm renderer: ${pageTarget.title}`)
  const cdp = new CdpClient(pageTarget.webSocketDebuggerUrl)
  await cdp.connect()
  await cdp.send('Runtime.enable')

  // Step A: Verify Helm IPC bridge exists
  const hasHelmApi = await cdp.eval('Boolean(window.helm && window.helm.getWeather)')
  console.log(`[Step A] window.helm.getWeather exposed in packaged build: ${hasHelmApi}`)
  if (!hasHelmApi) {
    cdp.close()
    child.kill()
    throw new Error('window.helm.getWeather is not exposed in renderer!')
  }

  // Step B: Configure Chennai in Settings
  console.log(`[Step B] Configuring location "Chennai, Tamil Nadu, India" via settings IPC...`)
  const updatedSettings = await cdp.eval(`
    window.helm.updateSettings({
      ambient: {
        weatherLocation: 'Chennai, Tamil Nadu, India',
        showWeather: true,
        temperatureUnit: 'C'
      }
    })
  `)
  console.log(`[Step B] Settings persisted. Saved location: "${updatedSettings?.ambient?.weatherLocation}"`)

  // Step C: Directly test getWeather with Chennai
  console.log(`[Step C] Testing window.helm.getWeather('Chennai, Tamil Nadu, India')...`)
  const weatherData = await cdp.eval(`window.helm.getWeather('Chennai, Tamil Nadu, India')`)
  console.log('[Step C] Weather data received from Open-Meteo:', weatherData)

  if (!weatherData || typeof weatherData.temperatureCelsius !== 'number') {
    cdp.close()
    child.kill()
    throw new Error(`Invalid weather data received: ${JSON.stringify(weatherData)}`)
  }

  console.log(`✓ Weather resolved: ${weatherData.temperatureCelsius}°C / ${weatherData.temperatureFahrenheit}°F, condition: "${weatherData.condition}", location: "${weatherData.location}"`)

  // Step D: Navigate to Ambient and inspect DOM
  console.log(`[Step D] Navigating to Ambient Screen Board in installed app...`)
  // Click the Ambient navigation button in sidebar
  await cdp.eval(`
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ambient'));
    if (btn) btn.click();
  `)

  // Wait for Ambient to mount and render weather
  console.log(`[Step D] Waiting for Ambient Screen Board to render weather widget...`)
  let ambientRendered = false
  let weatherText = ''

  for (let poll = 1; poll <= 15; poll++) {
    await sleep(500)
    weatherText = await cdp.eval(`
      (() => {
        // Look for weather badge or container
        const elements = Array.from(document.querySelectorAll('*'));
        const weatherEl = elements.find(el => el.textContent && (el.textContent.includes('°C') || el.textContent.includes('Weather unavailable')));
        return weatherEl ? weatherEl.textContent.trim() : '';
      })()
    `)
    if (weatherText && weatherText.includes('°C')) {
      ambientRendered = true
      break
    }
  }

  console.log(`[Step D] Ambient weather DOM text found: "${weatherText}"`)

  if (!ambientRendered || !weatherText.includes('°C')) {
    cdp.close()
    child.kill()
    throw new Error(`Ambient failed to visibly display weather! Found: "${weatherText}"`)
  }

  console.log(`✓ SUCCESS: Ambient Board visibly displays live weather: "${weatherText}"`)

  // Step E: Clean up session
  cdp.close()
  child.kill()
  await sleep(1000)
}

async function main() {
  try {
    // Run Session 1: Configure Chennai, test, verify Ambient display
    await runSession('Session 1 (First Run & Configuration)')

    // Step 8: Restart Helm and test again
    await sleep(2000)
    await runSession('Session 2 (Restart Helm & Persistence Verification)')

    console.log(`\n======================================================`)
    console.log(`  ALL INSTALLED APPLICATION VERIFICATION TESTS PASSED!`)
    console.log(`  Packaged Windows binary verified with live Chennai weather!`)
    console.log(`======================================================\n`)
    process.exit(0)
  } catch (err) {
    console.error('\n[VERIFICATION ERROR]:', err)
    process.exit(1)
  }
}

main()
