import React, { useState, useMemo } from 'react'
import { Plus, Calendar, ChevronRight, FileText, XCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { TimeOffBalanceCards } from './TimeOffBalanceCards'
import { LeaveCalendar } from './LeaveCalendar'
import { LeaveStatusBadge } from './LeaveStatusBadge'
import { TimeOffRequestModal } from './TimeOffRequestModal'

export const EmployeeTimeOffView: React.FC = () => {
  const { currentUser, leaveRecords, allocations } = useApp()
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const currentEmpId = currentUser?.employeeId || 'EMP001'

  const myLeaves = useMemo(() => {
    return leaveRecords
      .filter((l) => l.employeeId === currentEmpId)
      .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
  }, [leaveRecords, currentEmpId])

  const myAllocation = useMemo(() => {
    return allocations.find((a) => a.employeeId === currentEmpId)
  }, [allocations, currentEmpId])

  return (
    <div className="timeoff-page-layout">
      {/* Page Header */}
      <div className="timeoff-header-section">
        <div className="page-header-title-block">
          <div className="title-badge-row">
            <h1 className="attendance-main-title">Time Off</h1>
          </div>
          <p className="attendance-subtitle">
            View your leave balances, calendar, and submit new time-off requests
          </p>
        </div>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="btn-apply-timeoff"
          id="btn-new-timeoff-request"
          aria-label="Request new time off"
        >
          <Plus size={16} />
          <span>New</span>
        </button>
      </div>

      {/* Leave Balance KPI Cards */}
      <TimeOffBalanceCards allocation={myAllocation} mode="employee" />

      {/* Interactive Leave Calendar */}
      <LeaveCalendar
        leaves={leaveRecords}
        employeeId={currentEmpId}
      />

      {/* My Time Off Requests Table */}
      <div className="attendance-table-card">
        <div className="table-header-toolbar">
          <h2 className="table-section-title">
            My Time Off Requests
            <span className="count-pill">{myLeaves.length} requests</span>
          </h2>
        </div>

        <div className="table-responsive-wrapper">
          <table className="corporate-attendance-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
                <th className="text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.length > 0 ? (
                myLeaves.map((leave) => (
                  <React.Fragment key={leave.id}>
                    <tr
                      className="attendance-row-item"
                      onClick={() => setExpandedRow(expandedRow === leave.id ? null : leave.id)}
                    >
                      <td>
                        <span className="font-semibold text-slate-800">{leave.leaveType}</span>
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
                        <span className="table-reason-text" title={leave.reason}>{leave.reason}</span>
                      </td>
                      <td>
                        <span className="text-slate-500 text-xs font-mono">{leave.appliedOn}</span>
                      </td>
                      <td>
                        <LeaveStatusBadge status={leave.status} size="sm" />
                      </td>
                      <td className="text-right">
                        <button
                          className="btn-row-action"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedRow(expandedRow === leave.id ? null : leave.id)
                          }}
                          aria-label="Toggle row details"
                        >
                          <span>Details</span>
                          <ChevronRight
                            size={14}
                            className={`transition-transform ${expandedRow === leave.id ? 'rotate-90' : ''}`}
                          />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {expandedRow === leave.id && (
                      <tr className="expanded-detail-row">
                        <td colSpan={8}>
                          <div className="expanded-row-content">
                            <div className="expanded-detail-grid">
                              <div className="expanded-detail-item">
                                <span className="detail-key">Employee ID:</span>
                                <span className="detail-val font-mono">{leave.employeeId}</span>
                              </div>
                              <div className="expanded-detail-item">
                                <span className="detail-key">Department:</span>
                                <span className="detail-val">{leave.department || '—'}</span>
                              </div>
                              <div className="expanded-detail-item">
                                <span className="detail-key">Full Reason:</span>
                                <span className="detail-val italic">"{leave.reason}"</span>
                              </div>
                              {leave.attachment && (
                                <div className="expanded-detail-item">
                                  <span className="detail-key">Attachment:</span>
                                  <div className="attached-file-chip">
                                    <FileText size={12} />
                                    <span>{leave.attachment}</span>
                                  </div>
                                </div>
                              )}
                              {leave.rejectionReason && leave.status === 'Rejected' && (
                                <div className="expanded-detail-item rejection-reason-detail">
                                  <span className="detail-key text-rose-600">Rejection Reason:</span>
                                  <div className="rejection-reason-box">
                                    <XCircle size={13} className="text-rose-500" />
                                    <span>{leave.rejectionReason}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="table-empty-state">
                    <div className="empty-state-box">
                      <Calendar size={36} className="text-slate-300 mb-2" />
                      <p className="empty-title">No time-off requests found</p>
                      <p className="empty-desc">Click "+ New" to create your first leave request.</p>
                      <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="btn-empty-reset"
                      >
                        + Request Time Off
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      <TimeOffRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  )
}
