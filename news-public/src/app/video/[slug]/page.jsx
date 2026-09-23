import { notFound } from 'next/navigation'
import VideoCard from '../../../components/VideoCard'
import { getVideoBySlug, formatDate } from '../../../lib/api'

export async function generateMetadata ({ params }) {
  const { slug } = await params
  const data = await getVideoBySlug(slug).catch(() => null)
  if (!data) return { title: 'ভিডিও পাওয়া যায়নি' }
  return { title: data.video.title, description: data.video.description || '' }
}

export default async function SingleVideoPage ({ params }) {
  const { slug } = await params
  const data = await getVideoBySlug(slug).catch(() => null)

  if (!data) notFound()

  const { video, related } = data
  const API_STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL

  return (
    <main className='container-main py-8'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='aspect-video overflow-hidden rounded-lg bg-black'>
            {video.video_type === 'youtube' ? (
              <iframe
                src={video.embed_url}
                className='h-full w-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            ) : (
              <video
                src={`${API_STORAGE}/${video.video_file}`}
                controls
                className='h-full w-full'
              />
            )}
          </div>

          <h1 className='mt-4 text-2xl font-bold leading-snug'>
            {video.title}
          </h1>
          <div className='mt-2 flex gap-3 text-sm text-gray-500'>
            <span>{video.author_name}</span>
            <span>•</span>
            <span>{formatDate(video.published_at)}</span>
            <span>•</span>
            <span>{video.views_count} বার দেখা হয়েছে</span>
          </div>

          {video.description && (
            <p className='mt-4 leading-relaxed text-gray-700'>
              {video.description}
            </p>
          )}
        </div>

        <aside>
          <h2 className='mb-4 border-b-2 border-brand pb-2 text-lg font-bold'>
            আরও ভিডিও
          </h2>
          <div className='grid grid-cols-1 gap-4'>
            {related.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
