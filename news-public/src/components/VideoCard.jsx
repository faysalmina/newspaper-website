import Link from 'next/link'
import Image from 'next/image'
import { imageUrl } from '../lib/api'

export default function VideoCard ({ video }) {
  return (
    <Link href={`/video/${video.slug}`} className='group block'>
      <div className='relative aspect-video overflow-hidden rounded bg-gray-900'>
        <Image
          src={imageUrl(video.thumbnail)}
          alt={video.title}
          fill
          className='object-cover opacity-90 transition group-hover:scale-105'
          unoptimized
        />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-brand/90 text-white transition group-hover:scale-110'>
            ▶
          </div>
        </div>
      </div>
      <h3 className='mt-2 text-sm font-semibold leading-snug group-hover:text-brand line-clamp-2'>
        {video.title}
      </h3>
    </Link>
  )
}
