import React, { useState } from 'react'
import type { UserRole } from '../types'

interface SignupPageProps {
  onSignup: (userData: {
    name: string
    email: string
    phone?: string
    role: UserRole
    companyName: string
    department: string
    loginId?: string
    companyLogo?: string | null
  }) => void
  onNavigateToLogin: () => void
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [generatedLoginId, setGeneratedLoginId] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword || !companyName) {
      setError('Please fill in all required fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    const defaultRole: UserRole = 'admin'
    const defaultDept = 'General'

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, phone, password, companyName, department: defaultDept, role: defaultRole }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const loginId = data.employee?.loginId
        setGeneratedLoginId(loginId)
        onSignup({ name, email, phone, role: defaultRole, companyName, department: defaultDept, loginId, companyLogo })
      } else {
        onSignup({ name, email, phone, role: defaultRole, companyName, department: defaultDept, companyLogo })
      }
    } catch {
      // Direct fallback
      try {
        const directRes = await fetch('http://localhost:8081/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: name, email, phone, password, companyName, department: defaultDept, role: defaultRole }),
        })
        const data = await directRes.json()
        if (directRes.ok && data.success) {
          const loginId = data.employee?.loginId
          setGeneratedLoginId(loginId)
          onSignup({ name, email, phone, role: defaultRole, companyName, department: defaultDept, loginId, companyLogo })
          return
        }
      } catch {}

      onSignup({ name, email, phone, role: defaultRole, companyName, department: defaultDept, companyLogo })
    }
  }

  return (
    <div className="fullscreen-login-page">
      {/* Left Side: 50% Animated HR Graphic */}
      <div className="fullscreen-left-panel">
        <div className="hr-illustration-container">
          <svg
            className="hr-svg-anim"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="250" cy="250" r="180" fill="url(#purpleGlowSignup)" opacity="0.35" />

            {/* Registration / HR Onboarding Card */}
            <rect x="90" y="100" width="320" height="260" rx="16" fill="#FFFFFF" filter="drop-shadow(0px 15px 35px rgba(0,0,0,0.2))" />
            <rect x="90" y="100" width="320" height="44" rx="16" fill="#714B67" />
            <circle cx="120" cy="122" r="6" fill="#FF5F56" />
            <circle cx="138" cy="122" r="6" fill="#FFBD2E" />
            <circle cx="156" cy="122" r="6" fill="#27C93F" />

            {/* Profile setup fields representation */}
            <rect x="120" y="170" width="260" height="14" rx="7" fill="#E2E8F0" />
            <rect x="120" y="198" width="180" height="14" rx="7" fill="#F1F5F9" />
            <rect x="120" y="226" width="220" height="14" rx="7" fill="#F1F5F9" />

            <rect x="120" y="265" width="260" height="40" rx="10" fill="#714B67" opacity="0.9" />
            <text x="210" y="290" fontSize="13" fontWeight="bold" fill="white">Register Profile</text>

            {/* Floating HR Welcome Badge */}
            <g className="floating-badge-1">
              <rect x="50" y="280" width="140" height="52" rx="12" fill="#FFFFFF" filter="drop-shadow(0px 8px 20px rgba(0,0,0,0.15))" />
              <circle cx="78" cy="306" r="14" fill="#3B82F6" />
              <text x="73" y="311" fontSize="14" fill="white">👋</text>
              <text x="100" y="302" fontSize="11" fontWeight="bold" fill="#0F172A">Onboarding</text>
              <text x="100" y="315" fontSize="9" fill="#64748B">New Employee</text>
            </g>

            <defs>
              <linearGradient id="purpleGlowSignup" x1="70" y1="70" x2="430" y2="430" gradientUnits="userSpaceOnUse">
                <stop stopColor="#714B67" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="left-hero-text">
          <h3>Join Dayflow HRMS</h3>
          <p>Streamline onboarding & daily workflows.</p>
        </div>
      </div>

      {/* Right Side: 50% Signup Form Panel */}
      <div className="fullscreen-right-panel">
        <div className="form-inner">
          <h1 className="login-title">SIGN UP</h1>
          <p className="login-subtext">Create your Dayflow HR account</p>

          {error && <div className="auth-error-box">{error}</div>}
          {generatedLoginId && (
            <div className="auth-error-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}>
              ✓ Account created successfully! Your Login ID is: <strong>{generatedLoginId}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit} className="split-form">
            <div className="form-field">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-input"
                required
              />
            </div>

            {/* Company Name with Upload Logo Symbol Beside */}
            <div className="form-field">
              <label htmlFor="signup-company">Company Name</label>
              <div className="company-logo-input-row">
                <input
                  id="signup-company"
                  type="text"
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="rounded-input"
                  required
                />
                <label className="upload-logo-icon-btn" title="Upload Company Logo">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden-file-input"
                  />
                  <span>{companyLogo ? '✅' : '📤'}</span>
                </label>
              </div>
              {companyLogo && (
                <div className="logo-preview-badge">
                  <img src={companyLogo} alt="Logo Preview" className="logo-preview-img" />
                  <span>Logo selected</span>
                </div>
              )}
            </div>

            <div className="form-row-2col">
              <div className="form-field">
                <label htmlFor="signup-email">Work Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-input"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="signup-phone">Phone Number</label>
                <input
                  id="signup-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-input"
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-field">
                <label htmlFor="signup-password">New Password</label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-input"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="rounded-submit-btn" id="btn-signup-submit">
              Complete Registration
            </button>
          </form>

          <div className="form-bottom-link">
            <p>
              Already registered?{' '}
              <button type="button" className="signup-text-btn" onClick={onNavigateToLogin}>
                Sign In Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
