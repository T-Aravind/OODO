import React, { useState } from 'react'
import { Search, Edit2, Users, TrendingUp } from 'lucide-react'

import { useApp } from '../../context/AppContext'
import type { LeaveAllocation } from '../../types'
import { AllocateLeaveModal } from './AllocateLeaveModal'

export const AllocationSection: React.FC = () => {
  const { allocations } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAllocation, setSelectedAllocation] = useState<LeaveAllocation | null>(null)
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false)

  const filteredAllocations = allocations.filter((a) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      a.employeeName.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.employeeId.toLowerCase().includes(q)
    )
  })

  const handleOpenAllocate = (alloc: LeaveAllocation) => {
    setSelectedAllocation(alloc)
    setIsAllocateModalOpen(true)
  }

  return (
    <div className="allocation-section-container">
      {/* Section Header */}
      <div className="alloc-section-header">
        <div>
          <h2 className="alloc-section-title">Leave Allocation Management</h2>
          <p className="alloc-section-subtitle">
            Manage annual PTO and sick leave quotas for all employees
          </p>
        </div>
        <div className="search-input-wrapper compact">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search allocations"
          />
        </div>
      </div>

      {/* Allocation Summary Stats */}
      <div className="alloc-summary-bar">
        <div className="alloc-stat-item">
          <Users size={15} className="text-slate-500" />
          <span className="alloc-stat-label">Total Employees:</span>
          <strong className="alloc-stat-val">{allocations.length}</strong>
        </div>
        <div className="alloc-stat-item">
          <TrendingUp size={15} className="text-indigo-500" />
          <span className="alloc-stat-label">Standard PTO Quota:</span>
          <strong className="alloc-stat-val text-indigo-700">24 Days / Year</strong>
        </div>
        <div className="alloc-stat-item">
          <span className="alloc-stat-label">Standard Sick Leave:</span>
          <strong className="alloc-stat-val text-emerald-700">7 Days / Year</strong>
        </div>
      </div>

      {/* Allocation Table */}
      <div className="table-responsive-wrapper">
        <table className="corporate-attendance-table alloc-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Paid Time Off</th>
              <th>Sick Leave</th>
              <th>Total Used</th>
              <th>Remaining</th>
              <th>Validity</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.length > 0 ? (
              filteredAllocations.map((alloc) => {
                const ptoRemaining = Math.max(0, alloc.paidTimeOffTotal - alloc.paidTimeOffUsed)
                const sickRemaining = Math.max(0, alloc.sickLeaveTotal - alloc.sickLeaveUsed)
                const totalUsed = alloc.paidTimeOffUsed + alloc.sickLeaveUsed
                const totalRemaining = ptoRemaining + sickRemaining
                const ptoUsedPercent = Math.round((alloc.paidTimeOffUsed / alloc.paidTimeOffTotal) * 100)

                return (
                  <tr key={alloc.employeeId} className="attendance-row-item">
                    <td>
                      <div className="emp-profile-cell">
                        <div className="cell-avatar-wrapper">
                          {alloc.avatar ? (
                            <img src={alloc.avatar} alt={alloc.employeeName} className="cell-avatar-img" />
                          ) : (
                            <div className="cell-avatar-fallback">
                              {alloc.employeeName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="cell-emp-info">
                          <span className="cell-emp-name">{alloc.employeeName}</span>
                          <span className="cell-emp-designation">{alloc.employeeId}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="cell-dept-text">{alloc.department}</span>
                    </td>

                    <td>
                      <div className="alloc-cell-progress">
                        <div className="alloc-usage-text">
                          <span className="font-bold text-slate-800">{alloc.paidTimeOffUsed}</span>
                          <span className="text-slate-400"> / {alloc.paidTimeOffTotal} days</span>
                        </div>
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill fill-blue"
                            style={{ width: `${ptoUsedPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="alloc-usage-text">
                        <span className="font-bold text-slate-800">{alloc.sickLeaveUsed}</span>
                        <span className="text-slate-400"> / {alloc.sickLeaveTotal} days</span>
                      </div>
                    </td>

                    <td>
                      <span className="badge-days-count">{totalUsed} days</span>
                    </td>

                    <td>
                      <span className={`alloc-remaining-badge ${totalRemaining > 10 ? 'good' : totalRemaining > 5 ? 'warn' : 'low'}`}>
                        {totalRemaining} days left
                      </span>
                    </td>

                    <td>
                      <span className="font-mono text-slate-500 text-xs">{alloc.validityYear}</span>
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => handleOpenAllocate(alloc)}
                        className="btn-action-icon edit-btn"
                        title="Adjust leave quota"
                        aria-label="Allocate leave quota"
                      >
                        <Edit2 size={13} />
                        <span>Allocate</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className="table-empty-state">
                  <div className="empty-state-box">
                    <Users size={32} className="text-slate-300 mb-2" />
                    <p className="empty-title">No employees match this search</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AllocateLeaveModal
        isOpen={isAllocateModalOpen}
        allocation={selectedAllocation}
        onClose={() => setIsAllocateModalOpen(false)}
      />
    </div>
  )
}
