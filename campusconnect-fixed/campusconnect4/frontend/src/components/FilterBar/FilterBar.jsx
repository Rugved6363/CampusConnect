import { useEffect, useState } from 'react'
import { eventsApi } from '../../api/eventsApi'
import './FilterBar.css'

const CATEGORIES = [
  { value: '',          label: 'All Events',  icon: '🎪' },
  { value: 'CULTURAL',  label: 'Cultural',    icon: '🎭' },
  { value: 'TECHNICAL', label: 'Technical',   icon: '💻' },
  { value: 'SPORTS',    label: 'Sports',      icon: '⚽' },
  { value: 'WORKSHOP',  label: 'Workshop',    icon: '🧠' },
]

export default function FilterBar({ filters, onChange }) {
  const [colleges, setColleges] = useState([])

  useEffect(() => {
    eventsApi.getColleges()
      .then(res => setColleges(res.data))
      .catch(() => {})
  }, [])

  function set(key, value) {
    onChange({ ...filters, [key]: value, page: 0 })
  }

  return (
    <div className="filter-bar">
      {/* Category pills */}
      <div className="category-pills">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`pill ${filters.category === cat.value ? 'active' : ''}`}
            onClick={() => set('category', cat.value)}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* College select */}
      <div className="college-select-wrap">
        <select
          className="college-select form-input"
          value={filters.college || ''}
          onChange={e => set('college', e.target.value)}
        >
          <option value="">🏛️ All Colleges</option>
          {colleges.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
