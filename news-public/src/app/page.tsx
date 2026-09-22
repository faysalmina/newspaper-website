import Link from 'next/link'
import BreakingTicker from '../components/BreakingTicker'
import NewsCard from '../components/NewsCard'
import { getHomeFeed } from '../lib/api'

export default async function HomePage () {
  const feed = await getHomeFeed().catch(() => null)

  if (!feed || !feed.featured) {
    return (
      <main className='container-main py-16 text-center'>
        <p className='text-lg text-gray-500'>এখনো কোনো নিউজ প্রকাশিত হয়নি।</p>
        <p className='mt-2 text-sm text-gray-400'>
          অ্যাডমিন প্যানেল থেকে নিউজ পোস্ট করুন — এখানে অটোমেটিক দেখা যাবে।
        </p>
      </main>
    )
  }

  return (
    <main>
      <BreakingTicker items={feed.breaking || []} />

      <div className='container-main py-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <NewsCard news={feed.featured} size='large' />

            <div className='mt-8 mb-4 flex items-center justify-between border-b-2 border-brand pb-2'>
              <h2 className='text-lg font-bold'>সর্বশেষ সংবাদ</h2>
              <Link
                href='/latest'
                className='text-xs text-gray-500 hover:text-brand'
              >
                সব দেখুন →
              </Link>
            </div>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
              {feed.latest.map((n: any) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </div>

          <aside>
            <h2 className='mb-4 border-b-2 border-brand pb-2 text-lg font-bold'>
              সর্বাধিক পঠিত
            </h2>
            <div className='space-y-4'>
              {feed.most_read.map((n: any, i: number) => (
                <Link
                  key={n.id}
                  href={`/${n.category_slug}/${n.slug}`}
                  className='flex gap-3 group'
                >
                  <span className='text-2xl font-bold text-gray-300'>
                    {i + 1}
                  </span>
                  <h3 className='text-sm font-semibold leading-snug group-hover:text-brand'>
                    {n.title}
                  </h3>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
