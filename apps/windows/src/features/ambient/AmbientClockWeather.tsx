import React, { useEffect, useState } from 'react'
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Zap,
  Wind,
  CloudFog,
  MapPin,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { AmbientSettings, WeatherData } from '../../types'
import { BeaconSymbol } from '../../components/ui/BeaconLogo'

interface AmbientClockWeatherProps {
  settings: AmbientSettings
  settingsLoaded?: boolean
  onOpenSettings: () => void
  isScreensaver?: boolean
}

const CALM_QUOTES = [
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Quiet minds cannot be perplexed or frightened.", author: "Robert Louis Stevenson" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" }
]

export const AmbientClockWeather: React.FC<AmbientClockWeatherProps> = ({
  settings,
  settingsLoaded = true,
  onOpenSettings,
  isScreensaver = false
}) => {
  const [timeStr, setTimeStr] = useState<string>('')
  const [ampmStr, setAmpmStr] = useState<string>('')
  const [dateStr, setDateStr] = useState<string>('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false)
  const [quoteIndex, setQuoteIndex] = useState<number>(0)

  // Real-time Clock update (throttled when window is hidden or minimized)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    const updateTime = (): void => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const formattedMin = minutes < 10 ? `0${minutes}` : `${minutes}`

      if (settings.use24Hour) {
        const formattedHour = hours < 10 ? `0${hours}` : `${hours}`
        setTimeStr(`${formattedHour}:${formattedMin}`)
        setAmpmStr('')
      } else {
        const displayHour = hours % 12 || 12
        const ampm = hours >= 12 ? 'PM' : 'AM'
        setTimeStr(`${displayHour}:${formattedMin}`)
        setAmpmStr(ampm)
      }

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }
      setDateStr(now.toLocaleDateString(undefined, options))
    }

    const startTimer = (): void => {
      if (timer) clearInterval(timer)
      updateTime()
      if (!document.hidden) {
        timer = setInterval(updateTime, 1000)
      }
    }

    const onVisibilityChange = (): void => {
      if (document.hidden) {
        if (timer) {
          clearInterval(timer)
          timer = null
        }
      } else {
        startTimer()
      }
    }

    startTimer()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (timer) clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [settings.use24Hour])

  // Quote rotation (select daily or per session)
  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    setQuoteIndex(dayOfYear % CALM_QUOTES.length)
  }, [])

  // Live Weather fetching with race-condition prevention & diagnostic logging
  const fetchWeather = async (targetLoc?: string): Promise<void> => {
    if (!settings.showWeather || !window.beacon?.getWeather) {
      console.log('[Diagnostic:AmbientWeather] Skipping fetch: showWeather is false or window.beacon.getWeather missing')
      return
    }

    const loc = (targetLoc !== undefined ? targetLoc : settings.weatherLocation || '').trim()
    console.log('[Diagnostic:AmbientWeather] Requesting weather for location:', loc || '(empty)')

    if (!loc) {
      setWeather(null)
      setWeatherLoading(false)
      return
    }

    setWeatherLoading(true)
    try {
      console.log('[Diagnostic:AmbientWeather] Calling window.beacon.getWeather with:', loc)
      const data = await window.beacon.getWeather(loc)
      console.log('[Diagnostic:AmbientWeather] IPC weather response received:', data)
      setWeather(data)
    } catch (err: any) {
      console.error('[Diagnostic:AmbientWeather] Failed to load weather for ' + loc + ':', err?.message)
      setWeather(null)
    } finally {
      setWeatherLoading(false)
    }
  }

  useEffect(() => {
    if (!settingsLoaded) {
      console.log('[Diagnostic:AmbientWeather] Awaiting settings load before triggering initial weather fetch')
      return
    }

    let active = true
    const loc = (settings.weatherLocation || '').trim()

    if (!settings.showWeather || !loc) {
      setWeather(null)
      setWeatherLoading(false)
      return
    }

    console.log('[Diagnostic:AmbientWeather] Effect triggered. Location:', loc, 'showWeather:', settings.showWeather)
    setWeatherLoading(true)

    window.beacon?.getWeather(loc)
      .then((data) => {
        if (active) {
          console.log('[Diagnostic:AmbientWeather] Effect resolved weather data for ' + loc + ':', data)
          setWeather(data)
        } else {
          console.log('[Diagnostic:AmbientWeather] Discarded obsolete weather response for:', loc)
        }
      })
      .catch((err) => {
        if (active) {
          console.warn('[Diagnostic:AmbientWeather] Effect caught error for ' + loc + ':', err)
          setWeather(null)
        }
      })
      .finally(() => {
        if (active) {
          setWeatherLoading(false)
        }
      })

    // Poll weather politely once every 15 minutes
    const interval = setInterval(() => {
      if (active && settings.showWeather && loc) {
        window.beacon?.getWeather(loc).then((d) => {
          if (active) setWeather(d)
        }).catch(() => {})
      }
    }, 15 * 60 * 1000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [settingsLoaded, settings.showWeather, settings.weatherLocation])

  const getWeatherIcon = (code: WeatherData['conditionCode']): React.ReactNode => {
    switch (code) {
      case 'thunder':
        return <Zap className="w-4 h-4 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
      case 'snow':
        return <Snowflake className="w-4 h-4 text-sky-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
      case 'rain':
        return <CloudRain className="w-4 h-4 text-sky-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
      case 'fog':
        return <CloudFog className="w-4 h-4 text-slate-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
      case 'wind':
        return <Wind className="w-4 h-4 text-teal-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-slate-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
      case 'clear':
      default:
        return <Sun className="w-4 h-4 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
    }
  }

  const quote = CALM_QUOTES[quoteIndex]

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Header Row: Day/Date & Large Elegant Clock with Localized Fluent Glass Surfaces */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Date and Ambient Tag Surface */}
        <div className="inline-flex flex-col space-y-1.5 px-5 py-3.5 rounded-2xl ambient-surface-glass max-w-fit select-none">
          <div className="flex items-center gap-2">
            <BeaconSymbol size={isScreensaver ? 20 : 18} />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFFFFF] ambient-shadow-text">
              BEACON Ambient
            </span>
            {settings.showDate && (
              <>
                <span className="text-white/60 text-xs">•</span>
                <span className="text-xs font-semibold text-[#FFFFFF] ambient-shadow-text">
                  {dateStr}
                </span>
              </>
            )}
          </div>

          {settings.showDate && (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFFFFF] ambient-shadow-heading">
              {dateStr.split(',')[0]}
            </h1>
          )}
        </div>

        {/* Large Typography Clock Surface */}
        {settings.showClock && (
          <div className="inline-flex items-baseline gap-2.5 px-6 py-3.5 rounded-2xl ambient-surface-glass select-none">
            <span
              className={`font-mono font-medium sm:font-semibold tracking-tight text-[#FFFFFF] tabular-nums ambient-shadow-clock ${
                isScreensaver
                  ? 'text-6xl sm:text-7xl lg:text-8xl'
                  : 'text-5xl sm:text-6xl lg:text-7xl'
              }`}
            >
              {timeStr}
            </span>
            {ampmStr && (
              <span
                className={`font-bold tracking-wider text-[#FFFFFF] uppercase ambient-shadow-text ml-1.5 ${
                  isScreensaver ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                }`}
              >
                {ampmStr}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Subheader Row: Real Weather & Daily Mindfulness Quote */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Weather Indicator */}
        {settings.showWeather && (
          <div className="flex items-center gap-2.5">
            {weather ? (
              <div
                onClick={onOpenSettings}
                className="group cursor-pointer inline-flex items-center gap-2.5 py-2 px-4 rounded-2xl ambient-pill-glass hover:border-white/40 transition-all text-xs sm:text-sm text-white"
                title={`Weather data by Open-Meteo${weather.isStale ? ' (Cached data — offline)' : ''} · Click to configure location`}
              >
                <span className="shrink-0">
                  {getWeatherIcon(weather.conditionCode)}
                </span>
                <span className="font-bold text-[#FFFFFF] text-xs sm:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {settings.temperatureUnit === 'F'
                    ? `${weather.temperatureFahrenheit}°F`
                    : `${weather.temperatureCelsius}°C`}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-[#FFFFFF] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {weather.condition}
                </span>
                {weather.isStale && (
                  <span className="text-[10px] bg-amber-500/35 text-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-400/50">
                    Offline
                  </span>
                )}
                <span className="text-[#FFFFFF] font-semibold hidden sm:inline-flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 drop-shadow" />
                  {weather.location}
                </span>
              </div>
            ) : (
              <div
                onClick={() => {
                  if (settings.weatherLocation?.trim()) {
                    fetchWeather(settings.weatherLocation)
                  } else {
                    onOpenSettings()
                  }
                }}
                className="group cursor-pointer inline-flex items-center gap-2 py-2 px-4 rounded-2xl ambient-pill-glass hover:border-white/40 transition-all text-xs text-[#FFFFFF]"
                title={settings.weatherLocation?.trim() ? `Click to retry weather lookup for ${settings.weatherLocation}` : 'Configure weather location (Open-Meteo)'}
              >
                {weatherLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-white" />
                )}
                <span className="font-semibold text-[#FFFFFF]">
                  {weatherLoading
                    ? (settings.weatherLocation?.trim()
                        ? `Updating weather for ${settings.weatherLocation}...`
                        : 'Updating weather...')
                    : !settings.weatherLocation?.trim()
                      ? 'No location set · Configure location'
                      : `Weather unavailable for ${settings.weatherLocation} · Tap to retry`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Mindfulness / Focus Quote */}
        {settings.showQuote && quote && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl ambient-pill-glass max-w-xl text-xs sm:text-sm select-none">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 not-italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
            <span className="truncate text-[#FFFFFF] font-medium italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              “{quote.text}” <span className="not-italic text-emerald-300 font-bold ml-1.5">— {quote.author}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

