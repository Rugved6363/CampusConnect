import { useSeatUpdates } from '../../hooks/useSeatUpdates'
import './LiveSeatCounter.css'

export default function LiveSeatCounter({ eventId, initialSeats, totalSeats }) {
  const { availableSeats, soldOut, connected } = useSeatUpdates(eventId, initialSeats)

  const pct = totalSeats > 0 ? (availableSeats / totalSeats) * 100 : 0
  const barColor = soldOut ? 'var(--danger)' : pct <= 20 ? 'var(--warning)' : 'var(--accent)'

  return (
    <div className="seat-counter">
      <div className="seat-header">
        <div className="seat-label">
          <span className={`live-dot ${connected ? 'live' : 'offline'}`} />
          <span className="seat-title">Seat Availability</span>
          {connected && <span className="live-badge">LIVE</span>}
        </div>
        <span className={`seat-count ${soldOut ? 'sold-out' : pct <= 20 ? 'low' : ''}`}>
          {soldOut ? 'SOLD OUT' : `${availableSeats} / ${totalSeats}`}
        </span>
      </div>

      <div className="seat-bar-bg">
        <div
          className="seat-bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      {!soldOut && (
        <p className="seat-note">
          {pct <= 20
            ? `⚡ Only ${availableSeats} seat${availableSeats !== 1 ? 's' : ''} left — book fast!`
            : `${availableSeats} seat${availableSeats !== 1 ? 's' : ''} available`}
        </p>
      )}
    </div>
  )
}
