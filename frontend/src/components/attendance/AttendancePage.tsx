import React, { useState, useMemo } from 'react'
import { Clock, Search, UserCheck, ShieldAlert, Plane } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const AttendancePage: React.FC = () => {
  const { attendanceRecords, employees } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const stats = useMemo(() => {
    const presentCount = employees.filter((e) => e.status === 'present').length
    const onLeaveCount = employees.filter((e) => e.status === 'on_leave').length
    const absentCount = employees.filter((e) => e.status === 'absent').length
    return {
      total: employees.length,
      present: presentCount,
      onLeave: onLeaveCount,
      absent: absentCount
    }
  }, [employees])

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((rec) => {
      if (statusFilter !== 'all' && rec.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          rec.employeeName.toLowerCase().includes(q) ||
          rec.employeeId.toLowerCase().includes(q) ||
          rec.date.includes(q)
        )
      }
      return true
    })
  }, [attendanceRecords, searchQuery, statusFilter])

  return (
    <div className="attendance-page-layout">
      {/* Attendance Header */}
      <div className="attendance-header-section">
        <div>
          <h1 className="module-title">Attendance & Time Logs</h1>
          <p className="module-subtitle">
            Track daily work check-ins, office presence, and shift durations
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="attendance-stats-grid">
        <div className="stat-metric-card stat-present">
          <div className="stat-icon-wrapper text-emerald-600 bg-emerald-50">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Present in Office</span>
            <div className="stat-number">{stats.present} <span className="stat-total">/ {stats.total}</span></div>
            <span className="stat-subtext text-emerald-700">🟢 Checked in & working</span>
          </div>
        </div>

        <div className="stat-metric-card stat-leave">
          <div className="stat-icon-wrapper text-blue-600 bg-blue-50">
            <Plane size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">On Approved Leave</span>
            <div className="stat-number">{stats.onLeave}</div>
            <span className="stat-subtext text-blue-700">✈ Scheduled time off</span>
          </div>
        </div>

        <div className="stat-metric-card stat-absent">
          <div className="stat-icon-wrapper text-amber-600 bg-amber-50">
            <ShieldAlert size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Absent / Not Checked In</span>
            <div className="stat-number">{stats.absent}</div>
            <span className="stat-subtext text-amber-700">🟡 Awaiting punch-in</span>
          </div>
        </div>

        <div className="stat-metric-card stat-avg">
          <div className="stat-icon-wrapper text-indigo-600 bg-indigo-50">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Standard Work Hours</span>
            <div className="stat-number">8.5 <span className="stat-unit">hrs/day</span></div>
            <span className="stat-subtext text-slate-500">General shift timing</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="attendance-table-card">
        {/* Table Filter & Search Controls */}
        <div className="table-controls-bar">
          <div className="search-input-wrapper compact">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search records by employee or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="on_leave">On Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="table-responsive-wrapper">
          <table className="corporate-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span className="font-mono text-slate-700">{record.date}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-900">{record.employeeName}</span>
                    </td>
                    <td>
                      <span className="badge-emp-id">{record.employeeId}</span>
                    </td>
                    <td>
                      <span className="font-mono text-slate-800">
                        {record.checkIn || '—'}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-slate-800">
                        {record.checkOut || (record.status === 'present' ? 'In Progress' : '—')}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium text-slate-700">
                        {record.workingHours || '—'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-table-pill status-${record.status}`}
                      >
                        {record.status === 'present' && '🟢 Present'}
                        {record.status === 'on_leave' && '✈ On Leave'}
                        {record.status === 'absent' && '🟡 Absent'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-no-data">
                    No attendance records found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
