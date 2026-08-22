import React, { useState } from 'react'
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
  Clock,
  Briefcase,
  CheckCircle2,
  Globe,
  Copy,
  Check,
  ChevronRight,
  Award
} from 'lucide-react'
import type { Employee } from '../../types'
import { useApp } from '../../context/AppContext'
import { StatusIndicator } from '../common/StatusIndicator'

interface EmployeeProfileProps {
  employee: Employee
  onBack: () => void
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee, onBack }) => {
  const { currentUser } = useApp()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'contact' | 'role'>('all')

  const isEmployeeRole = currentUser?.role === 'employee'

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="profile-page-layout">
      {/* ── Top Breadcrumb & Page Header ── */}
      <div className="profile-top-header">
        <div className="profile-breadcrumb-row">
          {/* RBAC: Only Admin and HR have Back to Directory button */}
          {!isEmployeeRole ? (
            <>
              <button onClick={onBack} className="breadcrumb-back-btn" id="btn-back-to-employees">
                <ArrowLeft size={15} />
                <span>Back to Directory</span>
              </button>
              <span className="breadcrumb-separator">
                <ChevronRight size={13} />
              </span>
              <span className="breadcrumb-current">Employee Profile</span>
              <span className="breadcrumb-separator">
                <ChevronRight size={13} />
              </span>
              <span className="breadcrumb-id font-mono">{employee.id}</span>
            </>
          ) : (
            <>
              <span className="breadcrumb-current">My Account</span>
              <span className="breadcrumb-separator">
                <ChevronRight size={13} />
              </span>
              <span className="breadcrumb-current font-semibold text-slate-900">My Profile</span>
              <span className="breadcrumb-separator">
                <ChevronRight size={13} />
              </span>
              <span className="breadcrumb-id font-mono">{employee.id}</span>
            </>
          )}
        </div>

        <div className="profile-header-main">
          <div className="profile-title-block">
            <div className="profile-title-row">
              <h1 className="profile-page-title">{isEmployeeRole ? 'My Profile' : `${employee.name}'s Profile`}</h1>
              <div className="read-only-pill" title="This employee profile is in verified read-only mode">
                <Lock size={12} className="text-slate-500" />
                <span>Read-Only Record</span>
              </div>
            </div>
            <p className="profile-page-subtitle">
              {isEmployeeRole
                ? 'View your verified employee credentials, organization placement, and work profile'
                : 'Review official employee credentials, department placement, and employment records'}
            </p>
          </div>

          {/* Quick Actions / Tab Switchers */}
          <div className="profile-tab-pills" role="tablist" aria-label="Profile Sections">
            <button
              onClick={() => setActiveTab('all')}
              className={`tab-pill-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Information
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`tab-pill-btn ${activeTab === 'personal' ? 'active' : ''}`}
            >
              Personal
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`tab-pill-btn ${activeTab === 'contact' ? 'active' : ''}`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveTab('role')}
              className={`tab-pill-btn ${activeTab === 'role' ? 'active' : ''}`}
            >
              Job & Role
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Profile Grid ── */}
      <div className="profile-main-grid">
        {/* ── Left Column: Employee Summary & Leadership ── */}
        <div className="profile-left-column">
          {/* Card 1: Main Summary Card */}
          <div className="profile-summary-card">
            {/* Top Pattern Header Banner */}
            <div className="summary-card-banner">
              <div className="summary-banner-badge">
                <Award size={13} className="text-indigo-600" />
                <span>Verified Person</span>
              </div>
            </div>

            {/* Circular Avatar with Ring & Status Indicator */}
            <div className="summary-avatar-section">
              <div className="summary-avatar-ring">
                {!imageError && employee.profileImage ? (
                  <img
                    src={employee.profileImage}
                    alt={employee.name}
                    className="summary-avatar-img"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="summary-avatar-fallback">
                    {getInitials(employee.name)}
                  </div>
                )}
                <span className={`summary-avatar-status-dot dot-${employee.status}`} />
              </div>
            </div>

            {/* Employee Identification */}
            <div className="summary-info-block">
              <h2 className="summary-name">{employee.name}</h2>
              <p className="summary-designation">{employee.designation}</p>

              <div className="summary-badges-row">
                <span className="badge-emp-id-pill" title="Employee Identification Code">
                  {employee.id}
                </span>
                <span className="badge-dept-pill">
                  <Building size={12} className="text-slate-400" />
                  {employee.department}
                </span>
              </div>

              {/* Status Badge */}
              <div className="summary-status-container">
                <span className="summary-status-label">Current Attendance Status</span>
                <StatusIndicator status={employee.status} showLabel={true} size="md" />
              </div>
            </div>

            <div className="summary-divider" />

            {/* Contact Details List */}
            <div className="summary-contacts-list">
              {/* Corporate Email */}
              <div className="summary-contact-row">
                <div className="contact-icon-box">
                  <Mail size={14} className="text-indigo-600" />
                </div>
                <div className="contact-details">
                  <span className="contact-label">Corporate Email</span>
                  <a href={`mailto:${employee.email}`} className="contact-value-link" title="Send email">
                    {employee.email}
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(employee.email, 'email')}
                  className="btn-copy-field"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedField === 'email' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Primary Phone */}
              <div className="summary-contact-row">
                <div className="contact-icon-box">
                  <Phone size={14} className="text-emerald-600" />
                </div>
                <div className="contact-details">
                  <span className="contact-label">Primary Contact</span>
                  <span className="contact-value">{employee.phone}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(employee.phone, 'phone')}
                  className="btn-copy-field"
                  title="Copy phone to clipboard"
                  aria-label="Copy phone"
                >
                  {copiedField === 'phone' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Work Location */}
              <div className="summary-contact-row">
                <div className="contact-icon-box">
                  <MapPin size={14} className="text-rose-500" />
                </div>
                <div className="contact-details">
                  <span className="contact-label">Assigned Office</span>
                  <span className="contact-value">{employee.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Reporting & Leadership Card */}
          <div className="profile-leadership-card">
            <div className="card-section-heading">
              <div className="heading-icon-badge">
                <ShieldCheck size={16} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="section-title">Reporting & Leadership</h3>
                <p className="section-subtitle">Management structure & workspace assignment</p>
              </div>
            </div>

            <div className="leadership-fields-grid">
              {/* Direct Manager */}
              <div className="data-field-group">
                <label className="data-field-label">Direct Reporting Manager</label>
                <div className="data-field-container">
                  <User size={15} className="data-field-icon text-indigo-500" />
                  <span className="data-field-value font-semibold text-slate-800">
                    {employee.manager}
                  </span>
                </div>
              </div>

              {/* Employment Type */}
              <div className="data-field-group">
                <label className="data-field-label">Employment Classification</label>
                <div className="data-field-container">
                  <Briefcase size={15} className="data-field-icon text-blue-500" />
                  <span className="badge-employment-type">{employee.employmentType}</span>
                </div>
              </div>

              {/* Office Extension */}
              <div className="data-field-group">
                <label className="data-field-label">Internal Phone Extension</label>
                <div className="data-field-container">
                  <Phone size={15} className="data-field-icon text-slate-400" />
                  <span className="data-field-value font-mono">
                    {employee.extension || 'Ext. 4012'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Categorized Information Cards ── */}
        <div className="profile-right-column">
          {/* ── CARD 1: Personal Information ── */}
          {(activeTab === 'all' || activeTab === 'personal') && (
            <div className="profile-content-card">
              <div className="content-card-header">
                <div className="header-icon-box">
                  <User size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="content-card-title">Personal Information</h2>
                  <p className="content-card-subtitle">Verified identity and demographic information</p>
                </div>
              </div>

              <div className="content-card-body">
                <div className="fields-grid-2">
                  {/* Full Legal Name */}
                  <div className="data-field-group">
                    <label className="data-field-label">Full Legal Name</label>
                    <div className="data-field-container">
                      <span className="data-field-value font-semibold">{employee.name}</span>
                    </div>
                  </div>

                  {/* Employee ID */}
                  <div className="data-field-group">
                    <label className="data-field-label">Employee ID</label>
                    <div className="data-field-container field-highlight">
                      <span className="data-field-value font-mono font-bold text-indigo-700">
                        {employee.id}
                      </span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="data-field-group">
                    <label className="data-field-label">Gender</label>
                    <div className="data-field-container">
                      <span className="data-field-value">{employee.gender || 'Prefer not to say'}</span>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="data-field-group">
                    <label className="data-field-label">Date of Birth</label>
                    <div className="data-field-container">
                      <Calendar size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value">{employee.dob || '14 August 1996'}</span>
                    </div>
                  </div>

                  {/* Nationality */}
                  <div className="data-field-group">
                    <label className="data-field-label">Nationality</label>
                    <div className="data-field-container">
                      <Globe size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value">{employee.nationality || 'Indian'}</span>
                    </div>
                  </div>

                  {/* Work Authorization */}
                  <div className="data-field-group">
                    <label className="data-field-label">Work Authorization Status</label>
                    <div className="data-field-container field-success">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span className="data-field-value font-semibold text-emerald-800">
                        Active & Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CARD 2: Contact Information ── */}
          {(activeTab === 'all' || activeTab === 'contact') && (
            <div className="profile-content-card">
              <div className="content-card-header">
                <div className="header-icon-box">
                  <Mail size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="content-card-title">Contact Information</h2>
                  <p className="content-card-subtitle">Work communications and physical office base</p>
                </div>
              </div>

              <div className="content-card-body">
                <div className="fields-grid-2">
                  {/* Corporate Email */}
                  <div className="data-field-group">
                    <label className="data-field-label">Corporate Email</label>
                    <div className="data-field-container">
                      <Mail size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value font-mono text-slate-800">{employee.email}</span>
                    </div>
                  </div>

                  {/* Primary Contact Number */}
                  <div className="data-field-group">
                    <label className="data-field-label">Primary Contact Number</label>
                    <div className="data-field-container">
                      <Phone size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value">{employee.phone}</span>
                    </div>
                  </div>

                  {/* Assigned Work Location (Full Width) */}
                  <div className="data-field-group col-span-2">
                    <label className="data-field-label">Assigned Work Location / Campus</label>
                    <div className="data-field-container">
                      <MapPin size={15} className="data-field-icon text-rose-500" />
                      <span className="data-field-value">{employee.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CARD 3: Department & Role Details ── */}
          {(activeTab === 'all' || activeTab === 'role') && (
            <div className="profile-content-card">
              <div className="content-card-header">
                <div className="header-icon-box">
                  <Building size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="content-card-title">Department & Role Details</h2>
                  <p className="content-card-subtitle">Organizational placement, joining date, and shifts</p>
                </div>
              </div>

              <div className="content-card-body">
                <div className="fields-grid-2">
                  {/* Department */}
                  <div className="data-field-group">
                    <label className="data-field-label">Department</label>
                    <div className="data-field-container">
                      <Building size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value font-semibold text-slate-900">
                        {employee.department}
                      </span>
                    </div>
                  </div>

                  {/* Job Title / Designation */}
                  <div className="data-field-group">
                    <label className="data-field-label">Job Title / Designation</label>
                    <div className="data-field-container">
                      <Briefcase size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value font-semibold text-indigo-950">
                        {employee.designation}
                      </span>
                    </div>
                  </div>

                  {/* Date of Joining */}
                  <div className="data-field-group">
                    <label className="data-field-label">Date of Joining</label>
                    <div className="data-field-container">
                      <Calendar size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value">{employee.joiningDate}</span>
                    </div>
                  </div>

                  {/* Standard Work Shift */}
                  <div className="data-field-group">
                    <label className="data-field-label">Standard Work Shift</label>
                    <div className="data-field-container">
                      <Clock size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value">
                        {employee.workShift || 'General Shift (09:00 AM - 06:00 PM)'}
                      </span>
                    </div>
                  </div>

                  {/* Reporting Manager */}
                  <div className="data-field-group">
                    <label className="data-field-label">Reporting Manager</label>
                    <div className="data-field-container">
                      <User size={15} className="data-field-icon text-slate-400" />
                      <span className="data-field-value">{employee.manager}</span>
                    </div>
                  </div>

                  {/* Probation / Confirmation Status */}
                  <div className="data-field-group">
                    <label className="data-field-label">Probation / Confirmation Status</label>
                    <div className="data-field-container field-success">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span className="data-field-value font-semibold text-emerald-800">
                        Confirmed (Permanent)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
