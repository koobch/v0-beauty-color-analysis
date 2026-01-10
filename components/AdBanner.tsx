'use client'

import { useEffect } from 'react'

interface AdBannerProps {
    adSlot: string
    adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
    fullWidthResponsive?: boolean
    className?: string
}

export default function AdBanner({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    className = '',
}: AdBannerProps) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) {
                console.error('[AdSense] 광고 로딩 실패:', err)
            }
        }
    }, [])

    const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID

    if (!adsenseId) {
        console.warn('[AdSense] NEXT_PUBLIC_ADSENSE_ID 환경변수가 설정되지 않았습니다.')
        return null
    }

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={adsenseId}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
        </div>
    )
}
