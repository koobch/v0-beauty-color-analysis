export interface ColorItem {
    color: string; // 컬러명
    hex: string;   // Hex 코드
}

export interface AnalysisResult {
    type: string;        // "spring_light" 등 (로직 분기용)
    name: string;        // "Spring Light" (화면 표시용 제목)
    subtitle: string;    // "Warm and clear..." (화면 표시용 부제목)
    reasons: string[];   // 분석 근거 3줄
    makeup_colors: ColorItem[];
    makeup_guide: string;
    fashion_colors: ColorItem[];
    fashion_guide: string;
}

export interface ExampleImage {
    url: string;
    description: string;
}

// 퍼스널 컬러 타입별 예시 이미지 (개인정보 보호: 저장 없이 합성용으로만 사용)
export const EXAMPLE_IMAGES: Record<string, ExampleImage[]> = {
    "spring_warm": [
        { url: "/examples/spring_warm_1.png", description: "Warm Peach Look" },
        { url: "/examples/spring_warm_2.png", description: "Coral Glow" },
        { url: "/examples/spring_warm_3.png", description: "Golden Fresh" },
        { url: "/examples/spring_warm_4.png", description: "Bright Charm" }
    ],
    "summer_cool": [
        { url: "/examples/summer_cool_1.png", description: "Cool Lavender" },
        { url: "/examples/summer_cool_2.png", description: "Rose Pink Elegance" },
        { url: "/examples/spring_warm_1.png", description: "Soft Mauve" },
        { url: "/examples/spring_warm_2.png", description: "Gentle Grace" }
    ],
    "autumn_warm": [
        { url: "/examples/autumn_warm_1.png", description: "Brick Red Chic" },
        { url: "/examples/autumn_warm_2.png", description: "Copper Rich" },
        { url: "/examples/spring_warm_1.png", description: "Warm Moody" },
        { url: "/examples/spring_warm_2.png", description: "Terracotta Vibe" }
    ],
    "winter_cool": [
        { url: "/examples/winter_cool_1.png", description: "Bold Red Lip" },
        { url: "/examples/winter_cool_2.png", description: "Fuchsia Drama" },
        { url: "/examples/spring_warm_1.png", description: "Chic Charisma" },
        { url: "/examples/spring_warm_2.png", description: "High Contrast" }
    ],
    // 기본값 (타입이 매칭 안 될 경우)
    "default": [
        { url: "/examples/spring_warm_1.png", description: "Style 1" },
        { url: "/examples/spring_warm_2.png", description: "Style 2" },
        { url: "/examples/spring_warm_3.png", description: "Style 3" },
        { url: "/examples/spring_warm_4.png", description: "Style 4" }
    ]
};