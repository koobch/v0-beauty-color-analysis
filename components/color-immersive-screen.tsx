"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ColorImmersiveScreenProps {
  colorName: string
  color: string
  onBack: () => void
}

export default function ColorImmersiveScreen({ colorName, color, onBack }: ColorImmersiveScreenProps) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Determine if the background is light or dark to set text color
  const isLightColor = (hexColor: string) => {
    const hex = hexColor.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 155
  }

  const textColor = isLightColor(color) ? "text-neutral-800" : "text-white"
  const buttonBg = isLightColor(color)
    ? "bg-neutral-800 hover:bg-neutral-900 text-white"
    : "bg-white/90 hover:bg-white text-neutral-800"

  return (
    <button
      onClick={onBack}
      className="min-h-screen w-full flex flex-col items-center justify-between p-8 transition-all duration-700 ease-out cursor-pointer"
      style={{ backgroundColor: color }}
      aria-label="Tap to return to results"
    >
      {/* Color name centered with elegant serif typography */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className={`text-5xl font-suit italic ${textColor} text-center leading-tight px-6`}>{colorName}</h1>
      </div>

      {/* Button at bottom with fade-in animation */}
      <div className={`transition-opacity duration-1000 ${showButton ? "opacity-100" : "opacity-0"}`}>
        <Button className={`rounded-full px-10 py-6 text-base font-normal shadow-lg ${buttonBg}`}>Save My Color</Button>
      </div>
    </button>
  )
}
