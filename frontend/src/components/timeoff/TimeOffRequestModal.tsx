import React, { useState, useMemo } from 'react'
import { UploadCloud, X, FileText, Check } from 'lucide-react'

import { Modal } from '../common/Modal'
import { useApp } from '../../context/AppContext'
import type { LeaveType } from '../../types'

interface TimeOffRequestModalProps {
  isOpen: boolean
  onClose: () => void
  defaultEmployeeId?: string
}

const LEAVE_TYPES: LeaveType[] = [
  'Paid Time Off',
  'Sick Leave',
  'Unpaid Leave'
]

export const TimeOffRequestModal: React.FC<TimeOffRequestModalProps> = ({
  isOpen,
  onClose,
  defaultEmployeeId
}) => {
  const { currentUser, employees, addLeaveRecord, allocations } = useApp()

  const currentEmpId = defaultEmployeeId || currentUser?.employeeId || 'EMP001'
  const currentEmp = employees.find((e) => e.id === currentEmpId)
  const employeeName = currentEmp?.name || currentUser?.name || 'Aravind T'

  // Allocation metrics for validation
  const userAllocation = allocations.find((a) => a.employeeId === currentEmpId)
  const availablePTO = Math.max(
    0,
    (userAllocation?.paidTimeOffTotal ?? 24) - (userAllocation?.paidTimeOffUsed ?? 4)
  )

  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Time Off')
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [reason, setReason] = useState('')
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Automatically calculate working days
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) return 0
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }, [startDate, endDate])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFileName(e.target.files[0].name)
      if (errors.attachment) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next.attachment
          return next
        })
      }
    }
  }

  const handleRemoveFile = () => {
    setAttachedFileName(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!startDate) newErrors.startDate = 'Start date is required.'
    if (!endDate) newErrors.endDate = 'End date is required.'
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date cannot be earlier than start date.'
    }
    if (calculatedDays <= 0) {
      newErrors.days = 'Duration must be at least 1 day.'
    }
    if (!reason.trim()) {
      newErrors.reason = 'Please specify the reason for your time-off request.'
    }
    // Validation for Sick Leave attachment
    if (leaveType === 'Sick Leave' && !attachedFileName) {
      newErrors.attachment = 'Medical certificate / doctor note is mandatory for sick leave.'
    }
    // Validation for PTO limit
    if (leaveType === 'Paid Time Off' && calculatedDays > availablePTO) {
      newErrors.days = `Requested duration (${calculatedDays} days) exceeds available balance (${availablePTO} days).`
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit leave request
    addLeaveRecord({
      employeeId: currentEmpId,
      employeeName,
      department: currentEmp?.department || 'Engineering',
      avatar: currentEmp?.profileImage,
      leaveType,
      startDate,
      endDate,
      days: calculatedDays,
      reason: reason.trim(),
      attachment: attachedFileName
    })

    // Reset and close
    setReason('')
    setAttachedFileName(null)
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Time off Type Request"
      subtitle="Submit a formal time-off request for manager / HR review"
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} className="timeoff-request-form">
        {/* Employee Name (Read Only for Employee) */}
        <div className="form-group-row">
          <label className="req-form-label" htmlFor="req-employee">
            Employee
          </label>
          <div className="req-input-container">
            <input
              id="req-employee"
              type="text"
              className="req-form-input readonly"
              value={`${employeeName} (${currentEmpId})`}
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Time Off Type Dropdown */}
        <div className="form-group-row">
          <label className="req-form-label" htmlFor="req-leave-type">
            Time off Type
          </label>
          <div className="req-input-container">
            <select
              id="req-leave-type"
              className="req-form-select"
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value as LeaveType)
                setErrors((prev) => {
                  const next = { ...prev }
                  delete next.attachment
                  return next
                })
              }}
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {leaveType === 'Paid Time Off' && (
              <span className="req-input-subtext">
                Available balance: <strong>{availablePTO} days</strong>
              </span>
            )}
          </div>
        </div>

        {/* Validity Period: Start Date & End Date */}
        <div className="form-group-row">
          <label className="req-form-label">
            Validity Period
          </label>
          <div className="req-input-container">
            <div className="date-range-inputs">
              <div className="date-field-col">
                <input
                  id="req-start-date"
                  type="date"
                  className={`req-form-input date-input ${errors.startDate ? 'input-error' : ''}`}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-label="Start Date"
                />
                {errors.startDate && <span className="field-error-msg">{errors.startDate}</span>}
              </div>

              <span className="date-to-separator">To</span>

              <div className="date-field-col">
                <input
                  id="req-end-date"
                  type="date"
                  className={`req-form-input date-input ${errors.endDate ? 'input-error' : ''}`}
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="End Date"
                />
                {errors.endDate && <span className="field-error-msg">{errors.endDate}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Allocation / Duration Display */}
        <div className="form-group-row">
          <label className="req-form-label">
            Allocation
          </label>
          <div className="req-input-container">
            <div className="allocation-pill-display">
              <span className="alloc-number">{calculatedDays.toString().padStart(2, '0')}.00</span>
              <span className="alloc-label">{calculatedDays === 1 ? 'Day' : 'Days'}</span>
            </div>
            {errors.days && <span className="field-error-msg">{errors.days}</span>}
          </div>
        </div>

        {/* Reason / Purpose */}
        <div className="form-group-row">
          <label className="req-form-label" htmlFor="req-reason">
            Reason
          </label>
          <div className="req-input-container">
            <textarea
              id="req-reason"
              className={`req-form-textarea ${errors.reason ? 'input-error' : ''}`}
              rows={3}
              placeholder="Reason for leave request (e.g. family vacation, medical appointment)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {errors.reason && <span className="field-error-msg">{errors.reason}</span>}
          </div>
        </div>

        {/* Attachment Upload */}
        <div className="form-group-row">
          <label className="req-form-label">
            Attachment
          </label>
          <div className="req-input-container">
            <div className="attachment-upload-zone">
              {attachedFileName ? (
                <div className="attached-file-pill">
                  <FileText size={15} className="text-primary-accent" />
                  <span className="file-name-text">{attachedFileName}</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="btn-remove-attachment"
                    aria-label="Remove attached file"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="upload-label-btn" htmlFor="leave-attachment-input">
                  <UploadCloud size={18} className="text-primary-accent" />
                  <span>Choose File (PDF, PNG, JPG)</span>
                  <input
                    id="leave-attachment-input"
                    type="file"
                    className="hidden-file-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            <span className="req-input-subtext text-slate-500">
              {leaveType === 'Sick Leave' ? (
                <strong className="text-amber-700">
                  ⚠️ Medical certificate required for sick leave requests.
                </strong>
              ) : (
                '(Optional: Supporting documentation, flight itinerary, etc.)'
              )}
            </span>
            {errors.attachment && (
              <span className="field-error-msg">{errors.attachment}</span>
            )}
          </div>
        </div>

        {/* Action Buttons: Submit & Discard */}
        <div className="modal-actions-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-modal-secondary"
            id="btn-discard-request"
          >
            Discard
          </button>
          <button
            type="submit"
            className="btn-modal-primary"
            id="btn-submit-request"
          >
            <Check size={16} />
            <span>Submit Request</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
