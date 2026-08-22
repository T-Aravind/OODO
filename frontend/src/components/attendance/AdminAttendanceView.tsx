import React, { useState, useMemo } from 'react'
import {
  Search,
  Calendar,
  RotateCcw,
  Eye,
  Edit2,
  Users,
  Download,
  ShieldCheck
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { AttendanceRecord } from '../../types/attendance'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import { AttendanceSummaryCards } from './AttendanceSummaryCards'
import { AttendanceMonthNav } from './AttendanceMonthNav'
import { AttendanceDetailsDrawer } from './AttendanceDetailsDrawer'
import { EditAttendanceModal } from './EditAttendanceModal'
import { CheckInCard } from './CheckInCard'
import { formatDateDisplay, MONTH_NAMES } from '../../utils/attendanceUtils'

export const AdminAttendanceView: React.FC = () => {
  const { attendanceRecords, employees } = useApp()

  // Date and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewScope, setViewScope] = useState<'daily' | 'monthly'>('daily')

  // Default selected date to today
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0]
  })

  const [currentYear, setCurrentYear] = useState<number>(() => {
    return new Date().getFullYear()
  })

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    return new Date().getMonth()
  })

  // Selected records for Drawer / Edit Modal
  const [activeRecord, setActiveRecord] = useState<AttendanceRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Unique departments list
  const departments = useMemo(() => {
    const set = new Set<string>()
    employees.forEach((e) => {
      if (e.department) set.add(e.department)
    })
    return Array.from(set)
  }, [employees])

  // Real-time dynamic stats for today / selected date
  const adminStats = useMemo(() => {
    const totalEmployees = employees.length
    const todayRecords = attendanceRecords.filter((r) => r.date === selectedDate)

    const presentToday = todayRecords.filter((r) => r.status === 'present').length
    const lateToday = todayRecords.filter((r) => r.status === 'late').length
    const onLeaveToday = todayRecords.filter((r) => r.status === 'leave').length
    const halfDayToday = todayRecords.filter((r) => r.status === 'half_day').length

    const recordedIds = new Set(todayRecords.map((r) => r.employeeId))
    const explicitlyAbsent = todayRecords.filter((r) => r.status === 'absent').length
    const unrecordedCount = employees.filter((e) => !recordedIds.has(e.id)).length
    const absentToday = explicitlyAbsent + unrecordedCount

    return {
      totalEmployees,
      presentToday: presentToday + lateToday + halfDayToday,
      absentToday,
      onLeaveToday,
      lateToday
    }
  }, [employees, attendanceRecords, selectedDate])

  // Filtered attendance records
  const filteredRecords = useMemo(() => {
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`

    return attendanceRecords.filter((record) => {
      // Date or Month scope filter
      if (viewScope === 'daily') {
        if (record.date !== selectedDate) return false
      } else {
        if (!record.date.startsWith(monthPrefix)) return false
      }

      // Status filter
      if (selectedStatus !== 'all' && record.status !== selectedStatus) {
        return false
      }

      // Department filter
      if (selectedDept !== 'all') {
        const emp = employees.find((e) => e.id === record.employeeId)
        const dept = record.department || emp?.department
        if (dept !== selectedDept) return false
      }

      // Search query (Employee name, ID, department)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const emp = employees.find((e) => e.id === record.employeeId)
        const nameMatch = record.employeeName.toLowerCase().includes(q)
        const idMatch = record.employeeId.toLowerCase().includes(q)
        const deptMatch = (record.department || emp?.department || '').toLowerCase().includes(q)

        if (!nameMatch && !idMatch && !deptMatch) return false
      }

      return true
    })
  }, [
    attendanceRecords,
    employees,
    viewScope,
    selectedDate,
    currentYear,
    currentMonth,
    selectedStatus,
    selectedDept,
    searchQuery
  ])

  // Export CSV Report
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return

    const headers = ['Employee ID', 'Employee Name', 'Department', 'Date', 'Check In', 'Check Out', 'Work Hours', 'Extra Hours', 'Status', 'Notes']
    const rows = filteredRecords.map((r) => [
      `"${r.employeeId}"`,
      `"${r.employeeName}"`,
      `"${r.department || ''}"`,
      `"${r.date}"`,
      `"${r.checkIn || ''}"`,
      `"${r.checkOut || ''}"`,
      `"${r.workingHours || ''}"`,
      `"${r.extraHours || ''}"`,
      `"${r.status}"`,
      `"${r.notes || ''}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `DayFlow_Attendance_${viewScope === 'daily' ? selectedDate : `${MONTH_NAMES[currentMonth]}_${currentYear}`}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedDept('all')
    setSelectedStatus('all')
    const today = new Date()
    setSelectedDate(today.toISOString().split('T')[0])
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
  }

  const handleOpenDrawer = (record: AttendanceRecord) => {
    setActiveRecord(record)
    setIsDrawerOpen(true)
  }

  const handleOpenEdit = (record: AttendanceRecord) => {
    setActiveRecord(record)
    setIsEditModalOpen(true)
  }

  return (
    <div className="admin-attendance-container">
      {/* Page Header */}
      <div className="attendance-page-header">
        <div className="page-header-title-block">
          <div className="title-badge-row">
            <h1 className="attendance-main-title">Attendance Management</h1>
            <span className="admin-verified-pill">
              <ShieldCheck size={14} className="text-emerald-600" />
              HR Administration Console
            </span>
          </div>
          <p className="attendance-subtitle">
            Monitor, rectify, and manage real-time company attendance and payroll hours
          </p>
        </div>

        {/* View Scope Switcher & Month Navigation */}
        <div className="header-actions-group">
          <div className="scope-toggle-capsule">
            <button
              onClick={() => setViewScope('daily')}
              className={`scope-btn ${viewScope === 'daily' ? 'active' : ''}`}
            >
              Daily Roster
            </button>
            <button
              onClick={() => setViewScope('monthly')}
              className={`scope-btn ${viewScope === 'monthly' ? 'active' : ''}`}
            >
              Monthly Log
            </button>
          </div>

          {viewScope === 'monthly' ? (
            <AttendanceMonthNav
              currentYear={currentYear}
              currentMonth={currentMonth}
              onChangeMonth={(yr, m) => {
                setCurrentYear(yr)
                setCurrentMonth(m)
              }}
              showTodayBtn={false}
            />
          ) : (
            <button
              onClick={handleExportCSV}
              className="btn-export-csv"
              title="Download CSV report of current records"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin KPI Summary Cards */}
      <AttendanceSummaryCards mode="admin" stats={adminStats} />

      {/* Interactive Punch Action Card (Check In / Check Out) */}
      <CheckInCard />

      {/* Table & Controls Section */}
      <div className="attendance-table-card">
        {/* Filters and Search Bar */}
        <div className="admin-table-filter-bar">
          {/* Real-time search */}
          <div className="search-input-wrapper admin-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by employee name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search employees"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Controls */}
          <div className="filter-controls-cluster">
            {viewScope === 'daily' && (
              <div className="control-field-block">
                <label className="field-micro-label">Inspection Date</label>
                <div className="date-picker-input-wrapper">
                  <Calendar size={14} className="date-icon" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-picker-input"
                    aria-label="Pick date"
                  />
                </div>
              </div>
            )}

            <div className="control-field-block">
              <label className="field-micro-label">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="filter-select-dropdown"
                aria-label="Filter by department"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-field-block">
              <label className="field-micro-label">Status Filter</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select-dropdown"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="late">Late Arrival</option>
                <option value="leave">On Leave</option>
                <option value="half_day">Half Day</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            <button
              onClick={handleClearFilters}
              className="btn-clear-filters"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Date Banner & Quick Filter Chips */}
        <div className="admin-date-banner">
          <div className="banner-left">
            <span className="banner-badge">
              {viewScope === 'daily' ? '📅 Daily Roster' : '📆 Monthly Roster'}
            </span>
            <span className="banner-title">
              {viewScope === 'daily'
                ? formatDateDisplay(selectedDate, 'long')
                : `${MONTH_NAMES[currentMonth]} ${currentYear}`}
            </span>
          </div>

          <div className="admin-quick-filter-chips">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`filter-chip ${selectedStatus === 'all' ? 'active' : ''}`}
            >
              All Records ({filteredRecords.length})
            </button>
            <button
              onClick={() => setSelectedStatus('present')}
              className={`filter-chip ${selectedStatus === 'present' ? 'active' : ''}`}
            >
              🟢 Present ({adminStats.presentToday})
            </button>
            <button
              onClick={() => setSelectedStatus('late')}
              className={`filter-chip ${selectedStatus === 'late' ? 'active' : ''}`}
            >
              🟡 Late ({adminStats.lateToday})
            </button>
            <button
              onClick={() => setSelectedStatus('leave')}
              className={`filter-chip ${selectedStatus === 'leave' ? 'active' : ''}`}
            >
              ✈ Leave ({adminStats.onLeaveToday})
            </button>
            <button
              onClick={() => setSelectedStatus('absent')}
              className={`filter-chip ${selectedStatus === 'absent' ? 'active' : ''}`}
            >
              🔴 Absent ({adminStats.absentToday})
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive-wrapper">
          <table className="corporate-attendance-table admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra Hours</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const emp = employees.find((e) => e.id === record.employeeId)
                  const avatar = record.avatar || emp?.profileImage
                  const isOvertime = record.extraHours && record.extraHours.startsWith('+')
                  const isPresent = record.status === 'present' || record.status === 'late'

                  return (
                    <tr
                      key={record.id}
                      onClick={() => handleOpenDrawer(record)}
                      className="attendance-row-item admin-row"
                    >
                      <td>
                        <div className="emp-profile-cell">
                          <div className="cell-avatar-wrapper">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={record.employeeName}
                                className="cell-avatar-img"
                              />
                            ) : (
                              <div className="cell-avatar-fallback">
                                {record.employeeName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className={`cell-presence-indicator ${isPresent ? 'online' : 'offline'}`} />
                          </div>
                          <div className="cell-emp-info">
                            <span className="cell-emp-name">{record.employeeName}</span>
                            <span className="cell-emp-designation">{emp?.designation || 'Staff'}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge-emp-id">{record.employeeId}</span>
                      </td>

                      <td>
                        <span className="cell-dept-text">
                          {record.department || emp?.department || '—'}
                        </span>
                      </td>

                      <td>
                        <span className="font-mono text-slate-700">
                          {formatDateDisplay(record.date, 'slash')}
                        </span>
                      </td>

                      <td>
                        <span className={`font-mono ${record.checkIn ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                          {record.checkIn || '—'}
                        </span>
                      </td>

                      <td>
                        <span className={`font-mono ${record.checkOut ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                          {record.checkOut || (record.status === 'present' ? 'In Progress' : '—')}
                        </span>
                      </td>

                      <td>
                        <span className="font-mono font-bold text-slate-800">
                          {record.workingHours || '0h 00m'}
                        </span>
                      </td>

                      <td>
                        {isOvertime ? (
                          <span className="overtime-badge">
                            {record.extraHours} OT
                          </span>
                        ) : (
                          <span className="extra-hours-cell font-mono text-slate-400">
                            {record.extraHours || '0h 00m'}
                          </span>
                        )}
                      </td>

                      <td>
                        <AttendanceStatusBadge status={record.status} size="sm" />
                      </td>

                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-actions-cell">
                          <button
                            onClick={() => handleOpenDrawer(record)}
                            className="btn-action-icon view-btn"
                            title="View full details"
                            aria-label="View details"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(record)}
                            className="btn-action-icon edit-btn"
                            title="Edit punch times or status"
                            aria-label="Edit record"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={10} className="table-empty-state">
                    <div className="empty-state-box">
                      <Users size={36} className="text-slate-300 mb-2" />
                      <p className="empty-title">No attendance records match the selected filters</p>
                      <p className="empty-desc">
                        Try searching for a different employee, department, or date range.
                      </p>
                      <button onClick={handleClearFilters} className="btn-empty-reset">
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Action Toolbar */}
        <div className="table-footer-summary-strip">
          <div className="footer-stat-item">
            <span className="footer-stat-label">Displayed Roster:</span>
            <span className="footer-stat-value font-mono font-bold">{filteredRecords.length} Employees</span>
          </div>
          <div className="footer-stat-divider" />
          <div className="footer-stat-item">
            <span className="footer-stat-label">Active Presence:</span>
            <span className="footer-stat-value text-emerald-700 font-bold">{adminStats.presentToday} Present Today</span>
          </div>
          <div className="footer-stat-divider" />
          <button onClick={handleExportCSV} className="footer-export-btn">
            <Download size={13} />
            <span>Download CSV Snapshot</span>
          </button>
        </div>
      </div>

      {/* Details Side Drawer */}
      <AttendanceDetailsDrawer
        record={activeRecord}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(rec) => {
          setIsDrawerOpen(false)
          handleOpenEdit(rec)
        }}
        isAdmin={true}
      />

      {/* Edit Attendance Record Modal */}
      <EditAttendanceModal
        record={activeRecord}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}
