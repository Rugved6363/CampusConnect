import { useState, useEffect, useCallback } from 'react'
import { eventsApi } from '../../api/eventsApi'
import EventCard from '../../components/EventCard/EventCard'
import FilterBar from '../../components/FilterBar/FilterBar'
import './HomePage.css'

export default function HomePage() {
  const [events, setEvents]     = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [pagination, setPagination] = useState({ totalPages: 0, totalElements: 0, number: 0 })
  const [filters, setFilters]   = useState({ category: '', college: '', page: 0, size: 12 })

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.category) params.category = filters.category
      if (filters.college)  params.college  = filters.college
      params.page = filters.page
      params.size = filters.size

      const res = await eventsApi.getEvents(params)
      setEvents(res.data.content)
      setPagination({
        totalPages:    res.data.totalPages,
        totalElements: res.data.totalElements,
        number:        res.data.number,
      })
    } catch (err) {
      setError('Failed to load events. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  useEffect(() => {
    eventsApi.getTrending()
      .then(res => setTrending(res.data.slice(0, 4)))
      .catch(() => {})
  }, [])

  function handleFilterChange(newFilters) {
    setFilters(newFilters)
  }

  function goToPage(p) {
    setFilters(f => ({ ...f, page: p }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasActiveFilter = filters.category || filters.college

  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">🎓 Real-Time Event Discovery</p>
            <h1 className="hero-title">
              What's happening<br />
              <span className="gradient-text">on campus today?</span>
            </h1>
            <p className="hero-sub">
              Discover, explore, and book events across colleges — with live seat availability.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Trending strip (shown only when no filters active) */}
        {!hasActiveFilter && trending.length > 0 && (
          <section className="trending-section">
            <h2 className="section-title">🔥 Trending Now</h2>
            <div className="events-grid trending-grid">
              {trending.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Filter bar */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Events heading */}
        <div className="events-header">
          <h2 className="section-title">
            {hasActiveFilter ? 'Filtered Events' : 'All Upcoming Events'}
          </h2>
          {!loading && (
            <span className="events-count">{pagination.totalElements} events</span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button className="btn btn-outline" onClick={fetchEvents}>Try Again</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="events-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-skeleton">
                <div className="skeleton" style={{ paddingTop: '56.25%' }} />
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 18, borderRadius: 4, width: '75%' }} />
                  <div className="skeleton" style={{ height: 14, borderRadius: 4, width: '55%' }} />
                  <div className="skeleton" style={{ height: 14, borderRadius: 4, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events grid */}
        {!loading && !error && events.length > 0 && (
          <div className="events-grid">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && events.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎪</div>
            <h3>No Events Found</h3>
            <p>Try clearing your filters or check back soon.</p>
            <button
              className="btn btn-outline"
              style={{ marginTop: 16 }}
              onClick={() => setFilters({ category: '', college: '', page: 0, size: 12 })}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-outline"
              disabled={pagination.number === 0}
              onClick={() => goToPage(pagination.number - 1)}
            >
              ← Prev
            </button>
            <span className="page-info">
              Page {pagination.number + 1} of {pagination.totalPages}
            </span>
            <button
              className="btn btn-outline"
              disabled={pagination.number >= pagination.totalPages - 1}
              onClick={() => goToPage(pagination.number + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
