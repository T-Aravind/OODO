export type EmployeeStatus = 'present' | 'on_leave' | 'absent'

import type { AttendanceRecord, AttendanceStatusType, PayrollAttendanceSummary, AttendanceFilterOptions } from './attendance'
export type { AttendanceRecord, AttendanceStatusType, PayrollAttendanceSummary, AttendanceFilterOptions }

import type { LeaveRecord, LeaveStatus, LeaveType, LeaveAllocation, PublicHoliday } from './timeoff'
export type { LeaveRecord, LeaveStatus, LeaveType, LeaveAllocation, PublicHoliday }


export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  profileImage: string
  joiningDate: string
  manager: string
  location: string
  status: EmployeeStatus
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract'
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say'
  dob?: string
  nationality?: string
  workShift?: string
  extension?: string
  attendance?: AttendanceRecord[]
  leaves?: LeaveRecord[]
}

export interface UserSession {
  name: string
  email: string
  role: 'admin' | 'employee'
  employeeId: string
  profileImage?: string
  department?: string
  designation?: string
  companyName?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message?: string
  timestamp: number
}
