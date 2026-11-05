import React, { useState, useEffect } from 'react'
import { WallpaperItem } from '../../types'
import { BuiltInWallpaperView } from './BuiltInWallpapers'

export type KenBurnsVariant = 'a' | 'b' | 'c' | 'd'

interface KenBurnsSlideshowProps {
  currentWallpaper: WallpaperItem
  previousWallpaper: WallpaperItem | null
  nextWallpaper?: WallpaperItem | null
  isTransitioning: boolean
  transitionDuration: number
  kenBurnsEnabled: boolean
  backgroundDim: number
  animationVariant?: KenBurnsVariant
}

export const KenBurnsSlideshow: React.FC<KenBurnsSlideshowProps> = ({
  currentWallpaper,
  previousWallpaper,
  nextWallpaper,
  isTransitioning,
  transitionDuration,
  kenBurnsEnabled,
  backgroundDim,
  animationVariant = 'a'
}) => {
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({})

  // Preload next wallpaper image to eliminate transition latency
  useEffect(() => {
    if (!nextWallpaper?.url) return
    const isWebOrFile =
      nextWallpaper.url.startsWith('http://') ||
      nextWallpaper.url.startsWith('https://') ||
      nextWallpaper.url.startsWith('beacon-wallpaper://') ||
      nextWallpaper.url.startsWith('helm-wallpaper://') ||
      nextWallpaper.url.startsWith('data:')

    if (isWebOrFile) {
      const img = new Image()
      img.src = nextWallpaper.url
    }
  }, [nextWallpaper])

  const handleImageError = (id: string): void => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }))
  }

  const getAnimationClass = (variant: KenBurnsVariant): string => {
    if (!kenBurnsEnabled) return ''
    switch (variant) {
      case 'b':
        return 'animate-kenburns-b'
      case 'c':
        return 'animate-kenburns-c'
      case 'd':
        return 'animate-kenburns-d'
      case 'a':
      default:
        return 'animate-kenburns-a'
    }
  }

  const renderWallpaperLayer = (
    wallpaper: WallpaperItem,
    variant: KenBurnsVariant
  ): React.ReactNode => {
    const hasError = imageErrorMap[wallpaper.id]
    // If full-resolution URL had an error, fallback to thumbnail before falling back to vector
    const effectiveUrl = hasError && wallpaper.thumbnailUrl ? wallpaper.thumbnailUrl : wallpaper.url
    const animClass = getAnimationClass(variant)

    const isImageSource =
      Boolean(effectiveUrl) &&
      (effectiveUrl.startsWith('beacon-wallpaper://') ||
        effectiveUrl.startsWith('helm-wallpaper://') ||
        effectiveUrl.startsWith('http://') ||
        effectiveUrl.startsWith('https://') ||
        effectiveUrl.startsWith('data:') ||
        effectiveUrl.startsWith('file:') ||
        wallpaper.type === 'file')

    return (
      <div className={`absolute inset-0 w-full h-full overflow-hidden ${animClass}`}>
        {/* Procedural vector foundation (always active as underlying safety surface) */}
        <div className="absolute inset-0 w-full h-full">
          <BuiltInWallpaperView id={wallpaper.id} />
        </div>

        {/* High-resolution photographic overlay */}
        {isImageSource && (
          <img
            src={effectiveUrl}
            alt={wallpaper.name}
            loading="eager"
            decoding="async"
            onError={() => {
              if (!hasError) handleImageError(wallpaper.id)
            }}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-100 transition-opacity duration-300"
            style={{
              filter: 'brightness(1.04) contrast(1.02)'
            }}
          />
        )}
      </div>
    )
  }

  // Choose an offset variant for previous layer to avoid identical motion during cross-fade
  const previousVariant: KenBurnsVariant =
    animationVariant === 'a' ? 'b' : animationVariant === 'b' ? 'c' : animationVariant === 'c' ? 'd' : 'a'

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#070b16] select-none pointer-events-none">
      {/* Active Layer (base layer, always visible and animating) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {renderWallpaperLayer(currentWallpaper, animationVariant)}
      </div>

      {/* Previous Layer (top layer during transition, cross-fades out smoothly with keyframe animation) */}
      {previousWallpaper && isTransitioning && (
        <div
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          style={{
            animation: `screensaverFadeOutLayer ${transitionDuration}s ease-in-out forwards`
          }}
        >
          {renderWallpaperLayer(previousWallpaper, previousVariant)}
        </div>
      )}

      {/* Atmospheric Dimming Overlay (subtle, carefully calibrated to preserve natural photography depth) */}
      <div
        className="absolute inset-0 w-full h-full z-20 pointer-events-none transition-colors duration-500"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${Math.min(Math.max(backgroundDim ?? 0.10, 0), 0.20)})`
        }}
      />

      {/* Subtle Edge-Shadow Vignette Gradients for Text Legibility (gentle and translucent, preserving wallpaper vibrancy) */}
      <div className="absolute inset-0 w-full h-full z-20 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none" />

      {/* Subtle Radial Vignette focusing eye towards center */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_80%,rgba(0,0,0,0.06)_100%)]" />
    </div>
  )
}
