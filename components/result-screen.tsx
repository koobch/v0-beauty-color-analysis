"use client"

import { Button } from "@/components/ui/button"
import AdBanner from "@/components/AdBanner"
import { AnalysisResult } from "@/lib/constants"

interface ResultScreenProps {
  result: AnalysisResult | null;
  onColorSelect: (colorName: string, colorValue: string) => void
}

export default function ResultScreen({ result, onColorSelect }: ResultScreenProps) {
  // 결과 데이터가 없으면 아무것도 렌더링하지 않음 (상위에서 로딩 처리)
  if (!result) return null;

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
    </div>
  )
}