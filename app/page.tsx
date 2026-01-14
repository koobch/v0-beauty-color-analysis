"use client"

import { useState } from "react"
import LandingScreen from "@/components/landing-screen"
import CameraScreen from "@/components/camera-screen"
import ResultScreen from "@/components/result-screen"
import ColorImmersiveScreen from "@/components/color-immersive-screen"
import { analyzeImage } from "@/lib/api"
import { generateUUID } from "@/lib/image-utils"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "camera" | "result" | "immersive" | "loading">("landing")
  const [selectedColor, setSelectedColor] = useState<{ name: string; color: string } | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const handleStartAnalysis = () => {
    setCurrentScreen("camera")
  }

  const handleCameraCapture = async (imageBase64: string) => {
    try {
      // 캡처된 이미지 저장
      setCapturedImage(imageBase64)
      setIsAnalyzing(true)
      setCurrentScreen("loading")
      setAnalysisError(null)

      // UUID 생성
      const userId = generateUUID()

      // API 호출하여 n8n 웹훅 전송
      const result = await analyzeImage(imageBase64, userId)

      if (result.success) {
        // 성공: 결과 화면으로 이동
        setCurrentScreen("result")
        console.log('[App] 분석 성공:', result.data)
      } else {
        // 실패: 에러 처리
        setAnalysisError(result.error || '알 수 없는 오류가 발생했습니다.')
        alert(`분석 실패: ${result.error}`)
        // 카메라 화면으로 돌아가기
        setCurrentScreen("camera")
      }
    } catch (error) {
      console.error('[App] 이미지 분석 중 오류:', error)
      setAnalysisError(error instanceof Error ? error.message : '오류가 발생했습니다.')
      alert('이미지 분석 중 오류가 발생했습니다.')
      setCurrentScreen("camera")
    } finally {
      setIsAnalyzing(false)
    }
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
      {currentScreen === "loading" && (
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mb-4"></div>
            <p className="text-neutral-600 text-sm">이미지를 분석하고 있습니다...</p>
          </div>
        </div>
      )}
      {currentScreen === "result" && <ResultScreen onColorSelect={handleColorSelect} />}
      {currentScreen === "immersive" && selectedColor && (
        <ColorImmersiveScreen colorName={selectedColor.name} color={selectedColor.color} onBack={handleBackToResult} />
      )}
    </div>
  )
}
