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