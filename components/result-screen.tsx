"use client"

import { Button } from "@/components/ui/button"

const PERSONAL_COLOR_TYPE = {
  title: "Winter Mute",
  subtitle: "Cool and sophisticated, elegant impression",
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


interface ResultScreenProps {
  onColorSelect: (colorName: string, colorValue: string) => void
}

export default function ResultScreen({ onColorSelect }: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col py-8 px-6">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-light text-neutral-800 mb-2 tracking-tight">{PERSONAL_COLOR_TYPE.title}</h1>
          <p className="text-sm text-neutral-500 font-light">{PERSONAL_COLOR_TYPE.subtitle}</p>
        </div>

        {/* Commentary Section */}
        <div className="mb-6">
          <div className="inline-block bg-[#E8E3DD] px-4 py-1.5 rounded-full mb-3">
            <span className="text-xs font-normal text-neutral-700">Eddy's Comments</span>
          </div>
          <div className="space-y-1.5">
            {EDDY_COMMENTS.map((comment, index) => (
              <p key={index} className="text-[13px] text-neutral-600 font-light leading-relaxed">
                • {comment}
              </p>
            ))}
          </div>
        </div>

        {/* Makeup Color Card Section */}
        <div className="mb-5">
          <h2 className="text-base font-normal text-neutral-800 mb-3">Makeup Color Card</h2>
          <div className="flex gap-3 justify-between mb-3">
            {MAKEUP_COLORS.map((item, index) => (
              <button
                key={index}
                onClick={() => onColorSelect(item.name, item.color)}
                className="flex flex-col items-center group"
              >
                <div
                  className="w-14 h-14 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-neutral-600 mt-1.5 font-light">{item.name}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
            These muted, cool-toned makeup shades enhance your natural elegance without overpowering your features.
          </p>
        </div>

        {/* Fashion Color Card Section */}
        <div className="mb-6">
          <h2 className="text-base font-normal text-neutral-800 mb-3">Fashion Color Card</h2>
          <div className="flex gap-3 justify-between mb-3">
            {FASHION_COLORS.map((item, index) => (
              <button
                key={index}
                onClick={() => onColorSelect(item.name, item.color)}
                className="flex flex-col items-center group"
              >
                <div
                  className="w-14 h-14 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-neutral-600 mt-1.5 font-light">{item.name}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
            Cool, sophisticated neutrals in your wardrobe create a polished look that complements your coloring.
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
