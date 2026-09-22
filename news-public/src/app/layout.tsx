import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getPublicSettings, getCategories } from '../lib/api'

type PublicSettings = {
  site_name?: string
  site_tagline?: string
  footer_text?: string
  facebook_url?: string
  youtube_url?: string
  twitter_url?: string
}

async function loadShellData () {
  const [settings, categories] = await Promise.all([
    getPublicSettings().catch(() => ({})),
    getCategories().catch(() => [])
  ])
  return { settings: settings || {}, categories: categories || [] }
}

export async function generateMetadata (): Promise<Metadata> {
  const { settings } = await loadShellData()
  const siteName = settings.site_name || 'Daily News BD'

  return {
    title: { default: siteName, template: `%s | ${siteName}` },
    description: settings.site_tagline || 'বাংলাদেশের নির্ভরযোগ্য নিউজ পোর্টাল'
  }
}

export default async function RootLayout ({
  children
}: {
  children: ReactNode
}) {
  const { settings, categories } = await loadShellData()

  return (
    <html lang='bn'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <Header
          siteName={settings.site_name}
          tagline={settings.site_tagline}
          categories={categories}
        />
        {children}
        <Footer
          siteName={settings.site_name}
          footerText={settings.footer_text}
          socialLinks={settings}
        />
      </body>
    </html>
  )
}
