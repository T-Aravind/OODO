import React, { useState } from 'react'
import { MOCK_ATTENDANCE_LOGS } from '../../mock/employeeData'
import type { EmployeeAttendanceLog } from '../../mock/employeeData'

export const EmployeeAttendance: React.FC = () => {
  const [viewTab, setViewTab] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const [logs] = useState<EmployeeAttendanceLog[]>(MOCK_ATTENDANCE_LOGS)
  const [checkedIn, setCheckedIn] = useState(true)

  const toggleTodayCheck = () => {
    setCheckedIn(!checkedIn)
  }

  const getStatusBadge = (status: EmployeeAttendanceLog['status']) => {
    switch (status) {
      case 'present':
        return <span className="status-badge present">🟢 Present</span>
      case 'absent':
        return <span className="status-badge absent">🔴 Absent</span>
      case 'leave':
        return <span className="status-badge leave">🟡 Leave</span>
      case 'half_day':
        return <span className="status-badge halfday">🟠 Half Day</span>
      default:
        return <span className="status-badge">--</span>
    }
  }

  return (
    <div className="attendance-view-container">
      {/* Header & Tabs */}
      <div className="page-header-row">
        <div>
          <h2>Attendance Tracker</h2>
          <p className="sub-text">August 2026 Shift Logs & Records</p>
        </div>
        <div className="tab-pill-group">
          <button
            className={`tab-pill ${viewTab === 'daily' ? 'active' : ''}`}
            onClick={() => setViewTab('daily')}
          >
            Daily
          </button>
          <button
            className={`tab-pill ${viewTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewTab('weekly')}
          >
            Weekly
          </button>
          <button
            className={`tab-pill ${viewTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewTab('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="att-stats-row">
        <div className="att-stat-box green">
          <span className="stat-num">18</span>
          <span className="stat-lbl">Present Days</span>
        </div>
        <div className="att-stat-box red">
          <span className="stat-num">1</span>
          <span className="stat-lbl">Absent Days</span>
        </div>
        <div className="att-stat-box yellow">
          <span className="stat-num">2</span>
          <span className="stat-lbl">Leave Days</span>
        </div>
        <div className="att-stat-box orange">
          <span className="stat-num">1</span>
          <span className="stat-lbl">Half Days</span>
        </div>
      </div>

      {/* Check In / Check Out Banner */}
      <div className="card-box today-banner-card">
        <div className="banner-info">
          <div>
            <h4>Today's Shift Status — 22 August 2026</h4>
            <p>Shift: General (09:00 AM - 06:00 PM)</p>
          </div>
          <div className="time-chips">
            <span className="chip">Check In: <strong>09:14 AM</strong></span>
            <span className="chip">Working Time: <strong>07h 42m</strong></span>
          </div>
        </div>

        <button
          className={checkedIn ? 'btn-action-danger' : 'btn-action-primary'}
          onClick={toggleTodayCheck}
        >
          {checkedIn ? '⏹ CHECK OUT' : '▶ CHECK IN'}
        </button>
      </div>

      {/* Attendance Table */}
      <div className="card-box table-box">
        <div className="box-title">
          <h3>Attendance Records</h3>
        </div>
        <div className="responsive-table-wrapper">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <strong>{log.date}</strong>
                  </td>
                  <td>{log.checkIn || '--'}</td>
                  <td>{log.checkOut || '--'}</td>
                  <td>{log.workingHours || '--'}</td>
                  <td>{getStatusBadge(log.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Attendance Calendar */}
      <div className="card-box calendar-box">
        <div className="box-title">
          <h3>August 2026 Calendar Overview</h3>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="cal-day-header">
              {day}
            </div>
          ))}
          {/* Days 1-31 representation */}
          {Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1
            let statusClass = 'present'
            if (dayNum === 17) statusClass = 'absent'
            if (dayNum === 20) statusClass = 'leave'
            if (dayNum === 18) statusClass = 'halfday'
            if (dayNum > 22) statusClass = 'future'

            return (
              <div key={dayNum} className={`cal-day-cell ${statusClass}`}>
                <span className="day-num">{dayNum}</span>
                {statusClass !== 'future' && <span className="day-dot"></span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
