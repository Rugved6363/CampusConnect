import { useState, useEffect } from 'react'
import { adminApi } from '../../api/adminApi'
import toast from 'react-hot-toast'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [tab, setTab]         = useState('colleges')
  const [stats, setStats]     = useState({})
  const [colleges, setColleges] = useState([])
  const [users, setUsers]     = useState([])
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({ collegeName: '', email: '', password: '' })
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [searchRes, setSearchRes] = useState(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [s, c, u, e] = await Promise.all([
        adminApi.getStats(),
        adminApi.getColleges(),
        adminApi.getAllUsers(),
        adminApi.getAllEvents(),
      ])
      setStats(s.data)
      setColleges(c.data)
      setUsers(u.data)
      setEvents(e.data)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!searchQ.trim()) return
    setSearching(true)
    try {
      const res = await adminApi.search(searchQ)
      setSearchRes(res.data)
    } catch { toast.error('Search failed') }
    finally { setSearching(false) }
  }

  async function handleCreateCollege(e) {
    e.preventDefault()
    if (!form.collegeName || !form.email || !form.password) { toast.error('All fields required'); return }
    setCreating(true)
    try {
      await adminApi.createCollege(form)
      toast.success('College account created ✅')
      setForm({ collegeName: '', email: '', password: '' })
      setShowForm(false)
      loadAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setCreating(false) }
  }

  async function delCollege(id, name) {
    if (!confirm(`Delete college "${name}"?`)) return
    try { await adminApi.deleteCollege(id); toast.success('Deleted'); loadAll() }
    catch { toast.error('Failed to delete') }
  }

  async function delUser(id, name) {
    if (!confirm(`Delete user "${name}"?`)) return
    try { await adminApi.deleteUser(id); toast.success('User deleted'); loadAll() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  async function delEvent(id, title) {
    if (!confirm(`Delete event "${title}"?`)) return
    try { await adminApi.deleteEvent(id); toast.success('Event deleted'); loadAll() }
    catch { toast.error('Failed to delete') }
  }

  const STAT_CARDS = [
    { label: 'Students',   value: stats.students  ?? '—', icon: '🎓' },
    { label: 'Colleges',   value: stats.colleges  ?? '—', icon: '🏛️' },
    { label: 'Events',     value: stats.events    ?? '—', icon: '🎪' },
    { label: 'Sub-Events', value: stats.subEvents ?? '—', icon: '🎫' },
  ]

  return (
    <div className="page admin-page fade-in">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">⚙️ Admin Dashboard</h1>
            <p className="admin-sub">Full control over the CampusConnect platform</p>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="admin-stat-card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="admin-search-bar">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
            <input
              className="form-input"
              placeholder="Search users, events, colleges…"
              value={searchQ}
              onChange={e => { setSearchQ(e.target.value); if (!e.target.value) setSearchRes(null) }}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" type="submit" disabled={searching}>
              {searching ? '…' : '🔍 Search'}
            </button>
          </form>
          {searchRes && (
            <div className="search-results fade-in">
              <h4>Search Results for "{searchQ}"</h4>
              {searchRes.users?.length > 0 && (
                <>
                  <p className="sr-section">👥 Users ({searchRes.users.length})</p>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                      <tbody>
                        {searchRes.users.map(u => (
                          <tr key={u.id}>
                            <td>{u.name}</td><td>{u.email}</td>
                            <td><span className={`badge ${roleBadge(u.role)}`}>{u.role}</span></td>
                            <td><button className="btn-danger-sm" onClick={() => delUser(u.id, u.name)}>Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {searchRes.events?.length > 0 && (
                <>
                  <p className="sr-section">🎪 Events ({searchRes.events.length})</p>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Title</th><th>College</th><th>Action</th></tr></thead>
                      <tbody>
                        {searchRes.events.map(e => (
                          <tr key={e.id}>
                            <td>{e.title}</td><td>{e.college}</td>
                            <td><button className="btn-danger-sm" onClick={() => delEvent(e.id, e.title)}>Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {searchRes.users?.length === 0 && searchRes.events?.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', padding: '12px 0' }}>No results found.</p>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['colleges','users','events'].map(t => (
            <button key={t} className={`admin-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t==='colleges'?'🏛️ Colleges':t==='users'?'👥 Users':'🎪 Events'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-loading"><div className="spinner" style={{width:40,height:40}}/></div>
        ) : (
          <>
            {/* COLLEGES */}
            {tab==='colleges' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2 className="section-title">College Accounts ({colleges.length})</h2>
                  <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '+ Add College'}
                  </button>
                </div>
                {showForm && (
                  <div className="admin-form-card fade-in">
                    <h3 className="form-title">Create College Account</h3>
                    <form onSubmit={handleCreateCollege} className="admin-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>College Name</label>
                          <input className="form-input" placeholder="IIT Bombay" value={form.collegeName}
                            onChange={e => setForm(f=>({...f,collegeName:e.target.value}))} />
                        </div>
                        <div className="form-group">
                          <label>Official Email</label>
                          <input type="email" className="form-input" placeholder="events@iitb.ac.in" value={form.email}
                            onChange={e => setForm(f=>({...f,email:e.target.value}))} />
                        </div>
                        <div className="form-group">
                          <label>Password</label>
                          <input type="password" className="form-input" placeholder="Min 6 chars" value={form.password}
                            onChange={e => setForm(f=>({...f,password:e.target.value}))} />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={creating}>
                        {creating ? 'Creating…' : '✅ Create College Account'}
                      </button>
                    </form>
                  </div>
                )}
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>College</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {colleges.length===0
                        ? <tr><td colSpan={4} className="empty-cell">No colleges yet.</td></tr>
                        : colleges.map(c => (
                          <tr key={c.id}>
                            <td><strong>{c.collegeName||c.name}</strong></td>
                            <td>{c.email}</td>
                            <td><span className={`badge ${c.approved?'badge-green':'badge-red'}`}>{c.approved?'Active':'Inactive'}</span></td>
                            <td><button className="btn-danger-sm" onClick={() => delCollege(c.id, c.collegeName||c.name)}>Delete</button></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab==='users' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2 className="section-title">All Users ({users.length})</h2>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td><span className={`badge ${roleBadge(u.role)}`}>{u.role}</span></td>
                          <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                          <td>
                            {u.role !== 'ADMIN' && (
                              <button className="btn-danger-sm" onClick={() => delUser(u.id, u.name)}>Delete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EVENTS */}
            {tab==='events' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2 className="section-title">All Events ({events.length})</h2>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Title</th><th>College</th><th>Seats</th><th>Actions</th></tr></thead>
                    <tbody>
                      {events.map(e => (
                        <tr key={e.id}>
                          <td><strong>{e.title}</strong></td>
                          <td>{e.college}</td>
                          
                          <td>{e.availableSeats}/{e.totalSeats}</td>
                          <td><button className="btn-danger-sm" onClick={() => delEvent(e.id, e.title)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function roleBadge(role) {
  if (role==='ADMIN') return 'badge-purple'
  if (role==='COLLEGE') return 'badge-blue'
  return 'badge-gray'
}
