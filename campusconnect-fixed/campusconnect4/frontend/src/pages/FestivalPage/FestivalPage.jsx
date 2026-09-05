import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { festivalsApi } from '../../api/festivalsApi'
import { useAuth } from '../../context/AuthContext'
import { formatDateTime, formatPrice, formatDate } from '../../utils/formatters'
import './FestivalPage.css'

export default function FestivalPage() {
  const { id }            = useParams()
  const navigate          = useNavigate()
  const { isAuthenticated } = useAuth()

  const [festival, setFestival] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [openCats, setOpenCats] = useState({})  // which categories are expanded

  useEffect(() => {
    festivalsApi.getFestivalById(id)
      .then(res => {
        setFestival(res.data)
        // Open first category by default
        if (res.data.categories?.length > 0) {
          setOpenCats({ [res.data.categories[0].id]: true })
        }
      })
      .catch(() => setError('Festival not found or failed to load.'))
      .finally(() => setLoading(false))
  }, [id])

  function toggleCat(catId) {
    setOpenCats(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  function handleBook(subEventId) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/book/${subEventId}` } })
    } else {
      navigate(`/book/${subEventId}`)
    }
  }

  function handleBookMainPass() {
    if (!festival?.mainEventId) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/book/${festival.mainEventId}` } })
    } else {
      navigate(`/book/${festival.mainEventId}`)
    }
  }

  // ── Loading ──
  if (loading) return (
    <div className="page festival-page">
      <div className="container">
        <div className="fst-hero-skeleton">
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
        </div>
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  )

  // ── Error ──
  if (error) return (
    <div className="page festival-page">
      <div className="container">
        <div className="error-box" style={{ marginTop: 60 }}>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline">← Back to Events</Link>
        </div>
      </div>
    </div>
  )

  if (!festival) return null

  const totalSubEvents = festival.categories.reduce(
    (sum, c) => sum + (c.subEvents?.length || 0), 0
  )

  return (
    <div className="page festival-page fade-in">

      {/* ── Hero Banner ── */}
      <div className="fst-hero">
        <img
          src={festival.posterUrl}
          alt={festival.name}
          className="fst-hero-img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200' }}
        />
        <div className="fst-hero-overlay" />
        <div className="fst-hero-content container">
          <span className="fst-edition-badge">{festival.edition}</span>
          <h1 className="fst-hero-title">{festival.name}</h1>
          <p className="fst-hero-college">🏛️ {festival.college}</p>
          <p className="fst-hero-dates">
            📅 {formatDate(festival.startDate)} – {formatDate(festival.endDate)}
          </p>
          <p className="fst-hero-venue">📍 {festival.venue}</p>
        </div>
      </div>

      <div className="container">
        <Link to={`/events/${festival.mainEventId}`} className="back-link">
          ← Back to {festival.mainEventTitle}
        </Link>

        {/* ── Info strip ── */}
        <div className="fst-info-strip">
          <div className="fst-info-pill">
            <span className="fst-info-icon">🎪</span>
            <span>{festival.categories.length} Event Tracks</span>
          </div>
          <div className="fst-info-pill">
            <span className="fst-info-icon">🎟️</span>
            <span>{totalSubEvents} Bookable Sub-Events</span>
          </div>
          <div className="fst-info-pill">
            <span className="fst-info-icon">📅</span>
            <span>4-Day Festival</span>
          </div>
          {festival.websiteUrl && (
            <a
              href={festival.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="fst-info-pill fst-info-link"
            >
              <span className="fst-info-icon">🌐</span>
              <span>Official Site</span>
            </a>
          )}
        </div>

        {/* ── Description + Main Pass CTA ── */}
        <div className="fst-about-row">
          <div className="fst-about-text">
            <h2 className="fst-section-title">About the Festival</h2>
            <p>{festival.description}</p>
          </div>

          {/* Main pass card — always prominent */}
          <div className="fst-mainpass-card">
            <div className="fst-mainpass-header">
              <span className="fst-mainpass-badge">⭐ Main Festival Pass</span>
            </div>
            <p className="fst-mainpass-desc">
              Required for campus entry. Includes access to all free sub-events,
              exhibitions, food zone, and flea market across all 4 days.
            </p>
            <p className="fst-mainpass-note">
              🎟️ Individual paid sub-events (concerts, workshops, etc.) need
              separate tickets in addition to the Main Pass.
            </p>
            <div className="fst-mainpass-actions">
              <Link
                to={`/events/${festival.mainEventId}`}
                className="btn btn-outline fst-mainpass-view"
              >
                View Pass Details
              </Link>
              <button
                className="btn btn-primary fst-mainpass-book"
                onClick={handleBookMainPass}
              >
                🎟️ Book Main Pass
              </button>
            </div>
          </div>
        </div>

        {/* ── Category Accordion ── */}
        <h2 className="fst-section-title fst-events-heading">
          🗂️ All Events &amp; Sub-Events
        </h2>
        <p className="fst-events-subtext">
          Expand each track to see all events. Click "Book" to reserve your spot.
        </p>

        <div className="fst-accordion">
          {festival.categories.map(cat => {
            const isOpen = !!openCats[cat.id]
            const available = cat.subEvents?.filter(e => !e.soldOut).length || 0
            return (
              <div key={cat.id} className={`fst-cat ${isOpen ? 'open' : ''}`}>

                {/* Category header (clickable) */}
                <button
                  className="fst-cat-header"
                  onClick={() => toggleCat(cat.id)}
                >
                  <div className="fst-cat-left">
                    <span className="fst-cat-icon">{cat.icon}</span>
                    <div>
                      <span className="fst-cat-name">{cat.name}</span>
                      <span className="fst-cat-count">
                        {cat.subEvents?.length || 0} events
                        {available > 0
                          ? ` · ${available} available`
                          : ' · Sold out'}
                      </span>
                    </div>
                  </div>
                  <span className={`fst-chevron ${isOpen ? 'up' : 'down'}`}>›</span>
                </button>

                {/* Sub-events grid */}
                {isOpen && (
                  <div className="fst-subevent-grid">
                    {(cat.subEvents || []).map(sub => (
                      <SubEventCard
                        key={sub.id}
                        sub={sub}
                        onBook={() => handleBook(sub.id)}
                        isAuthenticated={isAuthenticated}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="fst-bottom-cta">
          <p>Ready to join Asia's biggest college fest?</p>
          <button className="btn btn-primary" onClick={handleBookMainPass}>
            🎟️ Get Your Main Pass – {festival.mainEventTitle}
          </button>
          <Link to="/" className="btn btn-outline">Explore Other Events</Link>
        </div>
      </div>
    </div>
  )
}

// ── SubEventCard component ──
function SubEventCard({ sub, onBook, isAuthenticated }) {
  const isFree  = !sub.price || Number(sub.price) === 0
  const soldOut = sub.soldOut || sub.availableSeats === 0
  const lowSeats = !soldOut && sub.availableSeats <= 20

  return (
    <div className={`fst-sub-card ${soldOut ? 'sold-out' : ''}`}>
      <div className="fst-sub-poster-wrap">
        <img
          src={sub.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
          alt={sub.title}
          className="fst-sub-poster"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' }}
          loading="lazy"
        />
        {soldOut && <div className="fst-sub-soldout-badge">SOLD OUT</div>}
      </div>

      <div className="fst-sub-body">
        <h4 className="fst-sub-title">{sub.title}</h4>
        <p className="fst-sub-desc">{sub.description}</p>

        <div className="fst-sub-meta">
          <span className="fst-sub-meta-item">📅 {formatDateTime(sub.dateTime)}</span>
          <span className="fst-sub-meta-item">📍 {sub.venue || 'TBA'}</span>
        </div>

        <div className="fst-sub-footer">
          <div className="fst-sub-price-seats">
            <span className={`fst-sub-price ${isFree ? 'free' : ''}`}>
              {formatPrice(sub.price)}
            </span>
            <span className={`fst-sub-seats ${soldOut ? 'sold' : ''} ${lowSeats ? 'low' : ''}`}>
              {soldOut
                ? '🔴 Sold Out'
                : lowSeats
                  ? `⚡ Only ${sub.availableSeats} left`
                  : `🪑 ${sub.availableSeats} seats`}
            </span>
          </div>

          <div className="fst-sub-actions">
            <Link
              to={`/events/${sub.id}`}
              className="btn btn-outline fst-sub-detail-btn"
            >
              Details
            </Link>
            <button
              className="btn btn-primary fst-sub-book-btn"
              onClick={onBook}
              disabled={soldOut}
            >
              {soldOut ? 'Sold Out' : isAuthenticated ? 'Book' : 'Login to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
