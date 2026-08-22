export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected'

export type LeaveType =
  | 'Paid Time Off'
  | 'Sick Leave'
  | 'Casual Leave'
  | 'Maternity / Paternity'
  | 'Unpaid Leave'

export interface LeaveRecord {
  id: string
  employeeId: string
  employeeName: string
  department?: string
  avatar?: string
  leaveType: LeaveType
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  days: number
  status: LeaveStatus
  reason: string
  appliedOn: string // YYYY-MM-DD
  attachment?: string | null
  rejectionReason?: string | null
}

export interface LeaveAllocation {
  employeeId: string
  employeeName: string
  department: string
  avatar?: string
  paidTimeOffTotal: number
  paidTimeOffUsed: number
  sickLeaveTotal: number
  sickLeaveUsed: number
  validityYear: number
}

export interface PublicHoliday {
  id: string
  date: string // YYYY-MM-DD
  name: string
  type: 'National' | 'Gazetted' | 'Corporate'
}
