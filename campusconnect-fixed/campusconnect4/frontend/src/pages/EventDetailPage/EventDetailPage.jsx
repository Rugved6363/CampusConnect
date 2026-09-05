import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { eventsApi } from '../../api/eventsApi'
import { festivalsApi } from '../../api/festivalsApi'
import { useAuth } from '../../context/AuthContext'
import LiveSeatCounter from '../../components/LiveSeatCounter/LiveSeatCounter'
import { formatDateTime, formatPrice, categoryIcon, categoryLabel } from '../../utils/formatters'
import './EventDetailPage.css'

export default function EventDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { isAuthenticated } = useAuth()

  const [event, setEvent]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [festival, setFestival] = useState(null)   // set if this event is a festival main pass

  useEffect(() => {
    setLoading(true)
    eventsApi.getEventById(id)
      .then(res => {
        setEvent(res.data)
        // Check if this event is a festival main pass
        festivalsApi.getFestivalByEventId(id)
          .then(fr => { if (fr.status === 200) setFestival(fr.data) })
          .catch(() => {}) // 204 = not a festival, silently ignore
      })
      .catch(() => setError('Event not found or failed to load.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleBookNow() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/book/${id}` } })
    } else {
      navigate(`/book/${id}`)
    }
  }

  if (loading) return (
    <div className="page">
      <div className="container">
        <div className="detail-skeleton">
          <div className="skeleton" style={{ height: 360, borderRadius: 16, marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 80, marginBottom: 12 }} />
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="page">
      <div className="container">
        <div className="error-box" style={{ marginTop: 60 }}>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline">← Back to Events</Link>
        </div>
      </div>
    </div>
  )

  if (!event) return null

  const isFree  = !event.price || Number(event.price) === 0
  const soldOut = event.soldOut || event.availableSeats === 0

  return (
    <div className="page event-detail-page fade-in">
      {/* Banner */}
      <div className="banner-wrap">
        <img
          src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
          alt={event.title}
          className="banner-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200' }}
        />
        <div className="banner-overlay" />
        <div className="banner-content container">
          <div className="category-pill-large">
            {categoryIcon(event.category)} {categoryLabel(event.category)}
          </div>
          <h1 className="banner-title">{event.title}</h1>
          <p className="banner-college">🏛️ {event.college}</p>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          {/* Left — info */}
          <div className="detail-main">
            <Link to="/" className="back-link">← Back to Events</Link>

            {/* Key details */}
            <div className="info-cards">
              <div className="info-card">
                <span className="info-icon">📅</span>
                <div>
                  <p className="info-label">Date & Time</p>
                  <p className="info-value">{formatDateTime(event.dateTime)}</p>
                </div>
              </div>
              <div className="info-card">
                <span className="info-icon">📍</span>
                <div>
                  <p className="info-label">Venue</p>
                  <p className="info-value">{event.venue || 'TBA'}</p>
                </div>
              </div>
              <div className="info-card">
                <span className="info-icon">🎟️</span>
                <div>
                  <p className="info-label">Entry</p>
                  <p className="info-value" style={{ color: isFree ? 'var(--success)' : 'inherit' }}>
                    {formatPrice(event.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h2 className="detail-section-title">About This Event</h2>
              <p className="detail-description">{event.description || 'No description provided.'}</p>
            </div>

            {/* ── Festival Sub-Events Banner (only for festival main passes) ── */}
            {festival && (
              <div className="festival-subevent-banner">
                <div className="fsb-content">
                  <div className="fsb-icon">🎪</div>
                  <div className="fsb-text">
                    <h3 className="fsb-title">This is a Festival Pass</h3>
                    <p className="fsb-desc">
                      <strong>{festival.name}</strong> has <strong>{festival.categories?.length} event tracks</strong> with
                      individually bookable concerts, workshops, competitions, and more — across 4 days.
                      The Main Pass gives you campus entry; book sub-events separately.
                    </p>
                    <div className="fsb-track-pills">
                      {festival.categories?.slice(0, 5).map(c => (
                        <span key={c.id} className="fsb-track-pill">
                          {c.icon} {c.name}
                        </span>
                      ))}
                      {festival.categories?.length > 5 && (
                        <span className="fsb-track-pill fsb-more">
                          +{festival.categories.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/festivals/${festival.id}`}
                  className="btn btn-primary fsb-explore-btn"
                >
                  🗂️ Explore All Sub-Events →
                </Link>
              </div>
            )}
          </div>

          {/* Right — booking sidebar */}
          <div className="detail-sidebar">
            {/* Live seat counter */}
            <LiveSeatCounter
              eventId={event.id}
              initialSeats={event.availableSeats}
              totalSeats={event.totalSeats}
            />

            {/* Price + CTA */}
            <div className="booking-card">
              <div className="booking-price-row">
                <span className="booking-price-label">Ticket Price</span>
                <span className={`booking-price-value ${isFree ? 'free' : ''}`}>
                  {formatPrice(event.price)}
                </span>
              </div>

              <button
                className="btn btn-primary book-btn"
                onClick={handleBookNow}
                disabled={soldOut}
              >
                {soldOut ? '🔴 Sold Out' : isAuthenticated ? '🎟️ Book Now' : '🔒 Login to Book'}
              </button>

              {!isAuthenticated && !soldOut && (
                <p className="booking-note">
                  <Link to="/login">Create an account</Link> to book tickets.
                </p>
              )}

              {soldOut && (
                <p className="booking-note sold-out-note">
                  This event is sold out. Check back for cancellations.
                </p>
              )}
            </div>

            {/* Share */}
            <button
              className="btn btn-outline share-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                  .then(() => alert('Link copied!'))
                  .catch(() => {})
              }}
            >
              🔗 Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
