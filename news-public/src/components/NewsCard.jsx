import Link from 'next/link'
import Image from 'next/image'

export default function NewsCard ({ news, size = 'medium' }) {
  const imageUrl = news.featured_image
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${news.featured_image}`
    : '/placeholder-news.jpg'

  const href = `/${news.category_slug || 'news'}/${news.slug}`

  if (size === 'large') {
    return (
      <Link href={href} className='group block'>
        <div className='relative aspect-video overflow-hidden rounded'>
          <Image
            src={imageUrl}
            alt={news.title}
            fill
            priority
            className='object-cover transition group-hover:scale-105'
            unoptimized
          />
        </div>
        <h2 className='mt-3 text-xl font-bold leading-snug group-hover:text-brand'>
          {news.title}
        </h2>
        {news.excerpt && (
          <p className='mt-2 text-sm text-gray-600'>{news.excerpt}</p>
        )}
      </Link>
    )
  }

  return (
    <Link href={href} className='group flex gap-3'>
      <div className='relative h-20 w-28 shrink-0 overflow-hidden rounded'>
        <Image
          src={imageUrl}
          alt={news.title}
          fill
          className='object-cover'
          unoptimized
        />
      </div>
      <div>
        <h3 className='text-sm font-semibold leading-snug group-hover:text-brand'>
          {news.title}
        </h3>
        <p className='mt-1 text-xs text-gray-400'>{news.category_name}</p>
      </div>
    </Link>
  )
}
