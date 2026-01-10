"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { captureImageFromVideo } from "@/lib/image-utils"

interface CameraScreenProps {
  onCapture: (imageBase64: string) => void
}

export default function CameraScreen({ onCapture }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error("[v0] Error accessing camera:", err)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    try {
      // Video 요소에서 이미지 캡처 및 FHD 압축
      if (videoRef.current) {
        const imageBase64 = captureImageFromVideo(videoRef.current)

        // 카메라 스트림 중지
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }

        // 캡처된 이미지를 부모 컴포넌트로 전달
        onCapture(imageBase64)
      }
    } catch (error) {
      console.error('[Camera] 이미지 캡처 실패:', error)
      alert('이미지 캡처에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/* 비디오 스트림 (거울 모드) */}
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-screen object-cover scale-x-[-1]" />

      {/* 얼굴 가이드라인 오버레이 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* 십자 가이드라인 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/40 -translate-x-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40 -translate-y-1/2" />

        {/* 얼굴형 타원 가이드 (크기 증가) */}
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <ellipse
            cx="50"
            cy="45"
            rx="35"
            ry="45"
            fill="none"
            stroke="white"
            strokeWidth="0.3"
            strokeOpacity="0.6"
            strokeDasharray="2,1"
          />
        </svg>
      </div>

      {/* 안내 메시지 */}
      <div className="absolute top-12 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white text-sm font-light">얼굴을 가이드에 맞춰주세요</p>
        </div>
      </div>

      {/* 촬영 버튼 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <Button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white hover:bg-neutral-100 border-4 border-neutral-300"
        />
      </div>
    </div>
  )
}
