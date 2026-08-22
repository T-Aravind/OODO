import React, { useState } from 'react'

interface LoginPageProps {
  onLogin: (userData: { email: string; role: 'admin' | 'employee'; name: string; loginId?: string }) => void
  onNavigateToSignup: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'employee'>('admin')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password, role }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        onLogin({
          email: data.employee?.email || email,
          role: (data.employee?.role as 'admin' | 'employee') || role,
          name: data.employee?.fullName || email.split('@')[0],
          loginId: data.employee?.loginId,
        })
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      // Fallback preview
      const fallbackName = email.split('@')[0].replace('.', ' ')
      onLogin({ email, role, name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1) })
    }
  }

  return (
    <div className="fullscreen-login-page">
      {/* Left Side: 50% Animated HR Illustration Panel */}
      <div className="fullscreen-left-panel">
        <div className="hr-illustration-container">
          <svg
            className="hr-svg-anim"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Glow */}
            <circle cx="250" cy="250" r="180" fill="url(#purpleGlow)" opacity="0.35" />
            
            {/* HR Dashboard Card */}
            <rect x="90" y="110" width="320" height="230" rx="16" fill="#FFFFFF" filter="drop-shadow(0px 15px 35px rgba(0,0,0,0.2))" />
            
            {/* Header Bar of Card */}
            <rect x="90" y="110" width="320" height="44" rx="16" fill="#714B67" />
            <circle cx="120" cy="132" r="6" fill="#FF5F56" />
            <circle cx="138" cy="132" r="6" fill="#FFBD2E" />
            <circle cx="156" cy="132" r="6" fill="#27C93F" />
            <rect x="280" y="124" width="110" height="16" rx="8" fill="rgba(255,255,255,0.25)" />

            {/* Employee Avatar & Stats */}
            <circle cx="150" cy="200" r="24" fill="#E2E8F0" />
            <circle cx="150" cy="192" r="10" fill="#714B67" />
            <path d="M132 216C132 208 140 204 150 204C160 204 168 208 168 216" fill="#714B67" />

            <rect x="190" y="185" width="120" height="12" rx="6" fill="#1E293B" />
            <rect x="190" y="205" width="80" height="8" rx="4" fill="#94A3B8" />

            {/* Attendance & Leave Progress Bars */}
            <rect x="120" y="250" width="260" height="10" rx="5" fill="#F1F5F9" />
            <rect x="120" y="250" width="195" height="10" rx="5" fill="#714B67" className="pulse-bar" />

            <rect x="120" y="280" width="260" height="10" rx="5" fill="#F1F5F9" />
            <rect x="120" y="280" width="140" height="10" rx="5" fill="#38BDF8" className="pulse-bar-2" />

            {/* Floating HR Badges */}
            <g className="floating-badge-1">
              <rect x="60" y="290" width="130" height="50" rx="12" fill="#FFFFFF" filter="drop-shadow(0px 8px 20px rgba(0,0,0,0.15))" />
              <circle cx="85" cy="315" r="12" fill="#10B981" />
              <path d="M80 315L83 318L90 311" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <text x="106" y="314" fontSize="11" fontWeight="bold" fill="#0F172A">Present</text>
              <text x="106" y="326" fontSize="9" fill="#64748B">Daily Check-in</text>
            </g>

            <g className="floating-badge-2">
              <rect x="310" y="70" width="130" height="50" rx="12" fill="#FFFFFF" filter="drop-shadow(0px 8px 20px rgba(0,0,0,0.15))" />
              <circle cx="335" cy="95" r="12" fill="#714B67" />
              <text x="330" y="99" fontSize="12" fontWeight="bold" fill="white">⏱</text>
              <text x="356" y="94" fontSize="11" fontWeight="bold" fill="#0F172A">Dayflow</text>
              <text x="356" y="106" fontSize="9" fill="#64748B">HRMS Active</text>
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="purpleGlow" x1="70" y1="70" x2="430" y2="430" gradientUnits="userSpaceOnUse">
                <stop stopColor="#714B67" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="left-hero-text">
          <h3>Dayflow HRMS</h3>
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
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="e.g. admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
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

            <div className="form-field">
              <label htmlFor="login-role">Select Role</label>
              <select
                id="login-role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
                className="rounded-input select-input"
              >
                <option value="admin">👨‍💼 Admin / HR Manager</option>
                <option value="employee">👨‍💻 Employee</option>
              </select>
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

            <button type="submit" className="rounded-submit-btn">
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
