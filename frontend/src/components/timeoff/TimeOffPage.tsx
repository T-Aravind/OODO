import React, { useState, useMemo } from 'react'
import { Plus, CheckCircle2, Clock3, XCircle, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ApplyLeaveModal } from './ApplyLeaveModal'

export const TimeOffPage: React.FC = () => {
  const { leaveRecords } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const filteredLeaves = useMemo(() => {
    return leaveRecords.filter((leave) => {
      if (statusFilter !== 'all' && leave.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          leave.employeeName.toLowerCase().includes(q) ||
          leave.employeeId.toLowerCase().includes(q) ||
          leave.leaveType.toLowerCase().includes(q) ||
          leave.reason.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [leaveRecords, searchQuery, statusFilter])

  return (
    <div className="timeoff-page-layout">
      {/* Time Off Header */}
      <div className="timeoff-header-section">
        <div>
          <h1 className="module-title">Time Off & Leave Management</h1>
          <p className="module-subtitle">
            Review leave allowances, active requests, and corporate holiday balance
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="btn-apply-timeoff"
          id="btn-apply-timeoff"
        >
          <Plus size={16} />
          <span>Apply Time Off</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="timeoff-balances-grid">
        <div className="leave-balance-card annual">
          <div className="balance-top">
            <span className="balance-type-tag">Annual Leave</span>
            <span className="balance-icon-tag">🌴</span>
          </div>
          <div className="balance-numbers">
            <span className="balance-available">14</span>
            <span className="balance-divider">/</span>
            <span className="balance-total">18 Days</span>
          </div>
          <div className="balance-progress-bar">
            <div className="progress-fill" style={{ width: '77%' }} />
          </div>
          <span className="balance-caption">4 days used • Renews Jan 2027</span>
        </div>

        <div className="leave-balance-card sick">
          <div className="balance-top">
            <span className="balance-type-tag">Sick & Medical</span>
            <span className="balance-icon-tag">🩺</span>
          </div>
          <div className="balance-numbers">
            <span className="balance-available">7</span>
            <span className="balance-divider">/</span>
            <span className="balance-total">10 Days</span>
          </div>
          <div className="balance-progress-bar">
            <div className="progress-fill" style={{ width: '70%' }} />
          </div>
          <span className="balance-caption">3 days used • Medical cert required &gt;2d</span>
        </div>

        <div className="leave-balance-card casual">
          <div className="balance-top">
            <span className="balance-type-tag">Casual / Personal</span>
            <span className="balance-icon-tag">☕</span>
          </div>
          <div className="balance-numbers">
            <span className="balance-available">4</span>
            <span className="balance-divider">/</span>
            <span className="balance-total">5 Days</span>
          </div>
          <div className="balance-progress-bar">
            <div className="progress-fill" style={{ width: '80%' }} />
          </div>
          <span className="balance-caption">1 day used • Requires 24h prior notice</span>
        </div>
      </div>

      {/* Leave Requests Table Card */}
      <div className="timeoff-table-card">
        <div className="table-controls-bar">
          <div className="search-input-wrapper compact">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search leaves by employee, type, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Approval Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending Approval</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="corporate-data-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Employee Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason / Notes</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <span className="font-semibold text-slate-800">{leave.leaveType}</span>
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <span className="font-medium text-slate-900">{leave.employeeName}</span>
                        <span className="table-sub-id">{leave.employeeId}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-slate-700">{leave.startDate}</span>
                    </td>
                    <td>
                      <span className="font-mono text-slate-700">{leave.endDate}</span>
                    </td>
                    <td>
                      <span className="badge-days-count">{leave.days} {leave.days === 1 ? 'day' : 'days'}</span>
                    </td>
                    <td>
                      <span className="table-reason-text" title={leave.reason}>
                        {leave.reason}
                      </span>
                    </td>
                    <td>
                      <span className="text-slate-500 text-xs">{leave.appliedOn}</span>
                    </td>
                    <td>
                      <span className={`leave-status-badge badge-${leave.status.toLowerCase()}`}>
                        {leave.status === 'Approved' && (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Approved</span>
                          </>
                        )}
                        {leave.status === 'Pending' && (
                          <>
                            <Clock3 size={13} />
                            <span>Pending</span>
                          </>
                        )}
                        {leave.status === 'Rejected' && (
                          <>
                            <XCircle size={13} />
                            <span>Rejected</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="table-no-data">
                    No leave requests found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  )
}
