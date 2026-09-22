import api from './axios'

export const getNews = (page = 1) => api.get(`/news?page=${page}`)
export const getSingleNews = id => api.get(`/news/${id}`)
export const getCategories = () => api.get('/categories')
export const getTags = () => api.get('/tags')

export const createNews = formData =>
  api.post('/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const updateNews = (id, formData) => {
  formData.append('_method', 'PUT') // Laravel method-spoofing (PHP PUT+multipart সমস্যা এড়াতে)
  return api.post(`/news/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteNews = id => api.delete(`/news/${id}`)
