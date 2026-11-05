import React, { useState, useMemo } from 'react'
import { useFocusTrap } from '../../lib/useFocusTrap'
import {
  X,
  Sliders,
  FolderOpen,
  Image as ImageIcon,
  Clock,
  Cloud,
  Sparkles,
  Eye,
  Check,
  CheckSquare
} from 'lucide-react'
import { AmbientSettings, WallpaperItem, WallpaperCategory } from '../../types'
import { WALLPAPER_CATEGORIES } from './wallpapers'
import { BuiltInWallpaperView } from './BuiltInWallpapers'

interface AmbientSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: AmbientSettings
  onUpdateSettings: (updated: Partial<AmbientSettings>) => void
  onSelectCustomFolder: () => Promise<void>
  wallpapers: WallpaperItem[]
}

export const AmbientSettingsModal: React.FC<AmbientSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSelectCustomFolder,
  wallpapers
}) => {
  const [locInput, setLocInput] = useState<string>(settings.weatherLocation || 'London')
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory | 'all'>('all')
  const [thumbErrorMap, setThumbErrorMap] = useState<Record<string, boolean>>({})

  const trapRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose })

  React.useEffect(() => {
    if (settings.weatherLocation) {
      setLocInput(settings.weatherLocation)
    }
  }, [settings.weatherLocation])

  const filteredWallpapers = useMemo(() => {
    return wallpapers
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => {
        if (selectedCategory === 'all') return true
        return item.category === selectedCategory
      })
  }, [wallpapers, selectedCategory])

  if (!isOpen) return null

  const handleLocationSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (locInput.trim()) {
      const target = locInput.trim()
      console.log('[Diagnostic:AmbientModal] Submitting location:', target)
      onUpdateSettings({ weatherLocation: target })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    }
  }

  const setPreset = (preset: string): void => {
    console.log('[Diagnostic:AmbientModal] Selecting preset:', preset)
    setLocInput(preset)
    onUpdateSettings({ weatherLocation: preset })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fadeIn">
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ambient-modal-title"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a]/92 backdrop-blur-2xl border border-white/20 text-white shadow-2xl p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 id="ambient-modal-title" className="text-base font-bold text-white">
              Ambient Screen Board Preferences
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preferences"
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Wallpaper & Slideshow */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5" />
            Wallpaper & Slideshow Motion
          </h4>

          {/* Wallpaper Source Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onUpdateSettings({ wallpaperSource: 'built-in' })}
              className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                settings.wallpaperSource === 'built-in'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <div className="font-semibold text-white mb-1">Curated Aesthetics (25)</div>
              <div className="text-[11px] text-white/50">
                Nature, Zen, Dark, Cosmic, Cozy & Minimal
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ wallpaperSource: 'custom-folder' })}
              className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                settings.wallpaperSource === 'custom-folder'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <div className="font-semibold text-white mb-1">Local Image Folder</div>
              <div className="text-[11px] text-white/50">
                {wallpapers.filter((w) => w.type === 'file').length > 0
                  ? `${wallpapers.filter((w) => w.type === 'file').length} images loaded`
                  : 'Select custom folder on PC'}
              </div>
            </button>
          </div>

          {/* Curated Wallpaper Gallery & Category Filters (Built-in Mode) */}
          {settings.wallpaperSource === 'built-in' && (
            <div className="space-y-3 pt-1">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
                {WALLPAPER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {filteredWallpapers.map(({ item, originalIndex }) => {
                  const isSelected = settings.selectedWallpaperIndex === originalIndex
                  const hasThumbError = thumbErrorMap[item.id]

                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        onUpdateSettings({
                          selectedWallpaperIndex: originalIndex,
                          wallpaperSource: 'built-in'
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onUpdateSettings({
                            selectedWallpaperIndex: originalIndex,
                            wallpaperSource: 'built-in'
                          })
                        }
                      }}
                      className={`group relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition-all text-left ${
                        isSelected
                          ? 'ring-2 ring-emerald-400 border-emerald-400 shadow-lg shadow-emerald-500/20'
                          : 'border-white/10 hover:border-white/25 hover:shadow-md'
                      }`}
                    >
                      {/* Background Visual */}
                      <div className="absolute inset-0 w-full h-full bg-slate-900 overflow-hidden">
                        <BuiltInWallpaperView id={item.id} />
                        {(item.thumbnailUrl || item.url) && !hasThumbError && (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.name}
                            loading="lazy"
                            onError={() => setThumbErrorMap((prev) => ({ ...prev, [item.id]: true }))}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>

                      {/* Vignette Overlay for Title Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                        <div className="text-xs font-semibold text-white truncate drop-shadow">
                          {item.name}
                        </div>
                        {item.subtitle && (
                          <div className="text-[10px] text-white/70 truncate drop-shadow">
                            {item.subtitle}
                          </div>
                        )}
                      </div>

                      {/* Selection Check Badge */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Folder Picker if custom folder chosen */}
          {settings.wallpaperSource === 'custom-folder' && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Selected Folder</span>
                <button
                  type="button"
                  onClick={onSelectCustomFolder}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Choose Folder...</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-white/50 bg-black/40 p-2 rounded border border-white/5 truncate">
                {settings.customWallpaperFolder || 'No folder selected yet'}
              </div>
            </div>
          )}

          {/* Slideshow Interval */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/80">
              <span>Slideshow Interval</span>
              <span className="font-mono text-emerald-400">
                {settings.slideshowInterval === 0 ? 'Paused' : `${settings.slideshowInterval}s`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 15, 30, 60, 120].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onUpdateSettings({ slideshowInterval: val })}
                  className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    settings.slideshowInterval === val
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {val === 0 ? 'Pause' : `${val}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Ken Burns Pan & Zoom Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <div className="text-xs font-medium text-white">Ken Burns Pan & Zoom Effect</div>
              <div className="text-[11px] text-white/50">Slow, smooth cinematic motion across wallpapers</div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ kenBurnsEnabled: !settings.kenBurnsEnabled })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-all ${
                settings.kenBurnsEnabled ? 'bg-emerald-500 justify-end' : 'bg-white/20 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Section 2: Clock & Weather */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Clock, Date & Weather
          </h4>

          {/* Clock & Date Toggles */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <span>Show Clock</span>
              <input
                type="checkbox"
                checked={settings.showClock}
                onChange={(e) => onUpdateSettings({ showClock: e.target.checked })}
                className="rounded accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <span>24-Hour Format</span>
              <input
                type="checkbox"
                checked={settings.use24Hour}
                onChange={(e) => onUpdateSettings({ use24Hour: e.target.checked })}
                className="rounded accent-emerald-500"
              />
            </label>
          </div>

          {/* Weather Location & Unit */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
                Weather Location & Units
              </span>
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ temperatureUnit: 'C' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    settings.temperatureUnit === 'C' ? 'bg-emerald-500 text-white' : 'text-white/60'
                  }`}
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ temperatureUnit: 'F' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    settings.temperatureUnit === 'F' ? 'bg-emerald-500 text-white' : 'text-white/60'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            <form onSubmit={handleLocationSubmit} className="flex gap-2">
              <input
                type="text"
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                placeholder="City name (e.g. Chennai, London, Tokyo)"
                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
              </button>
            </form>

            {/* Quick Suggestions & Attribution */}
            <div className="space-y-1.5 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-white/40">Presets:</span>
                {[
                  'Chennai, Tamil Nadu, India',
                  'London, UK',
                  'Tokyo, Japan',
                  'New York, NY'
                ].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setPreset(city)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                  >
                    {city.split(',')[0]}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
                <span>Weather data by Open-Meteo</span>
                <span>Auto-refreshes every 15 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Information & Visuals */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            Overlays & Glassmorphism
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Show Watch Feed
              </span>
              <input
                type="checkbox"
                checked={settings.showWatches}
                onChange={(e) => onUpdateSettings({ showWatches: e.target.checked })}
                className="rounded accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Show Tasks
              </span>
              <input
                type="checkbox"
                checked={settings.showTasks}
                onChange={(e) => onUpdateSettings({ showTasks: e.target.checked })}
                className="rounded accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Show Quotes
              </span>
              <input
                type="checkbox"
                checked={settings.showQuote}
                onChange={(e) => onUpdateSettings({ showQuote: e.target.checked })}
                className="rounded accent-emerald-500"
              />
            </label>
          </div>

          {/* Frosted Glass Blur Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/80">
              <span>Frosted Glass Blur</span>
              <span className="font-mono text-emerald-400">{settings.frostedGlassBlur}px</span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              step="2"
              value={settings.frostedGlassBlur}
              onChange={(e) => onUpdateSettings({ frostedGlassBlur: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Background Dim Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-200 font-medium">
              <span>Background Dimming</span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(settings.backgroundDim * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.30"
              step="0.02"
              value={settings.backgroundDim}
              onChange={(e) => onUpdateSettings({ backgroundDim: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Raw Photo)</span>
              <span>10% (Default)</span>
              <span>30% (Max Atmosphere)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
