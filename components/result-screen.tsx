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
  //버전 수정
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

  // 결과 저장 핸들러 (스크린샷 안내)
  const handleSaveResult = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      alert('📱 모바일: 스크린샷 기능으로 저장해주세요!\n• iOS: 전원 + 볼륨 상단 버튼\n• Android: 전원 + 볼륨 하단 버튼');
    } else {
      alert('💻 PC: 스크린샷 기능으로 저장해주세요!\n• Windows: Win + Shift + S\n• Mac: Cmd + Shift + 4');
    }
  }

  // 공유 핸들러 (링크 복사)
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다! 친구에게 공유해보세요 📋');
    } catch (error) {
      console.error('링크 복사 오류:', error);
      alert('링크 복사 중 오류가 발생했습니다.');
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F3F0] to-[#E8E6E3] flex flex-col py-8 px-6">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* 광고 배너 */}
        <AdBanner
          adSlot="YOUR_AD_SLOT_ID"
          adFormat="horizontal"
          className="mb-6"
        />

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-suit font-medium text-neutral-800 mb-2 tracking-tight bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
            {result.name}
          </h1>
          <p className="text-sm text-neutral-600 font-light">
            {result.subtitle}
          </p>
        </div>


        {/* Eddy's Analysis Card */}
        <div className="mb-6 bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-neutral-200/50 shadow-sm">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8E3DD] to-[#DDD8D2] px-4 py-2 rounded-full mb-4">
            <span className="text-xs font-medium text-neutral-700">💬 Eddy's Analysis</span>
          </div>
          <div className="space-y-2">
            {(result.reasons || []).map((reason, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#D4A5A5] mt-1">•</span>
                <p className="text-[13px] text-neutral-700 font-light leading-relaxed flex-1">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Color Cards - Bento Grid Style */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Makeup Colors Card */}
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-neutral-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💄</span>
              <h2 className="text-base font-suit font-medium text-neutral-800">메이크업</h2>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {result.makeup_colors.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onColorSelect(item.color, item.hex)}
                  className="flex flex-col items-center group"
                >
                  <div
                    className="w-14 h-14 rounded-2xl group-hover:scale-105 transition-transform duration-200 border border-neutral-200"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-[9px] text-neutral-600 mt-1.5 font-serif italic text-center leading-tight truncate w-full px-1">
                    {item.color}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
              {result.makeup_guide}
            </p>
          </div>

          {/* Fashion Colors Card */}
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-neutral-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">👗</span>
              <h2 className="text-base font-suit font-medium text-neutral-800">패션</h2>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {result.fashion_colors.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onColorSelect(item.color, item.hex)}
                  className="flex flex-col items-center group"
                >
                  <div
                    className="w-14 h-14 rounded-2xl group-hover:scale-105 transition-transform duration-200 border border-neutral-200"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-[9px] text-neutral-600 mt-1.5 font-serif italic text-center leading-tight truncate w-full px-1">
                    {item.color}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
              {result.fashion_guide}
            </p>
          </div>
        </div>

        {/* AI Styling Button */}
        <div className="mb-4 bg-gradient-to-r from-[#D4A5A5]/10 to-[#C89595]/10 rounded-2xl p-4 border border-[#D4A5A5]/20">
          <button
            onClick={handleComposeClick}
            disabled={isComposing}
            className="w-full bg-gradient-to-r from-[#D4A5A5] to-[#C89595] hover:from-[#C89595] hover:to-[#B88585] text-white rounded-xl py-4 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <p className="text-[10px] text-center text-neutral-500 mt-2">
            💡 AI가 퍼스널 컬러 기반으로 맞춤 스타일링을 생성해요 (20-30초)
          </p>
        </div>

        {/* Action Button Section */}
        <div className="flex gap-3 mt-auto">
          <Button
            onClick={handleSaveResult}
            className="flex-1 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-900 hover:to-neutral-800 text-white rounded-2xl py-5 text-[13px] font-medium shadow-lg hover:shadow-xl transition-all"
          >
            결과 저장
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 border-2 border-neutral-300 bg-white/80 backdrop-blur-sm hover:bg-white text-neutral-800 rounded-2xl py-5 text-[13px] font-medium shadow-md hover:shadow-lg transition-all"
          >
            공유
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
