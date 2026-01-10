/**
 * 이미지 처리 유틸리티
 * - Video 요소에서 이미지 캡처
 * - FHD 해상도로 압축
 * - Base64로 변환
 */

const FHD_WIDTH = 1920;
const FHD_HEIGHT = 1080;
const JPEG_QUALITY = 0.8;

/**
 * Video 요소에서 현재 프레임을 캡처하여 FHD 해상도로 압축 후 Base64로 반환
 * @param videoElement - 캡처할 video 요소
 * @returns Base64 인코딩된 이미지 문자열 (data:image/jpeg;base64,...)
 */
export function captureImageFromVideo(videoElement: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas context를 생성할 수 없습니다.');
    }

    // 원본 비디오 크기
    let sourceWidth = videoElement.videoWidth;
    let sourceHeight = videoElement.videoHeight;

    // FHD 해상도로 리사이즈 (가로/세로 비율 유지)
    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;

    // 가로가 더 긴 경우
    if (sourceWidth > sourceHeight) {
        if (sourceWidth > FHD_WIDTH) {
            targetWidth = FHD_WIDTH;
            targetHeight = Math.round((sourceHeight * FHD_WIDTH) / sourceWidth);
        }
    }
    // 세로가 더 긴 경우
    else {
        if (sourceHeight > FHD_HEIGHT) {
            targetHeight = FHD_HEIGHT;
            targetWidth = Math.round((sourceWidth * FHD_HEIGHT) / sourceHeight);
        }
    }

    // Canvas 크기 설정
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Video의 현재 프레임을 Canvas에 그리기
    ctx.drawImage(videoElement, 0, 0, targetWidth, targetHeight);

    // Base64로 변환 (JPEG, 품질 0.8)
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

/**
 * Base64 DataURL을 Blob으로 변환 (선택적 사용)
 * @param dataURL - Base64 인코딩된 DataURL
 * @returns Blob 객체
 */
export function dataURLToBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

/**
 * UUID v4 생성 함수
 * @returns UUID 문자열
 */
export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
