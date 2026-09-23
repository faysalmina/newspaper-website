import api from './axios'

export const forgotPassword = email => api.post('/forgot-password', { email })
export const resetPassword = data => api.post('/reset-password', data)
export const resetAdminPassword = (adminId, password = null) =>
  api.post(`/super-admin/admins/${adminId}/reset-password`, { password })
