import React from 'react'
import { CheckCircle2, Clock, XCircle, Plane, AlertCircle, Calendar } from 'lucide-react'
import type { AttendanceStatusType } from '../../types/attendance'

interface AttendanceStatusBadgeProps {
  status: AttendanceStatusType
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const getStatusConfig = (st: AttendanceStatusType) => {
    switch (st) {
      case 'present':
        return {
          label: 'Present',
          className: 'badge-present',
          icon: <CheckCircle2 size={13} className="badge-icon" />
        }
      case 'late':
        return {
          label: 'Late Arrival',
          className: 'badge-late',
          icon: <Clock size={13} className="badge-icon" />
        }
      case 'absent':
        return {
          label: 'Absent',
          className: 'badge-absent',
          icon: <XCircle size={13} className="badge-icon" />
        }
      case 'leave':
        return {
          label: 'On Leave',
          className: 'badge-leave',
          icon: <Plane size={13} className="badge-icon" />
        }
      case 'half_day':
        return {
          label: 'Half Day',
          className: 'badge-half-day',
          icon: <AlertCircle size={13} className="badge-icon" />
        }
      case 'weekend':
        return {
          label: 'Weekend',
          className: 'badge-weekend',
          icon: <Calendar size={13} className="badge-icon" />
        }
      default:
        return {
          label: 'Present',
          className: 'badge-present',
          icon: <CheckCircle2 size={13} className="badge-icon" />
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`attendance-status-pill ${config.className} size-${size}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  )
}
