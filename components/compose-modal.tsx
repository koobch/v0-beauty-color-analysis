"use client"

import { useEffect } from "react"

interface ComposeModalProps {
    isOpen: boolean
    onClose: () => void
    composedImageUrl: string | null
    isLoading: boolean
}

export default function ComposeModal({ isOpen, onClose, composedImageUrl, isLoading }: ComposeModalProps) {
    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEsc)
            document.body.style.overflow = "hidden" // 배경 스크롤 방지
        }
        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, isLoading, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* 모달 컨텐츠 */}
            <div className="relative bg-[#FAF9F7] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* 닫기 버튼 */}
                {!isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-900 flex items-center justify-center transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}

                {/* 로딩 상태 */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 px-6">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-200 border-t-neutral-800 mb-4" />
                        <h3 className="text-base font-normal text-neutral-800 mb-2">이미지 합성 중...</h3>
                        <p className="text-sm text-neutral-500 font-light text-center">
                            AI가 당신의 얼굴에 새로운 스타일을 입히고 있습니다.
                            <br />
                            잠시만 기다려주세요 (약 10-15초)
                        </p>
                    </div>
                )}

                {/* 합성 결과 */}
                {!isLoading && composedImageUrl && (
                    <div className="flex flex-col">
                        {/* 이미지 */}
                        <div className="relative">
                            <img
                                src={composedImageUrl}
                                alt="합성된 이미지"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* 하단 정보 */}
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-normal text-neutral-800 mb-2">
                                ✨ 합성 완료!
                            </h3>
                            <p className="text-sm text-neutral-500 font-light mb-4">
                                당신의 퍼스널 컬러 스타일이 적용되었습니다
                            </p>

                            {/* 다운로드 버튼 */}
                            <div className="flex gap-2">
                                <a
                                    href={composedImageUrl}
                                    download="my-color-style.png"
                                    className="flex-1 bg-neutral-800 hover:bg-neutral-900 text-white rounded-full py-3 text-sm font-normal shadow-sm transition-colors text-center"
                                >
                                    이미지 저장
                                </a>
                                <button
                                    onClick={onClose}
                                    className="flex-1 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 rounded-full py-3 text-sm font-normal transition-colors"
                                >
                                    닫기
                                </button>
                            </div>

                            <p className="text-xs text-neutral-400 mt-3 font-light">
                                💡 이미지는 서버에 저장되지 않습니다
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
