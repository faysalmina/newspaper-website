import { imageUrl } from '../lib/api'

async function getAdsByPosition (position) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  try {
    const res = await fetch(`${API_URL}/public/ads/${position}`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function AdSlot ({ position, className = '' }) {
  const ads = await getAdsByPosition(position)

  if (!ads || ads.length === 0) return null

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {ads.map(ad => {
        const clickUrl = `${API_URL}/ads/${ad.id}/click`
        const style = ad.width && ad.height ? { maxWidth: `${ad.width}px` } : {}

        return (
          <a
            key={ad.id}
            href={clickUrl}
            target='_blank'
            rel='noopener noreferrer sponsored'
            className='block overflow-hidden rounded border border-gray-200 bg-gray-50'
            style={style}
          >
            {ad.ad_type === 'image' ? (
              <img
                src={imageUrl(ad.image)}
                alt='বিজ্ঞাপন'
                width={ad.width || undefined}
                height={ad.height || undefined}
                className='h-auto w-full object-cover'
              />
            ) : (
              <div className='p-2 text-center text-xs text-gray-400'>
                ভিডিও বিজ্ঞাপন
              </div>
            )}
          </a>
        )
      })}
    </div>
  )
}
