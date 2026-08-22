import React, { useState, useMemo } from 'react'
import {
  Calendar,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { AttendanceRecord } from '../../types/attendance'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import { AttendanceMonthNav } from './AttendanceMonthNav'
import { AttendanceSummaryCards } from './AttendanceSummaryCards'
import { CheckInCard } from './CheckInCard'
import { AttendanceDetailsDrawer } from './AttendanceDetailsDrawer'
import {
  calculatePayrollSummary,
  formatDateDisplay,
  formatDateISO,
  isWeekendDay,
  MONTH_NAMES
} from '../../utils/attendanceUtils'

export const EmployeeAttendanceView: React.FC = () => {
  const { currentUser, attendanceRecords, leaveRecords } = useApp()

  const [currentYear, setCurrentYear] = useState<number>(() => {
    return new Date().getFullYear()
  })

  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    return new Date().getMonth() // 0-11
  })

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const currentEmpId = currentUser?.employeeId || 'EMP001'
  const currentEmpName = currentUser?.name || 'Aravind T'

  // Calculate Monthly Payroll & Attendance Summary
  const payrollSummary = useMemo(() => {
    return calculatePayrollSummary(
      currentEmpId,
      currentEmpName,
      currentYear,
      currentMonth,
      attendanceRecords,
      leaveRecords
    )
  }, [currentEmpId, currentEmpName, currentYear, currentMonth, attendanceRecords, leaveRecords])

  // Construct day-wise full month list for the employee
  const dayWiseMonthRecords = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`

    const existingMap = new Map<string, AttendanceRecord>()
    attendanceRecords
      .filter((r) => r.date && r.date.startsWith(monthPrefix))
      .forEach((r) => {
        const idMatch = r.employeeId && r.employeeId.toLowerCase() === currentEmpId.toLowerCase()
        const nameMatch = r.employeeName && r.employeeName.toLowerCase() === currentEmpName.toLowerCase()
        const defaultMatch = currentEmpId === 'EMP001' || currentEmpId === 'EMP-1001' || r.employeeId === 'EMP001' || r.employeeId === 'EMP-1001'
        if (idMatch || nameMatch || defaultMatch) {
          const existing = existingMap.get(r.date)
          if (!existing || (!existing.checkIn && r.checkIn)) {
            existingMap.set(r.date, r)
          }
        }
      })

    const recordsList: AttendanceRecord[] = []
    const todayStr = formatDateISO(new Date())

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentYear, currentMonth, day)
      const dateStr = formatDateISO(d)
      const isWeekend = isWeekendDay(d)

      const existing = existingMap.get(dateStr)
      if (existing) {
        recordsList.push(existing)
      } else {
        if (isWeekend) {
          recordsList.push({
            id: `AUTO-WKND-${dateStr}`,
            employeeId: currentEmpId,
            employeeName: currentEmpName,
            date: dateStr,
            checkIn: null,
            checkOut: null,
            workingHours: '—',
            extraHours: '0h 00m',
            workMinutes: 0,
            extraMinutes: 0,
            status: 'weekend',
            notes: 'Weekly off / Non-working day.'
          })
        } else if (dateStr <= todayStr) {
          recordsList.push({
            id: `AUTO-ABSENT-${dateStr}`,
            employeeId: currentEmpId,
            employeeName: currentEmpName,
            date: dateStr,
            checkIn: null,
            checkOut: null,
            workingHours: '—',
            extraHours: '0h 00m',
            workMinutes: 0,
            extraMinutes: 0,
            status: 'absent',
            notes: 'Not checked in / Absent'
          })
        }
      }
    }

    // Sort descending by date (most recent first)
    return recordsList.sort((a, b) => b.date.localeCompare(a.date))
  }, [currentYear, currentMonth, attendanceRecords, currentEmpId, currentEmpName])

  // Filter counts for quick tabs
  const filterCounts = useMemo(() => {
    const counts = {
      all: dayWiseMonthRecords.length,
      present: 0,
      late: 0,
      leave: 0,
      half_day: 0,
      absent: 0
    }
    dayWiseMonthRecords.forEach((r) => {
      if (r.status === 'present') counts.present++
      else if (r.status === 'late') counts.late++
      else if (r.status === 'leave') counts.leave++
      else if (r.status === 'half_day') counts.half_day++
      else if (r.status === 'absent') counts.absent++
    })
    return counts
  }, [dayWiseMonthRecords])

  // Filtered records
  const filteredRecords = useMemo(() => {
    return dayWiseMonthRecords.filter((r) => {
      if (statusFilter === 'all') return true
      return r.status === statusFilter
    })
  }, [dayWiseMonthRecords, statusFilter])

  const handleRowClick = (record: AttendanceRecord) => {
    setSelectedRecord(record)
    setIsDrawerOpen(true)
  }

  const handleResetToToday = () => {
    const today = new Date()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
  }

  return (
    <div className="employee-attendance-container">
      {/* Page Header */}
      <div className="attendance-page-header">
        <div className="page-header-title-block">
          <div className="title-badge-row">
            <h1 className="attendance-main-title">Attendance</h1>
            <span className="period-badge">
              <Sparkles size={13} className="text-indigo-600" />
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
          </div>
          <p className="attendance-subtitle">
            View your day-wise attendance log, working hours, and shift timings
          </p>
        </div>

        {/* Month Navigation Capsule */}
        <AttendanceMonthNav
          currentYear={currentYear}
          currentMonth={currentMonth}
          onChangeMonth={(yr, m) => {
            setCurrentYear(yr)
            setCurrentMonth(m)
          }}
          onResetToCurrent={handleResetToToday}
        />
      </div>

      {/* KPI Summary Cards */}
      <AttendanceSummaryCards mode="employee" summary={payrollSummary} />

      {/* Interactive Punch Action Card ("Today's Attendance") */}
      <CheckInCard />

      {/* Attendance Table Card */}
      <div className="attendance-table-card">
        <div className="table-header-toolbar">
          <div className="toolbar-left">
            <h2 className="table-section-title">
              Monthly Attendance Records
              <span className="count-pill">{filteredRecords.length} entries</span>
            </h2>
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="toolbar-right">
            <div className="quick-filter-pill-group">
              <button
                onClick={() => setStatusFilter('all')}
                className={`quick-pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
              >
                All ({filterCounts.all})
              </button>
              <button
                onClick={() => setStatusFilter('present')}
                className={`quick-pill-btn ${statusFilter === 'present' ? 'active' : ''}`}
              >
                Present ({filterCounts.present})
              </button>
              <button
                onClick={() => setStatusFilter('late')}
                className={`quick-pill-btn ${statusFilter === 'late' ? 'active' : ''}`}
              >
                Late ({filterCounts.late})
              </button>
              <button
                onClick={() => setStatusFilter('leave')}
                className={`quick-pill-btn ${statusFilter === 'leave' ? 'active' : ''}`}
              >
                Leaves ({filterCounts.leave})
              </button>
              <button
                onClick={() => setStatusFilter('absent')}
                className={`quick-pill-btn ${statusFilter === 'absent' ? 'active' : ''}`}
              >
                Absent ({filterCounts.absent})
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive-wrapper">
          <table className="corporate-attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra Hours</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const isWeekend = record.status === 'weekend'
                  const isOvertime = record.extraHours && record.extraHours.startsWith('+')

                  return (
                    <tr
                      key={record.id}
                      onClick={() => handleRowClick(record)}
                      className={`attendance-row-item ${isWeekend ? 'row-weekend' : ''}`}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleRowClick(record)
                        }
                      }}
                    >
                      <td>
                        <div className="date-cell">
                          <span className="date-slash-text">{formatDateDisplay(record.date, 'slash')}</span>
                          <span className="date-medium-text">{formatDateDisplay(record.date, 'medium')}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`time-cell font-mono ${record.checkIn ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                          {record.checkIn || '—'}
                        </span>
                      </td>

                      <td>
                        <span className={`time-cell font-mono ${record.checkOut ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                          {record.checkOut || (record.status === 'present' && !isWeekend ? 'In Progress' : '—')}
                        </span>
                      </td>

                      <td>
                        <span className="work-hours-cell font-mono">
                          {record.workingHours || (isWeekend ? '—' : '0h 00m')}
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

                      <td className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(record)
                          }}
                          className="btn-row-action"
                          title="View Attendance Details"
                          aria-label="View Attendance Details"
                        >
                          <span>Details</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="table-empty-state">
                    <div className="empty-state-box">
                      <Calendar size={36} className="text-slate-300 mb-2" />
                      <p className="empty-title">No attendance records found for this filter</p>
                      <p className="empty-desc">Try choosing a different status filter or month period.</p>
                      <button onClick={() => setStatusFilter('all')} className="btn-empty-reset">
                        Show All Records
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Footer Summary */}
        <div className="table-footer-summary-strip">
          <div className="footer-stat-item">
            <span className="footer-stat-label">Month Total Hours:</span>
            <span className="footer-stat-value font-mono">{payrollSummary.totalWorkHoursFormatted}</span>
          </div>
          <div className="footer-stat-divider" />
          <div className="footer-stat-item">
            <span className="footer-stat-label">Payable Attendance:</span>
            <span className="footer-stat-value text-indigo-700 font-bold">{payrollSummary.payableDays} / {payrollSummary.totalWorkingDays} Days</span>
          </div>
          <div className="footer-stat-divider" />
          <div className="footer-stat-item">
            <Award size={14} className="text-emerald-600" />
            <span className="footer-stat-sub">Automated calculation aligned with corporate payroll cycle.</span>
          </div>
        </div>
      </div>

      {/* Details Side Drawer */}
      <AttendanceDetailsDrawer
        record={selectedRecord}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isAdmin={false}
      />
    </div>
  )
}
