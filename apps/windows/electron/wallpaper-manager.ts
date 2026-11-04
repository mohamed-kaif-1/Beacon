import fs from 'fs'
import path from 'path'
import { BrowserWindow, dialog } from 'electron'
import { pathToFileURL } from 'url'
import { WallpaperItem } from './types'
import { updateAmbientSettings, loadAmbientSettings } from './settings-store'

export const BUILT_IN_WALLPAPERS: WallpaperItem[] = [
  // ==========================================
  // Category A: Deep Space & Milky Way (5)
  // ==========================================
  {
    id: 'space-milky-way-core',
    name: 'Milky Way Core',
    subtitle: 'Galaxy Heart Stretching Across the Night Sky',
    category: 'cosmic-space',
    author: 'Denis Degioanni',
    type: 'built-in',
    url: 'beacon-wallpaper://builtin/space-milky-way-core.jpg',
    thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-milky-way-core.jpg'
  },
  { id: 'space-deep-nebula', name: 'Deep Space Nebula', subtitle: 'Indigo and Violet Gas Cloud Formation', category: 'cosmic-space', author: 'Jeremy Thomas', type: 'built-in', url: 'beacon-wallpaper://builtin/space-deep-nebula.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-deep-nebula.jpg' },
  { id: 'space-stellar-void', name: 'Stellar Void', subtitle: 'Thousands of Distant Stars in Deep Space', category: 'cosmic-space', author: 'Bryan Goff', type: 'built-in', url: 'beacon-wallpaper://builtin/space-stellar-void.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-stellar-void.jpg' },
  { id: 'space-cosmic-dust', name: 'Cosmic Dust Clouds', subtitle: 'Dimensional Deep Space Silhouette', category: 'cosmic-space', author: 'Jeremy Thomas', type: 'built-in', url: 'beacon-wallpaper://builtin/space-cosmic-dust.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-cosmic-dust.jpg' },
  { id: 'space-orbital-horizon', name: 'Orbital Night', subtitle: 'Earth at Night from Orbit with Atmospheric Glow', category: 'cosmic-space', author: 'NASA', type: 'built-in', url: 'beacon-wallpaper://builtin/space-orbital-horizon.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/space-orbital-horizon.jpg' },
  // Category B: Aurora Borealis (5)
  { id: 'aurora-emerald-night', name: 'Emerald Aurora', subtitle: 'Green Northern Lights over Scandinavian Mountains', category: 'aurora', author: 'Jonatan Pie', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-emerald-night.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-emerald-night.jpg' },
  { id: 'aurora-violet-dream', name: 'Violet Aurora Dream', subtitle: 'Deep Violet and Indigo Northern Sky', category: 'aurora', author: 'Tobias Bjorkli', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-violet-dream.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-violet-dream.jpg' },
  { id: 'aurora-arctic-lake', name: 'Arctic Lake Aurora', subtitle: 'Northern Lights Reflected in Still Water', category: 'aurora', author: 'Lightscape', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-arctic-lake.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-arctic-lake.jpg' },
  { id: 'aurora-pine-silhouette', name: 'Forest Aurora', subtitle: 'Northern Lights Behind Pine Forest Silhouette', category: 'aurora', author: 'Jonatan Pie', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-pine-silhouette.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-pine-silhouette.jpg' },
  { id: 'aurora-cosmic-blue', name: 'Cosmic Blue Aurora', subtitle: 'Deep Blue and Teal Aurora Waves', category: 'aurora', author: 'Nelly Volkovich', type: 'built-in', url: 'beacon-wallpaper://builtin/aurora-cosmic-blue.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/aurora-cosmic-blue.jpg' },
  // Category C: Starry Night Landscapes (5)
  { id: 'night-mountain-stars', name: 'Mountain Starscape', subtitle: 'Rugged Peaks Beneath a Spectacular Star-Filled Sky', category: 'starry-night', author: 'Arto Marttinen', type: 'built-in', url: 'beacon-wallpaper://builtin/night-mountain-stars.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-mountain-stars.jpg' },
  { id: 'night-alpine-lake', name: 'Alpine Lake Stars', subtitle: 'Milky Way Reflected in Still Mountain Waters', category: 'starry-night', author: 'David Marcu', type: 'built-in', url: 'beacon-wallpaper://builtin/night-alpine-lake.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-alpine-lake.jpg' },
  { id: 'night-desert-milky-way', name: 'Desert Milky Way', subtitle: 'Extraordinary Star Density over Dark Desert', category: 'starry-night', author: 'Luca Bravo', type: 'built-in', url: 'beacon-wallpaper://builtin/night-desert-milky-way.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-desert-milky-way.jpg' },
  { id: 'night-misty-forest', name: 'Misty Forest Night', subtitle: 'Atmospheric Midnight Fog and Moonlight', category: 'starry-night', author: 'Felix Mittermeier', type: 'built-in', url: 'beacon-wallpaper://builtin/night-misty-forest.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-misty-forest.jpg' },
  { id: 'night-ocean-horizon', name: 'Ocean Night Horizon', subtitle: 'Vast Dark Ocean Under a Starlit Midnight Sky', category: 'starry-night', author: 'Patrick Fore', type: 'built-in', url: 'beacon-wallpaper://builtin/night-ocean-horizon.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/night-ocean-horizon.jpg' },
  // Category D: Cozy Campfire & Night Sanctuary (5)
  { id: 'campfire-starry-sky', name: 'Campfire & Stars', subtitle: 'Warm Amber Flame Beneath Millions of Stars', category: 'campfire', author: 'Mohamed Nohassi', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-starry-sky.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-starry-sky.jpg' },
  { id: 'campfire-mountain-retreat', name: 'Mountain Campsite', subtitle: 'Quiet Firelight and the Milky Way Overhead', category: 'campfire', author: 'Zach Lezniewicz', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-mountain-retreat.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-mountain-retreat.jpg' },
  { id: 'campfire-pine-forest', name: 'Pine Forest Campfire', subtitle: 'Secluded Fire Among Tall Trees at Night', category: 'campfire', author: 'David Marcu', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-pine-forest.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-pine-forest.jpg' },
  { id: 'campfire-lakeside', name: 'Lakeside Campfire', subtitle: 'Warm Light Reflected Across Dark Water', category: 'campfire', author: 'Tim Foster', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-lakeside.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-lakeside.jpg' },
  { id: 'campfire-cosmic-night', name: 'Cosmic Campsite', subtitle: 'Minimal Silhouette Beneath a Spectacular Sky', category: 'campfire', author: 'Free To Use Sounds', type: 'built-in', url: 'beacon-wallpaper://builtin/campfire-cosmic-night.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/campfire-cosmic-night.jpg' },
  // Category E: Moonlit Nature (5)
  { id: 'moonlit-japanese-forest', name: 'Japanese Moonlit Forest', subtitle: 'Peaceful Forest Beneath Soft Moonlight', category: 'moonlit', author: 'Lukasz Szmigiel', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-japanese-forest.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-japanese-forest.jpg' },
  { id: 'moonlit-bamboo-grove', name: 'Moonlit Bamboo', subtitle: 'Dark Bamboo Grove with Delicate Moonbeams', category: 'moonlit', author: 'kazuend', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-bamboo-grove.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-bamboo-grove.jpg' },
  { id: 'moonlit-waterfall', name: 'Nighttime Waterfall', subtitle: 'Cinematic Cascade with Natural Atmospheric Mist', category: 'moonlit', author: 'Ben Guerin', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-waterfall.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-waterfall.jpg' },
  { id: 'moonlit-sakura', name: 'Midnight Sakura', subtitle: 'Cherry Blossom Silhouettes Under Violet Sky', category: 'moonlit', author: 'Redd Francisco', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-sakura.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-sakura.jpg' },
  { id: 'moonlit-cloud-sea', name: 'Mountain Cloud Sea', subtitle: 'Peaks Rising Above a Sea of Clouds at Night', category: 'moonlit', author: 'Kace Rodriguez', type: 'built-in', url: 'beacon-wallpaper://builtin/moonlit-cloud-sea.jpg', thumbnailUrl: 'beacon-wallpaper://builtin/thumbnails/moonlit-cloud-sea.jpg' }
]

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.bmp'])

export function scanWallpaperDirectory(folderPath: string): WallpaperItem[] {
  if (!folderPath || !fs.existsSync(folderPath)) {
    return []
  }

  try {
    const stats = fs.statSync(folderPath)
    if (!stats.isDirectory()) return []

    const entries = fs.readdirSync(folderPath, { withFileTypes: true })
    const items: WallpaperItem[] = []

    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (ALLOWED_EXTENSIONS.has(ext)) {
          const fullPath = path.join(folderPath, entry.name)
          const name = path.basename(entry.name, ext)
          // Format with custom scheme so renderer can load it safely
          const url = `beacon-wallpaper://${encodeURIComponent(fullPath)}`
          items.push({
            id: `file-${Buffer.from(fullPath).toString('base64').replace(/=/g, '')}`,
            name,
            type: 'file',
            url,
            category: 'custom'
          })
        }
      }
    }

    return items.sort((a, b) => a.name.localeCompare(b.name))
  } catch (err) {
    console.error(`[BEACON WallpaperManager] Error scanning directory "${folderPath}":`, err)
    return []
  }
}

export function getActiveWallpapers(): WallpaperItem[] {
  const settings = loadAmbientSettings()
  if (settings.wallpaperSource === 'custom-folder' && settings.customWallpaperFolder) {
    const customItems = scanWallpaperDirectory(settings.customWallpaperFolder)
    if (customItems.length > 0) {
      return customItems
    }
  }
  return BUILT_IN_WALLPAPERS
}

export async function openWallpaperDirectoryDialog(
  window: BrowserWindow | null
): Promise<{ canceled: boolean; folderPath?: string; wallpapers?: WallpaperItem[] }> {
  if (!window || window.isDestroyed()) {
    return { canceled: true }
  }

  const result = await dialog.showOpenDialog(window, {
    title: 'Select Wallpaper Folder for BEACON Ambient',
    properties: ['openDirectory', 'dontAddToRecent']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  const selectedPath = result.filePaths[0]
  const wallpapers = scanWallpaperDirectory(selectedPath)

  updateAmbientSettings({
    wallpaperSource: wallpapers.length > 0 ? 'custom-folder' : 'built-in',
    customWallpaperFolder: selectedPath,
    selectedWallpaperIndex: 0
  })

  return {
    canceled: false,
    folderPath: selectedPath,
    wallpapers
  }
}
