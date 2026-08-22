import React, { useState, useRef, useEffect } from 'react'
import { Clock, LogIn, LogOut, CheckCircle2, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const CheckInOutWidget: React.FC = () => {
  const { checkInState, performCheckIn, performCheckOut, currentUser } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Format elapsed seconds into HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isCheckedIn = checkInState.isCheckedIn

  return (
    <div className="checkin-systray-container" ref={dropdownRef}>
      {/* Top Bar Quick Action Capsule */}
      <div className={`checkin-capsule ${isCheckedIn ? 'active-checked-in' : 'inactive-checked-out'}`}>
        {/* Status Dot */}
        <span
          className={`systray-status-dot ${isCheckedIn ? 'dot-green' : 'dot-red'}`}
          title={isCheckedIn ? 'Status: Present (Checked In)' : 'Status: Absent (Not Checked In)'}
        />

        {isCheckedIn ? (
          <div className="checkin-info-inline">
            <span className="since-label">Since {checkInState.checkInTime}</span>
            <span className="live-timer-badge">
              <Clock size={12} className="timer-icon animate-spin-slow" />
              {formatDuration(checkInState.elapsedSeconds)}
            </span>
            <button
              onClick={performCheckOut}
              className="btn-systray-action btn-checkout"
              title="Click to check out"
            >
              <LogOut size={13} />
              <span>Check Out &rarr;</span>
            </button>
          </div>
        ) : (
          <div className="checkin-info-inline">
            <span className="absent-label">Not Checked In</span>
            <button
              onClick={performCheckIn}
              className="btn-systray-action btn-checkin"
              title="Click to check in"
            >
              <LogIn size={13} />
              <span>Check IN &rarr;</span>
            </button>
          </div>
        )}

        {/* Dropdown Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="systray-dropdown-toggle"
          aria-label="Toggle attendance details"
        >
          <ChevronDown size={14} className={isOpen ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Systray Popover Details */}
      {isOpen && (
        <div className="systray-popover">
          <div className="systray-popover-header">
            <div className="systray-popover-title">
              <Clock size={16} className="text-primary" />
              <span>Daily Attendance Punch</span>
            </div>
            <span className={`badge-status-pill ${isCheckedIn ? 'present' : 'absent'}`}>
              {isCheckedIn ? '🟢 Present' : '🔴 Not Checked In'}
            </span>
          </div>

          <div className="systray-popover-body">
            <div className="popover-metric-row">
              <span className="metric-label">Employee</span>
              <span className="metric-value font-semibold">{currentUser?.name || 'Aravind T'}</span>
            </div>
            <div className="popover-metric-row">
              <span className="metric-label">Today's Date</span>
              <span className="metric-value">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {isCheckedIn && (
              <>
                <div className="popover-metric-row">
                  <span className="metric-label">Check-In Time</span>
                  <span className="metric-value font-semibold text-emerald-600">{checkInState.checkInTime}</span>
                </div>
                <div className="popover-metric-row">
                  <span className="metric-label">Active Session</span>
                  <span className="metric-value timer-highlight">{formatDuration(checkInState.elapsedSeconds)}</span>
                </div>
              </>
            )}
          </div>

          <div className="systray-popover-footer">
            {isCheckedIn ? (
              <button
                onClick={() => {
                  performCheckOut()
                  setIsOpen(false)
                }}
                className="btn-popover-action btn-popover-checkout"
              >
                <LogOut size={16} />
                <span>Check Out Now</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  performCheckIn()
                  setIsOpen(false)
                }}
                className="btn-popover-action btn-popover-checkin"
              >
                <CheckCircle2 size={16} />
                <span>Check In to Work</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
