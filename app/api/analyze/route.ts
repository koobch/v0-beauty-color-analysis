import { NextRequest, NextResponse } from 'next/server';

/**
 * 이미지 분석 API Route
 * 클라이언트로부터 이미지를 받아 n8n 웹훅으로 전달하고,
 * 복잡한 n8n 응답 구조를 파싱하여 프론트엔드에 전달
 */
export async function POST(request: NextRequest) {
    try {
        // 1. 요청 본문 파싱
        const body = await request.json();
        const { image, userId, timestamp } = body;

        // 2. 필수 필드 검증
        if (!image || !userId) {
            return NextResponse.json(
                { error: '이미지와 사용자 ID는 필수입니다.' },
                { status: 400 }
            );
        }

        // 3. 환경변수 체크
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error('[API] N8N_WEBHOOK_URL 환경변수가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: '서버 설정 오류가 발생했습니다.' },
                { status: 500 }
            );
        }

        console.log('[API] n8n 웹훅 호출 시작:', { userId, urlLength: webhookUrl.length });

        // 4. n8n 웹훅 호출
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
            const errorText = await webhookResponse.text();
            throw new Error(`n8n 호출 실패: ${webhookResponse.status} ${errorText}`);
        }

        // 5. n8n 응답 받기 (Raw Data)
        const rawResponse = await webhookResponse.json();
        console.log('[API] n8n Raw Response 수신 완료');

        // 6. 🔥 [핵심] 복잡한 중첩 구조 파싱 로직
        let parsedAiResult = null;

        try {
            // 보내주신 구조: { "success": true, "data": [ { "output": ... } ] } 
            // 혹은 n8n이 바로 [ { "output": ... } ] 를 줄 수도 있음. 두 경우 모두 대비.

            // 1단계: 배열 찾기
            const dataArray = Array.isArray(rawResponse) ? rawResponse : rawResponse.data;

            if (Array.isArray(dataArray) && dataArray.length > 0) {
                // 2단계: output -> content -> text 경로 탐색
                // 구조: data[0].output[0].content[0].text
                const textContent = dataArray[0]?.output?.[0]?.content?.[0]?.text;

                if (textContent) {
                    // 3단계: 문자열로 된 JSON을 진짜 객체로 변환
                    parsedAiResult = JSON.parse(textContent);
                }
            }

            if (!parsedAiResult) {
                console.error('[API] 파싱 실패: 원하는 데이터 경로를 찾지 못했습니다.', JSON.stringify(rawResponse).substring(0, 200));
                throw new Error('AI 분석 결과 형식이 올바르지 않습니다.');
            }

            // 7. 🔥 [안전장치] 프론트엔드 호환성 처리 (String -> Object 변환)
            // AI가 컬러를 ["Pink"] 처럼 문자열 배열로 줬을 경우, [{color:"Pink", hex:"#ccc"}]로 바꿔야 프론트가 안 깨짐

            const normalizeColors = (colors: any[]) => {
                if (!Array.isArray(colors)) return [];
                return colors.map(c => {
                    if (typeof c === 'string') {
                        // 문자열이면 객체로 변환 (Hex는 임시값)
                        return { color: c, hex: '#E0E0E0' };
                    }
                    return c; // 이미 객체라면 그대로 둠
                });
            };

            parsedAiResult.makeup_colors = normalizeColors(parsedAiResult.makeup_colors);
            parsedAiResult.fashion_colors = normalizeColors(parsedAiResult.fashion_colors);

        } catch (parseError) {
            console.error('[API] 데이터 파싱 중 에러:', parseError);
            throw new Error('AI 응답 데이터를 처리하는 중 오류가 발생했습니다.');
        }

        console.log('[API] 최종 파싱 성공:', parsedAiResult.type);

        // 8. 클라이언트에 최종 가공된 데이터 반환
        return NextResponse.json({
            success: true,
            data: parsedAiResult, // 깔끔해진 JSON 객체
        });

    } catch (error) {
        console.error('[API] 처리 중 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '알 수 없는 오류',
            },
            { status: 500 }
        );
    }
}