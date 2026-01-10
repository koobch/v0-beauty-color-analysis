"use client"

import { useState } from "react"
import LandingScreen from "@/components/landing-screen"
import CameraScreen from "@/components/camera-screen"
import ResultScreen from "@/components/result-screen"
import ColorImmersiveScreen from "@/components/color-immersive-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "camera" | "result" | "immersive">("landing")
  const [selectedColor, setSelectedColor] = useState<{ name: string; color: string } | null>(null)

  const handleStartAnalysis = () => {
    setCurrentScreen("camera")
  }

  const handleCameraCapture = () => {
    setCurrentScreen("result")
  }

  const handleColorSelect = (colorName: string, colorValue: string) => {
    setSelectedColor({ name: colorName, color: colorValue })
    setCurrentScreen("immersive")
  }

  const handleBackToResult = () => {
    setCurrentScreen("result")
    setSelectedColor(null)
  }

  return (
    <div className="min-h-screen">
      {currentScreen === "landing" && <LandingScreen onStart={handleStartAnalysis} />}
      {currentScreen === "camera" && <CameraScreen onCapture={handleCameraCapture} />}
      {currentScreen === "result" && <ResultScreen onColorSelect={handleColorSelect} />}
      {currentScreen === "immersive" && selectedColor && (
        <ColorImmersiveScreen colorName={selectedColor.name} color={selectedColor.color} onBack={handleBackToResult} />
      )}
    </div>
  )
}
