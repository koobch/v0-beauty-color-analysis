"use client"

import { useEffect, useState } from "react"

const ANALYSIS_STEPS = [
    { icon: "✓", text: "얼굴 영역 감지 완료", status: "complete" },
    { icon: "⏳", text: "피부톤 분석 중...", status: "active" },
    { icon: "⏱️", text: "컬러 매칭 대기 중", status: "pending" },
]

const BEAUTY_TIPS = [
    "봄 웜톤은 복숭아, 코랄 컬러가 가장 잘 어울려요!",
    "여름 쿨톤은 라벤더, 로즈 핑크가 피부를 맑게 보이게 해요",
    "가을 웜톤은 테라코타, 머스타드 컬러로 세련미를 연출하세요",
    "겨울 쿨톤은 선명한 레드, 퓨셔 핑크가 얼굴을 돋보이게 해요",
    "골드 주얼리는 웜톤, 실버는 쿨톤에 어울린다고 해요",
    "립스틱 테스트: 오렌지 vs 핑크 중 어느 쪽이 더 자연스러운가요?",
    "퍼스널 컬러는 피부, 눈동자, 머리카락 색을 종합적으로 분석해요",
    "자신의 컬러를 알면 쇼핑 시간이 50% 단축된다는 연구 결과가!",
    "잘못된 컬러는 피부를 칙칙하게, 맞는 컬러는 화사하게 보이게 해요",
    "메이크업과 패션에 모두 적용할 수 있는 퍼스널 컬러 분석 중...",
]

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const [currentTip, setCurrentTip] = useState(0)
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        // 프로그레스 바 애니메이션 (0% → 80% in 30s → 95% in 60s)
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 80) {
                    // 0-30초: 0% → 80% (빠르게)
                    return Math.min(prev + 2.67, 80) // 30초에 80% 도달
                } else if (prev < 95) {
                    // 30-60초: 80% → 95% (느리게)
                    return Math.min(prev + 0.5, 95) // 30초에 15% 증가
                }
                return prev
            })
        }, 1000) // 1초마다 업데이트

        // 단계 변경 (10초마다)
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length)
        }, 10000)

        // 뷰티 팁 변경 (5초마다)
        const tipInterval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % BEAUTY_TIPS.length)
        }, 5000)

        // 경과 시간 카운터
        const timeInterval = setInterval(() => {
            setElapsedTime((prev) => prev + 1)
        }, 1000)

        return () => {
            clearInterval(progressInterval)
            clearInterval(stepInterval)
            clearInterval(tipInterval)
            clearInterval(timeInterval)
        }
    }, [])

    const getStepStatus = (index: number) => {
        if (index < currentStep) return "complete"
        if (index === currentStep) return "active"
        return "pending"
    }

    return (
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full">
                {/* 팔레트 애니메이션 */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-20 h-20">
                        {/* 회전하는 컬러 서클들 */}
                        <div className="absolute inset-0 animate-spin-slow">
                            <div className="absolute top-0 left-1/2 w-4 h-4 -ml-2 rounded-full bg-[#FFB3BA]" />
                            <div className="absolute top-1/2 right-0 w-4 h-4 -mt-2 rounded-full bg-[#BAE1FF]" />
                            <div className="absolute bottom-0 left-1/2 w-4 h-4 -ml-2 rounded-full bg-[#FFFFBA]" />
                            <div className="absolute top-1/2 left-0 w-4 h-4 -mt-2 rounded-full bg-[#BAFFC9]" />
                        </div>
                        {/* 중앙 아이콘 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl">🎨</span>
                        </div>
                    </div>
                </div>

                {/* 메인 메시지 */}
                <div className="text-center mb-6">
                    <h2 className="text-lg font-normal text-neutral-800 mb-2">
                        AI가 당신의 퍼스널 컬러를 분석하고 있어요
                    </h2>
                    <p className="text-sm text-neutral-500 font-light">
                        약 30-60초 소요됩니다 ({elapsedTime}초 경과)
                    </p>
                </div>

                {/* 프로그레스 바 */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-neutral-500 mb-2">
                        <span>진행 중...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#D4A5A5] to-[#C49090] transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* 분석 단계 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-5 border border-neutral-100">
                    <div className="space-y-3">
                        {ANALYSIS_STEPS.map((step, index) => {
                            const status = getStepStatus(index)
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center gap-3 transition-all duration-500 ${status === "active" ? "opacity-100" : status === "complete" ? "opacity-70" : "opacity-40"
                                        }`}
                                >
                                    <span className="text-lg">
                                        {status === "complete" ? "✓" : status === "active" ? "⏳" : "⏱️"}
                                    </span>
                                    <span
                                        className={`text-sm ${status === "active" ? "text-neutral-800 font-normal" : "text-neutral-600 font-light"
                                            }`}
                                    >
                                        {step.text}
                                    </span>
                                    {status === "active" && (
                                        <div className="ml-auto flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-[#D4A5A5] rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-[#D4A5A5] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                            <div className="w-1.5 h-1.5 bg-[#D4A5A5] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 뷰티 팁 */}
                <div className="bg-[#E8E3DD]/50 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">💡</span>
                        <div className="flex-1">
                            <h3 className="text-xs font-normal text-neutral-700 mb-1">뷰티 팁</h3>
                            <p className="text-sm text-neutral-600 font-light leading-relaxed animate-fade-in">
                                {BEAUTY_TIPS[currentTip]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
