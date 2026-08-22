import React from 'react'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import type { LeaveStatus } from '../../types'

interface LeaveStatusBadgeProps {
  status: LeaveStatus
  size?: 'sm' | 'md' | 'lg'
}

export const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Approved':
        return {
          icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
          label: 'Approved',
          className: 'badge-approved'
        }
      case 'Pending':
        return {
          icon: <Clock3 size={size === 'sm' ? 12 : 14} />,
          label: 'Pending',
          className: 'badge-pending'
        }
      case 'Rejected':
        return {
          icon: <XCircle size={size === 'sm' ? 12 : 14} />,
          label: 'Rejected',
          className: 'badge-rejected'
        }
      default:
        return {
          icon: <Clock3 size={size === 'sm' ? 12 : 14} />,
          label: status,
          className: 'badge-pending'
        }
    }
  }

  const config = getBadgeConfig()

  return (
    <span className={`leave-status-badge ${config.className} size-${size}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  )
}
