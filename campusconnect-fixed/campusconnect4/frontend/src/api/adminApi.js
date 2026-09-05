import axiosInstance from './axiosInstance'

export const adminApi = {
  // Stats
  getStats:       ()    => axiosInstance.get('/admin/stats'),
  // Colleges
  createCollege:  (d)   => axiosInstance.post('/admin/colleges', d),
  getColleges:    ()    => axiosInstance.get('/admin/colleges'),
  deleteCollege:  (id)  => axiosInstance.delete(`/admin/colleges/${id}`),
  // Users
  getAllUsers:    ()    => axiosInstance.get('/admin/users'),
  deleteUser:    (id)  => axiosInstance.delete(`/admin/users/${id}`),
  // Events
  getAllEvents:   ()    => axiosInstance.get('/admin/events'),
  deleteEvent:   (id)  => axiosInstance.delete(`/admin/events/${id}`),
  // Search
  search:        (q)   => axiosInstance.get(`/admin/search?q=${encodeURIComponent(q)}`),
}
