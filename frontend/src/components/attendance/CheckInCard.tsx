import React, { useMemo } from 'react'
import { Clock, LogIn, LogOut, ShieldCheck, Sparkles, Coffee, Briefcase } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const CheckInCard: React.FC = () => {
  const { currentUser, checkInState, performCheckIn, performCheckOut, attendanceRecords } = useApp()

  const todayStr = new Date().toISOString().split('T')[0]
  const todayRecord = attendanceRecords.find(
    (r) => r.employeeId === (currentUser?.employeeId || 'EMP001') && r.date === todayStr
  )

  const isCheckedIn = checkInState.isCheckedIn
  const hasCompletedToday = !isCheckedIn && todayRecord?.checkOut != null

  // Format seconds to HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Progress percentage out of 8 hours (28,800 seconds)
  const progressPercent = useMemo(() => {
    if (!isCheckedIn) return 0
    const percent = Math.min(100, Math.round((checkInState.elapsedSeconds / 28800) * 100))
    return percent
  }, [isCheckedIn, checkInState.elapsedSeconds])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const currentDateDisplay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className={`checkin-action-card ${isCheckedIn ? 'active-shift-card' : ''}`}>
      <div className="checkin-card-header">
        <div className="checkin-header-left">
          <div className={`checkin-icon-badge ${isCheckedIn ? 'active' : ''}`}>
            <Clock size={20} className={isCheckedIn ? 'text-emerald-600 animate-spin-slow' : 'text-primary-accent'} />
          </div>
          <div>
            <div className="checkin-greeting-row">
              <h2 className="checkin-card-title">{greeting}, {currentUser?.name || 'Aravind'}</h2>
              <span className="shift-tag">
                <Briefcase size={12} />
                General Shift (09:00 AM - 06:00 PM)
              </span>
            </div>
            <p className="checkin-card-date">{currentDateDisplay}</p>
          </div>
        </div>

        <div className="checkin-header-status">
          {isCheckedIn && (
            <span className="live-status-pill online">
              <span className="live-status-dot green" />
              <span>Checked In & Working</span>
            </span>
          )}
          {hasCompletedToday && (
            <span className="live-status-pill completed">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Shift Completed Today</span>
            </span>
          )}
          {!isCheckedIn && !hasCompletedToday && (
            <span className="live-status-pill offline">
              <span className="live-status-dot red" />
              <span>Not Checked In</span>
            </span>
          )}
        </div>
      </div>

      <div className="checkin-card-body">
        {/* Dynamic Punch Workflow */}
        {isCheckedIn ? (
          <div className="punch-active-container">
            <div className="punch-active-info">
              <div className="punch-meta-item">
                <span className="punch-meta-label">Check-In Time</span>
                <span className="punch-meta-value text-emerald-600 font-mono font-bold">
                  {checkInState.checkInTime || todayRecord?.checkIn || '—'}
                </span>
              </div>

              <div className="punch-meta-divider" />

              <div className="punch-meta-item">
                <span className="punch-meta-label">Time Elapsed</span>
                <span className="punch-timer-display">
                  <Clock size={16} className="animate-spin-slow text-indigo-600" />
                  {formatDuration(checkInState.elapsedSeconds)}
                </span>
              </div>

              <div className="punch-meta-divider" />

              <div className="punch-meta-item progress-meta">
                <div className="progress-label-row">
                  <span className="punch-meta-label">Shift Target (8.0 hrs)</span>
                  <span className="progress-percent-val">{progressPercent}%</span>
                </div>
                <div className="shift-progress-bar-bg">
                  <div
                    className="shift-progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="punch-btn-wrapper">
              <button
                onClick={performCheckOut}
                className="btn-punch-action btn-punch-checkout"
                id="btn-employee-checkout"
              >
                <LogOut size={16} />
                <span>Check Out for the Day</span>
              </button>
            </div>
          </div>
        ) : hasCompletedToday ? (
          <div className="punch-completed-container">
            <div className="punch-summary-row">
              <div className="punch-pill-info">
                <span className="label">Check In:</span>
                <strong className="font-mono">{todayRecord?.checkIn}</strong>
              </div>
              <span className="arrow-sep">&rarr;</span>
              <div className="punch-pill-info">
                <span className="label">Check Out:</span>
                <strong className="font-mono">{todayRecord?.checkOut}</strong>
              </div>
              <div className="punch-pill-info highlight">
                <span className="label">Total Worked:</span>
                <strong className="text-emerald-700 font-mono font-bold">{todayRecord?.workingHours}</strong>
              </div>
              {todayRecord?.extraHours && todayRecord.extraHours.startsWith('+') && (
                <div className="punch-pill-info ot-highlight">
                  <span className="label">Overtime:</span>
                  <strong className="text-indigo-700 font-mono font-bold">{todayRecord?.extraHours}</strong>
                </div>
              )}
            </div>

            <div className="punch-completed-footer-actions">
              <p className="punch-completed-note">
                🎉 Great job! You have logged your full day's attendance. Your hours are recorded for payroll.
              </p>
              <button
                onClick={performCheckIn}
                className="btn-repunch-demo"
                title="Start another punch session for demo"
              >
                <LogIn size={13} />
                <span>Punch In Again (Demo)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="punch-idle-container">
            <div className="punch-prompt-text">
              <p className="main-prompt">Ready to start your work day?</p>
              <p className="sub-prompt">
                Standard shift: 09:00 AM – 06:00 PM • Standard Break: 45 minutes
              </p>
            </div>

            <button
              onClick={performCheckIn}
              className="btn-punch-action btn-punch-checkin"
              id="btn-employee-checkin"
            >
              <LogIn size={16} />
              <span>Check In Now</span>
            </button>
          </div>
        )}
      </div>

      <div className="checkin-card-footer">
        <div className="footer-tips">
          <Sparkles size={13} className="text-indigo-500" />
          <span>Automatic overtime & deficit hours calculated relative to the standard 8-hour workday.</span>
        </div>
        <div className="footer-break-info">
          <Coffee size={13} className="text-amber-600" />
          <span>Lunch & tea breaks: 45 mins auto-deducted from gross session.</span>
        </div>
      </div>
    </div>
  )
}
