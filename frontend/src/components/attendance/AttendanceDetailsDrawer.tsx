import React from 'react'
import {
  X,
  Calendar,
  Clock,
  Coffee,
  Zap,
  FileText,
  Building,
  CheckCircle2
} from 'lucide-react'
import type { AttendanceRecord } from '../../types/attendance'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import { formatDateDisplay } from '../../utils/attendanceUtils'

interface AttendanceDetailsDrawerProps {
  record: AttendanceRecord | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (record: AttendanceRecord) => void
  isAdmin?: boolean
}

export const AttendanceDetailsDrawer: React.FC<AttendanceDetailsDrawerProps> = ({
  record,
  isOpen,
  onClose,
  onEdit,
  isAdmin = false
}) => {
  if (!isOpen || !record) return null

  const isFullPresent = record.status === 'present' || record.status === 'late'
  const isHalfDay = record.status === 'half_day'

  return (
    <div className="attendance-drawer-backdrop" onClick={onClose}>
      <div
        className="attendance-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <h2 id="drawer-title" className="drawer-title">Attendance Details</h2>
            <p className="drawer-subtitle">
              Detailed breakdown of daily punch and shift metrics
            </p>
          </div>
          <button
            onClick={onClose}
            className="drawer-close-btn"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          {/* Employee Identity Card */}
          <div className="drawer-employee-card">
            <div className="drawer-avatar-wrapper">
              {record.avatar ? (
                <img
                  src={record.avatar}
                  alt={record.employeeName}
                  className="drawer-avatar-img"
                />
              ) : (
                <div className="drawer-avatar-fallback">
                  {record.employeeName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="drawer-emp-info">
              <h3 className="drawer-emp-name">{record.employeeName}</h3>
              <div className="drawer-emp-meta">
                <span className="badge-emp-id">{record.employeeId}</span>
                {record.department && (
                  <span className="drawer-dept-tag">
                    <Building size={12} />
                    {record.department}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Date & Status Banner */}
          <div className="drawer-section-banner">
            <div className="banner-date-block">
              <Calendar size={18} className="text-primary-accent" />
              <div className="banner-date-text">
                <span className="label">Log Date</span>
                <strong className="val">{formatDateDisplay(record.date, 'long')}</strong>
              </div>
            </div>
            <div className="banner-status-block">
              <AttendanceStatusBadge status={record.status} size="lg" />
            </div>
          </div>

          {/* Metric Grid: Check-in, Check-out, Work hours, Break */}
          <div className="drawer-metrics-grid">
            <div className="metric-box">
              <div className="metric-box-icon text-emerald-600 bg-emerald-50">
                <Clock size={16} />
              </div>
              <div className="metric-box-data">
                <span className="m-label">Check In</span>
                <span className="m-val font-mono font-bold">{record.checkIn || '—'}</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-box-icon text-indigo-600 bg-indigo-50">
                <Clock size={16} />
              </div>
              <div className="metric-box-data">
                <span className="m-label">Check Out</span>
                <span className="m-val font-mono font-bold">
                  {record.checkOut || (record.status === 'present' ? 'In Progress' : '—')}
                </span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-box-icon text-amber-600 bg-amber-50">
                <Coffee size={16} />
              </div>
              <div className="metric-box-data">
                <span className="m-label">Break Duration</span>
                <span className="m-val font-mono">
                  {record.breakDuration !== undefined ? `${record.breakDuration} mins` : '45 mins'}
                </span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-box-icon text-blue-600 bg-blue-50">
                <Zap size={16} />
              </div>
              <div className="metric-box-data">
                <span className="m-label">Net Work Hours</span>
                <span className="m-val font-mono text-primary font-bold">
                  {record.workingHours || '0h 00m'}
                </span>
              </div>
            </div>
          </div>

          {/* Overtime / Extra Hours section */}
          <div className="drawer-info-card">
            <div className="info-card-row">
              <div className="info-row-left">
                <Clock size={16} className="text-slate-500" />
                <span className="info-row-label">Overtime / Extra Hours:</span>
              </div>
              <span className="font-mono font-bold text-emerald-700">
                {record.extraHours || '0h 00m'}
              </span>
            </div>

            <div className="info-card-row">
              <div className="info-row-left">
                <CheckCircle2 size={16} className="text-indigo-600" />
                <span className="info-row-label">Payroll Countable Day:</span>
              </div>
              <span className="font-semibold text-slate-800">
                {isFullPresent
                  ? '1.0 Full Payable Day'
                  : isHalfDay
                  ? '0.5 Half Payable Day'
                  : record.status === 'leave'
                  ? record.isUnpaidLeave
                    ? '0.0 Unpaid Leave'
                    : '1.0 Paid Leave'
                  : '0.0 Absent (Deducted)'}
              </span>
            </div>
          </div>

          {/* Notes & Activity Log */}
          <div className="drawer-notes-block">
            <div className="notes-header">
              <FileText size={15} className="text-slate-500" />
              <span>Shift Notes & Remarks</span>
            </div>
            <p className="notes-content">
              {record.notes || 'Standard working day recorded via DayFlow HRMS time tracking.'}
            </p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          {isAdmin && onEdit && (
            <button
              onClick={() => {
                onClose()
                onEdit(record)
              }}
              className="btn-drawer-edit"
              id="btn-edit-from-drawer"
            >
              Edit Attendance Record
            </button>
          )}
          <button onClick={onClose} className="btn-drawer-close">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  )
}
