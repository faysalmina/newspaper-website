import { getFeedNews } from '../../lib/api'

function escapeXml (str: string = ''): string {
  return str.replace(
    /[<>&'"]/g,
    c =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;'
      }[c] || c)
  )
}

export async function GET () {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const news = await getFeedNews().catch(() => [])

  const items = (news || [])
    .map(
      (n: any) => `
    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${siteUrl}/${n.category_slug}/${n.slug}</link>
      <guid>${siteUrl}/${n.category_slug}/${n.slug}</guid>
      <pubDate>${new Date(n.published_at).toUTCString()}</pubDate>
      <description>${escapeXml(n.excerpt || '')}</description>
      <category>${escapeXml(n.category_name || '')}</category>
    </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Daily News BD</title>
    <link>${siteUrl}</link>
    <description>বাংলাদেশের নির্ভরযোগ্য নিউজ পোর্টাল</description>
    <language>bn-BD</language>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  })
}
