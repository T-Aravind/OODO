import React, { useState } from 'react'
import { CalendarCheck2 } from 'lucide-react'
import type { LeaveType } from '../../types'
import { Modal } from '../common/Modal'
import { useApp } from '../../context/AppContext'

interface ApplyLeaveModalProps {
  isOpen: boolean
  onClose: () => void
}

const LEAVE_TYPES: LeaveType[] = [
  'Annual Leave',
  'Sick Leave',
  'Casual Leave',
  'Maternity / Paternity',
  'Unpaid Leave'
]

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addLeaveRecord } = useApp()
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const calculateDays = () => {
    if (!startDate || !endDate) return 1
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays > 0 ? diffDays : 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Please provide a reason for the leave request.')
      return
    }
    const days = calculateDays()

    addLeaveRecord({
      employeeId: currentUser?.employeeId || 'EMP001',
      employeeName: currentUser?.name || 'Aravind T',
      leaveType,
      startDate,
      endDate,
      days,
      reason: reason.trim()
    })

    setReason('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Time Off"
      subtitle="Submit a formal leave application for manager approval"
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} className="modal-form-grid">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-field-group">
          <label className="field-label" htmlFor="leave-type-select">
            Leave Category *
          </label>
          <select
            id="leave-type-select"
            className="form-input"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          >
            {LEAVE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row-2">
          <div className="form-field-group">
            <label className="field-label" htmlFor="leave-start-date">
              Start Date *
            </label>
            <input
              id="leave-start-date"
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field-group">
            <label className="field-label" htmlFor="leave-end-date">
              End Date *
            </label>
            <input
              id="leave-end-date"
              type="date"
              className="form-input"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="leave-duration-summary-box">
          <span>Total Requested Duration:</span>
          <strong>{calculateDays()} {calculateDays() === 1 ? 'Working Day' : 'Working Days'}</strong>
        </div>

        <div className="form-field-group">
          <label className="field-label" htmlFor="leave-reason">
            Reason / Purpose *
          </label>
          <textarea
            id="leave-reason"
            className="form-textarea"
            rows={3}
            placeholder="e.g. Attending family function / medical checkup..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <div className="modal-actions-footer">
          <button type="button" onClick={onClose} className="btn-modal-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-modal-primary">
            <CalendarCheck2 size={16} />
            <span>Submit Leave Request</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
