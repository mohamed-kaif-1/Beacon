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
  const [imageLoadedMap, setImageLoadedMap] = useState<Record<string, boolean>>({})

  // Preload next wallpaper image to eliminate transition pop-in
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

  const handleImageLoad = (id: string): void => {
    setImageLoadedMap((prev) => ({ ...prev, [id]: true }))
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
    const isLoaded = imageLoadedMap[wallpaper.id]
    const animClass = getAnimationClass(variant)

    const isImageSource =
      Boolean(wallpaper.url) &&
      (wallpaper.url.startsWith('beacon-wallpaper://') ||
        wallpaper.url.startsWith('helm-wallpaper://') ||
        wallpaper.url.startsWith('http://') ||
        wallpaper.url.startsWith('https://') ||
        wallpaper.url.startsWith('data:') ||
        wallpaper.url.startsWith('file:') ||
        wallpaper.type === 'file')

    return (
      <div className={`absolute inset-0 w-full h-full overflow-hidden ${animClass}`}>
        {/* Procedural vector background (always present as instant foundation & offline fallback) */}
        <div className="absolute inset-0 w-full h-full">
          <BuiltInWallpaperView id={wallpaper.id} />
        </div>

        {/* High-resolution photographic overlay when available */}
        {isImageSource && !hasError && (
          <img
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0 && !imageLoadedMap[wallpaper.id]) {
                handleImageLoad(wallpaper.id)
              }
            }}
            src={wallpaper.url}
            alt={wallpaper.name}
            loading="eager"
            onLoad={() => handleImageLoad(wallpaper.id)}
            onError={() => handleImageError(wallpaper.id)}
            className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700 ease-in-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>
    )
  }

  // Choose an offset variant for previous layer to avoid identical motion during cross-fade
  const previousVariant: KenBurnsVariant =
    animationVariant === 'a' ? 'b' : animationVariant === 'b' ? 'c' : animationVariant === 'c' ? 'd' : 'a'

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none">
      {/* Active Layer (base layer, always visible and animating) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {renderWallpaperLayer(currentWallpaper, animationVariant)}
      </div>

      {/* Previous Layer (top layer during transition, cross-fades out smoothly) */}
      {previousWallpaper && isTransitioning && (
        <div
          className="absolute inset-0 w-full h-full z-10 transition-opacity ease-in-out"
          style={{
            opacity: 0,
            transitionDuration: `${transitionDuration}s`
          }}
        >
          {renderWallpaperLayer(previousWallpaper, previousVariant)}
        </div>
      )}

      {/* Atmospheric Dimming Overlay (user-adjustable) */}
      <div
        className="absolute inset-0 w-full h-full z-20 pointer-events-none transition-colors duration-500"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backgroundDim})`
        }}
      />

      {/* Dual Edge-Shadow Vignette Gradients for Text Legibility (matching macOS BoardView) */}
      <div className="absolute inset-0 w-full h-full z-20 bg-gradient-to-b from-black/70 via-black/15 to-black/75 pointer-events-none" />

      {/* Subtle Radial Vignette focusing eye towards center */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  )
}
