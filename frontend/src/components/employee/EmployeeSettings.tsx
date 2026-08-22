import React, { useState } from 'react'

export const EmployeeSettings: React.FC = () => {
  const [emailNotif, setEmailNotif] = useState(true)
  const [leaveNotif, setLeaveNotif] = useState(true)
  const [attNotif, setAttNotif] = useState(true)
  const [payrollNotif, setPayrollNotif] = useState(false)

  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="settings-view-container">
      <div className="page-header-row">
        <div>
          <h2>Account & Preferences</h2>
          <p className="sub-text">Manage notifications, account security, and appearance</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Account Security */}
        <div className="card-box">
          <div className="box-title">
            <h3>Account & Security</h3>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Work Email Address</label>
              <input
                type="email"
                value="akash@dayflow.com"
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="modal-input"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="modal-input"
              />
            </div>

            <button
              className="btn-action-primary"
              onClick={() => alert('Password updated successfully!')}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card-box">
          <div className="box-title">
            <h3>Notification Preferences</h3>
          </div>
          <div className="toggles-list">
            <div className="toggle-item">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive updates regarding approvals via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="toggle-switch"
              />
            </div>

            <div className="toggle-item">
              <div>
                <h4>Leave Notifications</h4>
                <p>Get notified when your leave status changes</p>
              </div>
              <input
                type="checkbox"
                checked={leaveNotif}
                onChange={(e) => setLeaveNotif(e.target.checked)}
                className="toggle-switch"
              />
            </div>

            <div className="toggle-item">
              <div>
                <h4>Attendance Reminders</h4>
                <p>Receive check-in and check-out alerts</p>
              </div>
              <input
                type="checkbox"
                checked={attNotif}
                onChange={(e) => setAttNotif(e.target.checked)}
                className="toggle-switch"
              />
            </div>

            <div className="toggle-item">
              <div>
                <h4>Payroll & Salary Alerts</h4>
                <p>Notify when monthly salary slip is generated</p>
              </div>
              <input
                type="checkbox"
                checked={payrollNotif}
                onChange={(e) => setPayrollNotif(e.target.checked)}
                className="toggle-switch"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Interface */}
        <div className="card-box full-width">
          <div className="box-title">
            <h3>Appearance & Interface</h3>
          </div>
          <div className="toggles-list">
            <div className="toggle-item">
              <div>
                <h4>Dark Mode Theme</h4>
                <p>Toggle dark workspace theme across your dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="toggle-switch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
