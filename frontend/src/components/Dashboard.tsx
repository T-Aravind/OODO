import React, { useState, useEffect } from 'react'
import type { Employee } from '../types'
import { useApp } from '../context/AppContext'
import { Navbar } from './common/Navbar'
import { EmployeesDashboard } from './employees/EmployeesDashboard'
import { EmployeeProfile } from './employees/EmployeeProfile'
import { AttendancePage } from './attendance/AttendancePage'
import { TimeOffPage } from './timeoff/TimeOffPage'

type ActiveView = 'employees' | 'employee-detail' | 'profile' | 'attendance' | 'time-off'

interface DashboardProps {
  initialView?: ActiveView
  initialEmployeeId?: string | null
  initialAttendanceMode?: 'employee' | 'admin'
  onNavigateUrl?: (path: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({
  initialView = 'employees',
  initialEmployeeId = null,
  initialAttendanceMode,
  onNavigateUrl
}) => {
  const { currentUser, employees, getEmployeeById } = useApp()
  const isEmployeeRole = currentUser?.role === 'employee'

  // If role is employee, default view must be 'profile', never 'employees' directory
  const defaultView: ActiveView = isEmployeeRole ? (initialView === 'employees' ? 'profile' : initialView) : initialView
  const [currentView, setCurrentView] = useState<ActiveView>(defaultView)

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(() => {
    if (isEmployeeRole) {
      // Employee always gets own profile
      return employees[0] || null
    }
    if (initialEmployeeId) {
      return getEmployeeById(initialEmployeeId) || employees[0]
    }
    return employees[0] || null
  })

  // Sync state if initial props change or role restrictions apply
  useEffect(() => {
    if (isEmployeeRole) {
      if (initialView === 'employees') {
        setCurrentView('profile')
        setSelectedEmployee(employees[0] || null)
        return
      }
      if (initialView === 'employee-detail') {
        // IDOR check: if requested id != own id, redirect to profile
        if (initialEmployeeId && initialEmployeeId.toLowerCase() !== currentUser?.employeeId.toLowerCase()) {
          setCurrentView('profile')
          setSelectedEmployee(employees[0] || null)
          return
        }
      }
    }

    if (initialView) {
      setCurrentView(initialView)
    }
    if (initialEmployeeId) {
      const emp = getEmployeeById(initialEmployeeId)
      if (emp) setSelectedEmployee(emp)
    }
  }, [initialView, initialEmployeeId, isEmployeeRole, currentUser?.employeeId, employees, getEmployeeById])

  const handleNavigate = (view: 'employees' | 'profile' | 'attendance' | 'time-off') => {
    if (view === 'profile') {
      const loggedInEmp = employees.find((e) => e.id.toLowerCase() === currentUser?.employeeId.toLowerCase()) || employees[0]
      setSelectedEmployee(loggedInEmp)
      setCurrentView('profile')
      if (onNavigateUrl) onNavigateUrl('/profile')
    } else if (view === 'employees') {
      if (isEmployeeRole) {
        // Reject employee access to directory
        setCurrentView('profile')
        if (onNavigateUrl) onNavigateUrl('/profile')
        return
      }
      setSelectedEmployee(null)
      setCurrentView('employees')
      if (onNavigateUrl) onNavigateUrl('/employees')
    } else if (view === 'attendance') {
      setCurrentView('attendance')
      if (onNavigateUrl) {
        if (currentUser?.role === 'admin' && initialAttendanceMode === 'admin') {
          onNavigateUrl('/admin/attendance')
        } else {
          onNavigateUrl('/attendance')
        }
      }
    } else if (view === 'time-off') {
      setCurrentView('time-off')
      if (onNavigateUrl) onNavigateUrl('/time-off')
    }
  }

  const handleSelectEmployee = (emp: Employee) => {
    if (isEmployeeRole && emp.id.toLowerCase() !== currentUser?.employeeId.toLowerCase()) {
      return
    }
    setSelectedEmployee(emp)
    setCurrentView('employee-detail')
    if (onNavigateUrl) onNavigateUrl(`/employees/${emp.id}`)
  }

  const handleBackToEmployees = () => {
    if (isEmployeeRole) {
      setCurrentView('profile')
      if (onNavigateUrl) onNavigateUrl('/profile')
      return
    }
    setSelectedEmployee(null)
    setCurrentView('employees')
    if (onNavigateUrl) onNavigateUrl('/employees')
  }

  return (
    <div className="corporate-app-shell">
      {/* Top Professional Navigation */}
      <Navbar currentPage={currentView} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="corporate-main-content">
        {currentView === 'employees' && !isEmployeeRole && (
          <EmployeesDashboard onSelectEmployee={handleSelectEmployee} />
        )}

        {(currentView === 'employee-detail' || currentView === 'profile') && selectedEmployee && (
          <EmployeeProfile
            employee={selectedEmployee}
            onBack={handleBackToEmployees}
          />
        )}

        {currentView === 'attendance' && (
          <AttendancePage
            initialMode={initialAttendanceMode}
            onNavigateUrl={onNavigateUrl}
          />
        )}

        {currentView === 'time-off' && <TimeOffPage />}
      </main>
    </div>
  )
}
