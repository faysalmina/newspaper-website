import Link from 'next/link'
import Image from 'next/image'
import { imageUrl } from '../lib/api'

export default function NewsCard ({ news, size = 'medium' }) {
  const href = `/${news.category_slug || 'news'}/${news.slug}`

  if (size === 'large') {
    return (
      <Link href={href} className='group block'>
        <div className='relative aspect-video overflow-hidden rounded-lg bg-gray-100'>
          <Image
            src={imageUrl(news.featured_image)}
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
    <Link href={href} className='group block'>
      <div className='relative aspect-video overflow-hidden rounded bg-gray-100'>
        <Image
          src={imageUrl(news.featured_image)}
          alt={news.title}
          fill
          className='object-cover transition group-hover:scale-105'
          unoptimized
        />
      </div>
      <h3 className='mt-2 text-sm font-semibold leading-snug group-hover:text-brand line-clamp-2'>
        {news.title}
      </h3>
      {news.excerpt && (
        <p className='mt-1 text-xs text-gray-500 line-clamp-2'>
          {news.excerpt}
        </p>
      )}
    </Link>
  )
}
