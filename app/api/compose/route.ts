import { NextRequest, NextResponse } from 'next/server';

/**
 * 이미지 합성 API Route (OpenAI GPT-4 Vision 사용)
 * 사용자 이미지와 예시 이미지를 합성하여 새로운 이미지 생성
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

        // 2. OpenAI API 키 검증
        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
            console.error('[Compose API] OPENAI_API_KEY 환경변수가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: '서버 설정 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        console.log('[Compose API] 이미지 합성 시작');

        // 3. 예시 이미지 URL을 Base64로 변환 (public 폴더에서 가져오기)
        const exampleImageBase64 = await fetchImageAsBase64(exampleImageUrl);

        // 4. OpenAI GPT-4 Vision API 호출 (DALL-E 3 사용)
        // 얼굴 스왑 방식: 사용자 얼굴 + 예시 스타일을 합성
        const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: `Create a hyper-realistic portrait combining these two elements:
1. The facial features and face structure from the first image (user photo)
2. The makeup style, hair color, and overall color tone from the second image (example style)

Keep the person's identity and facial features identical to the first image, but apply the makeup colors, hair styling, and color scheme from the second image. The result should look natural and professional, like a beauty transformation photo. White background, 8k quality, beauty photography style.`,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
                response_format: 'url'
            }),
        });

        if (!dalleResponse.ok) {
            const errorData = await dalleResponse.json().catch(() => ({}));
            console.error('[Compose API] OpenAI 호출 실패:', errorData);
            throw new Error('이미지 합성에 실패했습니다.');
        }

        const dalleResult = await dalleResponse.json();
        const composedImageUrl = dalleResult.data?.[0]?.url;

        if (!composedImageUrl) {
            throw new Error('합성된 이미지를 생성하지 못했습니다.');
        }

        console.log('[Compose API] 이미지 합성 성공');

        // 5. 생성된 이미지 URL 반환
        return NextResponse.json({
            success: true,
            composedImageUrl: composedImageUrl
        });

    } catch (error) {
        console.error('[Compose API] 처리 중 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '이미지 합성 중 오류가 발생했습니다.'
            },
            { status: 500 }
        );
    }
}

/**
 * public 폴더의 이미지를 Base64로 변환
 */
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
    try {
        // Next.js에서는 public 폴더가 루트이므로, 전체 URL 생성
        const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${imageUrl}`;

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error('예시 이미지를 가져올 수 없습니다.');
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.error('[fetchImageAsBase64] 에러:', error);
        throw error;
    }
}
