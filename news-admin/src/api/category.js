import api from './axios'

export const getCategories = () => api.get('/categories')
export const createCategory = data => api.post('/super-admin/categories', data)
export const updateCategory = (id, data) =>
  api.put(`/super-admin/categories/${id}`, data)
export const deleteCategory = id => api.delete(`/super-admin/categories/${id}`)
