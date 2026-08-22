import React from 'react'
import { SearchX, Users } from 'lucide-react'
import type { Employee } from '../../types'
import { EmployeeCard } from './EmployeeCard'

interface EmployeeGridProps {
  employees: Employee[]
  onEmployeeClick: (employee: Employee) => void
  onClearSearch?: () => void
  isFiltered?: boolean
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  onEmployeeClick,
  onClearSearch,
  isFiltered = false
}) => {
  if (employees.length === 0) {
    return (
      <div className="employee-empty-state">
        <div className="empty-icon-box">
          <SearchX size={36} className="text-slate-400" />
        </div>
        <h3>No employees found</h3>
        <p>
          {isFiltered
            ? 'We couldn’t find any employee matching your current search query or status filter.'
            : 'No employee records are available in the directory.'}
        </p>
        {isFiltered && onClearSearch && (
          <button onClick={onClearSearch} className="btn-clear-filters">
            Clear Search & Filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="employee-grid-wrapper">
      <div className="employee-grid-header-meta">
        <span className="results-count">
          <Users size={14} className="text-slate-500" />
          Showing <strong>{employees.length}</strong> {employees.length === 1 ? 'employee' : 'employees'}
        </span>
      </div>

      <div className="employee-cards-grid">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={onEmployeeClick}
          />
        ))}
      </div>
    </div>
  )
}
