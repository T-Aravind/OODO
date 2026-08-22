import React, { useState, useEffect } from 'react'
import { X, Clock } from 'lucide-react'
import type { AttendanceRecord, AttendanceStatusType } from '../../types/attendance'
import { useApp } from '../../context/AppContext'

interface EditAttendanceModalProps {
  record: AttendanceRecord | null
  isOpen: boolean
  onClose: () => void
}

export const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
  record,
  isOpen,
  onClose
}) => {
  const { updateAttendanceRecord } = useApp()

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [breakDuration, setBreakDuration] = useState(45)
  const [status, setStatus] = useState<AttendanceStatusType>('present')
  const [notes, setNotes] = useState('')
  const [isUnpaidLeave, setIsUnpaidLeave] = useState(false)

  useEffect(() => {
    if (record) {
      setCheckIn(record.checkIn || '')
      setCheckOut(record.checkOut || '')
      setBreakDuration(record.breakDuration ?? 45)
      setStatus(record.status)
      setNotes(record.notes || '')
      setIsUnpaidLeave(record.isUnpaidLeave || false)
    }
  }, [record])

  if (!isOpen || !record) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updated: AttendanceRecord = {
      ...record,
      checkIn: checkIn.trim() || null,
      checkOut: checkOut.trim() || null,
      breakDuration: Number(breakDuration) || 0,
      status,
      notes: notes.trim(),
      isUnpaidLeave
    }

    updateAttendanceRecord(updated)
    onClose()
  }

  return (
    <div className="attendance-modal-backdrop" onClick={onClose}>
      <div
        className="attendance-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="attendance-modal-header">
          <div className="modal-header-icon bg-indigo-50 text-indigo-600">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="modal-title">Edit Attendance Record</h2>
            <p className="modal-subtitle">
              Modify shift timings, break duration, and status for {record.employeeName}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="attendance-modal-form">
          {/* Employee & Date banner */}
          <div className="modal-info-strip">
            <div className="strip-item">
              <span className="strip-label">Employee:</span>
              <span className="strip-value font-semibold">{record.employeeName} ({record.employeeId})</span>
            </div>
            <div className="strip-item">
              <span className="strip-label">Date:</span>
              <span className="strip-value font-mono">{record.date}</span>
            </div>
          </div>

          <div className="form-row-grid-2">
            <div className="form-group">
              <label htmlFor="edit-check-in" className="form-label">
                Check-In Time
              </label>
              <input
                id="edit-check-in"
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="form-input font-mono"
              />
              <span className="form-help">Format: HH:MM AM/PM</span>
            </div>

            <div className="form-group">
              <label htmlFor="edit-check-out" className="form-label">
                Check-Out Time
              </label>
              <input
                id="edit-check-out"
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="e.g. 06:00 PM"
                className="form-input font-mono"
              />
              <span className="form-help">Format: HH:MM AM/PM</span>
            </div>
          </div>

          <div className="form-row-grid-2">
            <div className="form-group">
              <label htmlFor="edit-break" className="form-label">
                Break Duration (Minutes)
              </label>
              <input
                id="edit-break"
                type="number"
                min="0"
                max="240"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-status" className="form-label">
                Attendance Status
              </label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatusType)}
                className="form-select"
              >
                <option value="present">Present</option>
                <option value="late">Late Arrival</option>
                <option value="half_day">Half Day</option>
                <option value="leave">On Leave</option>
                <option value="absent">Absent</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>
          </div>

          {status === 'leave' && (
            <div className="form-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isUnpaidLeave}
                  onChange={(e) => setIsUnpaidLeave(e.target.checked)}
                />
                <span>Mark as Unpaid Leave (Deducted from payable days for payroll)</span>
              </label>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-notes" className="form-label">
              Adjustment Notes / Justification
            </label>
            <textarea
              id="edit-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Manual correction approved by HR manager due to biometric reader malfunction..."
              className="form-textarea"
            />
          </div>

          <div className="attendance-modal-footer">
            <button type="button" onClick={onClose} className="btn-modal-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-modal-save">
              Save Attendance Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
