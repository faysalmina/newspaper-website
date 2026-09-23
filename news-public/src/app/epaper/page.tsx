import { getAllEpapers } from '../../lib/api'

export const metadata = { title: 'ই-পেপার' }

function formatBanglaDate (dateStr: string) {
  return new Date(dateStr).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function EpaperPage () {
  const data = await getAllEpapers().catch(() => ({ data: [] }))
  const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL

  return (
    <main className='container-main py-8'>
      <h1 className='mb-6 border-b-2 border-brand pb-2 text-2xl font-bold'>
        ই-পেপার
      </h1>

      {data.data.length === 0 ? (
        <p className='text-gray-500'>এখনো কোনো ই-পেপার প্রকাশিত হয়নি।</p>
      ) : (
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5'>
          {data.data.map((ep: any) => (
            <a
              key={ep.id}
              href={`${STORAGE_URL}/${ep.pdf_file}`}
              target='_blank'
              rel='noopener noreferrer'
              className='group block overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md'
            >
              <div className='flex aspect-[3/4] items-center justify-center bg-gray-100'>
                {ep.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${STORAGE_URL}/${ep.cover_image}`}
                    alt={ep.title || ep.publish_date}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <span className='text-4xl'>📰</span>
                )}
              </div>
              <div className='p-3 text-center'>
                <p className='text-sm font-semibold group-hover:text-brand'>
                  {ep.title || 'ই-পেপার'}
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                  {formatBanglaDate(ep.publish_date)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
