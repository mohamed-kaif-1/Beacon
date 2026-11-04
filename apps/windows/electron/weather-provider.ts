import { WeatherData } from './types'
import { logger, redactSensitiveText } from './logger'

export interface IWeatherProvider {
  getWeather(location: string): Promise<WeatherData | null>
}

export interface WmoCondition {
  description: string
  conditionCode: WeatherData['conditionCode']
}

/**
 * Maps WMO Weather Interpretation Codes (0-99) to clean descriptions and normalized condition codes
 */
export function parseWmoCode(code?: number, isDay = 1): WmoCondition {
  if (code === undefined || code === null) {
    return { description: 'Clear', conditionCode: 'clear' }
  }

  switch (code) {
    case 0:
      return { description: isDay ? 'Clear sky' : 'Clear night', conditionCode: 'clear' }
    case 1:
      return { description: 'Mainly clear', conditionCode: 'clear' }
    case 2:
      return { description: 'Partly cloudy', conditionCode: 'cloudy' }
    case 3:
      return { description: 'Overcast', conditionCode: 'cloudy' }
    case 45:
      return { description: 'Fog', conditionCode: 'fog' }
    case 48:
      return { description: 'Depositing rime fog', conditionCode: 'fog' }
    case 51:
      return { description: 'Light drizzle', conditionCode: 'rain' }
    case 53:
      return { description: 'Moderate drizzle', conditionCode: 'rain' }
    case 55:
      return { description: 'Dense drizzle', conditionCode: 'rain' }
    case 56:
    case 57:
      return { description: 'Freezing drizzle', conditionCode: 'snow' }
    case 61:
      return { description: 'Slight rain', conditionCode: 'rain' }
    case 63:
      return { description: 'Moderate rain', conditionCode: 'rain' }
    case 65:
      return { description: 'Heavy rain', conditionCode: 'rain' }
    case 66:
    case 67:
      return { description: 'Freezing rain', conditionCode: 'snow' }
    case 71:
      return { description: 'Slight snow fall', conditionCode: 'snow' }
    case 73:
      return { description: 'Moderate snow fall', conditionCode: 'snow' }
    case 75:
      return { description: 'Heavy snow fall', conditionCode: 'snow' }
    case 77:
      return { description: 'Snow grains', conditionCode: 'snow' }
    case 80:
      return { description: 'Slight rain showers', conditionCode: 'rain' }
    case 81:
      return { description: 'Moderate rain showers', conditionCode: 'rain' }
    case 82:
      return { description: 'Violent rain showers', conditionCode: 'rain' }
    case 85:
      return { description: 'Slight snow showers', conditionCode: 'snow' }
    case 86:
      return { description: 'Heavy snow showers', conditionCode: 'snow' }
    case 95:
      return { description: 'Thunderstorm', conditionCode: 'thunder' }
    case 96:
    case 99:
      return { description: 'Thunderstorm with hail', conditionCode: 'thunder' }
    default:
      return { description: 'Clear', conditionCode: 'clear' }
  }
}

interface GeocodingResult {
  latitude: number
  longitude: number
  displayName: string
}

interface CacheEntry {
  data: WeatherData
  expiresAt: number
}

export class OpenMeteoWeatherProvider implements IWeatherProvider {
  private cache: Map<string, CacheEntry> = new Map()
  private geoCache: Map<string, { result: GeocodingResult; expiresAt: number }> = new Map()
  private cacheTTLMs = 15 * 60 * 1000 // 15-minute weather cache
  private geoTTLMs = 24 * 60 * 60 * 1000 // 24-hour geocode cache

  public clearCache(): void {
    this.cache.clear()
    this.geoCache.clear()
  }

  public getCachedEntry(location: string): WeatherData | null {
    const key = (location || '').trim().toLowerCase()
    const cached = this.cache.get(key)
    return cached ? cached.data : null
  }

  private async geocodeLocation(location: string): Promise<GeocodingResult | null> {
    const trimmed = location.trim()
    if (!trimmed) return null

    const cacheKey = trimmed.toLowerCase()
    const cachedGeo = this.geoCache.get(cacheKey)
    if (cachedGeo && Date.now() < cachedGeo.expiresAt) {
      return cachedGeo.result
    }

    try {
      const fetchWithTimeout = async (query: string): Promise<any> => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 8000)
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        logger.info('Weather', `[OpenMeteo:Geocode] Initiating request: query="${query}", URL=${redactSensitiveText(url)}`)
        try {
          const res = await fetch(url, {
            headers: {
              Accept: 'application/json',
              'User-Agent': 'BEACON-Desktop/0.1.0 (https://github.com/jonathanvineet/beacon)'
            },
            signal: controller.signal
          })
          logger.info('Weather', `[OpenMeteo:Geocode] HTTP response status: ${res.status} ${res.statusText}`)
          if (!res.ok) {
            logger.warn('Weather', `[OpenMeteo:Geocode] Non-200 status received: ${res.status}`)
            return null
          }
          const parsed = await res.json()
          logger.info('Weather', `[OpenMeteo:Geocode] Result count: ${parsed?.results?.length ?? 0}`)
          return parsed
        } catch (err: any) {
          logger.error('Weather', `[OpenMeteo:Geocode] Fetch error for "${query}": ${err?.message}`, err?.stack)
          throw err
        } finally {
          clearTimeout(timer)
        }
      }

      let data = await fetchWithTimeout(trimmed)

