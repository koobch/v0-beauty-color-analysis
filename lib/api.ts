/**
 * API 호출 함수
 * 프론트엔드에서 백엔드 API를 호출하는 함수들
 */

export interface AnalysisResult {
    success: boolean;
    data?: any; // n8n 응답 구조에 맞게 조정 필요
    error?: string;
}

/**
 * 이미지 분석을 위해 백엔드 API를 호출
 * @param imageBase64 - Base64 인코딩된 이미지
 * @param userId - 사용자 식별 UUID
 * @returns 분석 결과
 */
export async function analyzeImage(
    imageBase64: string,
    userId: string
): Promise<AnalysisResult> {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageBase64,
                userId: userId,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            data: data,
        };
    } catch (error) {
        console.error('[API] 이미지 분석 실패:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        };
    }
}
