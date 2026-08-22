import React, { useState } from 'react'

interface LoginPageProps {
  onLogin: (userData: { email: string; role: 'admin' | 'employee'; name: string }) => void
  onNavigateToSignup: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'employee'>('admin')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    const name = email.split('@')[0].replace('.', ' ')
    onLogin({ email, role, name: name.charAt(0).toUpperCase() + name.slice(1) })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-badge">⚡ Day-Flow HRMS</div>
          <h2>Sign In</h2>
          <p>Access your employee management workspace</p>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="e.g. admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-role">Select Role</label>
            <select
              id="login-role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
              className="form-control"
            >
              <option value="admin">👨‍💼 Admin / HR Manager</option>
              <option value="employee">👨‍💻 Employee</option>
            </select>
          </div>

          <button type="submit" className="btn-auth-submit">
            Sign In to Workspace
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <button type="button" className="auth-switch-btn" onClick={onNavigateToSignup}>
              Create Account (Sign Up)
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
