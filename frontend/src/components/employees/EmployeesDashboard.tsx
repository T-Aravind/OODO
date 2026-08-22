import React, { useState, useMemo } from 'react'
import { Plus, Search, X, Briefcase } from 'lucide-react'
import type { Employee, EmployeeStatus } from '../../types'
import { useApp } from '../../context/AppContext'
import { EmployeeGrid } from './EmployeeGrid'
import { NewEmployeeModal } from './NewEmployeeModal'

interface EmployeesDashboardProps {
  onSelectEmployee: (employee: Employee) => void
}

export const EmployeesDashboard: React.FC<EmployeesDashboardProps> = ({ onSelectEmployee }) => {
  const { employees, addEmployee } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | EmployeeStatus>('all')
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  // Extract distinct departments
  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department))
    return Array.from(set)
  }, [employees])

  // Compute status counts
  const counts = useMemo(() => {
    const presentCount = employees.filter((e) => e.status === 'present').length
    const onLeaveCount = employees.filter((e) => e.status === 'on_leave').length
    const absentCount = employees.filter((e) => e.status === 'absent').length
    return {
      all: employees.length,
      present: presentCount,
      on_leave: onLeaveCount,
      absent: absentCount
    }
  }, [employees])

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return employees.filter((emp) => {
      // Status Filter
      if (statusFilter !== 'all' && emp.status !== statusFilter) {
        return false
      }
      // Department Filter
      if (deptFilter !== 'all' && emp.department !== deptFilter) {
        return false
      }
      // Search Query
      if (query) {
        const matchesName = emp.name.toLowerCase().includes(query)
        const matchesId = emp.id.toLowerCase().includes(query)
        const matchesDept = emp.department.toLowerCase().includes(query)
        const matchesDesignation = emp.designation.toLowerCase().includes(query)
        const matchesEmail = emp.email.toLowerCase().includes(query)
        return matchesName || matchesId || matchesDept || matchesDesignation || matchesEmail
      }
      return true
    })
  }, [employees, searchQuery, statusFilter, deptFilter])

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setDeptFilter('all')
  }

  const isFiltered = searchQuery !== '' || statusFilter !== 'all' || deptFilter !== 'all'

  return (
    <div className="employees-dashboard-container">
      {/* Dashboard Top Action Header */}
      <div className="dashboard-action-bar">
        {/* Left Action: NEW Employee Button */}
        <div className="action-bar-left">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn-new-employee"
            id="btn-new-employee"
          >
            <Plus size={18} />
            <span>NEW</span>
          </button>

          <div className="action-title-block">
            <h1 className="dashboard-main-title">Employees Directory</h1>
            <p className="dashboard-subtitle">
              Manage organization staff, track live presence, and review profiles
            </p>
          </div>
        </div>

        {/* Right Action: Search Box */}
        <div className="action-bar-right">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search employees by name, ID, title, dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-employees-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear search query"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Status Badges Bar */}
      <div className="dashboard-filters-strip">
        {/* Status Filters */}
        <div className="status-filter-pills">
          <button
            onClick={() => setStatusFilter('all')}
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
          >
            <span>All Staff</span>
            <span className="pill-count">{counts.all}</span>
          </button>

          <button
            onClick={() => setStatusFilter('present')}
            className={`filter-pill pill-present ${statusFilter === 'present' ? 'active' : ''}`}
          >
            <span className="pill-dot dot-green" />
            <span>Present</span>
            <span className="pill-count">{counts.present}</span>
          </button>

          <button
            onClick={() => setStatusFilter('on_leave')}
            className={`filter-pill pill-leave ${statusFilter === 'on_leave' ? 'active' : ''}`}
          >
            <span className="pill-icon">✈</span>
            <span>On Leave</span>
            <span className="pill-count">{counts.on_leave}</span>
          </button>

          <button
            onClick={() => setStatusFilter('absent')}
            className={`filter-pill pill-absent ${statusFilter === 'absent' ? 'active' : ''}`}
          >
            <span className="pill-dot dot-yellow" />
            <span>Absent</span>
            <span className="pill-count">{counts.absent}</span>
          </button>
        </div>

        {/* Department Filter Dropdown */}
        <div className="department-filter-box">
          <Briefcase size={14} className="text-slate-500" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="department-select"
            aria-label="Filter by department"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Cards Grid Area */}
      <div className="dashboard-content-area">
        <EmployeeGrid
          employees={filteredEmployees}
          onEmployeeClick={onSelectEmployee}
          onClearSearch={handleClearFilters}
          isFiltered={isFiltered}
        />
      </div>

      {/* Create Employee Modal Flow */}
      <NewEmployeeModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddEmployee={addEmployee}
      />
    </div>
  )
}
