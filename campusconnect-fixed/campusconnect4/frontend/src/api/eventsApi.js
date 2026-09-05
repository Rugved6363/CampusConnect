import axiosInstance from './axiosInstance'

export const eventsApi = {
  getEvents: (params) => axiosInstance.get('/events', { params }),
  getEventById: (id)  => axiosInstance.get(`/events/${id}`),
  getTrending: ()     => axiosInstance.get('/events/trending'),
  getColleges: ()     => axiosInstance.get('/events/colleges'),
}
