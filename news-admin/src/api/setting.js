import api from './axios'

export const getSettings = () => api.get('/super-admin/settings')
export const updateSettings = data => api.put('/super-admin/settings', data)
