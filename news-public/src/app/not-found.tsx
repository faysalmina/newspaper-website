import Link from 'next/link'

export default function NotFound () {
  return (
    <main className='container-main flex min-h-[60vh] flex-col items-center justify-center text-center py-16'>
      <h1 className='text-6xl font-extrabold text-brand'>৪০৪</h1>
      <p className='mt-4 text-lg text-gray-600'>
        দুঃখিত, এই পেজটি খুঁজে পাওয়া যায়নি।
      </p>
      <Link
        href='/'
        className='mt-6 rounded bg-brand px-6 py-2.5 text-white hover:bg-brand-dark'
      >
        হোমপেজে ফিরে যান
      </Link>
    </main>
  )
}
