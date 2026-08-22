import React, { useState } from 'react'
import {
  MOCK_LEAVE_BALANCES,
  MOCK_LEAVE_HISTORY,
  EmployeeLeaveItem,
} from '../../mock/employeeData'

export const EmployeeLeave: React.FC = () => {
  const [leaveHistory, setLeaveHistory] = useState<EmployeeLeaveItem[]>(MOCK_LEAVE_HISTORY)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form State
  const [leaveType, setLeaveType] = useState<'Paid Leave' | 'Sick Leave' | 'Unpaid Leave'>('Paid Leave')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  // Calculate days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    if (diffTime < 0) return 1
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || !reason.trim()) return

    const newLeave: EmployeeLeaveItem = {
      id: `LEV-${Date.now().toString().slice(-3)}`,
      leaveType,
      startDate,
      endDate,
      days: calculateDays(),
      reason,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'Pending',
    }

    setLeaveHistory([newLeave, ...leaveHistory])
    setIsModalOpen(false)
    setReason('')
    setStartDate('')
    setEndDate('')

    setToastMessage('Leave request submitted successfully.')
    setTimeout(() => setToastMessage(null), 4000)
  }

  const getStatusBadge = (status: EmployeeLeaveItem['status']) => {
    switch (status) {
      case 'Approved':
        return <span className="status-badge present">Approved</span>
      case 'Pending':
        return <span className="status-badge halfday">Pending</span>
      case 'Rejected':
        return <span className="status-badge absent">Rejected</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  return (
    <div className="leave-view-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-success-banner">
          <span>✅ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2>Leave & Time-Off</h2>
          <p className="sub-text">Apply for leaves and track request statuses</p>
        </div>
        <button className="btn-action-primary" onClick={() => setIsModalOpen(true)}>
          ➕ Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="leave-balances-grid">
        <div className="balance-card">
          <div className="bal-icon purple">🌴</div>
          <div className="bal-info">
            <span className="bal-val">{MOCK_LEAVE_BALANCES.paidLeave} Days</span>
            <span className="bal-label">Paid Leave</span>
          </div>
        </div>

        <div className="balance-card">
          <div className="bal-icon blue">🩺</div>
          <div className="bal-info">
            <span className="bal-val">{MOCK_LEAVE_BALANCES.sickLeave} Days</span>
            <span className="bal-label">Sick Leave</span>
          </div>
        </div>

        <div className="balance-card">
          <div className="bal-icon green">♾️</div>
          <div className="bal-info">
            <span className="bal-val">{MOCK_LEAVE_BALANCES.unpaidLeave}</span>
            <span className="bal-label">Unpaid Leave</span>
          </div>
        </div>
      </div>

      {/* Leave History Table */}
      <div className="card-box table-box">
        <div className="box-title">
          <h3>Leave Request History</h3>
        </div>
        <div className="responsive-table-wrapper">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.leaveType}</strong>
                  </td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td>{item.days} Day(s)</td>
                  <td>
                    {item.reason}
                    {item.adminComment && (
                      <div className="admin-comment-note">
                        <span>💬 Admin Note: {item.adminComment}</span>
                      </div>
                    )}
                  </td>
                  <td>{item.appliedOn}</td>
                  <td>{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Time-Off</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="modal-form">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="modal-select"
                >
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="modal-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="modal-input"
                    required
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="days-calc-badge">
                  <span>Total Duration: <strong>{calculateDays()} Day(s)</strong></span>
                </div>
              )}

              <div className="form-group">
                <label>Reason / Remarks</label>
                <textarea
                  placeholder="Please state the reason for leave..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="modal-textarea"
                  rows={3}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
