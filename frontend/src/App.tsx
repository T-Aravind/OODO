import React, { useState, useEffect, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { ToastContainer } from './components/common/ToastContainer'
import { SplashScreen } from './components/common/SplashScreen'
import { LoginPage } from './components/LoginPage'
import { SignupPage } from './components/SignupPage'
import { Dashboard } from './components/Dashboard'
import type { UserRole } from './types'
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
  if (clean === 'profile' || clean === 'my-profile') return { page: 'profile' }
  if (clean === 'attendance') return { page: 'attendance', adminView: false }
  if (clean === 'admin/attendance' || clean === 'attendance/admin') {
    return { page: 'attendance', adminView: true }
  }
  if (clean === 'time-off') return { page: 'time-off' }
  return { page: 'employees' }
}

const SPLASH_STORAGE_KEY = 'dayflow_splash_completed'

const MainAppContent: React.FC = () => {
  const { currentUser, login } = useApp()
  const { addToast } = useToast()

  // Splash Screen State (Only on initial session entry)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SPLASH_STORAGE_KEY) !== 'true'
    } catch {
      return true
    }
  })

  const [route, setRoute] = useState<AppRoute>(() => {
    return parsePath(window.location.pathname)
  })

  const handleSplashComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
    setShowSplash(false)
  }, [])

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

  // Strict Role-Based Route Protection & Auto-Navigation Logic
  useEffect(() => {
    if (currentUser) {
      const isEmployee = currentUser.role === 'employee'

      // Unauthenticated routes redirect to authenticated landing
      if (route.page === 'login' || route.page === 'signup') {
        const target = isEmployee ? '/profile' : '/employees'
        navigate(target, true)
        return
      }

      // STRICT RBAC CHECK FOR EMPLOYEE ROLE
      if (isEmployee) {
        // 1. Employee cannot access directory `/employees`
        if (route.page === 'employees') {
          addToast('warning', 'Access Restricted', 'Employee directory is restricted to Admin and HR.')
          navigate('/profile', true)
          return
        }

        // 2. IDOR Protection: Employee cannot access `/employees/:id` for another employee
        if (route.page === 'employee-detail') {
          if (route.employeeId.toLowerCase() !== currentUser.employeeId.toLowerCase()) {
            addToast('error', 'Access Denied', 'You do not have permission to view other employee records.')
            navigate('/profile', true)
            return
          }
        }
      }
    } else {
      // If unauthenticated and on a protected route, redirect to /login
      if (route.page !== 'login' && route.page !== 'signup') {
        navigate('/login', true)
      }
    }
  }, [currentUser, route, navigate, addToast])

  const handleLoginSubmit = (userData: { email: string; role: UserRole; name: string; loginId?: string }) => {
    login(userData)
    // Navigate based on role
    if (userData.role === 'employee') {
      navigate('/profile')
    } else {
      navigate('/employees')
    }
  }

  const handleSignupSubmit = (userData: {
    name: string
    email: string
    role: UserRole
    companyName: string
    department: string
    loginId?: string
  }) => {
    login({ email: userData.email, role: userData.role, name: userData.name, loginId: userData.loginId })
    if (userData.role === 'employee') {
      navigate('/profile')
    } else {
      navigate('/employees')
    }
  }

  return (
    <div className="app-root-container">
      {/* ── First-Load Animated Splash Screen ── */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <ToastContainer />

      {/* ── Main Application Content with Smooth Settle ── */}
      <div className={`app-main-viewport ${!showSplash ? 'app-content-fade-in' : ''}`}>
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
                : currentUser.role === 'employee'
                ? 'profile'
                : 'employees'
            }
            initialEmployeeId={route.page === 'employee-detail' ? route.employeeId : null}
            initialAttendanceMode={route.page === 'attendance' && route.adminView ? 'admin' : 'employee'}
            onNavigateUrl={(path) => navigate(path)}
          />
        )}
      </div>
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
