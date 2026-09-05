import axiosInstance from './axiosInstance'

export const festivalsApi = {
  // Public
  getAllFestivals:       ()                         => axiosInstance.get('/festivals'),
  getFestivalById:      (id)                        => axiosInstance.get(`/festivals/${id}`),
  getFestivalByEventId: (eventId)                   => axiosInstance.get(`/festivals/by-event/${eventId}`),

  // College management
  getMyFestivals:       ()                          => axiosInstance.get('/festivals/my'),
  createFestival:       (data)                      => axiosInstance.post('/festivals', data),
  deleteFestival:       (id)                        => axiosInstance.delete(`/festivals/${id}`),
  addCategory:          (festivalId, data)          => axiosInstance.post(`/festivals/${festivalId}/categories`, data),
  deleteCategory:       (festivalId, catId)         => axiosInstance.delete(`/festivals/${festivalId}/categories/${catId}`),
  addSubEvent:          (festivalId, catId, data)   => axiosInstance.post(`/festivals/${festivalId}/categories/${catId}/sub-events`, data),
}
