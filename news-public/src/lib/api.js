const API_URL = process.env.NEXT_PUBLIC_API_URL

export { fetchAPI }
async function fetchAPI (endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`API error: ${res.status} ${endpoint}`)
  }

  return res.json()
}

export const getAllEpapers = (page = 1) =>
  fetchAPI(`/public/epapers?page=${page}`)
export const getLatestEpaper = () => fetchAPI('/public/epapers/latest')
export const getLatestVideos = () => fetchAPI('/public/videos/latest')
export const getVideoBySlug = slug =>
  fetchAPI(`/public/videos/${encodeURIComponent(slug)}`)
export const getAllVideos = (page = 1) =>
  fetchAPI(`/public/videos?page=${page}`)
export const getHomeSections = () => fetchAPI('/public/news/home-sections')
export const getPublicSettings = () => fetchAPI('/public-settings')
export const getCategories = () => fetchAPI('/public/categories')
export const getHomeFeed = () => fetchAPI('/public/news/featured')
export const getNewsByCategory = (slug, page = 1) =>
  fetchAPI(`/public/news/category/${encodeURIComponent(slug)}?page=${page}`)
export const getNewsBySlug = slug =>
  fetchAPI(`/public/news/${encodeURIComponent(slug)}`)
export const getAllNews = (page = 1) => fetchAPI(`/public/news?page=${page}`)

export function imageUrl (path) {
  if (!path) return '/placeholder-news.jpg'
  return `${process.env.NEXT_PUBLIC_STORAGE_URL}/${path}`
}

export function formatDate (dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
export const getSitemapData = () => fetchAPI('/public/news/sitemap-data')
export const getFeedNews = () => fetchAPI('/public/news/feed')
