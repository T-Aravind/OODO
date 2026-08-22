export type AttendanceStatusType = 'present' | 'late' | 'absent' | 'leave' | 'half_day' | 'weekend'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  department?: string
  avatar?: string
  date: string // Format: YYYY-MM-DD
  checkIn: string | null // e.g. "09:00 AM" or "09:00"
  checkOut: string | null // e.g. "06:00 PM" or "18:00"
  breakDuration?: number // Duration in minutes (e.g. 45)
  workingHours: string | null // e.g. "8h 15m" or "08:15" or "In Progress"
  extraHours?: string | null // e.g. "1h 00m" or "0h 00m"
  workMinutes?: number // Total net productive minutes
  extraMinutes?: number // Overtime / deficit minutes
  status: AttendanceStatusType
  notes?: string
  isUnpaidLeave?: boolean
}

export interface PayrollAttendanceSummary {
  employeeId: string
  employeeName: string
  month: number // 1 - 12
  year: number
  totalCalendarDays: number
  totalWorkingDays: number
  presentDays: number
  lateDays: number
  halfDays: number
  absentDays: number
  paidLeaveDays: number
  unpaidLeaveDays: number
  payableDays: number
  totalWorkMinutes: number
  totalWorkHoursFormatted: string
  totalExtraMinutes: number
  totalExtraHoursFormatted: string
}

export interface AttendanceFilterOptions {
  searchQuery: string
  department: string
  status: string
  date: string
  month: number // 0-11
  year: number
  viewMode: 'daily' | 'monthly'
}
