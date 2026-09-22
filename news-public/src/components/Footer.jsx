import Link from 'next/link'

export default function Footer ({
  siteName = 'Daily News BD',
  footerText = '',
  socialLinks = {}
}) {
  return (
    <footer className='mt-10 bg-ink text-gray-300'>
      <div className='container-main grid grid-cols-1 gap-8 py-10 md:grid-cols-3'>
        <div>
          <h3 className='mb-3 text-xl font-bold text-white'>{siteName}</h3>
          <p className='text-sm text-gray-400'>
            {footerText || 'বাংলাদেশের নির্ভরযোগ্য নিউজ পোর্টাল।'}
          </p>
        </div>

        <div>
          <h4 className='mb-3 font-semibold text-white'>দ্রুত লিংক</h4>
          <ul className='space-y-1 text-sm'>
            <li>
              <Link href='/' className='hover:text-white'>
                হোম
              </Link>
            </li>
            <li>
              <Link href='/about' className='hover:text-white'>
                আমাদের সম্পর্কে
              </Link>
            </li>
            <li>
              <Link href='/contact' className='hover:text-white'>
                যোগাযোগ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='mb-3 font-semibold text-white'>সামাজিক যোগাযোগ</h4>
          <div className='flex gap-3 text-sm'>
            {socialLinks.facebook_url && (
              <a
                href={socialLinks.facebook_url}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white'
              >
                Facebook
              </a>
            )}
            {socialLinks.youtube_url && (
              <a
                href={socialLinks.youtube_url}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white'
              >
                YouTube
              </a>
            )}
            {socialLinks.twitter_url && (
              <a
                href={socialLinks.twitter_url}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-white'
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>

      <div className='border-t border-gray-700 py-4 text-center text-xs text-gray-500'>
        © {new Date().getFullYear()} {siteName} — সর্বস্বত্ব সংরক্ষিত
        <h4>Developed by: MD FAYSAL AHMED BHUIYAN</h4>
      </div>
    </footer>
  )
}
