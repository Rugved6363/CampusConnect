import { format, formatDistanceToNow, isPast } from 'date-fns'

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'EEE, d MMM yyyy')
}

export function formatTime(dateStr) {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'h:mm a')
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'EEE, d MMM yyyy • h:mm a')
}

export function formatRelative(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isPast(date)) return 'Event ended'
  return `In ${formatDistanceToNow(date)}`
}

export function formatPrice(price) {
  if (!price || Number(price) === 0) return 'Free'
  return `₹${Number(price).toLocaleString('en-IN')}`
}

export function categoryIcon(category) {
  const icons = {
    CULTURAL:  '🎭',
    TECHNICAL: '💻',
    SPORTS:    '⚽',
    WORKSHOP:  '🧠',
  }
  return icons[category] || '🎪'
}

export function categoryLabel(category) {
  if (!category) return ''
  return category.charAt(0) + category.slice(1).toLowerCase()
}

export function truncate(str, n = 120) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}
