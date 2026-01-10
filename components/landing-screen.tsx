"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

// 8 palette combinations that will rotate
const COLOR_PALETTES = [
  ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
  ["#E8C4C4", "#F4D8CD", "#FFF5E1", "#D4E8E0", "#D4E4F7"],
  ["#FFE5E5", "#FFD6E8", "#FFFACD", "#E0F5E9", "#E8F4F8"],
  ["#FFDFD3", "#FFE4D6", "#FFF8DC", "#D8E9E4", "#DDE7F2"],
  ["#F5E6E8", "#FFF0F0", "#FFFEF7", "#E6F4EA", "#E8F0F7"],
  ["#FFD8CC", "#FFE9D6", "#FEFCBF", "#C9E4DE", "#D0E8F2"],
  ["#FFCCCB", "#FFE4E1", "#FFFACD", "#B5EAD7", "#C7CEEA"],
  ["#FFC8C8", "#FFD9B3", "#FFF9C4", "#B2DFDB", "#BBDEFB"],
]

interface LandingScreenProps {
  onStart: () => void
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPaletteIndex((prev) => (prev + 1) % COLOR_PALETTES.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const currentPalette = COLOR_PALETTES[currentPaletteIndex]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#FAF9F7]">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* Hero Text Block */}
        <h1 className="text-[32px] leading-tight font-light tracking-tight text-neutral-800 mb-3">
          What colors make my face
          <br />
          look most beautiful?
        </h1>

        {/* Subtext */}
        <div className="space-y-1 mb-8">
          <p className="text-base text-neutral-500 font-light">No expensive diagnosis needed,</p>
          <p className="text-base text-neutral-500 font-light">just one photo is enough!</p>
        </div>

        {/* CTA Block */}
        <Button
          onClick={onStart}
          className="bg-[#D4A5A5] hover:bg-[#C49090] text-white rounded-full px-12 py-6 text-base font-normal shadow-sm transition-all mb-3"
        >
          Find My Colors
        </Button>

        {/* Trust Caption Block */}
        <p className="text-xs text-neutral-400 font-light mb-12">📷 Photos are only used for analysis and not stored</p>

        {/* Color Palette Block - positioned higher to relate to content */}
        <div className="mt-4">
          <div className="flex gap-2.5 justify-center transition-opacity duration-500">
            {currentPalette.map((color, index) => (
              <div
                key={`${currentPaletteIndex}-${index}`}
                className="w-11 h-11 rounded-full shadow-sm animate-fade-in"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
