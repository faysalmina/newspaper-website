import api from './axios'

export const getAdmins = () => api.get('/super-admin/admins')
export const createAdmin = data => api.post('/super-admin/admins', data)
export const updateAdmin = (id, data) =>
  api.put(`/super-admin/admins/${id}`, data)
export const toggleAdminStatus = id =>
  api.post(`/super-admin/admins/${id}/toggle-status`)
export const deleteAdmin = id => api.delete(`/super-admin/admins/${id}`)
export const getActivityLogs = (page = 1) =>
  api.get(`/super-admin/activity-logs?page=${page}`)
