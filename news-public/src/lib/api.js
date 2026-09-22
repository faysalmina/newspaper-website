const API_URL = process.env.NEXT_PUBLIC_API_URL

async function fetchAPI (endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    next: { revalidate: 60 } // ৬০ সেকেন্ড পরপর নতুন ডেটা (ISR) — পারফরম্যান্স + freshness দুটোই
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${endpoint}`)
  }

  return res.json()
}

export const getPublicSettings = () => fetchAPI('/public-settings')
export const getCategories = () => fetchAPI('/categories')

// পরের ফেজে (Phase 8) এগুলো ব্যবহার হবে — এখনই বানিয়ে রাখছি
export const getPublishedNews = (page = 1) =>
  fetchAPI(`/news?page=${page}&status=published`)
export const getNewsBySlug = slug => fetchAPI(`/news/slug/${slug}`)
export const getNewsByCategory = (slug, page = 1) =>
  fetchAPI(`/category/${slug}?page=${page}`)
