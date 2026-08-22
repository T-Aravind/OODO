import React, { useState } from 'react'
import { XCircle } from 'lucide-react'
import { Modal } from '../common/Modal'
import type { LeaveRecord } from '../../types'

interface RejectReasonModalProps {
  isOpen: boolean
  record: LeaveRecord | null
  onClose: () => void
  onConfirm: (recordId: string, reason?: string) => void
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  record,
  onClose,
  onConfirm
}) => {
  const [rejectionReason, setRejectionReason] = useState('')

  if (!record) return null

  const handleConfirm = () => {
    onConfirm(record.id, rejectionReason.trim() || undefined)
    setRejectionReason('')
    onClose()
  }

  const handleClose = () => {
    setRejectionReason('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Time-Off Request"
      subtitle="Provide a reason to help the employee understand the decision"
      maxWidth="460px"
    >
      <div className="reject-modal-content">
        <div className="reject-icon-banner">
          <div className="reject-icon-circle">
            <XCircle size={28} className="text-rose-600" />
          </div>
          <p className="reject-confirm-prompt">
            You are about to reject the time-off request for{' '}
            <strong>{record.employeeName}</strong>.
          </p>
        </div>

        <div className="request-summary-pill-card">
          <div className="summary-pill-row">
            <span className="summary-pill-label">Employee:</span>
            <strong className="summary-pill-val">{record.employeeName} ({record.employeeId})</strong>
          </div>
          <div className="summary-pill-row">
            <span className="summary-pill-label">Leave Type:</span>
            <span className="summary-pill-val font-semibold">{record.leaveType}</span>
          </div>
          <div className="summary-pill-row">
            <span className="summary-pill-label">Period:</span>
            <span className="summary-pill-val font-mono">{record.startDate} → {record.endDate} ({record.days} {record.days === 1 ? 'day' : 'days'})</span>
          </div>
        </div>

        <div className="reject-reason-field">
          <label className="reject-reason-label" htmlFor="rejection-reason-input">
            Reason for Rejection <span className="optional-text">(optional)</span>
          </label>
          <textarea
            id="rejection-reason-input"
            className="reject-reason-textarea"
            rows={3}
            placeholder="e.g. Clashes with project deadline, insufficient leave balance, prior approval pending..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <span className="reject-note-text">
            The rejection reason will be visible to the employee on their Time Off page.
          </span>
        </div>

        <div className="modal-actions-footer">
          <button
            type="button"
            onClick={handleClose}
            className="btn-modal-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-reject-confirm"
            id="btn-confirm-reject"
          >
            <XCircle size={16} />
            <span>Reject Request</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
