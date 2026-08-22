import React from 'react'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  ShieldCheck,
  Calendar,
  Lock,
  Clock
} from 'lucide-react'
import type { Employee } from '../../types'
import { StatusIndicator } from '../common/StatusIndicator'

interface EmployeeProfileProps {
  employee: Employee
  onBack: () => void
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee, onBack }) => {
  return (
    <div className="profile-page-layout">
      {/* Top Header Bar with Navigation & Read-Only Notice */}
      <div className="profile-top-bar">
        <button onClick={onBack} className="btn-back-link" id="btn-back-to-employees">
          <ArrowLeft size={16} />
          <span>Back to Employees</span>
        </button>

        <div className="read-only-badge-indicator" title="All information on this page is read-only">
          <Lock size={14} className="text-amber-600" />
          <span>View-Only Employee Record</span>
        </div>
      </div>

      <div className="profile-main-grid">
        {/* Left Column: Hero Profile Card */}
        <div className="profile-left-column">
          <div className="profile-hero-card">
            <div className="profile-hero-avatar-wrapper">
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={employee.name}
                  className="profile-hero-avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
              <div className="profile-hero-avatar-fallback">
                {employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            </div>

            <div className="profile-hero-identity">
              <h1 className="profile-hero-name">{employee.name}</h1>
              <div className="profile-hero-id-tag">
                <span>Employee ID:</span>
                <strong>{employee.id}</strong>
              </div>
              <p className="profile-hero-designation">{employee.designation}</p>
              <div className="profile-hero-dept">
                <Building size={14} className="text-slate-400" />
                <span>{employee.department}</span>
              </div>
            </div>

            <div className="profile-hero-status-row">
              <span className="status-label-heading">Current Attendance Status:</span>
              <StatusIndicator status={employee.status} showLabel={true} size="md" />
            </div>

            <div className="profile-hero-divider" />

            <div className="profile-hero-quick-meta">
              <div className="quick-meta-item">
                <Mail size={14} className="text-indigo-500" />
                <a href={`mailto:${employee.email}`} className="quick-meta-link">
                  {employee.email}
                </a>
              </div>
              <div className="quick-meta-item">
                <Phone size={14} className="text-emerald-500" />
                <span className="quick-meta-text">{employee.phone}</span>
              </div>
              <div className="quick-meta-item">
                <MapPin size={14} className="text-rose-500" />
                <span className="quick-meta-text">{employee.location}</span>
              </div>
            </div>
          </div>

          {/* Manager & Organization Snapshot */}
          <div className="profile-sidebar-card">
            <h3 className="sidebar-card-title">
              <ShieldCheck size={16} className="text-indigo-600" />
              Reporting & Leadership
            </h3>
            <div className="readonly-field-block">
              <label className="readonly-label">Direct Manager</label>
              <div className="readonly-value font-semibold text-slate-800">
                {employee.manager}
              </div>
            </div>
            <div className="readonly-field-block">
              <label className="readonly-label">Employment Type</label>
              <span className="badge-employment-type">{employee.employmentType}</span>
            </div>
            <div className="readonly-field-block">
              <label className="readonly-label">Office Extension</label>
              <div className="readonly-value">{employee.extension || 'Ext. 1001'}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Information Cards */}
        <div className="profile-right-column">
          {/* Card 1: Personal & Demographic Information */}
          <div className="profile-details-card">
            <div className="details-card-header">
              <div className="card-header-icon-box">
                <User size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="details-card-title">Personal Information</h2>
                <p className="details-card-subtitle">Verified identity and demographic information</p>
              </div>
            </div>
            <div className="details-card-body">
              <div className="readonly-fields-grid-2">
                <div className="readonly-field-block">
                  <label className="readonly-label">Full Legal Name</label>
                  <div className="readonly-value">{employee.name}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Employee ID</label>
                  <div className="readonly-value font-mono font-bold text-indigo-700">{employee.id}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Gender</label>
                  <div className="readonly-value">{employee.gender || 'Not Specified'}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Date of Birth</label>
                  <div className="readonly-value">{employee.dob || '14 August 1995'}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Nationality</label>
                  <div className="readonly-value">{employee.nationality || 'Indian'}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Work Authorization</label>
                  <div className="readonly-value font-medium text-emerald-700">Active & Verified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Information */}
          <div className="profile-details-card">
            <div className="details-card-header">
              <div className="card-header-icon-box">
                <Mail size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="details-card-title">Contact Information</h2>
                <p className="details-card-subtitle">Work communications and physical office base</p>
              </div>
            </div>
            <div className="details-card-body">
              <div className="readonly-fields-grid-2">
                <div className="readonly-field-block">
                  <label className="readonly-label">Corporate Email</label>
                  <div className="readonly-value font-mono">{employee.email}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Primary Contact Number</label>
                  <div className="readonly-value">{employee.phone}</div>
                </div>
                <div className="readonly-field-block col-span-2">
                  <label className="readonly-label">Assigned Work Location / Campus</label>
                  <div className="readonly-value">{employee.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Employment & Department Details */}
          <div className="profile-details-card">
            <div className="details-card-header">
              <div className="card-header-icon-box">
                <Building size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="details-card-title">Department & Role Details</h2>
                <p className="details-card-subtitle">Organizational placement, joining date, and shifts</p>
              </div>
            </div>
            <div className="details-card-body">
              <div className="readonly-fields-grid-2">
                <div className="readonly-field-block">
                  <label className="readonly-label">Department</label>
                  <div className="readonly-value font-semibold">{employee.department}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Job Title / Designation</label>
                  <div className="readonly-value font-semibold">{employee.designation}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Date of Joining</label>
                  <div className="readonly-value">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      {employee.joiningDate}
                    </span>
                  </div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Standard Work Shift</label>
                  <div className="readonly-value">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      {employee.workShift || 'General Shift (09:00 AM - 06:00 PM)'}
                    </span>
                  </div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Reporting Manager</label>
                  <div className="readonly-value">{employee.manager}</div>
                </div>
                <div className="readonly-field-block">
                  <label className="readonly-label">Probation / Confirmation Status</label>
                  <div className="readonly-value font-medium text-emerald-700">Confirmed (Permanent)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
