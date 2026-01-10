"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface CameraScreenProps {
  onCapture: () => void
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
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    onCapture()
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
