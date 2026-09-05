import axiosInstance from './axiosInstance'

export const bookingsApi = {
  createBooking:   (data)      => axiosInstance.post('/bookings', data),
  getUserBookings: (userId)    => axiosInstance.get(`/users/${userId}/bookings`),
  cancelBooking:   (bookingId) => axiosInstance.delete(`/bookings/${bookingId}`),
}
