import type { MetadataRoute } from 'next';
import { getSitemapData } from '../lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const data = await getSitemapData().catch(() => ({ news: [], categories: [] }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'always', priority: 1 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (data?.categories || []).map((c: any) => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: c.updated_at,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const newsPages: MetadataRoute.Sitemap = (data?.news || [])
    .filter((n: any) => n.category_slug)
    .map((n: any) => ({
      url: `${siteUrl}/${n.category_slug}/${n.slug}`,
      lastModified: n.updated_at,
      changeFrequency: 'hourly',
      priority: 0.9,
    }));

  return [...staticPages, ...categoryPages, ...newsPages];
}