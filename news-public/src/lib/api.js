const API_URL = process.env.NEXT_PUBLIC_API_URL

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
