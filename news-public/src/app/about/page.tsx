import { getPublicSettings } from '../../lib/api'

export const metadata = { title: 'আমাদের সম্পর্কে' }

export default async function AboutPage () {
  const settings = await getPublicSettings().catch(() => ({}))

  return (
    <main className='container-main py-10'>
      <div className='mx-auto max-w-3xl'>
        <h1 className='mb-6 border-b-2 border-brand pb-2 text-2xl font-bold'>
          আমাদের সম্পর্কে
        </h1>

        <div className='prose prose-lg max-w-none leading-relaxed text-gray-700'>
          <p>
            <strong>{settings.site_name || 'Daily News BD'}</strong> বাংলাদেশের
            একটি নির্ভরযোগ্য অনলাইন নিউজ পোর্টাল। আমরা দেশ-বিদেশের সর্বশেষ ও
            নির্ভুল সংবাদ পাঠকের কাছে দ্রুততম সময়ে পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।
          </p>
          <p>
            জাতীয়, রাজনীতি, আন্তর্জাতিক, অর্থনীতি, খেলাধুলা, বিনোদন ও
            প্রযুক্তিসহ বিভিন্ন বিভাগে আমরা নিয়মিত সংবাদ প্রকাশ করে থাকি।
            আমাদের লক্ষ্য সঠিক তথ্য, নিরপেক্ষ বিশ্লেষণ এবং দ্রুত সংবাদ পরিবেশন।
          </p>
        </div>
      </div>
    </main>
  )
}
