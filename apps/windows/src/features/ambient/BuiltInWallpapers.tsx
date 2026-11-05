import React from 'react'

interface BuiltInWallpaperProps {
  id: string
}

export const BuiltInWallpaperView: React.FC<BuiltInWallpaperProps> = ({ id }) => {
  // Category A: Deep Space & Milky Way
  if (id.startsWith('space-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#070b1a] overflow-hidden">
        {/* Deep cosmic nebula glow and radiant stellar core */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#060a17] via-[#0d1428] to-[#080d1e] opacity-95" />
        <div className="absolute top-1/4 left-1/3 w-[650px] h-[650px] bg-indigo-900/25 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] bg-violet-900/20 rounded-full blur-[110px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-950/20 rounded-full blur-[140px]" />
      </div>
    )
  }

  // Category B: Aurora Borealis & Northern Lights
  if (id.startsWith('aurora-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#050e17] overflow-hidden">
        {/* Subtle nocturnal aurora atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06141d] via-[#081a24] to-[#040c14] opacity-95" />
        <div className="absolute -top-24 left-1/4 w-[750px] h-[550px] bg-emerald-900/25 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-1/4 w-[650px] h-[450px] bg-teal-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[300px] bg-cyan-950/15 rounded-full blur-[100px]" />
      </div>
    )
  }

  // Category C: Starry Night Landscapes
  if (id.startsWith('night-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#060d1a] overflow-hidden">
        {/* Deep starlit midnight sky foundation */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071224] via-[#09172c] to-[#050b16] opacity-95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-blue-900/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-950/25 rounded-full blur-[100px]" />
      </div>
    )
  }

  // Category D: Cozy Campfire & Night Sanctuary
  if (id.startsWith('campfire-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#080712] overflow-hidden">
        {/* Deep nocturnal forest with subtle warm amber campfire glow in bottom region */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090918] via-[#100d1c] to-[#080612] opacity-95" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-amber-900/30 rounded-full blur-[90px]" />
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[400px] bg-purple-950/15 rounded-full blur-[120px]" />
      </div>
    )
  }

  // Category E: Moonlit Nature & Atmospheric Night
  if (id.startsWith('moonlit-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#060818] overflow-hidden">
        {/* Moonlit indigo and violet atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d24] via-[#0b122e] to-[#050714] opacity-95" />
        <div className="absolute top-16 right-1/4 w-[550px] h-[550px] bg-indigo-900/25 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-violet-950/20 rounded-full blur-[110px]" />
      </div>
    )
  }

  // Default fallback: Pure cinematic midnight dark foundation
  return (
    <div className="absolute inset-0 w-full h-full bg-[#070b18] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080e22] via-[#0c142c] to-[#060a16]" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[120px]" />
    </div>
  )
}
