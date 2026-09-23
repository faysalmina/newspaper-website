import { getPublicSettings } from '../../lib/api'

export const metadata = { title: 'যোগাযোগ করুন' }

export default async function ContactPage () {
  const settings = await getPublicSettings().catch(() => ({}))

  return (
    <main className='container-main py-10'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='mb-6 border-b-2 border-brand pb-2 text-2xl font-bold'>
          যোগাযোগ করুন
        </h1>

        <div className='space-y-4 rounded bg-white p-6 shadow'>
          <div>
            <p className='text-sm text-gray-500'>ইমেইল</p>
            <p className='text-lg font-medium'>
              {settings.contact_email || '—'}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>ফোন</p>
            <p className='text-lg font-medium'>
              {settings.contact_phone || '—'}
            </p>
          </div>

          {(settings.facebook_url ||
            settings.youtube_url ||
            settings.twitter_url) && (
            <div>
              <p className='mb-2 text-sm text-gray-500'>সোশ্যাল মিডিয়া</p>
              <div className='flex gap-3 text-sm'>
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-brand hover:underline'
                  >
                    Facebook
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-brand hover:underline'
                  >
                    YouTube
                  </a>
                )}
                {settings.twitter_url && (
                  <a
                    href={settings.twitter_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-brand hover:underline'
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
