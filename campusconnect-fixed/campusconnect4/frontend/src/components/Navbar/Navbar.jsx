import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-name">CampusConnect</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Discover</Link>
          {isAuthenticated && user?.role === 'STUDENT' && (
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={() => setMenuOpen(false)}>My Bookings</Link>
          )}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`} onClick={() => setMenuOpen(false)}>⚙️ Admin</Link>
          )}
          {isAuthenticated && user?.role === 'COLLEGE' && (
            <Link to="/college" className={`nav-link ${isActive('/college')}`} onClick={() => setMenuOpen(false)}>🏛️ Dashboard</Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-avatar-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
                <span className="chevron">▾</span>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  {user?.role === 'STUDENT' && (
                    <>
                      <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
                      <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>🎟️ My Bookings</Link>
                    </>
                  )}
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>⚙️ Admin Dashboard</Link>
                  )}
                  {user?.role === 'COLLEGE' && (
                    <Link to="/college" className="dropdown-item" onClick={() => setMenuOpen(false)}>🏛️ My Dashboard</Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login"  className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>Sign Up</Link>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />}
    </nav>
  )
}
