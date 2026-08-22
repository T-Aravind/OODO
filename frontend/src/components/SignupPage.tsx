import React, { useState } from 'react'
import type { UserRole } from '../types'
import dayflowIcon from '../assets/dayflow-icon.jpg'

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
    const defaultDept = 'Human Resources'

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, phone, password, companyName, department: defaultDept, role: 'hr' }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const loginId = data.employee?.loginId
        setGeneratedLoginId(loginId)
        onSignup({ name, email, phone, role: 'hr', companyName, department: defaultDept, loginId, companyLogo })
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch {
      onSignup({ name, email, phone, role: 'hr', companyName, department: defaultDept, companyLogo })
    }
  }

  return (
    <div className="fullscreen-login-page">
      {/* Left Side: 50% Animated HR Graphic */}
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
          <p>Streamline onboarding & daily workflows.</p>
        </div>
      </div>

      {/* Right Side: 50% Signup Form Panel */}
      <div className="fullscreen-right-panel">
        <div className="form-inner">
          <h1 className="login-title">HR SIGN UP</h1>
          <p className="login-subtext">Register a new company workspace as HR Manager</p>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            💼 <strong>HR Account Scope:</strong> Registering as <strong>HR Manager</strong>. Your credentials and password will be saved securely in the PostgreSQL database.
          </div>

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
