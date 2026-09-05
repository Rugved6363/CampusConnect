import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { eventsApi } from '../../api/eventsApi'
import { bookingsApi } from '../../api/bookingsApi'
import { useAuth } from '../../context/AuthContext'
import PaymentSimulator from '../../components/PaymentSimulator/PaymentSimulator'
import { formatDateTime, formatPrice } from '../../utils/formatters'
import toast from 'react-hot-toast'
import './BookingPage.css'

const STEPS = ['Select Tickets', 'Payment', 'Confirmation']

export default function BookingPage() {
  const { eventId }  = useParams()
  const navigate     = useNavigate()
  const { user }     = useAuth()

  const [event, setEvent]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [step, setStep]         = useState(0)
  const [quantity, setQty]      = useState(1)
  const [booking, setBooking]   = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    eventsApi.getEventById(eventId)
      .then(res => setEvent(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [eventId, navigate])

  const totalAmount = event ? Number(event.price) * quantity : 0
  const isFree      = !event?.price || Number(event.price) === 0

  async function handlePaymentSuccess() {
    setSubmitting(true)
    try {
      const res = await bookingsApi.createBooking({ eventId: Number(eventId), quantity })
      setBooking(res.data)
      setStep(2)
      toast.success('Booking confirmed! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.'
      toast.error(msg)
      if (err.response?.status === 409) {
        // Sold out — go back
        setTimeout(() => navigate(`/events/${eventId}`), 2000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // For free events, skip payment step
  async function handleFreeBooking() {
    setSubmitting(true)
    try {
      const res = await bookingsApi.createBooking({ eventId: Number(eventId), quantity })
      setBooking(res.data)
      setStep(2)
      toast.success('Booking confirmed! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="page loading-center">
      <div className="spinner" style={{ width: 48, height: 48 }} />
    </div>
  )

  if (!event) return null

  return (
    <div className="page booking-page fade-in">
      <div className="container">
        <div className="booking-layout">
          {/* Left panel */}
          <div className="booking-main">
            <Link to={`/events/${eventId}`} className="back-link">← Back to Event</Link>

            {/* Stepper */}
            <div className="stepper">
              {STEPS.map((s, i) => (
                <div key={s} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                  <div className="step-num">{i < step ? '✓' : i + 1}</div>
                  <span className="step-label">{s}</span>
                  {i < STEPS.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>

            {/* ── STEP 0: Quantity ── */}
            {step === 0 && (
              <div className="step-panel fade-in">
                <h2 className="step-title">Select Tickets</h2>

                <div className="qty-selector">
                  <button
                    className="qty-btn"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >−</button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty(q => Math.min(5, q + 1))}
                    disabled={quantity >= 5 || quantity >= event.availableSeats}
                  >+</button>
                </div>
                <p className="qty-note">Max 5 tickets per booking · {event.availableSeats} available</p>

                <div className="order-summary">
                  <h3 className="summary-title">Order Summary</h3>
                  <div className="summary-row">
                    <span>{formatPrice(event.price)} × {quantity} ticket{quantity > 1 ? 's' : ''}</span>
                    <span>{isFree ? 'Free' : `₹${(Number(event.price) * quantity).toLocaleString('en-IN')}`}</span>
                  </div>
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <span className={isFree ? 'free' : ''}>{isFree ? 'Free' : `₹${totalAmount.toLocaleString('en-IN')}`}</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary continue-btn"
                  onClick={() => isFree ? handleFreeBooking() : setStep(1)}
                  disabled={submitting}
                >
                  {submitting
                    ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Confirming…</>
                    : isFree ? '🎟️ Confirm Free Booking' : 'Continue to Payment →'
                  }
                </button>
              </div>
            )}

            {/* ── STEP 1: Payment ── */}
            {step === 1 && (
              <div className="step-panel fade-in">
                <h2 className="step-title">Payment</h2>
                <PaymentSimulator
                  amount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  disabled={submitting}
                />
                <button className="btn btn-outline back-btn" onClick={() => setStep(0)}>
                  ← Back
                </button>
              </div>
            )}

            {/* ── STEP 2: Confirmation ── */}
            {step === 2 && booking && (
              <div className="step-panel confirmation fade-in">
                <div className="confirm-icon">🎉</div>
                <h2 className="confirm-title">Booking Confirmed!</h2>
                <p className="confirm-sub">Your tickets are secured. Have a great time!</p>

                <div className="ticket-card">
                  <div className="ticket-header">
                    <span>🎟️ TICKET</span>
                    <span className="ticket-id">#{booking.bookingId}</span>
                  </div>
                  <div className="ticket-body">
                    <div className="ticket-row">
                      <span className="ticket-label">Event</span>
                      <span className="ticket-value">{booking.eventTitle}</span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">Date</span>
                      <span className="ticket-value">{formatDateTime(booking.eventDateTime)}</span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">College</span>
                      <span className="ticket-value">{booking.eventCollege}</span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">Qty</span>
                      <span className="ticket-value">{booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">Amount</span>
                      <span className="ticket-value">
                        {!booking.totalAmount || Number(booking.totalAmount) === 0
                          ? 'Free'
                          : `₹${Number(booking.totalAmount).toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">Payment Ref</span>
                      <span className="ticket-value ref">{booking.paymentRef}</span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-label">Status</span>
                      <span className="ticket-value status-confirmed">✅ {booking.status}</span>
                    </div>
                  </div>
                </div>

                <div className="confirm-actions">
                  <Link to="/profile" className="btn btn-primary">View My Bookings</Link>
                  <Link to="/" className="btn btn-outline">Discover More Events</Link>
                </div>
              </div>
            )}
          </div>

          {/* Right — event summary */}
          {event && step < 2 && (
            <div className="booking-event-summary">
              <img
                src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'}
                alt={event.title}
                className="summary-poster"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' }}
              />
              <div className="summary-info">
                <h3 className="summary-event-title">{event.title}</h3>
                <p className="summary-college">🏛️ {event.college}</p>
                <p className="summary-datetime">📅 {formatDateTime(event.dateTime)}</p>
                <p className="summary-venue">📍 {event.venue || 'TBA'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
