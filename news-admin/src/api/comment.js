import api from './axios'

export const getComments = (status = '') =>
  api.get(`/comments${status ? `?status=${status}` : ''}`)
export const approveComment = id => api.post(`/comments/${id}/approve`)
export const deleteComment = id => api.delete(`/comments/${id}`)
