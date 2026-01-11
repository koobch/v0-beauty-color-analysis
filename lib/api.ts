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
 * 타임아웃이 있는 fetch 요청
 * @param url - 요청 URL
 * @param options - fetch 옵션
 * @param timeout - 타임아웃 시간 (밀리초)
 */
async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 30000
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.');
        }
        throw error;
    }
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
        const response = await fetchWithTimeout(
            '/api/analyze',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageBase64,
                    userId: userId,
                    timestamp: new Date().toISOString(),
                }),
            },
            120000 // 120초 타임아웃
        );

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

        // 사용자 친화적인 에러 메시지
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        if (error instanceof Error) {
            if (error.message.includes('요청 시간이 초과')) {
                errorMessage = error.message;
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = '네트워크 연결을 확인해주세요.';
            } else {
                errorMessage = error.message;
            }
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}
