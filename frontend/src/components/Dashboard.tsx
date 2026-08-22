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
  onNavigateUrl?: (path: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({
  initialView = 'employees',
  initialEmployeeId = null,
  onNavigateUrl
}) => {
  const { currentUser, employees, getEmployeeById } = useApp()
  const [currentView, setCurrentView] = useState<ActiveView>(initialView)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(() => {
    if (initialEmployeeId) {
      return getEmployeeById(initialEmployeeId) || employees[0]
    }
    return null
  })

  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView)
    }
    if (initialEmployeeId) {
      const emp = getEmployeeById(initialEmployeeId)
      if (emp) setSelectedEmployee(emp)
    }
  }, [initialView, initialEmployeeId, getEmployeeById])

  const handleNavigate = (view: 'employees' | 'profile' | 'attendance' | 'time-off') => {
    if (view === 'profile') {
      const loggedInEmp = employees.find((e) => e.id === currentUser?.employeeId) || employees[0]
      setSelectedEmployee(loggedInEmp)
      setCurrentView('profile')
      if (onNavigateUrl) onNavigateUrl('/profile')
    } else if (view === 'employees') {
      setSelectedEmployee(null)
      setCurrentView('employees')
      if (onNavigateUrl) onNavigateUrl('/employees')
    } else if (view === 'attendance') {
      setCurrentView('attendance')
      if (onNavigateUrl) onNavigateUrl('/attendance')
    } else if (view === 'time-off') {
      setCurrentView('time-off')
      if (onNavigateUrl) onNavigateUrl('/time-off')
    }
  }

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp)
    setCurrentView('employee-detail')
    if (onNavigateUrl) onNavigateUrl(`/employees/${emp.id}`)
  }

  const handleBackToEmployees = () => {
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
        {currentView === 'employees' && (
          <EmployeesDashboard onSelectEmployee={handleSelectEmployee} />
        )}

        {(currentView === 'employee-detail' || currentView === 'profile') && selectedEmployee && (
          <EmployeeProfile
            employee={selectedEmployee}
            onBack={handleBackToEmployees}
          />
        )}

        {currentView === 'attendance' && <AttendancePage />}

        {currentView === 'time-off' && <TimeOffPage />}
      </main>
    </div>
  )
}
