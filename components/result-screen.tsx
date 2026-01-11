"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import AdBanner from "@/components/AdBanner"
import ComposeModal from "@/components/compose-modal"
import { AnalysisResult, EXAMPLE_IMAGES, ExampleImage } from "@/lib/constants"
import { composeImage } from "@/lib/api"

interface ResultScreenProps {
  result: AnalysisResult | null;
  capturedImage: string | null; // 🔥 추가: 사용자가 촬영한 이미지 (Base64)
  onColorSelect: (colorName: string, colorValue: string) => void
}

export default function ResultScreen({ result, capturedImage, onColorSelect }: ResultScreenProps) {
  const [isComposing, setIsComposing] = useState(false)
  const [composedImageUrl, setComposedImageUrl] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 결과 데이터가 없으면 아무것도 렌더링하지 않음 (상위에서 로딩 처리)
  if (!result) return null;

  // 현재 퍼스널 컬러 타입에 맞는 예시 이미지 가져오기
  const exampleImages: ExampleImage[] = EXAMPLE_IMAGES[result.type] || EXAMPLE_IMAGES["default"];

  // 이미지 합성 핸들러
  const handleComposeClick = async (exampleImageUrl: string) => {
    if (!capturedImage) {
      alert('사용자 이미지가 없습니다. 다시 촬영해주세요.');
      return;
    }

    try {
      setIsComposing(true)
      setIsModalOpen(true) // 모달 열기 (로딩 상태)
      setComposedImageUrl(null)

      console.log('[ResultScreen] 이미지 합성 시작:', exampleImageUrl);

      const result = await composeImage(capturedImage, exampleImageUrl);

      if (result.success && result.composedImageUrl) {
        setComposedImageUrl(result.composedImageUrl)
        console.log('[ResultScreen] 합성 성공');
      } else {
        alert(`합성 실패: ${result.error || '알 수 없는 오류'}`);
        setIsModalOpen(false) // 실패 시 모달 닫기
      }
    } catch (error) {
      console.error('[ResultScreen] 합성 중 오류:', error);
      alert('이미지 합성 중 오류가 발생했습니다.');
      setIsModalOpen(false)
    } finally {
      setIsComposing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col py-8 px-6">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* 광고 배너 */}
        <AdBanner
          adSlot="YOUR_AD_SLOT_ID"
          adFormat="horizontal"
          className="mb-6"
        />

        {/* Title Section: API에서 받은 name과 subtitle 사용 */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-light text-neutral-800 mb-2 tracking-tight">
            {result.name}
          </h1>
          <p className="text-sm text-neutral-500 font-light">
            {result.subtitle}
          </p>
        </div>

        {/* Commentary Section: Eddy's Analysis */}
        <div className="mb-6">
          <div className="inline-block bg-[#E8E3DD] px-4 py-1.5 rounded-full mb-3">
            <span className="text-xs font-normal text-neutral-700">Eddy's Analysis</span>
          </div>
          <div className="space-y-1.5">
            {(result.reasons || []).map((reason, index) => (
              <p key={index} className="text-[13px] text-neutral-600 font-light leading-relaxed">
                • {reason}
              </p>
            ))}
          </div>
        </div>

        {/* Makeup Color Card Section */}
        <div className="mb-5">
          <h2 className="text-base font-normal text-neutral-800 mb-3">Makeup Color Card</h2>
          <div className="flex gap-3 justify-between mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {result.makeup_colors.map((item, index) => (
              <button
                key={index}
                onClick={() => onColorSelect(item.color, item.hex)}
                className="flex flex-col items-center group min-w-[56px]"
              >
                {/* API에서 준 Hex 코드로 배경색 지정 */}
                <div
                  className="w-14 h-14 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 border border-neutral-100"
                  style={{ backgroundColor: item.hex }}
                />
                <span className="text-[10px] text-neutral-600 mt-1.5 font-light text-center leading-tight truncate w-full px-1">
                  {item.color}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
            {result.makeup_guide}
          </p>
        </div>

        {/* Fashion Color Card Section */}
        <div className="mb-6">
          <h2 className="text-base font-normal text-neutral-800 mb-3">Fashion Color Card</h2>
          <div className="flex gap-3 justify-between mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {result.fashion_colors.map((item, index) => (
              <button
                key={index}
                onClick={() => onColorSelect(item.color, item.hex)}
                className="flex flex-col items-center group min-w-[56px]"
              >
                {/* API에서 준 Hex 코드로 배경색 지정 */}
                <div
                  className="w-14 h-14 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 border border-neutral-100"
                  style={{ backgroundColor: item.hex }}
                />
                <span className="text-[10px] text-neutral-600 mt-1.5 font-light text-center leading-tight truncate w-full px-1">
                  {item.color}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
            {result.fashion_guide}
          </p>
        </div>

        {/* 🔥 NEW: Try On Example Styles Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-normal text-neutral-800">Try On Example Styles</h2>
            <span className="inline-block bg-[#D4A5A5] text-white text-[10px] px-2 py-0.5 rounded-full">
              AI
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-light mb-3">
            내 얼굴에 {result.name} 스타일을 입혀보세요
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {exampleImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleComposeClick(img.url)}
                disabled={isComposing}
                className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={img.url}
                  alt={img.description}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-normal bg-neutral-800/80 px-3 py-1.5 rounded-full transition-opacity">
                    합성하기
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[10px] text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full block text-center">
                    {img.description}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-neutral-400 font-light text-center">
            💡 AI가 당신의 얼굴에 예시 스타일을 합성합니다 (약 10-15초 소요)
          </p>
        </div>

        {/* Action Button Section */}
        <div className="flex gap-2.5 mt-auto">
          <Button className="flex-1 bg-neutral-800 hover:bg-neutral-900 text-white rounded-full py-5 text-[13px] font-normal shadow-sm">
            Save Results
          </Button>
          <Button
            variant="outline"
            className="flex-1 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 rounded-full py-5 text-[13px] font-normal"
          >
            Share with Friends
          </Button>
        </div>
      </div>

      {/* 🔥 Composition Modal */}
      <ComposeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        composedImageUrl={composedImageUrl}
        isLoading={isComposing}
      />
    </div>
  )
}
