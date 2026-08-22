import React, { useState, useEffect } from 'react'
import { UserCheck, Users, ShieldAlert } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { EmployeeAttendanceView } from './EmployeeAttendanceView'
import { AdminAttendanceView } from './AdminAttendanceView'

interface AttendancePageProps {
  initialMode?: 'employee' | 'admin'
  onNavigateUrl?: (path: string) => void
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  initialMode,
  onNavigateUrl
}) => {
  const { currentUser } = useApp()
  const isAdmin = currentUser?.role === 'admin'

  // Determine active view mode
  const [viewMode, setViewMode] = useState<'employee' | 'admin'>(() => {
    if (initialMode) return initialMode
    return isAdmin ? 'admin' : 'employee'
  })

  useEffect(() => {
    if (initialMode) {
      setViewMode(initialMode)
    }
  }, [initialMode])

  const handleToggleMode = (mode: 'employee' | 'admin') => {
    setViewMode(mode)
    if (onNavigateUrl) {
      if (mode === 'admin') {
        onNavigateUrl('/admin/attendance')
      } else {
        onNavigateUrl('/attendance')
      }
    }
  }

  return (
    <div className="attendance-page-layout">
      {/* If current user is Admin, provide a quick perspective switcher */}
      {isAdmin && (
        <div className="role-perspective-bar">
          <div className="role-perspective-label">
            <ShieldAlert size={15} className="text-primary-accent" />
            <span>HR Administrator Perspective:</span>
          </div>

          <div className="role-toggle-tabs">
            <button
              onClick={() => handleToggleMode('admin')}
              className={`role-tab-btn ${viewMode === 'admin' ? 'active' : ''}`}
              id="tab-admin-attendance"
            >
              <Users size={15} />
              <span>All Employees Roster (Admin)</span>
            </button>

            <button
              onClick={() => handleToggleMode('employee')}
              className={`role-tab-btn ${viewMode === 'employee' ? 'active' : ''}`}
              id="tab-my-attendance"
            >
              <UserCheck size={15} />
              <span>My Personal Attendance Log</span>
            </button>
          </div>
        </div>
      )}

      {/* Render appropriate view */}
      {viewMode === 'admin' && isAdmin ? (
        <AdminAttendanceView />
      ) : (
        <EmployeeAttendanceView />
      )}
    </div>
  )
}
