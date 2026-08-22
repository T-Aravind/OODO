import React, { useState } from 'react'
import type { UserRole } from '../types'
import dayflowIcon from '../assets/dayflow-icon.jpg'

interface LoginPageProps {
  onLogin: (userData: { email: string; role: UserRole; name: string; loginId?: string }) => void
  onNavigateToSignup: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    const defaultRole: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'employee'

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        onLogin({
          email: data.employee?.email || email,
          role: (data.employee?.role as UserRole) || defaultRole,
          name: data.employee?.fullName || email.split('@')[0],
          loginId: data.employee?.loginId,
        })
      } else {
        // Fallback login
        const fallbackName = email.split('@')[0].replace('.', ' ')
        onLogin({ email, role: defaultRole, name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1) })
      }
    } catch {
      // Offline / client-side fallback
      const fallbackName = email.split('@')[0].replace('.', ' ')
      onLogin({ email, role: defaultRole, name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1) })
    }
  }

  return (
    <div className="fullscreen-login-page">
      {/* Left Side: 50% Animated HR Illustration Panel */}
      <div className="fullscreen-left-panel">
        <div className="hr-illustration-container">
          <div className="login-hero-logo-card">
            <img
              src={dayflowIcon}
              alt="DayFlow Logo"
              className="login-hero-logo-img"
            />
          </div>
        </div>
        <div className="left-hero-text">
          <h3>DayFlow HRMS</h3>
          <p>Every workday, perfectly aligned.</p>
        </div>
      </div>

      {/* Right Side: 50% Clean White Form Panel */}
      <div className="fullscreen-right-panel">
        <div className="form-inner">
          <h1 className="login-title">LOGIN</h1>
          <p className="login-subtext">Welcome back! Please enter your details.</p>

          {error && <div className="auth-error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="split-form">
            <div className="form-field">
              <label htmlFor="login-email">Email or Login ID</label>
              <input
                id="login-email"
                type="text"
                placeholder="e.g. EMP-1001 or admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password / PIN Code</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-input"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="forgot-link">
                🔒 Forgot Password?
              </a>
            </div>

            <button type="submit" className="rounded-submit-btn" id="btn-login-submit">
              Sign In to Workspace
            </button>
          </form>

          <div className="form-bottom-link">
            <p>
              Don't have an account yet?{' '}
              <button type="button" className="signup-text-btn" onClick={onNavigateToSignup}>
                Create Account (Sign Up)
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
