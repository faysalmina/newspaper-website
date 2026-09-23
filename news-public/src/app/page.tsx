import Link from 'next/link'
import BreakingTicker from '../components/BreakingTicker'
import NewsCard from '../components/NewsCard'
import VideoCard from '../components/VideoCard'
import { getHomeFeed, getHomeSections, getLatestVideos } from '../lib/api'

export default async function HomePage () {
  const [feed, sections, videos] = await Promise.all([
    getHomeFeed().catch(() => null),
    getHomeSections().catch(() => []),
    getLatestVideos().catch(() => [])
  ])

  if (!feed || !feed.featured) {
    return (
      <main className='container-main py-16 text-center'>
        <p className='text-lg text-gray-500'>এখনো কোনো নিউজ প্রকাশিত হয়নি।</p>
      </main>
    )
  }

  return (
    <main>
      <BreakingTicker items={feed.breaking || []} />

      <div className='container-main py-8'>
        {/* উপরের অংশ — ফিচার্ড নিউজ + সর্বাধিক পঠিত সাইডবার */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <NewsCard news={feed.featured} size='large' />
          </div>
          <aside className='rounded-lg border bg-white p-4'>
            <h2 className='mb-4 border-b-2 border-brand pb-2 text-lg font-bold'>
              সর্বাধিক পঠিত
            </h2>
            <div className='space-y-4'>
              {(feed.most_read || []).map((n: any, i: number) => (
                <Link
                  key={n.id}
                  href={`/${n.category_slug}/${n.slug}`}
                  className='flex gap-3 group'
                >
                  <span className='text-2xl font-bold text-gray-300'>
                    {i + 1}
                  </span>
                  <h3 className='text-sm font-semibold leading-snug group-hover:text-brand line-clamp-2'>
                    {n.title}
                  </h3>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* প্রতিটা ক্যাটাগরির জন্য আলাদা সেকশন — daily-bangladesh স্টাইল */}
        {sections.map((section: any) => (
          <section key={section.category.slug} className='mt-10'>
            <div className='mb-4 flex items-center justify-between border-b-2 border-brand pb-2'>
              <h2 className='text-xl font-bold'>{section.category.name}</h2>
              <Link
                href={`/category/${section.category.slug}`}
                className='text-sm text-gray-500 hover:text-brand'
              >
                সব দেখুন →
              </Link>
            </div>
            <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
              {section.news.map((n: any) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </section>
        ))}
        {videos && videos.length > 0 && (
          <section className='mt-10'>
            <div className='mb-4 flex items-center justify-between border-b-2 border-brand pb-2'>
              <h2 className='text-xl font-bold'>ভিডিও</h2>
              <Link
                href='/video'
                className='text-sm text-gray-500 hover:text-brand'
              >
                সব দেখুন →
              </Link>
            </div>
            <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
              {videos.map((v: any) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
