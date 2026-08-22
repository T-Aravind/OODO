import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Employee, AttendanceRecord, LeaveRecord, UserSession } from '../types'
import { INITIAL_EMPLOYEES, INITIAL_ATTENDANCE_RECORDS, INITIAL_LEAVE_RECORDS } from '../data/mockData'
import { useToast } from './ToastContext'
import {
  calculateWorkHours,
  calculateExtraHours,
  getAttendanceStatus,
  DEFAULT_BREAK_MINUTES
} from '../utils/attendanceUtils'

interface CheckInState {
  isCheckedIn: boolean
  checkInTime: string | null
  checkInTimestamp: number | null
  elapsedSeconds: number
}

interface AppContextType {
  currentUser: UserSession | null
  employees: Employee[]
  attendanceRecords: AttendanceRecord[]
  leaveRecords: LeaveRecord[]
  checkInState: CheckInState
  login: (userData: { email: string; role: 'admin' | 'employee'; name: string; loginId?: string }) => void
  logout: () => void
  performCheckIn: () => void
  performCheckOut: () => void
  addEmployee: (employee: Omit<Employee, 'id'>) => Employee
  addLeaveRecord: (leave: Omit<LeaveRecord, 'id' | 'appliedOn' | 'status'>) => void
  getEmployeeById: (id: string) => Employee | undefined
  updateAttendanceRecord: (record: AttendanceRecord) => void
  deleteAttendanceRecord: (id: string) => void
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => AttendanceRecord
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEYS = {
  USER: 'dayflow_user_session',
  EMPLOYEES: 'dayflow_employees_data',
  ATTENDANCE: 'dayflow_attendance_data',
  LEAVES: 'dayflow_leaves_data',
  CHECKIN: 'dayflow_checkin_state'
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast()

  // Load Initial Session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Employees state
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES)
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES
    } catch {
      return INITIAL_EMPLOYEES
    }
  })

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE)
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS
    } catch {
      return INITIAL_ATTENDANCE_RECORDS
    }
  })

  // Leave Records
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES)
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_RECORDS
    } catch {
      return INITIAL_LEAVE_RECORDS
    }
  })

  // Check-In State
  const [checkInState, setCheckInState] = useState<CheckInState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKIN)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.isCheckedIn && parsed.checkInTimestamp) {
          const diff = Math.floor((Date.now() - parsed.checkInTimestamp) / 1000)
          return {
            ...parsed,
            elapsedSeconds: Math.max(0, diff)
          }
        }
        return parsed
      }
    } catch {
      // ignore
    }
    return {
      isCheckedIn: false,
      checkInTime: null,
      checkInTimestamp: null,
      elapsedSeconds: 0
    }
  })

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords))
  }, [attendanceRecords])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRecords))
  }, [leaveRecords])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKIN, JSON.stringify(checkInState))
  }, [checkInState])

  // Live timer for active check-in session
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (checkInState.isCheckedIn && checkInState.checkInTimestamp) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - checkInState.checkInTimestamp!) / 1000)
        setCheckInState((prev) => ({
          ...prev,
          elapsedSeconds: diff
        }))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [checkInState.isCheckedIn, checkInState.checkInTimestamp])

  const formatCurrentTime = (date: Date = new Date()) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const formatDateString = (date: Date = new Date()) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Login handler
  // Login handler
  const login = useCallback((userData: { email: string; role: 'admin' | 'employee'; name: string; loginId?: string }) => {
    const matchedEmployee = employees.find(
      (e) => e.email.toLowerCase() === userData.email.toLowerCase()
    ) || employees[0]

    const session: UserSession = {
      name: userData.name || matchedEmployee.name,
      email: userData.email,
      role: userData.role,
      employeeId: userData.loginId || matchedEmployee.id || 'EMP-1001',
      profileImage: matchedEmployee.profileImage,
      department: matchedEmployee.department,
      designation: matchedEmployee.designation,
      companyName: 'DayFlow Technologies'
    }

    setCurrentUser(session)
    addToast('success', 'Authentication Successful', `Welcome back, ${session.name}!`)
  }, [employees, addToast])

  // Logout handler
  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem(STORAGE_KEYS.USER)
    addToast('info', 'Logged Out', 'You have been signed out successfully.')
  }, [addToast])

  // Check In handler (Syncs with Spring Boot POST /api/attendance/check-in)
  const performCheckIn = useCallback(async (workLocation = 'OFFICE') => {
    const now = new Date()
    const timeStr = formatCurrentTime(now)
    const todayStr = formatDateString(now)
    const timestamp = now.getTime()

    const empId = currentUser?.employeeId || 'EMP-1001'

    setCheckInState({
      isCheckedIn: true,
      checkInTime: timeStr,
      checkInTimestamp: timestamp,
      elapsedSeconds: 0
    })

    // Call Backend API
    try {
      await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeLoginId: empId, workLocation }),
      })
    } catch {
      // Fallback preview
    }

    const matchedEmp = employees.find((e) => e.id === empId) || employees[0]
    const empName = currentUser?.name || matchedEmp?.name || 'Employee'
    const initialStatus = getAttendanceStatus(timeStr, null)

    // Update employee status to 'present'
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, status: 'present' } : emp))
    )

    // Add or update attendance record for today
    setAttendanceRecords((prev) => {
      const existingIndex = prev.findIndex((a) => a.employeeId === empId && a.date === todayStr)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          checkIn: timeStr,
          status: initialStatus,
          workingHours: 'In Progress',
          notes: `Checked in via dashboard (${workLocation}).`
        }
        return updated
      } else {
        const newRecord: AttendanceRecord = {
          id: `ATT-${Date.now().toString().slice(-4)}`,
          employeeId: empId,
          employeeName: empName,
          department: matchedEmp?.department || 'Engineering',
          avatar: matchedEmp?.profileImage || '',
          date: todayStr,
          checkIn: timeStr,
          checkOut: null,
          breakDuration: DEFAULT_BREAK_MINUTES,
          workingHours: 'In Progress',
          extraHours: '0h 00m',
          workMinutes: 0,
          extraMinutes: 0,
          status: initialStatus,
          notes: `Checked in via dashboard (${workLocation}).`
        }
        return [newRecord, ...prev]
      }
    })

    addToast('success', 'Attendance Marked', `Checked in successfully at ${timeStr}`)
  }, [currentUser, employees, addToast])

  // Check Out handler (Syncs with Spring Boot POST /api/attendance/check-out)
  const performCheckOut = useCallback(async () => {
    const now = new Date()
    const timeStr = formatCurrentTime(now)
    const todayStr = formatDateString(now)

    const empId = currentUser?.employeeId || 'EMP-1001'

    // Call Backend API
    try {
      await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeLoginId: empId }),
      })
    } catch {
      // Fallback preview
    }

    // Update attendance record with checkout time and calculate exact work/extra hours
    setAttendanceRecords((prev) => {
      const existingIndex = prev.findIndex((a) => a.employeeId === empId && a.date === todayStr)
      if (existingIndex >= 0) {
        const existing = prev[existingIndex]
        const breakMins = existing.breakDuration ?? DEFAULT_BREAK_MINUTES
        const hoursResult = calculateWorkHours(existing.checkIn, timeStr, breakMins)
        const extraResult = calculateExtraHours(hoursResult.workMinutes)

        const updated = [...prev]
        updated[existingIndex] = {
          ...existing,
          checkOut: timeStr,
          workingHours: hoursResult.formatted,
          workMinutes: hoursResult.workMinutes,
          extraHours: extraResult.formatted,
          extraMinutes: extraResult.extraMinutes,
          status: existing.status === 'late' ? 'late' : 'present'
        }
        return updated
      }
      return prev
    })

    setCheckInState({
      isCheckedIn: false,
      checkInTime: null,
      checkInTimestamp: null,
      elapsedSeconds: 0
    })

    addToast('success', 'Attendance Completed', `Checked out successfully at ${timeStr}`)
  }, [currentUser, addToast])

  // Update an Attendance Record (Used by Admin/HR)
  const updateAttendanceRecord = useCallback((updatedRecord: AttendanceRecord) => {
    const breakMins = updatedRecord.breakDuration ?? DEFAULT_BREAK_MINUTES
    const hoursResult = calculateWorkHours(updatedRecord.checkIn, updatedRecord.checkOut, breakMins)
    const extraResult = calculateExtraHours(hoursResult.workMinutes)

    const calculatedRecord: AttendanceRecord = {
      ...updatedRecord,
      workingHours: updatedRecord.checkOut ? hoursResult.formatted : (updatedRecord.checkIn ? 'In Progress' : '0h 00m'),
      workMinutes: hoursResult.workMinutes,
      extraHours: extraResult.formatted,
      extraMinutes: extraResult.extraMinutes
    }

    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === calculatedRecord.id ? calculatedRecord : r))
    )
    addToast('success', 'Attendance Updated', `Record for ${calculatedRecord.employeeName} has been updated.`)
  }, [addToast])

  // Delete Attendance Record
  const deleteAttendanceRecord = useCallback((id: string) => {
    setAttendanceRecords((prev) => prev.filter((r) => r.id !== id))
    addToast('info', 'Record Removed', 'Attendance record was deleted.')
  }, [addToast])

  // Add Attendance Record manually
  const addAttendanceRecord = useCallback((newRecordData: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
    const newId = `ATT-${Date.now().toString().slice(-4)}`
    const breakMins = newRecordData.breakDuration ?? DEFAULT_BREAK_MINUTES
    const hoursResult = calculateWorkHours(newRecordData.checkIn, newRecordData.checkOut, breakMins)
    const extraResult = calculateExtraHours(hoursResult.workMinutes)

    const fullRecord: AttendanceRecord = {
      ...newRecordData,
      id: newId,
      workingHours: newRecordData.checkOut ? hoursResult.formatted : (newRecordData.checkIn ? 'In Progress' : '0h 00m'),
      workMinutes: hoursResult.workMinutes,
      extraHours: extraResult.formatted,
      extraMinutes: extraResult.extraMinutes
    }

    setAttendanceRecords((prev) => [fullRecord, ...prev])
    addToast('success', 'Attendance Logged', `Record added for ${fullRecord.employeeName}.`)
    return fullRecord
  }, [addToast])

  // Add Employee handler
  const addEmployee = useCallback((newEmpData: Omit<Employee, 'id'>): Employee => {
    const newId = `EMP${String(employees.length + 1).padStart(3, '0')}`
    const fullEmployee: Employee = {
      ...newEmpData,
      id: newId
    }
    setEmployees((prev) => [fullEmployee, ...prev])
    addToast('success', 'Employee Created', `${fullEmployee.name} has been added to the directory.`)
    return fullEmployee
  }, [employees.length, addToast])

  // Add Leave Record
  const addLeaveRecord = useCallback((leaveData: Omit<LeaveRecord, 'id' | 'appliedOn' | 'status'>) => {
    const todayStr = formatDateString()
    const newLeave: LeaveRecord = {
      ...leaveData,
      id: `LEV-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
      appliedOn: todayStr
    }
    setLeaveRecords((prev) => [newLeave, ...prev])
    addToast('success', 'Leave Request Submitted', `Your ${newLeave.leaveType} request for ${newLeave.days} days was submitted.`)
  }, [addToast])

  // Get Employee by ID
  const getEmployeeById = useCallback((id: string) => {
    return employees.find((e) => e.id.toLowerCase() === id.toLowerCase())
  }, [employees])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        employees,
        attendanceRecords,
        leaveRecords,
        checkInState,
        login,
        logout,
        performCheckIn,
        performCheckOut,
        addEmployee,
        addLeaveRecord,
        getEmployeeById,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        addAttendanceRecord
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
