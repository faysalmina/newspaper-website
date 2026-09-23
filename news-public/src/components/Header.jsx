import Link from 'next/link'
import SearchBar from './SearchBar'

export default function Header ({
  siteName = 'Daily News BD',
  tagline = '',
  categories = []
}) {
  const today = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <div className='bg-navy-dark py-1.5 text-center text-xs text-gray-300'>
        {today}
      </div>

      <div className='container-main flex items-center justify-between gap-4 py-5'>
        <Link href='/' className='shrink-0'>
          <div className='text-4xl font-extrabold text-brand'>{siteName}</div>
          {tagline && <p className='mt-0.5 text-sm text-gray-500'>{tagline}</p>}
        </Link>
        <SearchBar />
      </div>

      {/* বড় করা হয়েছে, রঙ লাল থেকে নেভি করা হয়েছে — চোখে কম লাগবে */}
      <nav className='border-t border-b bg-navy'>
        <div className='container-main flex items-center gap-1 overflow-x-auto'>
          <Link
            href='/'
            className='whitespace-nowrap px-5 py-3.5 text-base font-semibold text-white hover:bg-white/10'
          >
            হোম
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${encodeURIComponent(cat.slug)}`}
              className='whitespace-nowrap px-5 py-3.5 text-base font-semibold text-white hover:bg-white/10'
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <div className='container-main py-2.5 md:hidden'>
          <SearchBar mobile />
        </div>
      </nav>
    </header>
  )
}
