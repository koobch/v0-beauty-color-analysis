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

        console.log('[Compose API] 예시 이미지 URL:', exampleImageUrl);

        // 3-1. 예시 이미지를 Base64로 변환 (Replicate는 localhost 접근불가)
        let exampleImageBase64: string;

        if (exampleImageUrl.startsWith('http')) {
            // 이미 절대 URL이면 그대로 사용 (production 환경)
            exampleImageBase64 = exampleImageUrl;
        } else {
            // 상대 경로면 파일을 읽어서 Base64로 변환 (development 환경)
            try {
                const path = await import('path');
                const fs = await import('fs/promises');

                // public 폴더의 파일 경로 생성
                const filePath = path.join(process.cwd(), 'public', exampleImageUrl);
                console.log('[Compose API] 파일 경로:', filePath);

                // 파일 읽기
                const fileBuffer = await fs.readFile(filePath);

                // MIME 타입 결정 (확장자 기반)
                const ext = path.extname(filePath).toLowerCase();
                const mimeTypes: Record<string, string> = {
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.webp': 'image/webp',
                };
                const mimeType = mimeTypes[ext] || 'image/png';

                // Base64로 인코딩
                exampleImageBase64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
                console.log('[Compose API] 예시 이미지를 Base64로 변환 완료');
            } catch (fileError) {
                console.error('[Compose API] 예시 이미지 파일 읽기 실패:', fileError);
                return NextResponse.json(
                    { error: '예시 이미지 파일을 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }
        }

        // 4. Replicate 클라이언트 초기화
        const replicate = new Replicate({
            auth: replicateToken,
        });

        // 5. Face Swap 모델 실행
        // 공개 모델: cdingram/face-swap (약 10초 소요, $0.014/실행)
        const output = await replicate.run(
            "cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111",
            {
                input: {
                    input_image: exampleImageBase64, // 예시 이미지 (Base64)
                    swap_image: userImage, // 사용자 얼굴 (교체할 얼굴 - Base64)
                }
            }
        );

        // 6. 결과 처리 (cdingram/face-swap는 FileOutput 객체 반환)
        console.log('[Compose API] Replicate 응답 타입:', typeof output);
        console.log('[Compose API] Replicate 응답:', output);

        let composedImageUrl: string;

        // cdingram/face-swap는 FileOutput 객체를 반환하며 .url() 메서드 제공
        if (typeof output === 'object' && output !== null && typeof (output as any).url === 'function') {
            const urlResult = await (output as any).url();
            console.log('[Compose API] FileOutput.url() 반환값:', urlResult);

            // .url()이 URL 객체를 반환하는 경우 문자열로 변환
            if (typeof urlResult === 'object' && urlResult !== null && 'href' in urlResult) {
                composedImageUrl = urlResult.href;
            } else if (typeof urlResult === 'string') {
                composedImageUrl = urlResult;
            } else {
                composedImageUrl = String(urlResult);
            }
            console.log('[Compose API] 최종 URL 문자열:', composedImageUrl);
        }
        // output이 배열인 경우
        else if (Array.isArray(output)) {
            composedImageUrl = output[0];
        }
        // output이 직접 문자열인 경우
        else if (typeof output === 'string') {
            composedImageUrl = output;
        }
        // 그 외의 경우
        else {
            console.error('[Compose API] 예상치 못한 output 형태:', output);
            throw new Error('합성된 이미지 URL을 추출할 수 없습니다.');
        }

        if (!composedImageUrl || typeof composedImageUrl !== 'string') {
            console.error('[Compose API] composedImageUrl이 문자열이 아님:', typeof composedImageUrl, composedImageUrl);
            throw new Error('합성된 이미지를 생성하지 못했습니다.');
        }

        console.log('[Compose API] Face Swap 성공! 최종 URL:', composedImageUrl);

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
