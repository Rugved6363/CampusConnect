import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import LandingPage from './pages/LandingPage/LandingPage'
import HomePage from './pages/HomePage/HomePage'
import EventDetailPage from './pages/EventDetailPage/EventDetailPage'
import BookingPage from './pages/BookingPage/BookingPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignupPage from './pages/SignupPage/SignupPage'
import FestivalPage from './pages/FestivalPage/FestivalPage'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import CollegeDashboard from './pages/CollegeDashboard/CollegeDashboard'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function RoleRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== role) return <Navigate to="/" replace />
  return children
}

/** Landing for non-auth, redirect for logged-in users */
function RootRoute() {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <LandingPage />
  if (user?.role === 'ADMIN')   return <Navigate to="/admin"   replace />
  if (user?.role === 'COLLEGE') return <Navigate to="/college" replace />
  return <HomePage />
}

export default function App() {
  const { user } = useAuth()
  const isStudent = !user || user.role === 'STUDENT'

  return (
    <>
      {/* Show Navbar only for non-landing pages */}
      {user && <Navbar />}
      <Routes>
        <Route path="/"              element={<RootRoute />} />
        <Route path="/events-browse" element={<><Navbar /><HomePage /></>} />
        <Route path="/events/:id"    element={<><Navbar /><EventDetailPage /></>} />
        <Route path="/festivals/:id" element={<><Navbar /><FestivalPage /></>} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/signup"        element={<SignupPage />} />
        <Route path="/book/:eventId" element={<ProtectedRoute><Navbar /><BookingPage /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><Navbar /><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin"         element={<RoleRoute role="ADMIN"><AdminDashboard /></RoleRoute>} />
        <Route path="/college"       element={<RoleRoute role="COLLEGE"><CollegeDashboard /></RoleRoute>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
