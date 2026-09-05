import { Link } from 'react-router-dom'
import './LandingPage.css'

const ROLES = [
  {
    icon: '🎓',
    title: 'Student',
    desc: 'Browse and book events across colleges. Get real-time seat updates.',
    link: '/signup',
    btnLabel: 'Sign Up as Student',
    accent: '#6c63ff',
  },
  {
    icon: '🏛️',
    title: 'College',
    desc: 'Publish events and festivals visible to students across all colleges.',
    link: '/login',
    btnLabel: 'College Login',
    accent: '#10b981',
  },
]

const FEATURES = [
  { icon: '⚡', title: 'Live Seat Updates', desc: 'Real-time availability via WebSocket — know instantly if seats fill up.' },
  { icon: '🎪', title: 'Festival Hierarchy', desc: 'Full support for multi-day festivals with category tracks and sub-events.' },
  { icon: '🎟️', title: 'Instant Booking', desc: 'Book tickets in seconds with payment simulation and confirmation.' },
]

export default function LandingPage() {

  return (
    <div className="landing">

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-brand">🎓 CampusConnect</Link>
          <div className="landing-nav-links">
            <Link to="/login"  className="lnav-btn lnav-outline">Login</Link>
            <Link to="/signup" className="lnav-btn lnav-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-container">
          <span className="hero-badge">
            🎉 Where Campus Memories Begin — Discover the Craziest Fests Around You
          </span>
          <h1 className="landing-h1">
            The All-In-One<br/>
            <span className="landing-gradient">College Event Platform</span>
          </h1>
          <p className="landing-lead">
            Discover, explore, and book events from colleges across India —
            with live seat counters, festival hierarchies, and role-based dashboards.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="lnav-btn lnav-primary hero-cta-btn">Get Started Free →</Link>
            <Link to="/events-browse" className="lnav-btn lnav-outline hero-cta-btn">Browse Events</Link>
          </div>

        </div>
      </section>

      {/* ── Role Selection ── */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Choose Your Role</h2>
          <p className="landing-sub">CampusConnect works differently for each type of user.</p>
          <div className="role-grid role-grid-two">
            {ROLES.map(r => (
              <div key={r.title} className="role-card" style={{ '--accent': r.accent }}>
                <div className="role-icon">{r.icon}</div>
                <h3 className="role-title">{r.title}</h3>
                <p className="role-desc">{r.desc}</p>
                <Link to={r.link} className="role-btn">{r.btnLabel} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-section landing-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Everything You Need</h2>
          <div className="feature-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <h2 className="landing-h2" style={{ color: '#fff' }}>Ready to get started?</h2>
          <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: 28 }}>
            Join students and colleges already on CampusConnect.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="lnav-btn" style={{ background:'#fff', color:'#6c63ff', fontWeight:700 }}>
              Create Student Account
            </Link>
            <Link to="/login" className="lnav-btn lnav-outline" style={{ borderColor:'rgba(255,255,255,.5)', color:'#fff' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <span>🎓 CampusConnect &copy; 2025 — Built for college communities</span>
        </div>
      </footer>
    </div>
  )
}
