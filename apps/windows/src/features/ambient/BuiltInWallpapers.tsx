import React from 'react'

interface BuiltInWallpaperProps {
  id: string
}

export const BuiltInWallpaperView: React.FC<BuiltInWallpaperProps> = ({ id }) => {
  // Category A: Deep Space & Milky Way
  if (id.startsWith('space-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#030408] overflow-hidden">
        {/* Deep cosmic nebula glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050814] via-[#090b1e] to-[#04060c] opacity-90" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-violet-950/15 rounded-full blur-[100px]" />
      </div>
    )
  }

  // Category B: Aurora Borealis & Northern Lights
  if (id.startsWith('aurora-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#020509] overflow-hidden">
        {/* Subtle nocturnal aurora atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030911] via-[#040c14] to-[#020408] opacity-95" />
        <div className="absolute -top-24 left-1/4 w-[700px] h-[500px] bg-emerald-950/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-teal-950/15 rounded-full blur-[110px]" />
      </div>
    )
  }

  // Category C: Starry Night Landscapes
  if (id.startsWith('night-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#020409] overflow-hidden">
        {/* Deep starlit midnight sky foundation */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040713] via-[#060a1a] to-[#02040a] opacity-95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-950/15 rounded-full blur-[130px]" />
      </div>
    )
  }

  // Category D: Cozy Campfire & Night Sanctuary
  if (id.startsWith('campfire-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#040306] overflow-hidden">
        {/* Deep nocturnal forest with subtle warm amber campfire glow in bottom region */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04050c] via-[#08070d] to-[#050306] opacity-95" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-amber-950/25 rounded-full blur-[80px]" />
      </div>
    )
  }

  // Category E: Moonlit Nature & Atmospheric Night
  if (id.startsWith('moonlit-')) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#03050c] overflow-hidden">
        {/* Moonlit indigo and violet atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050818] via-[#080c20] to-[#03050d] opacity-95" />
        <div className="absolute top-16 right-1/4 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-[110px]" />
      </div>
    )
  }

  // Default fallback: Pure cinematic midnight dark foundation
  return (
    <div className="absolute inset-0 w-full h-full bg-[#030408] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#040714] via-[#080b1c] to-[#030408]" />
    </div>
  )
}
