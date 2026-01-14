declare module 'dom-to-image-more' {
    export function toBlob(
        node: HTMLElement,
        options?: {
            bgcolor?: string;
            quality?: number;
            scale?: number;
        }
    ): Promise<Blob>;

    export function toPng(
        node: HTMLElement,
        options?: {
            bgcolor?: string;
            quality?: number;
            scale?: number;
        }
    ): Promise<string>;
}
