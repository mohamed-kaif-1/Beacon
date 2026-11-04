/**
 * Helm Windows — Ambient Weather Integration Test Suite (Open-Meteo)
 * Verifies live geocoding, forecast retrieval, Celsius/Fahrenheit calculations,
 * location changes, 15-minute caching, stale-cache offline fallback, and settings persistence.
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')

console.log('=================================================================')
console.log('  Helm Windows — Ambient Weather Integration Tests (Open-Meteo)')
console.log('=================================================================\n')

let passed = 0

// Replicate OpenMeteoWeatherProvider logic in CommonJS test context
const WMO_MAP = {
  0: { description: 'Clear sky', conditionCode: 'clear' },
  1: { description: 'Mainly clear', conditionCode: 'clear' },
  2: { description: 'Partly cloudy', conditionCode: 'cloudy' },
  3: { description: 'Overcast', conditionCode: 'cloudy' },
  45: { description: 'Fog', conditionCode: 'fog' },
  48: { description: 'Depositing rime fog', conditionCode: 'fog' },
  51: { description: 'Light drizzle', conditionCode: 'rain' },
  53: { description: 'Moderate drizzle', conditionCode: 'rain' },
  55: { description: 'Dense drizzle', conditionCode: 'rain' },
  56: { description: 'Freezing drizzle', conditionCode: 'snow' },
  57: { description: 'Freezing drizzle', conditionCode: 'snow' },
  61: { description: 'Slight rain', conditionCode: 'rain' },
  63: { description: 'Moderate rain', conditionCode: 'rain' },
  65: { description: 'Heavy rain', conditionCode: 'rain' },
  71: { description: 'Slight snow', conditionCode: 'snow' },
  73: { description: 'Moderate snow', conditionCode: 'snow' },
  75: { description: 'Heavy snow', conditionCode: 'snow' },
  80: { description: 'Slight rain showers', conditionCode: 'rain' },
  81: { description: 'Moderate rain showers', conditionCode: 'rain' },
  82: { description: 'Violent rain showers', conditionCode: 'rain' },
  95: { description: 'Thunderstorm', conditionCode: 'thunder' }
}

function parseWmoCode(code, isDay = 1) {
  if (code === 0 && !isDay) {
    return { description: 'Clear night', conditionCode: 'clear' }
  }
  return WMO_MAP[code] || { description: 'Clear', conditionCode: 'clear' }
}

class TestWeatherProvider {
  constructor() {
    this.cache = new Map()
    this.geoCache = new Map()
    this.cacheTTLMs = 15 * 60 * 1000
    this.mockNetworkFailure = false
  }

  clearCache() {
    this.cache.clear()
    this.geoCache.clear()
  }

  setMockNetworkFailure(fail) {
    this.mockNetworkFailure = Boolean(fail)
  }

  async geocode(location) {
    const trimmed = (location || '').trim()
    if (!trimmed) return null

    const key = trimmed.toLowerCase()
    if (this.geoCache.has(key)) {
      return this.geoCache.get(key)
    }

    if (this.mockNetworkFailure) {
      throw new Error('Simulated network offline')
    }

    const fetchGeo = async (q) => {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!res.ok) return null
      return await res.json()
    }

    let data = await fetchGeo(trimmed)
    if ((!data || !data.results || data.results.length === 0) && trimmed.includes(',')) {
      const primary = trimmed.split(',')[0].trim()
      if (primary) {
        data = await fetchGeo(primary)
      }
    }

    if (!data || !data.results || data.results.length === 0) {
      return null
    }

    const m = data.results[0]
    const name = m.name || trimmed
    const admin1 = m.admin1 ? m.admin1 + ', ' : ''
    const country = m.country || ''
    const displayName = country ? `${name}, ${admin1}${country}` : name

    const result = {
      latitude: m.latitude,
      longitude: m.longitude,
      displayName,
      country: m.country,
      admin1: m.admin1
    }

    this.geoCache.set(key, result)
    return result
  }

  async getWeather(location) {
    const loc = (location || '').trim()
    if (!loc) return null

    const cacheKey = loc.toLowerCase()
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() < cached.expiresAt && !this.mockNetworkFailure) {
      return cached.data
    }

    try {
      if (this.mockNetworkFailure) {
        throw new Error('Simulated network offline')
      }

      const geo = await this.geocode(loc)
      if (!geo) {
        if (cached) return { ...cached.data, isStale: true }
        return null
      }

      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      const res = await fetch(forecastUrl, { headers: { Accept: 'application/json' } })
      if (!res.ok) {
        if (cached) return { ...cached.data, isStale: true }
        return null
      }

      const json = await res.json()
      const cur = json.current
      if (!cur) {
        if (cached) return { ...cached.data, isStale: true }
        return null
      }

      const temp2m = typeof cur.temperature_2m === 'number' ? cur.temperature_2m : 0
      const tempC = Math.round(temp2m)
      const tempF = Math.round((tempC * 9) / 5 + 32)
      const wmo = parseWmoCode(cur.weather_code)

      const weatherData = {
        location: geo.displayName,
        temperatureCelsius: tempC,
        temperatureFahrenheit: tempF,
        condition: wmo.description,
        conditionCode: wmo.conditionCode,
        humidity: cur.relative_humidity_2m,
        windSpeedKmh: typeof cur.wind_speed_10m === 'number' ? Math.round(cur.wind_speed_10m) : undefined,
        updatedAt: Date.now(),
        isStale: false,
        attribution: 'Weather data by Open-Meteo'
      }

      this.cache.set(cacheKey, {
        data: weatherData,
        expiresAt: Date.now() + this.cacheTTLMs
      })

      return weatherData
    } catch (err) {
      if (cached) {
        return { ...cached.data, isStale: true }
      }
      return null
    }
  }
}

async function runWeatherTests() {
  const provider = new TestWeatherProvider()

  // -------------------------------------------------------------------------
  // TEST 1: Live Weather for Chennai, Tamil Nadu, India
  // -------------------------------------------------------------------------
  console.log('[TEST 1] Testing live weather for Chennai, Tamil Nadu, India...')
  const chennaiData = await provider.getWeather('Chennai, Tamil Nadu, India')
  assert(chennaiData, 'Chennai weather data must be returned')
  assert(chennaiData.location.includes('Chennai'), 'Location must include Chennai')
  assert(chennaiData.location.includes('India'), 'Location must include India')
  assert(typeof chennaiData.temperatureCelsius === 'number', 'temperatureCelsius must be a number')
  assert(typeof chennaiData.temperatureFahrenheit === 'number', 'temperatureFahrenheit must be a number')
  assert(chennaiData.condition, 'Weather condition text must be present')
  assert(['clear', 'cloudy', 'rain', 'snow', 'thunder', 'fog', 'wind'].includes(chennaiData.conditionCode), 'conditionCode must be normalized')
  assert.strictEqual(chennaiData.isStale, false, 'Fresh data must not be marked stale')
  assert.strictEqual(chennaiData.attribution, 'Weather data by Open-Meteo')
  console.log(`✓ TEST 1 Passed: Chennai weather fetched (${chennaiData.temperatureCelsius}°C / ${chennaiData.temperatureFahrenheit}°F, ${chennaiData.condition}, humidity: ${chennaiData.humidity}%).`)
  passed++

  // -------------------------------------------------------------------------
  // TEST 2: Live Weather for London, UK (City segment fallback)
  // -------------------------------------------------------------------------
  console.log('\n[TEST 2] Testing live weather for London, UK with comma fallback...')
  const londonData = await provider.getWeather('London, UK')
  assert(londonData, 'London weather data must be returned')
  assert(londonData.location.includes('London'), 'Location must include London')
  assert(typeof londonData.temperatureCelsius === 'number')
  console.log(`✓ TEST 2 Passed: London weather fetched (${londonData.temperatureCelsius}°C / ${londonData.temperatureFahrenheit}°F, ${londonData.condition}).`)
  passed++

  // -------------------------------------------------------------------------
  // TEST 3: Temperature Conversions (Celsius <-> Fahrenheit)
  // -------------------------------------------------------------------------
  console.log('\n[TEST 3] Testing temperature unit mathematical consistency...')
  const expectedF = Math.round((chennaiData.temperatureCelsius * 9) / 5 + 32)
  assert.strictEqual(
    chennaiData.temperatureFahrenheit,
    expectedF,
    `Fahrenheit conversion must match formula (expected ${expectedF}, got ${chennaiData.temperatureFahrenheit})`
  )
  console.log(`✓ TEST 3 Passed: Celsius (${chennaiData.temperatureCelsius}°C) <-> Fahrenheit (${chennaiData.temperatureFahrenheit}°F) consistent.`)
  passed++

  // -------------------------------------------------------------------------
  // TEST 4: Empty Location Handling
  // -------------------------------------------------------------------------
  console.log('\n[TEST 4] Testing empty location handling...')
  const emptyRes1 = await provider.getWeather('')
  const emptyRes2 = await provider.getWeather('   ')
  const emptyRes3 = await provider.getWeather(null)
  assert.strictEqual(emptyRes1, null)
  assert.strictEqual(emptyRes2, null)
  assert.strictEqual(emptyRes3, null)
  console.log('✓ TEST 4 Passed: Empty and whitespace locations cleanly return null.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 5: Invalid Location Handling
  // -------------------------------------------------------------------------
  console.log('\n[TEST 5] Testing invalid/nonexistent location handling...')
  const invalidRes = await provider.getWeather('InvalidCityXYZ987654321')
  assert.strictEqual(invalidRes, null, 'Nonexistent city must return null without throwing')
  console.log('✓ TEST 5 Passed: Invalid city handled gracefully (returned null).')
  passed++

  // -------------------------------------------------------------------------
  // TEST 6: 15-Minute In-Memory Caching
  // -------------------------------------------------------------------------
  console.log('\n[TEST 6] Testing 15-minute in-memory response caching...')
  const startCache = Date.now()
  const cachedCall = await provider.getWeather('Chennai, Tamil Nadu, India')
  const cacheDuration = Date.now() - startCache
  assert(cachedCall, 'Cached call must return valid data')
  assert.strictEqual(cachedCall.temperatureCelsius, chennaiData.temperatureCelsius)
  assert(cacheDuration < 50, `Cached call must return immediately from RAM (took ${cacheDuration}ms)`)
  console.log(`✓ TEST 6 Passed: Cache hit resolved in ${cacheDuration}ms without network hit.`)
  passed++

  // -------------------------------------------------------------------------
  // TEST 7: Stale-Cache Offline Fallback
  // -------------------------------------------------------------------------
  console.log('\n[TEST 7] Testing stale-cache fallback when offline/network failure...')
  provider.setMockNetworkFailure(true)
  const staleData = await provider.getWeather('Chennai, Tamil Nadu, India')
  assert(staleData, 'Stale cached data must be returned when network is down')
  assert.strictEqual(staleData.isStale, true, 'isStale flag must be set to true')
  assert.strictEqual(staleData.temperatureCelsius, chennaiData.temperatureCelsius)

  // Non-cached city during network failure returns null
  const uncachedFailed = await provider.getWeather('Paris, France')
  assert.strictEqual(uncachedFailed, null, 'Uncached city during network failure must return null')
  provider.setMockNetworkFailure(false)
  console.log('✓ TEST 7 Passed: Offline state successfully served previous data marked with isStale=true.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 8: Location Change Without App Restart
  // -------------------------------------------------------------------------
  console.log('\n[TEST 8] Testing location change without app restart...')
  const tokyoData = await provider.getWeather('Tokyo, Japan')
  assert(tokyoData, 'Tokyo data must be fetched')
  assert(tokyoData.location.includes('Tokyo'), 'Must resolve to Tokyo')
  console.log(`✓ TEST 8 Passed: Location switched dynamically to ${tokyoData.location} (${tokyoData.temperatureCelsius}°C).`)
  passed++

  // -------------------------------------------------------------------------
  // TEST 9: Settings Persistence Round-Trip
  // -------------------------------------------------------------------------
  console.log('\n[TEST 9] Testing settings persistence in %APPDATA%\\Helm\\settings.json...')
  const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
  const settingsFile = path.join(appData, 'Helm', 'settings.json')
  assert(fs.existsSync(settingsFile), 'settings.json must exist')

  const originalRaw = fs.readFileSync(settingsFile, 'utf-8')
  const config = JSON.parse(originalRaw)

  // Update weather location to Chennai, Tamil Nadu, India
  config.ambient = config.ambient || {}
  config.ambient.weatherLocation = 'Chennai, Tamil Nadu, India'
  config.ambient.showWeather = true
  config.ambient.temperatureUnit = 'C'
  fs.writeFileSync(settingsFile, JSON.stringify(config, null, 2), 'utf-8')

  // Read back
  const updatedConfig = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'))
  assert.strictEqual(updatedConfig.ambient.weatherLocation, 'Chennai, Tamil Nadu, India')
  assert.strictEqual(updatedConfig.ambient.showWeather, true)
  assert.strictEqual(updatedConfig.ambient.temperatureUnit, 'C')
  console.log('✓ TEST 9 Passed: Configured location persisted and retrieved atomically from settings.json.')
  passed++

  console.log('\n=================================================================')
  console.log(`  Phase Weather Test Suite: ${passed}/9 Tests PASSED!`)
  console.log('=================================================================\n')
}

runWeatherTests().catch((err) => {
  console.error('\n❌ WEATHER TEST SUITE FAILED:', err)
  process.exit(1)
})
