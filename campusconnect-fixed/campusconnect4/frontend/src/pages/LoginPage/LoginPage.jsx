import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './AuthPages.css'

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const location     = useLocation()
  const from         = location.state?.from || '/'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  function validate() {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setErrors({})
    try {
      const res = await authApi.login(form)
      login(res.data)
      toast.success(`Welcome back, ${res.data.name}! 👋`)
      if (res.data.role === 'ADMIN')        navigate('/admin',   { replace: true })
      else if (res.data.role === 'COLLEGE') navigate('/college', { replace: true })
      else navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setErrors({ general: msg })
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: undefined, general: undefined }))
  }

  return (
    <div className="page auth-page">
      <div className="auth-card fade-in">
        <div className="auth-brand">
          <span>🎓</span>
          <span>CampusConnect</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to book events.</p>

        {errors.general && (
          <div className="auth-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@college.ac.in"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              autoComplete="email"
              autoFocus
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in…</>
              : 'Sign In'
            }
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one →</Link>
        </p>
      </div>
    </div>
  )
}