      // Fallback 1: If no results and query contains commas (e.g. "London, UK", "Chennai, Tamil Nadu, India"), try primary city
      if ((!data || !data.results || data.results.length === 0) && trimmed.includes(',')) {
        const primaryCity = trimmed.split(',')[0].trim()
        if (primaryCity && primaryCity.toLowerCase() !== trimmed.toLowerCase()) {
          logger.info('Weather', `[OpenMeteo:Geocode] Trying primary city segment fallback: "${primaryCity}"`)
          try {
            data = await fetchWithTimeout(primaryCity)
          } catch {}
        }
      }

      if (!data || !data.results || data.results.length === 0) {
        logger.warn('Weather', `[OpenMeteo:Geocode] No coordinates found for location: "${trimmed}"`)
        return null
      }

      const match = data.results[0]
      const name = match.name || trimmed
      const admin1 = match.admin1 ? match.admin1 + ', ' : ''
      const country = match.country || ''
      const displayName = country ? `${name}, ${admin1}${country}` : name

      const result: GeocodingResult = {
        latitude: match.latitude,
        longitude: match.longitude,
        displayName
      }

      logger.info('Weather', `[OpenMeteo:Geocode] Successfully resolved: "${displayName}" -> lat=${result.latitude}, lon=${result.longitude}`)

      this.geoCache.set(cacheKey, {
        result,
        expiresAt: Date.now() + this.geoTTLMs
      })

      return result
    } catch (err: any) {
      logger.error('Weather', `[OpenMeteo:Geocode] Exception during geocoding "${trimmed}": ${err?.message}`, err?.stack)
      return null
    }
  }

  async getWeather(location: string): Promise<WeatherData | null> {
    const loc = (location || '').trim()
    if (!loc) {
      logger.info('Weather', '[OpenMeteo:Forecast] Empty location string provided, returning null')
      return null
    }

    const cacheKey = loc.toLowerCase()
    const cached = this.cache.get(cacheKey)

    // Return fresh cached data if within TTL
    if (cached && Date.now() < cached.expiresAt) {
      logger.info('Weather', `[OpenMeteo:Forecast] Returning cached weather for "${loc}" (valid until ${new Date(cached.expiresAt).toISOString()})`)
      return cached.data
    }

    // Geocode to coordinates
    const geo = await this.geocodeLocation(loc)
    if (!geo) {
      // If geocoding failed (e.g. offline/network failure), return stale cached data if available
      if (cached) {
        logger.warn('Weather', `[OpenMeteo:Forecast] Geocoding failed, returning stale cache with isStale=true for "${loc}"`)
        return { ...cached.data, isStale: true }
      }
      logger.warn('Weather', `[OpenMeteo:Forecast] Geocoding returned null, no weather data available for "${loc}"`)
      return null
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)

      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
      logger.info('Weather', `[OpenMeteo:Forecast] Requesting forecast: ${redactSensitiveText(forecastUrl)}`)

      const response = await fetch(forecastUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'BEACON-Desktop/0.1.0 (https://github.com/jonathanvineet/beacon)'
        },
        signal: controller.signal
      })
      clearTimeout(timeout)

      logger.info('Weather', `[OpenMeteo:Forecast] HTTP response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        logger.warn('Weather', `[OpenMeteo:Forecast] Forecast API returned status ${response.status} for ${loc}`)
        if (cached) {
          return { ...cached.data, isStale: true }
        }
        return null
      }

      const json = await response.json()
      const cur = json.current
      if (!cur) {
        logger.warn('Weather', '[OpenMeteo:Forecast] Invalid forecast payload received (missing .current)')
        if (cached) {
          return { ...cached.data, isStale: true }
        }
        return null
      }

      const temp2m = typeof cur.temperature_2m === 'number' ? cur.temperature_2m : 0
      const tempC = Math.round(temp2m)
      const tempF = Math.round((tempC * 9) / 5 + 32)
      const wmo = parseWmoCode(cur.weather_code, cur.is_day)

      const weatherData: WeatherData = {
        location: geo.displayName,
        temperatureCelsius: tempC,
        temperatureFahrenheit: tempF,
        condition: wmo.description,
        conditionCode: wmo.conditionCode,
        humidity: typeof cur.relative_humidity_2m === 'number' ? cur.relative_humidity_2m : undefined,
        windSpeedKmh: typeof cur.wind_speed_10m === 'number' ? Math.round(cur.wind_speed_10m) : undefined,
        updatedAt: Date.now(),
        isStale: false,
        attribution: 'Weather data by Open-Meteo'
      }

      logger.info(
        'Weather',
        `[OpenMeteo:Forecast] Success: loc="${weatherData.location}", temp=${tempC}°C / ${tempF}°F, code=${cur.weather_code} (${wmo.description}), humidity=${weatherData.humidity}%, wind=${weatherData.windSpeedKmh}km/h`
      )

      // Update cache
      this.cache.set(cacheKey, {
        data: weatherData,
        expiresAt: Date.now() + this.cacheTTLMs
      })

      return weatherData
    } catch (err: any) {
      if (err.name === 'AbortError') {
        logger.warn('Weather', `[OpenMeteo:Forecast] Forecast request timed out after 8s for "${loc}"`)
      } else {
        logger.error('Weather', `[OpenMeteo:Forecast] Forecast lookup error for "${loc}": ${err?.message}`, err?.stack)
      }

      // Fallback: return stale cached data if available
      if (cached) {
        logger.info('Weather', `[OpenMeteo:Forecast] Serving stale cache data for "${loc}"`)
        return { ...cached.data, isStale: true }
      }
      return null
    }
  }
}

export const defaultWeatherProvider = new OpenMeteoWeatherProvider()
