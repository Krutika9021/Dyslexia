import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import GamePage from './pages/GamePage'
import ProfilePage from './pages/ProfilePage'
import TeacherDashboard from './pages/TeacherDashboard'
import UserProfile from './pages/UserProfile'
import ThemeToggle from './components/ui/ThemeToggle'
import ParentLogin from './pages/ParentLogin.jsx'
import ParentSignup from './pages/ParentSignup.jsx'
import ParentDashboard from './pages/ParentDashboard'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import TeacherLogin from './pages/TeacherLogin.jsx'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
        <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/parent/login" element={<ParentLogin />} />
            <Route path="/parent/signup" element={<ParentSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/games" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/game/:gameType" 
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin redirectTo="/admin/login">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/parent/dashboard" 
              element={
                <ProtectedRoute requireParent redirectTo="/parent/login">
                  <ParentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher" 
              element={<Navigate to="/teacher/dashboard" replace />} 
            />
            <Route 
              path="/teacher/dashboard" 
              element={
                <ProtectedRoute requireTeacher redirectTo="/teacher/login">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/:userId" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
              }
            }}
          />
          <Analytics />
        </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App