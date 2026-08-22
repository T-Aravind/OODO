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
  const isHrOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'
  const { approveLeaveRecord, rejectLeaveRecord } = useApp()

  const myLeaves = useMemo(() => {
    if (!currentUser) return leaveRecords
    if (isHrOrAdmin) {
      return [...leaveRecords].sort((a, b) => (b.appliedOn || '').localeCompare(a.appliedOn || ''))
    }
    const empId = (currentUser.employeeId || '').toLowerCase()
    const empName = (currentUser.name || '').toLowerCase()

    return leaveRecords
      .filter(
        (l) =>
          (l.employeeId && l.employeeId.toLowerCase() === empId) ||
          (l.employeeName && l.employeeName.toLowerCase() === empName)
      )
      .sort((a, b) => (b.appliedOn || '').localeCompare(a.appliedOn || ''))
  }, [leaveRecords, currentUser, isHrOrAdmin])

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

      {/* HR Decision Notification Banners for Employee */}
      {!isHrOrAdmin && myLeaves.some((l) => l.status === 'Approved') && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <div>
              <h4 className="font-semibold text-emerald-900 text-sm">
                Time-Off Approved!
              </h4>
              <p className="text-xs text-emerald-700">
                HR has approved your leave request. Your leave balance has been updated accordingly.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isHrOrAdmin && myLeaves.some((l) => l.status === 'Rejected') && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-rose-900 text-sm">
                Time-Off Request Rejected
              </h4>
              <p className="text-xs text-rose-700">
                Your time-off request was marked as rejected by HR. Check details in the table below.
              </p>
            </div>
          </div>
        </div>
      )}

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
                {isHrOrAdmin && <th>Employee</th>}
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
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
                      {isHrOrAdmin && (
                        <td>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{leave.employeeName}</span>
                            <span className="text-xs text-slate-400 font-mono">{leave.employeeId}</span>
                          </div>
                        </td>
                      )}
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
                        {isHrOrAdmin && leave.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => approveLeaveRecord(leave.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectLeaveRecord(leave.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
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
                        )}
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {expandedRow === leave.id && (
                      <tr className="expanded-detail-row">
                        <td colSpan={isHrOrAdmin ? 9 : 8}>
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
                  <td colSpan={isHrOrAdmin ? 9 : 8} className="table-empty-state">
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
