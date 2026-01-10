import { NextRequest, NextResponse } from 'next/server';

/**
 * 이미지 분석 API Route
 * 클라이언트로부터 이미지를 받아 n8n 웹훅으로 전달
 */
export async function POST(request: NextRequest) {
    try {
        // 요청 본문 파싱
        const body = await request.json();
        const { image, userId, timestamp } = body;

        // 필수 필드 검증
        if (!image || !userId) {
            return NextResponse.json(
                { error: '이미지와 사용자 ID는 필수입니다.' },
                { status: 400 }
            );
        }

        // 환경변수에서 n8n 웹훅 URL 가져오기
        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('[API] N8N_WEBHOOK_URL 환경변수가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: '서버 설정 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        // n8n 웹훅 호출
        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                image: image,
                timestamp: timestamp || new Date().toISOString(),
            }),
        });

        if (!webhookResponse.ok) {
            throw new Error(`n8n 웹훅 호출 실패: ${webhookResponse.status}`);
        }

        // n8n 응답 받기
        const webhookData = await webhookResponse.json();

        // 클라이언트에 응답 반환
        return NextResponse.json({
            success: true,
            data: webhookData,
        });
    } catch (error) {
        console.error('[API] 이미지 분석 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}
