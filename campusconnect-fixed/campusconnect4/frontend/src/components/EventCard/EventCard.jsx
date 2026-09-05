import { Link } from 'react-router-dom'
import { formatDate, formatPrice, categoryIcon, categoryLabel, truncate } from '../../utils/formatters'
import styles from './EventCard.module.css'

export default function EventCard({ event }) {
  const { id, title, college, category, price, dateTime, availableSeats, posterUrl, soldOut } = event
  const isFree = !price || Number(price) === 0

  return (
    <Link to={`/events/${id}`} className={styles.card}>
      <div className={styles.poster}>
        <img
          src={posterUrl || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600`}
          alt={title}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' }}
        />
        <div className={styles.categoryBadge}>
          {categoryIcon(category)} {categoryLabel(category)}
        </div>
        {soldOut && <div className={styles.soldOutOverlay}>SOLD OUT</div>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.college}>🏛️ {college}</p>

        <div className={styles.meta}>
          <span className={styles.date}>📅 {formatDate(dateTime)}</span>
        </div>

        <div className={styles.footer}>
          <span className={`${styles.price} ${isFree ? styles.free : ''}`}>
            {formatPrice(price)}
          </span>
          <span className={`${styles.seats} ${availableSeats <= 10 ? styles.low : ''} ${soldOut ? styles.soldOut : ''}`}>
            {soldOut ? '🔴 Sold Out' : availableSeats <= 10 ? `⚡ ${availableSeats} left` : `🪑 ${availableSeats} seats`}
          </span>
        </div>
      </div>
    </Link>
  )
}
