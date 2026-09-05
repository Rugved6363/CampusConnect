import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bookingsApi } from '../../api/bookingsApi'
import { useAuth } from '../../context/AuthContext'
import { formatDateTime, formatPrice } from '../../utils/formatters'
import toast from 'react-hot-toast'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, logout }      = useAuth()
  const navigate              = useNavigate()
  const [bookings, setBookings]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    bookingsApi.getUserBookings(user.id)
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleCancel(bookingId) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(bookingId)
    try {
      await bookingsApi.cancelBooking(bookingId)
      setBookings(bs => bs.map(b =>
        b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b
      ))
      toast.success('Booking cancelled. Refund initiated.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed.')
    } finally {
      setCancelling(null)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  const confirmed  = bookings.filter(b => b.status === 'CONFIRMED')
  const cancelled  = bookings.filter(b => b.status === 'CANCELLED')

  return (
    <div className="page profile-page fade-in">
      <div className="container">
        {/* Profile header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-role-badge">{user?.role}</span>
          </div>
          <button className="btn btn-outline logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">{bookings.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{confirmed.length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{cancelled.length}</span>
            <span className="stat-label">Cancelled</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">
              ₹{confirmed.reduce((s, b) => s + Number(b.totalAmount || 0), 0).toLocaleString('en-IN')}
            </span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>

        {/* Bookings section */}
        <div className="bookings-section">
          <div className="section-header-row">
            <h2 className="section-title">🎟️ My Bookings</h2>
            <Link to="/" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              + Book More
            </Link>
          </div>

          {loading && (
            <div className="loading-center" style={{ padding: '60px 0' }}>
              <div className="spinner" />
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎪</div>
              <h3>No Bookings Yet</h3>
              <p>Discover events and book your first ticket!</p>
              <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
                Explore Events
              </Link>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div
                  key={booking.bookingId}
                  className={`booking-card ${booking.status === 'CANCELLED' ? 'cancelled' : ''}`}
                >
                  <div className="booking-card-left">
                    <div className="booking-status-dot">
                      {booking.status === 'CONFIRMED' ? '🟢' : '🔴'}
                    </div>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-card-top">
                      <h3 className="booking-event-title">{booking.eventTitle}</h3>
                      <span className={`booking-status-badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-meta-row">
                      <span>🏛️ {booking.eventCollege}</span>
                      <span>📅 {formatDateTime(booking.eventDateTime)}</span>
                    </div>

                    <div className="booking-detail-row">
                      <span>
                        {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                        {booking.totalAmount && Number(booking.totalAmount) > 0
                          ? ` · ₹${Number(booking.totalAmount).toLocaleString('en-IN')}`
                          : ' · Free'}
                      </span>
                      <span className="booking-ref">{booking.paymentRef}</span>
                    </div>
                  </div>

                  <div className="booking-card-actions">
                    <Link
                      to={`/events/${booking.eventId}`}
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      View
                    </Link>
                    {booking.status === 'CONFIRMED' && (
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        onClick={() => handleCancel(booking.bookingId)}
                        disabled={cancelling === booking.bookingId}
                      >
                        {cancelling === booking.bookingId
                          ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                          : 'Cancel'
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
