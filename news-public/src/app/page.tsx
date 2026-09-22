import BreakingTicker from '../components/BreakingTicker'
import NewsCard from '../components/NewsCard'

// ⚠️ Placeholder ডেটা — Phase 8-এ Laravel থেকে real নিউজ আসবে
const dummyNews = {
  featured: {
    id: 1,
    title: 'এটি একটি নমুনা ফিচার্ড নিউজ শিরোনাম যা হোমপেজে বড় করে দেখা যাবে',
    excerpt: 'এখানে নিউজের সংক্ষিপ্ত বিবরণ দেখা যাবে।',
    slug: 'demo-news',
    category_slug: 'জাতীয়',
    featured_image: null
  },
  latest: Array.from({ length: 6 }).map((_, i) => ({
    id: i + 2,
    title: `নমুনা নিউজ শিরোনাম নাম্বার ${i + 1}`,
    slug: `demo-news-${i + 1}`,
    category_slug: 'জাতীয়',
    category_name: 'জাতীয়',
    featured_image: null
  }))
}

export default function HomePage () {
  return (
    <main>
      <BreakingTicker
        items={
          [
            'এটি একটি নমুনা ব্রেকিং নিউজ',
            'Phase 8-এ real ডেটা যুক্ত হবে'
          ] as unknown as never[]
        }
      />

      <div className='container-main py-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* মেইন কলাম — ফিচার্ড + লেটেস্ট */}
          <div className='lg:col-span-2'>
            <NewsCard news={dummyNews.featured} size='large' />

            <h2 className='mt-8 mb-4 border-b-2 border-brand pb-2 text-lg font-bold'>
              সর্বশেষ সংবাদ
            </h2>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
              {dummyNews.latest.map(n => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </div>

          {/* সাইডবার — সবচেয়ে বেশি পড়া */}
          <aside>
            <h2 className='mb-4 border-b-2 border-brand pb-2 text-lg font-bold'>
              সর্বাধিক পঠিত
            </h2>
            <div className='space-y-4'>
              {dummyNews.latest.slice(0, 5).map((n, i) => (
                <div key={n.id} className='flex gap-3'>
                  <span className='text-2xl font-bold text-gray-300'>
                    {i + 1}
                  </span>
                  <h3 className='text-sm font-semibold leading-snug hover:text-brand'>
                    {n.title}
                  </h3>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
