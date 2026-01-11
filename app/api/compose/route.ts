import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

/**
 * 이미지 합성 API Route (Replicate Face Swap 사용)
 * 사용자 얼굴을 예시 이미지에 정확하게 합성
 * 
 * 개인정보 보호: 이미지는 처리 중에만 사용되고 저장되지 않음
 */
export async function POST(request: NextRequest) {
    try {
        const { userImage, exampleImageUrl } = await request.json();

        // 1. 필수 필드 검증
        if (!userImage || !exampleImageUrl) {
            return NextResponse.json(
                { error: '사용자 이미지와 예시 이미지가 필요합니다.' },
                { status: 400 }
            );
        }

        // 2. Replicate API 토큰 검증
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        if (!replicateToken) {
            console.error('[Compose API] REPLICATE_API_TOKEN 환경변수가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: '서버 설정 오류가 발생했습니다. Replicate API 토큰을 확인해주세요.' },
                { status: 500 }
            );
        }

        console.log('[Compose API] Replicate Face Swap 시작');

        // 3. 예시 이미지 URL을 절대 경로로 변환
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const fullExampleImageUrl = exampleImageUrl.startsWith('http')
            ? exampleImageUrl
            : `${baseUrl}${exampleImageUrl}`;

        console.log('[Compose API] 예시 이미지 URL:', fullExampleImageUrl);

        // 4. Replicate 클라이언트 초기화
        const replicate = new Replicate({
            auth: replicateToken,
        });

        // 5. Face Swap 모델 실행
        // 검증된 공개 모델: lucataco/faceswap 또는 omniedgeio/face-swap
        const output = await replicate.run(
            "lucataco/faceswap:9a4863ba4585fa16fa35c4dacf2d0633308bb2f2a6101ea259190c123e83d17d",
            {
                input: {
                    input_image: userImage, // 사용자 얼굴 (Base64)
                    swap_image: fullExampleImageUrl, // 예시 이미지 (URL 또는 Base64)
                }
            }
        );

        // 6. 결과 처리 (lucataco/faceswap는 단일 URL 반환)
        const composedImageUrl = output as unknown as string;

        if (!composedImageUrl) {
            throw new Error('합성된 이미지를 생성하지 못했습니다.');
        }

        console.log('[Compose API] Face Swap 성공:', composedImageUrl);

        // 7. 합성 결과 반환
        return NextResponse.json({
            success: true,
            composedImageUrl: composedImageUrl
        });

    } catch (error) {
        console.error('[Compose API] 처리 중 오류:', error);

        // 에러 메시지 상세화
        let errorMessage = '이미지 합성 중 오류가 발생했습니다.';
        if (error instanceof Error) {
            if (error.message.includes('Unauthorized')) {
                errorMessage = 'Replicate API 토큰이 유효하지 않습니다.';
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
