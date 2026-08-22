import React, { useState } from 'react'

interface SignupPageProps {
  onSignup: (userData: {
    name: string
    email: string
    role: 'admin' | 'employee'
    companyName: string
    department: string
    loginId?: string
  }) => void
  onNavigateToLogin: () => void
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [department, setDepartment] = useState('Engineering')
  const [role, setRole] = useState<'admin' | 'employee'>('employee')
  const [error, setError] = useState('')
  const [generatedLoginId, setGeneratedLoginId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !companyName) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, password, companyName, department, role }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const loginId = data.employee?.loginId
        setGeneratedLoginId(loginId)
        onSignup({ name, email, role, companyName, department, loginId })
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch {
      // Direct fallback
      try {
        const directRes = await fetch('http://localhost:8081/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: name, email, password, companyName, department, role }),
        })
        const data = await directRes.json()
        if (directRes.ok && data.success) {
          const loginId = data.employee?.loginId
          setGeneratedLoginId(loginId)
          onSignup({ name, email, role, companyName, department, loginId })
          return
        }
      } catch {}

      onSignup({ name, email, role, companyName, department })
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
            <div className="form-row-2col">
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

              <div className="form-field">
                <label htmlFor="signup-company">Company Name</label>
                <input
                  id="signup-company"
                  type="text"
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="rounded-input"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="signup-password">Password</label>
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

            <div className="form-row-2col">
              <div className="form-field">
                <label htmlFor="signup-department">Department</label>
                <select
                  id="signup-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-input select-input"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="signup-role">Role</label>
                <select
                  id="signup-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
                  className="rounded-input select-input"
                >
                  <option value="admin">👨‍💼 Admin / HR Manager</option>
                  <option value="employee">👨‍💻 Employee</option>
                </select>
              </div>
            </div>

            <button type="submit" className="rounded-submit-btn">
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
