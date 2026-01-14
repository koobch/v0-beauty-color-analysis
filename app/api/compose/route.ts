import { NextRequest, NextResponse } from 'next/server';

/**
 * AI 스타일링 이미지 생성 API Route (n8n 웹훅2 사용)
 * 사용자 사진과 퍼스널 컬러 분석 결과를 기반으로 AI가 스타일링 이미지 생성
 * 
 * 개인정보 보호: 이미지는 처리 중에만 사용되고 저장되지 않음
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            userImage,
            colorType,
            colorName,
            makeupColors,
            fashionColors,
            makeupGuide,
            fashionGuide
        } = body;

        // 1. 필수 필드 검증
        if (!userImage || !colorType) {
            return NextResponse.json(
                { error: '사용자 이미지와 퍼스널 컬러 타입이 필요합니다.' },
                { status: 400 }
            );
        }

        // 2. n8n 웹훅2 URL 검증
        const webhookUrl = process.env.N8N_WEBHOOK_URL2;
        if (!webhookUrl) {
            console.error('[Compose API] N8N_WEBHOOK_URL2 환경변수가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: '서버 설정 오류가 발생했습니다. n8n 웹훅 URL을 확인해주세요.' },
                { status: 500 }
            );
        }

        console.log('[Compose API] n8n 웹훅2 호출 시작 - 퍼스널 컬러:', colorType);

        // 3. n8n 웹훅2 호출 (AI 스타일링 이미지 생성)
        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userImage: userImage, // 사용자 사진 (Base64)
                colorType: colorType, // 예: "Spring Warm Light"
                colorName: colorName, // 예: "봄 웜 라이트"
                makeupColors: makeupColors, // 메이크업 색상 배열
                fashionColors: fashionColors, // 패션 색상 배열
                makeupGuide: makeupGuide, // 메이크업 가이드
                fashionGuide: fashionGuide, // 패션 가이드
            }),
        });

        if (!webhookResponse.ok) {
            throw new Error(`n8n 웹훅 호출 실패: ${webhookResponse.status} ${webhookResponse.statusText}`);
        }

        // 4. n8n 응답 파싱
        const responseData = await webhookResponse.json();
        console.log('[Compose API] n8n 응답 수신');

        // n8n은 배열로 반환하며, 첫 번째 요소에 결과가 있음
        if (!Array.isArray(responseData) || responseData.length === 0) {
            throw new Error('n8n 응답 형식이 올바르지 않습니다.');
        }

        const result = responseData[0];

        // 5. 상태 확인
        if (result.status !== 'succeeded') {
            throw new Error(result.error || 'AI 스타일링 이미지 생성에 실패했습니다.');
        }

        // 6. 이미지 URL 추출
        const composedImageUrl = result.output;

        if (!composedImageUrl || typeof composedImageUrl !== 'string') {
            console.error('[Compose API] composedImageUrl이 문자열이 아님:', typeof composedImageUrl, composedImageUrl);
            throw new Error('스타일링 이미지를 생성하지 못했습니다.');
        }

        console.log('[Compose API] AI 스타일링 성공! URL:', composedImageUrl);

        // 7. 생성 결과 반환
        return NextResponse.json({
            success: true,
            composedImageUrl: composedImageUrl
        });

    } catch (error) {
        console.error('[Compose API] 처리 중 오류:', error);

        // 에러 메시지 상세화
        let errorMessage = 'AI 스타일링 이미지 생성 중 오류가 발생했습니다.';
        if (error instanceof Error) {
            if (error.message.includes('Unauthorized')) {
                errorMessage = 'n8n 웹훅 인증이 실패했습니다.';
            } else if (error.message.includes('rate limit')) {
                errorMessage = 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            } else {
                errorMessage = error.message;
            }
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage
            },
            { status: 500 }
        );
    }
}
