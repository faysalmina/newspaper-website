import api from './axios'

export const getEpapers = () => api.get('/epapers')
export const createEpaper = formData =>
  api.post('/epapers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const deleteEpaper = id => api.delete(`/epapers/${id}`)
