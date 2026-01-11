"use client"

import { useState } from "react"
import LandingScreen from "@/components/landing-screen"
import CameraScreen from "@/components/camera-screen"
import ResultScreen from "@/components/result-screen"
import ColorImmersiveScreen from "@/components/color-immersive-screen"
import LoadingScreen from "@/components/loading-screen"
import { analyzeImage } from "@/lib/api"
import { generateUUID } from "@/lib/image-utils"
import { AnalysisResult } from "@/lib/constants" // 위에서 만든 파일 import

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "camera" | "result" | "immersive" | "loading">("landing")
  const [selectedColor, setSelectedColor] = useState<{ name: string; color: string } | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

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
        // 🔥 [수정] API 응답 데이터를 상태에 저장
        // result.data가 AnalysisResult 타입과 일치한다고 가정
        const resultData = result.data.data;
        setAnalysisResult(resultData);

        // 성공: 결과 화면으로 이동
        setCurrentScreen("result")
        console.log('[App] 분석 성공:', resultData);
      } else {
        // 실패: 에러 처리
        setAnalysisError(result.error || '알 수 없는 오류가 발생했습니다.')
        // 카메라 화면으로 먼저 돌아가기
        setCurrentScreen("camera")
        // 화면 전환 후 alert 표시
        setTimeout(() => {
          alert(`분석 실패: ${result.error}\n\n다시 촬영해주세요.`)
        }, 100)
      }
    } catch (error) {
      console.error('[App] 이미지 분석 중 오류:', error)
      setAnalysisError(error instanceof Error ? error.message : '오류가 발생했습니다.')
      // 카메라 화면으로 먼저 돌아가기
      setCurrentScreen("camera")
      // 화면 전환 후 alert 표시
      setTimeout(() => {
        alert('이미지 분석 중 오류가 발생했습니다.\n\n다시 촬영해주세요.')
      }, 100)
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
      {currentScreen === "camera" && <CameraScreen onCapture={handleCameraCapture} onBack={() => setCurrentScreen("landing")} />}
      {currentScreen === "loading" && <LoadingScreen />}
      {currentScreen === "result" && <ResultScreen result={analysisResult} capturedImage={capturedImage} onColorSelect={handleColorSelect} />}
      {currentScreen === "immersive" && selectedColor && (
        <ColorImmersiveScreen colorName={selectedColor.name} color={selectedColor.color} onBack={handleBackToResult} />
      )}
    </div>
  )
}
