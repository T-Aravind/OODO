import React from 'react'
import { Mail, MapPin, Briefcase } from 'lucide-react'
import type { Employee } from '../../types'
import { StatusIndicator } from '../common/StatusIndicator'

interface EmployeeCardProps {
  employee: Employee
  onClick: (employee: Employee) => void
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  return (
    <div
      className="employee-card"
      onClick={() => onClick(employee)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(employee)
        }
      }}
      aria-label={`View profile for ${employee.name}`}
    >
      {/* Top Card Header: ID Badge & Status Indicator */}
      <div className="employee-card-top">
        <span className="employee-id-pill">{employee.id}</span>
        <div className="status-indicator-container">
          <StatusIndicator status={employee.status} showLabel={false} size="md" />
        </div>
      </div>

      {/* Center: Profile Avatar */}
      <div className="employee-avatar-container">
        <div className="employee-avatar-wrapper">
          {employee.profileImage ? (
            <img
              src={employee.profileImage}
              alt={employee.name}
              className="employee-avatar-img"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.classList.add('fallback-avatar-active')
                }
              }}
            />
          ) : null}
          <div className="employee-avatar-fallback">
            {employee.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Bottom: Employee Basic Information */}
      <div className="employee-card-info">
        <h3 className="employee-card-name" title={employee.name}>
          {employee.name}
        </h3>
        <p className="employee-card-designation" title={employee.designation}>
          {employee.designation}
        </p>

        <div className="employee-card-dept-badge">
          <Briefcase size={12} className="text-slate-400" />
          <span>{employee.department}</span>
        </div>

        <div className="employee-card-meta-list">
          <div className="employee-card-meta-item" title={employee.email}>
            <Mail size={12} className="meta-icon" />
            <span className="meta-text">{employee.email}</span>
          </div>
          <div className="employee-card-meta-item" title={employee.location}>
            <MapPin size={12} className="meta-icon" />
            <span className="meta-text">{employee.location.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Hover Hint */}
      <div className="employee-card-footer">
        <span className="view-profile-hint">View Profile &rarr;</span>
      </div>
    </div>
  )
}
