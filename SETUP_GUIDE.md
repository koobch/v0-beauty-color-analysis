# 설정 가이드

## .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

**실제 n8n 웹훅 URL로 교체해야 합니다.**

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 테스트하세요.

## 테스트 절차

1. 랜딩 페이지에서 "시작" 버튼 클릭
2. 카메라 권한 허용
3. 촬영 버튼 클릭
4. 로딩 화면 확인
5. Network 탭에서 `/api/analyze` 요청 확인
6. n8n 워크플로우에서 데이터 수신 확인

## 주요 파일 위치

- **환경변수**: `.env.local` (gitignore됨)
- **이미지 유틸리티**: `lib/image-utils.ts`
- **API 호출**: `lib/api.ts`
- **API Route**: `app/api/analyze/route.ts`
- **카메라 화면**: `components/camera-screen.tsx`
- **메인 페이지**: `app/page.tsx`
