import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './AuthPages.css'

export default function SignupPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim())               e.name     = 'Name is required'
    if (!form.email)                     e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password)                  e.password = 'Password is required'
    else if (form.password.length < 6)   e.password = 'At least 6 characters required'
    if (form.password !== form.confirm)  e.confirm  = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setErrors({})
    try {
      const res = await authApi.signup({
        name:     form.name.trim(),
        email:    form.email,
        password: form.password,
      })
      login(res.data)
      toast.success(`Account created! Welcome, ${res.data.name}! 🎉`)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.'
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

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join thousands of students discovering campus events.</p>

        {errors.general && (
          <div className="auth-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Arjun Sharma"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              autoFocus
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>College Email</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@college.ac.in"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className={`form-input ${errors.confirm ? 'input-error' : ''}`}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={e => set('confirm', e.target.value)}
            />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account…</>
              : 'Create Account'
            }
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
