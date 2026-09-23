import type { Metadata } from 'next'
import NewsCard from '../../components/NewsCard'
import { fetchAPI } from '../../lib/api'

type Props = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata ({
  searchParams
}: Props): Promise<Metadata> {
  const { q } = await searchParams
  return { title: q ? `"${q}" এর সার্চ ফলাফল` : 'সার্চ' }
}

export default async function SearchPage ({ searchParams }: Props) {
  const { q } = await searchParams

  if (!q) {
    return (
      <main className='container-main py-16 text-center text-gray-500'>
        অনুসন্ধান করতে উপরে সার্চ বক্সে লিখুন।
      </main>
    )
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(
    `${API_URL}/public/news?search=${encodeURIComponent(q)}`,
    {
      next: { revalidate: 30 }
    }
  )
  const results = res.ok ? await res.json() : { data: [] }

  return (
    <main className='container-main py-8'>
      <h1 className='mb-6 border-b-2 border-brand pb-2 text-xl font-bold'>
        "{q}" এর জন্য {results.total ?? results.data.length} টি ফলাফল
      </h1>

      {results.data.length === 0 ? (
        <p className='text-gray-500'>
          কোনো নিউজ পাওয়া যায়নি। ভিন্ন শব্দ দিয়ে চেষ্টা করুন।
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {results.data.map((n: any) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
      )}
    </main>
  )
}
