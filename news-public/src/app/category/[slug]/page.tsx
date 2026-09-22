import type { Metadata } from 'next'
import NewsCard from '../../../components/NewsCard'
import { getNewsByCategory } from '../../../lib/api'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getNewsByCategory(slug).catch(() => null)
  if (!data) return { title: 'ক্যাটাগরি পাওয়া যায়নি' }

  return {
    title: data.category.name,
    description: `${data.category.name} বিভাগের সর্বশেষ সব সংবাদ`
  }
}

export default async function CategoryPage ({ params }: Props) {
  const { slug } = await params
  const data = await getNewsByCategory(slug).catch(() => null)

  if (!data) notFound()

  const { category, news } = data

  return (
    <main className='container-main py-8'>
      <h1 className='mb-6 border-b-2 border-brand pb-2 text-2xl font-bold'>
        {category.name}
      </h1>

      {news.data.length === 0 ? (
        <p className='text-gray-500'>এই বিভাগে এখনো কোনো নিউজ নেই।</p>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {news.data.map((n: any) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
      )}
    </main>
  )
}
