"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import AdBanner from "@/components/AdBanner"
import ComposeModal from "@/components/compose-modal"
import { AnalysisResult } from "@/lib/constants"
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

  // AI 스타일링 이미지 생성 핸들러
  const handleComposeClick = async () => {
    if (!capturedImage) {
      alert('사용자 이미지가 없습니다. 다시 촬영해주세요.');
      return;
    }

    // 🔥 확인 다이얼로그 추가
    const confirmed = confirm(
      `당신의 퍼스널 컬러 "${result.name}"에 맞춘 AI 스타일링 이미지를 생성하시겠습니까?\n\n` +
      `⏱️ 약 20-30초 소요됩니다.\n` +
      `💡 AI가 당신의 사진과 퍼스널 컬러 분석 결과를 기반으로 스타일링 이미지를 생성합니다.\n\n` +
      `계속하시겠습니까?`
    );

    if (!confirmed) {
      return; // 취소하면 아무것도 안 함
    }

    try {
      setIsComposing(true)
      setIsModalOpen(true) // 모달 열기 (로딩 상태)
      setComposedImageUrl(null)

      console.log('[ResultScreen] AI 스타일링 이미지 생성 시작:', result.type);

      const composeResult = await composeImage(capturedImage, {
        type: result.type,
        name: result.name,
        makeup_colors: result.makeup_colors,
        fashion_colors: result.fashion_colors,
        makeup_guide: result.makeup_guide,
        fashion_guide: result.fashion_guide,
      });

      if (composeResult.success && composeResult.composedImageUrl) {
        setComposedImageUrl(composeResult.composedImageUrl)
        console.log('[ResultScreen] AI 스타일링 성공');
      } else {
        alert(`AI 스타일링 실패: ${composeResult.error || '알 수 없는 오류'}`);
        setIsModalOpen(false) // 실패 시 모달 닫기
      }
    } catch (error) {
      console.error('[ResultScreen] AI 스타일링 중 오류:', error);
      alert('AI 스타일링 중 오류가 발생했습니다.');
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

        {/* 🔥 NEW: AI Styling Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-normal text-neutral-800">AI Styling Preview</h2>
            <span className="inline-block bg-[#D4A5A5] text-white text-[10px] px-2 py-0.5 rounded-full">
              AI
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-light mb-4">
            내 퍼스널 컬러에 맞춘 스타일링 이미지를 AI로 생성해보세요
          </p>

          <button
            onClick={handleComposeClick}
            disabled={isComposing}
            className="w-full bg-gradient-to-r from-[#D4A5A5] to-[#C89595] hover:from-[#C89595] hover:to-[#B88585] text-white rounded-2xl py-4 px-6 text-sm font-normal shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isComposing ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>AI 스타일링 생성 중...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <span>내 스타일링 이미지 생성하기</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-neutral-400 font-light text-center mt-3">
            💡 퍼스널 컬러 기반으로 맞춤 스타일링 이미지를 생성합니다 (약 20-30초 소요)
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
