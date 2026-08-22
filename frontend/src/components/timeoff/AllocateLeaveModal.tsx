import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Modal } from '../common/Modal'
import type { LeaveAllocation } from '../../types'
import { useApp } from '../../context/AppContext'

interface AllocateLeaveModalProps {
  isOpen: boolean
  allocation: LeaveAllocation | null
  onClose: () => void
}

export const AllocateLeaveModal: React.FC<AllocateLeaveModalProps> = ({
  isOpen,
  allocation,
  onClose
}) => {
  const { updateAllocation } = useApp()

  const [ptoTotal, setPtoTotal] = useState<number>(allocation?.paidTimeOffTotal ?? 24)
  const [sickTotal, setSickTotal] = useState<number>(allocation?.sickLeaveTotal ?? 7)
  const [validityYear, setValidityYear] = useState<number>(allocation?.validityYear ?? new Date().getFullYear())

  // Sync when allocation changes
  React.useEffect(() => {
    if (allocation) {
      setPtoTotal(allocation.paidTimeOffTotal)
      setSickTotal(allocation.sickLeaveTotal)
      setValidityYear(allocation.validityYear)
    }
  }, [allocation])

  if (!allocation) return null

  const handleSave = () => {
    updateAllocation({
      ...allocation,
      paidTimeOffTotal: ptoTotal,
      sickLeaveTotal: sickTotal,
      validityYear
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Allocate / Adjust Leave Quota"
      subtitle="Update annual leave quota for the selected employee"
      maxWidth="460px"
    >
      <div className="allocate-modal-content">
        <div className="allocate-employee-strip">
          {allocation.avatar && (
            <img src={allocation.avatar} alt={allocation.employeeName} className="alloc-avatar" />
          )}
          <div>
            <p className="alloc-emp-name">{allocation.employeeName}</p>
            <p className="alloc-emp-dept">{allocation.department} · {allocation.employeeId}</p>
          </div>
        </div>

        <div className="allocate-form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="alloc-pto">Paid Time Off (Days)</label>
            <input
              id="alloc-pto"
              type="number"
              min={0}
              max={60}
              className="form-input"
              value={ptoTotal}
              onChange={(e) => setPtoTotal(Number(e.target.value))}
            />
            <span className="form-help">Currently used: {allocation.paidTimeOffUsed} days</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="alloc-sick">Sick Leave (Days)</label>
            <input
              id="alloc-sick"
              type="number"
              min={0}
              max={30}
              className="form-input"
              value={sickTotal}
              onChange={(e) => setSickTotal(Number(e.target.value))}
            />
            <span className="form-help">Currently used: {allocation.sickLeaveUsed} days</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="alloc-year">Validity Year</label>
            <select
              id="alloc-year"
              className="form-select"
              value={validityYear}
              onChange={(e) => setValidityYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions-footer">
          <button type="button" onClick={onClose} className="btn-modal-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-modal-primary">
            <PlusCircle size={16} />
            <span>Save Allocation</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
