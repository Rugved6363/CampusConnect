import axiosInstance from './axiosInstance'

export const collegeApi = {
  getMyEvents:    ()           => axiosInstance.get('/college/events'),
  createEvent:    (d)          => axiosInstance.post('/college/events', d),
  updateEvent:    (id, d)      => axiosInstance.put(`/college/events/${id}`, d),
  deleteEvent:    (id)         => axiosInstance.delete(`/college/events/${id}`),
  getSubEvents:   (parentId)   => axiosInstance.get(`/college/events/${parentId}/sub-events`),
  createSubEvent: (parentId,d) => axiosInstance.post(`/college/events/${parentId}/sub-events`, d),
}
