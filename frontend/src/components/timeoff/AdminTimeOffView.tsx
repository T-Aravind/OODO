import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Download,
  ShieldCheck,
  Users
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { LeaveRecord } from '../../types'
import { TimeOffBalanceCards } from './TimeOffBalanceCards'
import { LeaveStatusBadge } from './LeaveStatusBadge'
import { TimeOffRequestModal } from './TimeOffRequestModal'
import { ApproveConfirmationModal } from './ApproveConfirmationModal'
import { RejectReasonModal } from './RejectReasonModal'
import { AllocationSection } from './AllocationSection'

type AdminTab = 'timeoff' | 'allocation'

export const AdminTimeOffView: React.FC = () => {
  const { leaveRecords, employees, approveLeaveRecord, rejectLeaveRecord } = useApp()

  const [activeTab, setActiveTab] = useState<AdminTab>('timeoff')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [approveTarget, setApproveTarget] = useState<LeaveRecord | null>(null)
  const [rejectTarget, setRejectTarget] = useState<LeaveRecord | null>(null)

  const departments = useMemo(() => {
    const set = new Set<string>()
    employees.forEach((e) => { if (e.department) set.add(e.department) })
    return Array.from(set)
  }, [employees])

  // Overall company stats for today
  const companyStats = useMemo(() => {
    const pending = leaveRecords.filter((l) => l.status === 'Pending').length
    const approved = leaveRecords.filter((l) => l.status === 'Approved').length
    const rejected = leaveRecords.filter((l) => l.status === 'Rejected').length
    return { pending, approved, rejected, total: leaveRecords.length }
  }, [leaveRecords])

  // Filtered records
  const filteredRecords = useMemo(() => {
    return leaveRecords.filter((leave) => {
      if (statusFilter !== 'all' && leave.status !== statusFilter) return false
      if (typeFilter !== 'all' && leave.leaveType !== typeFilter) return false
      if (deptFilter !== 'all') {
        const emp = employees.find((e) => e.id === leave.employeeId)
        const dept = leave.department || emp?.department
        if (dept !== deptFilter) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const emp = employees.find((e) => e.id === leave.employeeId)
        if (
          !leave.employeeName.toLowerCase().includes(q) &&
          !leave.leaveType.toLowerCase().includes(q) &&
          !(leave.department || emp?.department || '').toLowerCase().includes(q) &&
          !leave.employeeId.toLowerCase().includes(q) &&
          !leave.reason.toLowerCase().includes(q)
        ) return false
      }
      return true
    }).sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
  }, [leaveRecords, statusFilter, typeFilter, deptFilter, searchQuery, employees])

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Applied On', 'Reason']
    const rows = filteredRecords.map((r) => [
      `"${r.employeeId}"`, `"${r.employeeName}"`, `"${r.department || ''}"`,
      `"${r.leaveType}"`, `"${r.startDate}"`, `"${r.endDate}"`,
      `"${r.days}"`, `"${r.status}"`, `"${r.appliedOn}"`, `"${r.reason}"`
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `DayFlow_TimeOff_Report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setTypeFilter('all')
    setDeptFilter('all')
  }

  return (
    <div className="timeoff-page-layout">
      {/* Page Header */}
      <div className="timeoff-header-section">
        <div className="page-header-title-block">
          <div className="title-badge-row">
            <h1 className="attendance-main-title">Time Off</h1>
            <span className="admin-verified-pill">
              <ShieldCheck size={14} className="text-emerald-600" />
              HR Administration Console
            </span>
          </div>
          <p className="attendance-subtitle">
            Review, approve, and manage time-off requests across the organization
          </p>
        </div>

        <div className="header-actions-group">
          {/* Tab Switcher */}
          <div className="scope-toggle-capsule">
            <button
              onClick={() => setActiveTab('timeoff')}
              className={`scope-btn ${activeTab === 'timeoff' ? 'active' : ''}`}
            >
              Time Off
            </button>
            <button
              onClick={() => setActiveTab('allocation')}
              className={`scope-btn ${activeTab === 'allocation' ? 'active' : ''}`}
            >
              Allocation
            </button>
          </div>

          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="btn-apply-timeoff"
            id="btn-admin-new-timeoff"
          >
            <Plus size={16} />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* HR Pending Request Notification Banner */}
      {companyStats.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">
                🔔 Time-Off Request Alert: {companyStats.pending} request(s) awaiting your HR approval
              </h4>
              <p className="text-xs text-amber-700">
                Employees have submitted new leave requests. Review details and confirm approval or rejection below.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Pending')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Review Pending ({companyStats.pending})
          </button>
        </div>
      )}

      {/* Company-Level Leave Balance Cards */}
      <TimeOffBalanceCards mode="admin" />

      {/* Quick Stats Strip */}
      <div className="admin-timeoff-stats-strip">
        <div className="stats-strip-item">
          <span className="stats-strip-label">All Requests:</span>
          <strong className="stats-strip-val">{companyStats.total}</strong>
        </div>
        <div className="stats-strip-divider" />
        <button
          onClick={() => setStatusFilter('Pending')}
          className={`stats-strip-item clickable ${statusFilter === 'Pending' ? 'active-filter' : ''}`}
        >
          <span className="status-dot pending-dot" />
          <span className="stats-strip-label">Pending:</span>
          <strong className="stats-strip-val text-amber-700">{companyStats.pending}</strong>
        </button>
        <div className="stats-strip-divider" />
        <button
          onClick={() => setStatusFilter('Approved')}
          className={`stats-strip-item clickable ${statusFilter === 'Approved' ? 'active-filter' : ''}`}
        >
          <span className="status-dot approved-dot" />
          <span className="stats-strip-label">Approved:</span>
          <strong className="stats-strip-val text-emerald-700">{companyStats.approved}</strong>
        </button>
        <div className="stats-strip-divider" />
        <button
          onClick={() => setStatusFilter('Rejected')}
          className={`stats-strip-item clickable ${statusFilter === 'Rejected' ? 'active-filter' : ''}`}
        >
          <span className="status-dot rejected-dot" />
          <span className="stats-strip-label">Rejected:</span>
          <strong className="stats-strip-val text-rose-700">{companyStats.rejected}</strong>
        </button>
        <div className="stats-strip-divider" />
        <button
          onClick={() => setStatusFilter('all')}
          className="footer-export-btn ml-auto"
        >
          <RotateCcw size={13} />
          <span>Clear Filter</span>
        </button>
      </div>

      {activeTab === 'timeoff' ? (
        <div className="attendance-table-card">
          {/* Search & Filter Bar */}
          <div className="admin-table-filter-bar">
            <div className="search-input-wrapper admin-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search employees or requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search time off requests"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Clear search">
                  &times;
                </button>
              )}
            </div>

            <div className="filter-controls-cluster">
              <div className="control-field-block">
                <label className="field-micro-label">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select-dropdown"
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="control-field-block">
                <label className="field-micro-label">Leave Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="filter-select-dropdown"
                  aria-label="Filter by leave type"
                >
                  <option value="all">All Types</option>
                  <option value="Paid Time Off">Paid Time Off</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="control-field-block">
                <label className="field-micro-label">Department</label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="filter-select-dropdown"
                  aria-label="Filter by department"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleClearFilters} className="btn-clear-filters">
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive-wrapper">
            <table className="corporate-attendance-table admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Time Off Type</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((leave) => {
                    const emp = employees.find((e) => e.id === leave.employeeId)
                    const avatar = leave.avatar || emp?.profileImage
                    const isPending = leave.status === 'Pending'

                    return (
                      <tr key={leave.id} className="attendance-row-item admin-row">
                        <td>
                          <div className="emp-profile-cell">
                            <div className="cell-avatar-wrapper">
                              {avatar ? (
                                <img src={avatar} alt={leave.employeeName} className="cell-avatar-img" />
                              ) : (
                                <div className="cell-avatar-fallback">
                                  {leave.employeeName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="cell-emp-info">
                              <span className="cell-emp-name">{leave.employeeName}</span>
                              <span className="cell-emp-designation">
                                {leave.department || emp?.department || '—'} · {leave.employeeId}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="font-mono text-slate-700">{leave.startDate}</span>
                        </td>

                        <td>
                          <span className="font-mono text-slate-700">{leave.endDate}</span>
                        </td>

                        <td>
                          <span className="font-semibold text-slate-800">{leave.leaveType}</span>
                          {leave.attachment && (
                            <span className="attachment-indicator" title={`Attachment: ${leave.attachment}`}>
                              📎
                            </span>
                          )}
                        </td>

                        <td>
                          <span className="badge-days-count">{leave.days} {leave.days === 1 ? 'day' : 'days'}</span>
                        </td>

                        <td>
                          <LeaveStatusBadge status={leave.status} size="sm" />
                          {leave.rejectionReason && (
                            <div className="rejection-reason-mini" title={leave.rejectionReason}>
                              <span className="text-xs text-rose-500 italic">
                                "{leave.rejectionReason.slice(0, 40)}{leave.rejectionReason.length > 40 ? '…' : ''}"
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="text-right">
                          <div className="admin-actions-cell">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => setApproveTarget(leave)}
                                  className="btn-approve-action"
                                  aria-label="Approve request"
                                  id={`btn-approve-${leave.id}`}
                                >
                                  <CheckCircle2 size={13} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => setRejectTarget(leave)}
                                  className="btn-reject-action"
                                  aria-label="Reject request"
                                  id={`btn-reject-${leave.id}`}
                                >
                                  <XCircle size={13} />
                                  <span>Reject</span>
                                </button>
                              </>
                            ) : (
                              <span className="processed-indicator">
                                {leave.status === 'Approved' ? '✓ Processed' : '✗ Processed'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="table-empty-state">
                      <div className="empty-state-box">
                        <Users size={36} className="text-slate-300 mb-2" />
                        <p className="empty-title">No time-off requests match the current filters</p>
                        <p className="empty-desc">Try adjusting the search or filter criteria.</p>
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

          {/* Table Footer */}
          <div className="table-footer-summary-strip">
            <div className="footer-stat-item">
              <span className="footer-stat-label">Showing:</span>
              <span className="footer-stat-value font-bold">{filteredRecords.length} requests</span>
            </div>
            <div className="footer-stat-divider" />
            <div className="footer-stat-item">
              <span className="footer-stat-label">Pending Review:</span>
              <span className="footer-stat-value text-amber-700 font-bold">{companyStats.pending}</span>
            </div>
            <div className="footer-stat-divider" />
            <button onClick={handleExportCSV} className="footer-export-btn">
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="attendance-table-card">
          <AllocationSection />
        </div>
      )}

      {/* New Request Modal */}
      <TimeOffRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
      />

      {/* Approve Confirmation Modal */}
      <ApproveConfirmationModal
        isOpen={approveTarget !== null}
        record={approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={(id) => approveLeaveRecord(id)}
      />

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={rejectTarget !== null}
        record={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={(id, reason) => rejectLeaveRecord(id, reason)}
      />
    </div>
  )
}
