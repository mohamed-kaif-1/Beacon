import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sliders,
  ArrowLeft
} from 'lucide-react'

interface AmbientControlsProps {
  visible: boolean
  isFullscreen: boolean
  isPlaying: boolean
  currentWallpaperIndex: number
  totalWallpapers: number
  currentWallpaperTitle?: string
  onPrevWallpaper: () => void
  onNextWallpaper: () => void
  onTogglePlay: () => void
  onToggleFullscreen: () => void
  onOpenSettings: () => void
  onExitAmbient: () => void
}

export const AmbientControls: React.FC<AmbientControlsProps> = ({
  visible,
  isFullscreen,
  isPlaying,
  currentWallpaperIndex,
  totalWallpapers,
  currentWallpaperTitle,
  onPrevWallpaper,
  onNextWallpaper,
  onTogglePlay,
  onToggleFullscreen,
  onOpenSettings,
  onExitAmbient
}) => {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-2xl transition-all">
        {/* Return to Desktop */}
        <button
          type="button"
          onClick={onExitAmbient}
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/70 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          title="Return to Desktop (Esc)"
          aria-label="Return to Desktop"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* Previous Wallpaper */}
        <button
          type="button"
          onClick={onPrevWallpaper}
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          title="Previous Wallpaper (Left Arrow)"
          aria-label="Previous Wallpaper"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Play/Pause Slideshow */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/90 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          title={isPlaying ? 'Pause Slideshow (Space)' : 'Resume Slideshow (Space)'}
          aria-label={isPlaying ? 'Pause Slideshow' : 'Resume Slideshow'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-emerald-400" />
          ) : (
            <Play className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Next Wallpaper */}
        <button
          type="button"
          onClick={onNextWallpaper}
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          title="Next Wallpaper (Right Arrow)"
          aria-label="Next Wallpaper"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Current Wallpaper Name (if present) & Slide Counter */}
        {currentWallpaperTitle && (
          <span
            className="text-[11px] font-medium text-white/80 hidden md:inline truncate max-w-[150px] px-1 select-none"
            title={currentWallpaperTitle}
          >
            {currentWallpaperTitle}
          </span>
        )}

        <span
          className="text-[11px] font-mono px-1.5 text-white/60 select-none"
          title={currentWallpaperTitle ? `${currentWallpaperTitle} (${currentWallpaperIndex + 1} of ${totalWallpapers})` : undefined}
        >
          {totalWallpapers > 0 ? `${currentWallpaperIndex + 1} / ${totalWallpapers}` : '1 / 1'}
        </span>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          title={isFullscreen ? 'Exit Fullscreen (Esc or F11)' : 'Enter Fullscreen (F11)'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Ambient Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          title="Configure Ambient Preferences"
          aria-label="Configure Ambient Preferences"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
