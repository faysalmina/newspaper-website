import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShareButtons from '../../../components/ShareButtons'
import NewsCard from '../../../components/NewsCard'
import { getNewsBySlug, imageUrl, formatDate } from '../../../lib/api'
import AdSlot from '../../../components/AdSlot'

type Props = { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getNewsBySlug(slug).catch(() => null)
  if (!data) return { title: 'নিউজ পাওয়া যায়নি' }

  const n = data.news
  const title = n.meta_title || n.title
  const description = n.meta_description || n.excerpt || ''
  const image = n.og_image || n.featured_image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: n.published_at,
      images: image ? [imageUrl(image)] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [imageUrl(image)] : []
    }
  }
}

export default async function SingleNewsPage ({ params }: Props) {
  const { slug } = await params
  const data = await getNewsBySlug(slug).catch(() => null)

  if (!data) notFound()

  const { news, related } = data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const pageUrl = `${siteUrl}/${news.category_slug}/${news.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    image: [imageUrl(news.featured_image)],
    datePublished: news.published_at,
    author: [{ '@type': 'Person', name: news.author_name || 'Daily News BD' }],
    description: news.excerpt || news.meta_description || ''
  }

  return (
    <main className='container-main py-8'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <article className='lg:col-span-2'>
          <nav className='mb-3 text-xs text-gray-500'>
            <Link href='/' className='hover:text-brand'>
              হোম
            </Link>
            {' / '}
            <Link
              href={`/category/${news.category_slug}`}
              className='hover:text-brand'
            >
              {news.category_name}
            </Link>
          </nav>

          <h1 className='text-2xl font-bold leading-snug md:text-3xl'>
            {news.title}
          </h1>

          <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500'>
            <span>{news.author_name}</span>
            <span>•</span>
            <span>{formatDate(news.published_at)}</span>
            <span>•</span>
            <span>{news.views_count} বার পঠিত</span>
          </div>

          {news.featured_image && (
            <div className='relative mt-5 aspect-video overflow-hidden rounded bg-gray-100'>
              <Image
                src={imageUrl(news.featured_image)}
                alt={news.title}
                fill
                priority
                className='object-cover'
                unoptimized
              />
            </div>
          )}

          <div
            className='prose prose-lg mt-6 max-w-none leading-relaxed'
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
          <div className='my-6'>
            <AdSlot position='in_article' />
          </div>

          {news.tags?.length > 0 && (
            <div className='mt-6 flex flex-wrap gap-2'>
              {news.tags.map((tag: string) => (
                <span
                  key={tag}
                  className='rounded bg-gray-100 px-3 py-1 text-xs text-gray-600'
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className='mt-6 border-t pt-4'>
            <p className='mb-2 text-sm font-medium text-gray-700'>
              শেয়ার করুন
            </p>
            <ShareButtons url={pageUrl} title={news.title} />
          </div>
        </article>

        <aside>
          <h2 className='mb-4 border-b-2 border-brand pb-2 text-lg font-bold'>
            সম্পর্কিত সংবাদ
          </h2>
          <div className='space-y-4'>
            {related.map((n: any) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
