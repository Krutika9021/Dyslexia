import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireTeacher?: boolean
  requireParent?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireTeacher = false,
  requireParent = false,
  redirectTo,
}) => {
  const { user, loading, isAdmin, isTeacher, isParent } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo ?? '/auth'} state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  if (requireTeacher && !isTeacher && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  if (requireParent && !isParent && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}