import Link from 'next/link'

const staticCategories = [
  { name: 'জাতীয়', slug: 'জাতীয়' },
  { name: 'রাজনীতি', slug: 'রাজনীতি' },
  { name: 'আন্তর্জাতিক', slug: 'আন্তর্জাতিক' },
  { name: 'অর্থনীতি', slug: 'অর্থনীতি' },
  { name: 'খেলা', slug: 'খেলা' },
  { name: 'বিনোদন', slug: 'বিনোদন' },
  { name: 'প্রযুক্তি', slug: 'প্রযুক্তি' },
  { name: 'মতামত', slug: 'মতামত' }
]

export default function Header ({ siteName = 'Daily News BD', tagline = '' }) {
  const today = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      {/* টপ বার — তারিখ */}
      <div className='bg-ink py-1.5 text-center text-xs text-gray-300'>
        {today}
      </div>

      {/* লোগো এরিয়া */}
      <div className='container-main flex items-center justify-between py-4'>
        <Link href='/' className='text-3xl font-extrabold text-brand'>
          {siteName}
        </Link>
        {tagline && (
          <p className='hidden text-sm text-gray-500 md:block'>{tagline}</p>
        )}
      </div>

      {/* মেইন নেভিগেশন */}
      <nav className='border-t border-b bg-brand'>
        <div className='container-main flex gap-1 overflow-x-auto'>
          <Link
            href='/'
            className='whitespace-nowrap px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark'
          >
            হোম
          </Link>
          {staticCategories.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${encodeURIComponent(cat.slug)}`}
              className='whitespace-nowrap px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark'
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
