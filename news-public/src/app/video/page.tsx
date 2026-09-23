import VideoCard from '../../components/VideoCard'
import { getAllVideos } from '../../lib/api'

export const metadata = { title: 'ভিডিও' }

export default async function VideoListPage () {
  const data = await getAllVideos().catch(() => ({ data: [] }))

  return (
    <main className='container-main py-8'>
      <h1 className='mb-6 border-b-2 border-brand pb-2 text-2xl font-bold'>
        সব ভিডিও
      </h1>

      {data.data.length === 0 ? (
        <p className='text-gray-500'>এখনো কোনো ভিডিও নেই।</p>
      ) : (
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4'>
          {data.data.map((v: any) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </main>
  )
}
