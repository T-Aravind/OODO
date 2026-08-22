import React, { useState } from 'react'

interface SignupPageProps {
  onSignup: (userData: {
    name: string
    email: string
    role: 'admin' | 'employee'
    companyName: string
    department: string
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !companyName) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    onSignup({ name, email, role, companyName, department })
  }

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="brand-badge">⚡ Day-Flow HRMS</div>
          <h2>Create Account</h2>
          <p>Register as Admin or Employee to manage attendance & workflow</p>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid-2">
            <div className="input-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="signup-email">Work Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="input-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="signup-company">Company / Org Name</label>
              <input
                id="signup-company"
                type="text"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="input-group">
              <label htmlFor="signup-department">Department</label>
              <select
                id="signup-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-control"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="signup-role">Account Type / Role</label>
              <select
                id="signup-role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
                className="form-control"
              >
                <option value="admin">👨‍💼 Admin / HR Manager</option>
                <option value="employee">👨‍💻 Employee</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-auth-submit">
            Complete Registration
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already registered?{' '}
            <button type="button" className="auth-switch-btn" onClick={onNavigateToLogin}>
              Sign In Here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
