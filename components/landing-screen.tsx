"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const APP_VERSION = "1.0.0"

// 8 palette combinations that will rotate
const COLOR_PALETTES = [
  ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "##BAE1FF"],
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-[#FAF9F7] via-[#F5F1EE] to-[#E8E3DD] relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#D4A5A5]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#C89595]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="flex flex-col items-center text-center max-w-md w-full relative z-10">

        {/* Hero Text Block - 더 크게 */}
        <h1 className="text-[42px] leading-[1.15] font-suit font-bold tracking-tight bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent mb-5">
          내 얼굴이 제일 예뻐
          <br />
          보이는 컬러는?
        </h1>

        {/* Subtext */}
        <p className="text-base text-neutral-600 font-light mb-12">
          비싼 진단이 필요 없어요, 사진 한 장이면 충분해요!
        </p>

        {/* CTA Block */}
        <Button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-[#D4A5A5] to-[#C89595] hover:from-[#C89595] hover:to-[#B88585] text-white rounded-full px-12 py-7 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] mb-5"
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            내 컬러 알아보기
          </span>
        </Button>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 border border-neutral-200/50 mb-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <p className="text-xs text-neutral-600 font-medium">📷 사진은 분석에만 사용되고 저장되지 않아요</p>
        </div>

        {/* Color Palette - 하단으로 */}
        <div className="w-full">
          <div className="flex gap-2.5 justify-center">
            {currentPalette.map((color, index) => (
              <div
                key={`${currentPaletteIndex}-${index}`}
                className="w-11 h-11 rounded-full shadow-md animate-fade-in border-2 border-white"
                style={{
                  backgroundColor: color,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Version Info - 우측 하단 */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="bg-white/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-neutral-200/30">
          <p className="text-xs text-neutral-500 font-light">v{APP_VERSION}</p>
        </div>
      </div>
    </div>
  )
}
