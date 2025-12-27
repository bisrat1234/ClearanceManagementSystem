import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import StudentDashboard from './components/StudentDashboard'
import ApproverDashboard from './components/ApproverDashboard'
import AdminDashboard from './components/AdminDashboard'
import AdminSystemSettings from './components/AdminSystemSettings'
import Settings from './components/Settings'
import AboutSystem from './components/AboutSystem'
import AboutDeveloper from './components/AboutDeveloper'
import Contact from './components/Contact'
import LearnMore from './components/LearnMore'
import apiService from './services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

function App() {
  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Set token in API service
      apiService.setToken(token)
      // Try to get user profile to verify token
      apiService.getUserProfile()
        .then(userData => {
          setUser(userData)
          fetchRequests()
        })
        .catch((error) => {
          console.error('Token verification failed:', error)
          // Token is invalid, remove it
          localStorage.removeItem('token')
          apiService.removeToken()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (userData) => {
    setUser(userData)
    await fetchRequests()
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
    setRequests([])
    window.location.href = '/'
  }

  const fetchRequests = async () => {
    try {
      const data = await apiService.getRequests()
      setRequests(data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, requests, setRequests, fetchRequests }}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/student" element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
            <Route path="/teacher" element={user?.role === 'teacher' ? <StudentDashboard /> : <Navigate to="/login" />} />
            <Route path="/approver" element={user?.role === 'approver' || user?.role === 'teacher' ? <ApproverDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/settings" element={user?.role === 'admin' ? <AdminSystemSettings /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/about-system" element={<AboutSystem />} />
            <Route path="/about-developer" element={<AboutDeveloper />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/learn-more" element={<LearnMore />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App