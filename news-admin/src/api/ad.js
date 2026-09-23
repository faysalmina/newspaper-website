import api from './axios'

export const getAds = () => api.get('/super-admin/ads')
export const createAd = formData =>
  api.post('/super-admin/ads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const updateAd = (id, formData) => {
  formData.append('_method', 'PUT')
  return api.post(`/super-admin/ads/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const toggleAdActive = id =>
  api.post(`/super-admin/ads/${id}/toggle-active`)
export const deleteAd = id => api.delete(`/super-admin/ads/${id}`)
