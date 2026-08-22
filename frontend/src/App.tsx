import React, { useState, useEffect, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/common/ToastContainer'
import { LoginPage } from './components/LoginPage'
import { SignupPage } from './components/SignupPage'
import { Dashboard } from './components/Dashboard'
import './styles/dashboard.css'
import './styles/employee-card.css'
import './styles/profile.css'
import './styles/attendance.css'
import './styles/timeoff.css'
import './styles/modal.css'
import './styles/toast.css'
import './App.css'

type AppRoute =
  | { page: 'login' }
  | { page: 'signup' }
  | { page: 'employees' }
  | { page: 'employee-detail'; employeeId: string }
  | { page: 'profile' }
  | { page: 'attendance'; adminView?: boolean }
  | { page: 'time-off' }

function parsePath(pathname: string): AppRoute {
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '')
  if (!clean || clean === 'login') return { page: 'login' }
  if (clean === 'signup') return { page: 'signup' }
  if (clean === 'employees') return { page: 'employees' }
  if (clean.startsWith('employees/')) {
    const id = clean.split('/')[1]
    return { page: 'employee-detail', employeeId: id }
  }
  if (clean === 'profile') return { page: 'profile' }
  if (clean === 'attendance') return { page: 'attendance', adminView: false }
  if (clean === 'admin/attendance' || clean === 'attendance/admin') {
    return { page: 'attendance', adminView: true }
  }
  if (clean === 'time-off') return { page: 'time-off' }
  return { page: 'employees' }
}

const MainAppContent: React.FC = () => {
  const { currentUser, login } = useApp()
  const [route, setRoute] = useState<AppRoute>(() => {
    return parsePath(window.location.pathname)
  })

  // Handle URL change
  const navigate = useCallback((path: string, replace = false) => {
    if (replace) {
      window.history.replaceState(null, '', path)
    } else {
      window.history.pushState(null, '', path)
    }
    setRoute(parsePath(path))
  }, [])

  // Listen to browser Back/Forward popstate
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname))
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Route Protection & Auto-Navigation Logic
  useEffect(() => {
    if (currentUser) {
      // If user is logged in and currently on login or signup or root, redirect to /employees
      if (route.page === 'login' || route.page === 'signup') {
        navigate('/employees', true)
      }
    } else {
      // If unauthenticated and on a protected route, redirect to /login
      if (route.page !== 'login' && route.page !== 'signup') {
        navigate('/login', true)
      }
    }
  }, [currentUser, route.page, navigate])

  const handleLoginSubmit = (userData: { email: string; role: 'admin' | 'employee'; name: string; loginId?: string }) => {
    login(userData)
    navigate('/employees')
  }

  const handleSignupSubmit = (userData: {
    name: string
    email: string
    role: 'admin' | 'employee'
    companyName: string
    department: string
    loginId?: string
  }) => {
    login({ email: userData.email, role: userData.role, name: userData.name, loginId: userData.loginId })
    navigate('/employees')
  }

  // Render according to route
  return (
    <div className="app-root-container">
      <ToastContainer />

      {/* Unauthenticated Pages */}
      {!currentUser && route.page === 'login' && (
        <LoginPage
          onLogin={handleLoginSubmit}
          onNavigateToSignup={() => navigate('/signup')}
        />
      )}

      {!currentUser && route.page === 'signup' && (
        <SignupPage
          onSignup={handleSignupSubmit}
          onNavigateToLogin={() => navigate('/login')}
        />
      )}

      {/* Authenticated Corporate Shell */}
      {currentUser && (
        <Dashboard
          initialView={
            route.page === 'employee-detail'
              ? 'employee-detail'
              : route.page === 'profile'
              ? 'profile'
              : route.page === 'attendance'
              ? 'attendance'
              : route.page === 'time-off'
              ? 'time-off'
              : 'employees'
          }
          initialEmployeeId={route.page === 'employee-detail' ? route.employeeId : null}
          initialAttendanceMode={route.page === 'attendance' && route.adminView ? 'admin' : 'employee'}
          onNavigateUrl={(path) => navigate(path)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ToastProvider>
  )
}

export default App
