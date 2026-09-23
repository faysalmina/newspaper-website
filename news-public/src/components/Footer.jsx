import Link from 'next/link'
import AdSlot from './AdSlot'

export default async function Footer ({ settings = {} }) {
  const siteName = settings.site_name || 'Daily News BD'

  const socials = [
    { key: 'facebook_url', label: 'Facebook' },
    { key: 'twitter_url', label: 'Twitter/X' },
    { key: 'instagram_url', label: 'Instagram' },
    { key: 'youtube_url', label: 'YouTube' },
    { key: 'linkedin_url', label: 'LinkedIn' }
  ].filter(s => settings[s.key])

  return (
    <footer className='mt-10 border-t bg-gray-50'>
      <div className='border-b py-4'>
        <AdSlot position='footer' />
      </div>
      <div className='container-main grid grid-cols-1 gap-8 py-10 md:grid-cols-3'>
        <div>
          <div className='text-2xl font-extrabold text-brand'>{siteName}</div>
          {settings.site_tagline && (
            <p className='mt-1 text-sm text-gray-500'>
              {settings.site_tagline}
            </p>
          )}
          {settings.footer_text && (
            <p className='mt-3 text-sm text-gray-600'>{settings.footer_text}</p>
          )}
        </div>

        <div className='text-sm text-gray-600'>
          {settings.editor_name && (
            <p>
              <strong>সম্পাদক:</strong> {settings.editor_name}
            </p>
          )}
          {settings.address && <p className='mt-2'>{settings.address}</p>}
          {settings.contact_phone && (
            <p className='mt-2'>ফোন: {settings.contact_phone}</p>
          )}
          {settings.contact_email && (
            <p className='mt-1'>ইমেইল: {settings.contact_email}</p>
          )}
        </div>

        <div>
          <h4 className='mb-3 font-semibold text-gray-800'>সামাজিক যোগাযোগ</h4>
          <div className='flex flex-wrap gap-3 text-sm'>
            {socials.map(s => (
              <a
                key={s.key}
                href={settings[s.key]}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded border border-gray-300 px-3 py-1.5 text-gray-600 hover:border-brand hover:text-brand'
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className='mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500'>
            <Link href='/about' className='hover:text-brand'>
              আমাদের সম্পর্কে
            </Link>
            <Link href='/contact' className='hover:text-brand'>
              যোগাযোগ
            </Link>
            <a href='/rss.xml' className='hover:text-brand'>
              RSS
            </a>
            <a href='/sitemap.xml' className='hover:text-brand'>
              সাইটম্যাপ
            </a>
          </div>
        </div>
      </div>

      <div className='bg-navy-dark py-4 text-center text-xs text-gray-300'>
        © {new Date().getFullYear()} {siteName} — সর্বস্বত্ব সংরক্ষিত
        <h5>Developed by MD FAYSAL AHMED BHUIYAN</h5>
      </div>
    </footer>
  )
}
