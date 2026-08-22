import React, { useState, useEffect } from 'react'
import {
  MOCK_CURRENT_EMPLOYEE,
  MOCK_LEAVE_BALANCES,
  MOCK_RECENT_ACTIVITY,
} from '../../mock/employeeData'

interface EmployeeDashboardProps {
  onNavigate: (path: string) => void
  onOpenLeaveModal: () => void
}

type AttendanceState = 'not_checked_in' | 'checked_in' | 'completed'

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onNavigate,
  onOpenLeaveModal,
}) => {
  // Interactive Attendance State
  const [attState, setAttState] = useState<AttendanceState>('not_checked_in')
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

  // Timer for working hours while checked in
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (attState === 'checked_in') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [attState])

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    const secs = totalSec % 60
    return `${hrs.toString().padStart(2, '0')}h ${mins
      .toString()
      .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
  }

  const handleCheckIn = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setCheckInTime(timeStr)
    setAttState('checked_in')
    setElapsedSeconds(27720) // Start at ~7h 42m for demo realism
  }

  const handleCheckOut = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setCheckOutTime(timeStr)
    setAttState('completed')
  }

  return (
    <div className="dashboard-view-container">
      {/* Welcome Header */}
      <div className="dash-welcome-banner">
        <div className="welcome-text">
          <h1>Good Morning, {MOCK_CURRENT_EMPLOYEE.name.split(' ')[0]} 👋</h1>
          <p>Here's your work overview & daily flow for today.</p>
        </div>
        <div className="banner-date-badge">
          <span>📅 Friday, 22 August 2026</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card-widget" onClick={() => onNavigate('/employee/attendance')}>
          <div className="stat-header">
            <span className="stat-title">Today's Attendance</span>
            <span className="stat-icon-circle purple">🕐</span>
          </div>
          <div className="stat-value">
            {attState === 'not_checked_in' ? 'NOT CHECKED IN' : 'PRESENT'}
          </div>
          <div className="stat-subtext">
            {attState === 'checked_in'
              ? `Checked in at ${checkInTime}`
              : attState === 'completed'
              ? 'Shift completed'
              : 'Action required'}
          </div>
        </div>

        <div className="stat-card-widget">
          <div className="stat-header">
            <span className="stat-title">Working Hours</span>
            <span className="stat-icon-circle blue">⏱</span>
          </div>
          <div className="stat-value">
            {attState === 'not_checked_in'
              ? '00h 00m'
              : attState === 'checked_in'
              ? formatTimer(elapsedSeconds)
              : '08h 48m'}
          </div>
          <div className="stat-subtext">Target: 08h 00m daily</div>
        </div>

        <div className="stat-card-widget" onClick={() => onNavigate('/employee/leave')}>
          <div className="stat-header">
            <span className="stat-title">Leave Balance</span>
            <span className="stat-icon-circle green">📅</span>
          </div>
          <div className="stat-value">{MOCK_LEAVE_BALANCES.paidLeave + MOCK_LEAVE_BALANCES.sickLeave} Days</div>
          <div className="stat-subtext">
            {MOCK_LEAVE_BALANCES.paidLeave} Paid | {MOCK_LEAVE_BALANCES.sickLeave} Sick
          </div>
        </div>

        <div className="stat-card-widget" onClick={() => onNavigate('/employee/leave')}>
          <div className="stat-header">
            <span className="stat-title">Pending Requests</span>
            <span className="stat-icon-circle orange">📋</span>
          </div>
          <div className="stat-value">1 Request</div>
          <div className="stat-subtext">Awaiting HR approval</div>
        </div>
      </div>

      {/* Main Dashboard Row: Attendance Widget & Recent Activity */}
      <div className="dash-main-grid">
        {/* Left: Today's Attendance Widget Card */}
        <div className="card-box att-widget-box">
          <div className="box-title">
            <h3>Today's Attendance</h3>
            <span className="live-status-pill">
              {attState === 'checked_in' ? '🟢 Live Working' : attState === 'completed' ? '🏁 Completed' : '⚪ Pending'}
            </span>
          </div>

          <div className="att-widget-body">
            {attState === 'not_checked_in' && (
              <div className="att-state-view">
                <div className="att-status-badge inactive">Not Checked In</div>
                <div className="att-time-display">
                  <span className="label">Current Time</span>
                  <span className="time-val">09:14 AM</span>
                </div>
                <button className="btn-action-primary checkin-btn" onClick={handleCheckIn}>
                  <span className="btn-icon">▶</span> CHECK IN
                </button>
              </div>
            )}

            {attState === 'checked_in' && (
              <div className="att-state-view">
                <div className="att-status-badge active">🟢 PRESENT</div>
                <div className="att-time-grid">
                  <div className="time-item">
                    <span className="label">Checked In</span>
                    <span className="val">{checkInTime || '09:14 AM'}</span>
                  </div>
                  <div className="time-item">
                    <span className="label">Working Time</span>
                    <span className="val highlight">{formatTimer(elapsedSeconds)}</span>
                  </div>
                </div>
                <button className="btn-action-danger checkout-btn" onClick={handleCheckOut}>
                  <span className="btn-icon">⏹</span> CHECK OUT
                </button>
              </div>
            )}

            {attState === 'completed' && (
              <div className="att-state-view">
                <div className="att-status-badge completed">🟢 Attendance Completed</div>
                <div className="att-time-grid-3">
                  <div className="time-item">
                    <span className="label">Check In</span>
                    <span className="val">{checkInTime || '09:14 AM'}</span>
                  </div>
                  <div className="time-item">
                    <span className="label">Check Out</span>
                    <span className="val">{checkOutTime || '06:02 PM'}</span>
                  </div>
                  <div className="time-item">
                    <span className="label">Total Hours</span>
                    <span className="val highlight">08h 48m</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Actions Card */}
        <div className="card-box quick-actions-box">
          <div className="box-title">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <button className="qa-card" onClick={() => onNavigate('/employee/attendance')}>
              <span className="qa-icon">🕐</span>
              <div className="qa-info">
                <h4>Attendance</h4>
                <p>View logs & shifts</p>
              </div>
            </button>

            <button className="qa-card" onClick={onOpenLeaveModal}>
              <span className="qa-icon">📅</span>
              <div className="qa-info">
                <h4>Apply Leave</h4>
                <p>Request time off</p>
              </div>
            </button>

            <button className="qa-card" onClick={() => onNavigate('/employee/profile')}>
              <span className="qa-icon">👤</span>
              <div className="qa-info">
                <h4>My Profile</h4>
                <p>View personal info</p>
              </div>
            </button>

            <button className="qa-card" onClick={() => onNavigate('/employee/payroll')}>
              <span className="qa-icon">💰</span>
              <div className="qa-info">
                <h4>Payroll</h4>
                <p>View salary slips</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="card-box recent-activity-box">
        <div className="box-title">
          <h3>Recent Activity</h3>
        </div>
        <div className="activity-timeline">
          {MOCK_RECENT_ACTIVITY.map((act) => (
            <div key={act.id} className="timeline-item">
              <div className={`timeline-dot ${act.statusType}`}></div>
              <div className="timeline-content">
                <span className="timeline-title">{act.title}</span>
                <span className="timeline-time">{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
