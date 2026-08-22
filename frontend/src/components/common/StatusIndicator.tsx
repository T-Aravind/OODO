import React from 'react'
import { Plane } from 'lucide-react'
import type { EmployeeStatus } from '../../types'

interface StatusIndicatorProps {
  status: EmployeeStatus
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showLabel = false,
  size = 'md',
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'present':
        return {
          label: 'Present',
          tooltip: 'Present in the office',
          dotClass: 'status-dot-present',
          badgeClass: 'status-badge-present',
          icon: <span className="status-ping-dot green" />
        }
      case 'on_leave':
        return {
          label: 'On Leave',
          tooltip: 'Currently on approved leave',
          dotClass: 'status-dot-leave',
          badgeClass: 'status-badge-leave',
          icon: <Plane className="w-3.5 h-3.5 text-blue-600 status-plane-icon" size={14} />
        }
      case 'absent':
      default:
        return {
          label: 'Absent',
          tooltip: 'Absent / Not checked in today',
          dotClass: 'status-dot-absent',
          badgeClass: 'status-badge-absent',
          icon: <span className="status-ping-dot yellow" />
        }
    }
  }

  const config = getStatusConfig()

  if (showLabel) {
    return (
      <div className={`status-pill ${config.badgeClass} size-${size} ${className}`} title={config.tooltip}>
        <span className="status-icon-wrapper">{config.icon}</span>
        <span className="status-pill-text">{config.label}</span>
      </div>
    )
  }

  return (
    <div
      className={`status-indicator-dot size-${size} ${config.dotClass} ${className}`}
      title={config.tooltip}
      aria-label={config.tooltip}
    >
      {config.icon}
    </div>
  )
}
