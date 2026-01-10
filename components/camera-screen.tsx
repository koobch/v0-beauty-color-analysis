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
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-screen object-cover" />

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <Button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white hover:bg-neutral-100 border-4 border-neutral-300"
        />
      </div>
    </div>
  )
}
