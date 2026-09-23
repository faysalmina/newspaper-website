import api from './axios'

export const getVideos = (page = 1) => api.get(`/videos?page=${page}`)
export const getSingleVideo = id => api.get(`/videos/${id}`)
export const createVideo = formData =>
  api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const updateVideo = (id, formData) => {
  formData.append('_method', 'PUT')
  return api.post(`/videos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const deleteVideo = id => api.delete(`/videos/${id}`)
