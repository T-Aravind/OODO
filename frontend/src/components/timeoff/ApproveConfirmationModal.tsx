import React from 'react'
import { CheckCircle2 } from 'lucide-react'

import { Modal } from '../common/Modal'
import type { LeaveRecord } from '../../types'

interface ApproveConfirmationModalProps {
  isOpen: boolean
  record: LeaveRecord | null
  onClose: () => void
  onConfirm: (recordId: string) => void
}

export const ApproveConfirmationModal: React.FC<ApproveConfirmationModalProps> = ({
  isOpen,
  record,
  onClose,
  onConfirm
}) => {
  if (!record) return null

  const handleConfirm = () => {
    onConfirm(record.id)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Time-Off Request"
      subtitle="Confirm approval for the selected employee leave application"
      maxWidth="460px"
    >
      <div className="approve-modal-content">
        <div className="approve-icon-banner">
          <div className="approve-icon-circle">
            <CheckCircle2 size={28} className="text-emerald-600" />
          </div>
          <p className="approve-confirm-prompt">
            Are you sure you want to approve this time-off request for{' '}
            <strong>{record.employeeName}</strong>?
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
          {record.reason && (
            <div className="summary-pill-row">
              <span className="summary-pill-label">Reason:</span>
              <span className="summary-pill-val text-slate-600 italic">"{record.reason}"</span>
            </div>
          )}
        </div>

        <p className="approve-disclaimer">
          ⚡ Upon approval, the employee's calendar will be updated and the leave days will be automatically recorded for payroll.
        </p>

        <div className="modal-actions-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-modal-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-approve-confirm"
            id="btn-confirm-approve"
          >
            <CheckCircle2 size={16} />
            <span>Approve Request</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
