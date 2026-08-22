export interface EmployeeProfileData {
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
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract'
  dob: string
  gender: string
  address: string
  salary: {
    basic: number
    hra: number
    allowances: number
    deductions: number
    netSalary: number
  }
}

export interface EmployeeAttendanceLog {
  id: string
  date: string
  checkIn: string | null
  checkOut: string | null
  workingHours: string | null
  status: 'present' | 'absent' | 'half_day' | 'leave'
}

export interface EmployeeLeaveItem {
  id: string
  leaveType: 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave'
  startDate: string
  endDate: string
  days: number
  reason: string
  appliedOn: string
  status: 'Pending' | 'Approved' | 'Rejected'
  adminComment?: string
}

export interface EmployeeSalarySlip {
  id: string
  month: string
  year: number
  grossSalary: number
  deductions: number
  netSalary: number
  status: 'Paid' | 'Processing'
}

export interface EmployeeNotification {
  id: string
  type: 'leave' | 'attendance' | 'payroll' | 'system'
  icon: string
  title: string
  description: string
  timestamp: string
  read: boolean
}

export interface RecentActivityItem {
  id: string
  type: 'check_in' | 'leave_applied' | 'leave_approved' | 'payroll'
  title: string
  timestamp: string
  statusType: 'success' | 'info' | 'warning'
}

// ── Mock Employee Master Data ─────────────────────────────
export const MOCK_CURRENT_EMPLOYEE: EmployeeProfileData = {
  id: 'DF1024',
  name: 'Akash Kumar',
  email: 'akash@dayflow.com',
  phone: '+91 98765 43210',
  department: 'Engineering',
  designation: 'Software Engineer',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  joiningDate: '10 June 2025',
  manager: 'John Smith',
  location: 'Bangalore Tech Park, India',
  employmentType: 'Full-Time',
  dob: '14 August 1997',
  gender: 'Male',
  address: '#42, 4th Main, HSR Layout, Sector 7, Bangalore, Karnataka - 560102',
  salary: {
    basic: 35000,
    hra: 10000,
    allowances: 5000,
    deductions: 4000,
    netSalary: 46000,
  },
}

// ── Mock Leave Balances ──────────────────────────────────
export const MOCK_LEAVE_BALANCES = {
  paidLeave: 10,
  sickLeave: 5,
  unpaidLeave: 'Unlimited',
}

// ── Mock Attendance Log ──────────────────────────────────
export const MOCK_ATTENDANCE_LOGS: EmployeeAttendanceLog[] = [
  {
    id: 'ATT-201',
    date: '2026-08-22',
    checkIn: '09:14 AM',
    checkOut: null,
    workingHours: '07h 42m',
    status: 'present',
  },
  {
    id: 'ATT-202',
    date: '2026-08-21',
    checkIn: '09:02 AM',
    checkOut: '06:04 PM',
    workingHours: '08h 58m',
    status: 'present',
  },
  {
    id: 'ATT-203',
    date: '2026-08-20',
    checkIn: null,
    checkOut: null,
    workingHours: '--',
    status: 'leave',
  },
  {
    id: 'ATT-204',
    date: '2026-08-19',
    checkIn: '09:10 AM',
    checkOut: '06:15 PM',
    workingHours: '09h 05m',
    status: 'present',
  },
  {
    id: 'ATT-205',
    date: '2026-08-18',
    checkIn: '09:30 AM',
    checkOut: '01:30 PM',
    workingHours: '04h 00m',
    status: 'half_day',
  },
  {
    id: 'ATT-206',
    date: '2026-08-17',
    checkIn: null,
    checkOut: null,
    workingHours: '--',
    status: 'absent',
  },
  {
    id: 'ATT-207',
    date: '2026-08-16',
    checkIn: '08:58 AM',
    checkOut: '06:00 PM',
    workingHours: '09h 02m',
    status: 'present',
  },
]

// ── Mock Leave History ───────────────────────────────────
export const MOCK_LEAVE_HISTORY: EmployeeLeaveItem[] = [
  {
    id: 'LEV-501',
    leaveType: 'Paid Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    days: 3,
    reason: 'Family function trip',
    appliedOn: '2026-08-18',
    status: 'Approved',
  },
  {
    id: 'LEV-502',
    leaveType: 'Sick Leave',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    days: 1,
    reason: 'Viral fever rest',
    appliedOn: '2026-08-19',
    status: 'Approved',
  },
  {
    id: 'LEV-503',
    leaveType: 'Paid Leave',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    days: 4,
    reason: 'Personal vacation',
    appliedOn: '2026-08-21',
    status: 'Pending',
  },
  {
    id: 'LEV-504',
    leaveType: 'Unpaid Leave',
    startDate: '2026-07-12',
    endDate: '2026-07-13',
    days: 2,
    reason: 'Home renovation work',
    appliedOn: '2026-07-05',
    status: 'Rejected',
    adminComment: 'Project deadline overlapping during those dates.',
  },
]

// ── Mock Salary Slips History ────────────────────────────
export const MOCK_SALARY_SLIPS: EmployeeSalarySlip[] = [
  {
    id: 'SLIP-AUG-2026',
    month: 'August',
    year: 2026,
    grossSalary: 50000,
    deductions: 4000,
    netSalary: 46000,
    status: 'Processing',
  },
  {
    id: 'SLIP-JUL-2026',
    month: 'July',
    year: 2026,
    grossSalary: 50000,
    deductions: 4000,
    netSalary: 46000,
    status: 'Paid',
  },
  {
    id: 'SLIP-JUN-2026',
    month: 'June',
    year: 2026,
    grossSalary: 50000,
    deductions: 4000,
    netSalary: 46000,
    status: 'Paid',
  },
  {
    id: 'SLIP-MAY-2026',
    month: 'May',
    year: 2026,
    grossSalary: 50000,
    deductions: 4000,
    netSalary: 46000,
    status: 'Paid',
  },
]

// ── Mock Notifications ───────────────────────────────────
export const MOCK_NOTIFICATIONS: EmployeeNotification[] = [
  {
    id: 'NOTIF-1',
    type: 'leave',
    icon: '🟢',
    title: 'Leave Request Approved',
    description: 'Your leave request for Aug 25–27 has been approved by HR.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'NOTIF-2',
    type: 'attendance',
    icon: '🕐',
    title: 'Attendance Check-in Reminder',
    description: 'Good morning! Remember to mark your daily attendance.',
    timestamp: 'Today, 09:00 AM',
    read: false,
  },
  {
    id: 'NOTIF-3',
    type: 'payroll',
    icon: '💰',
    title: 'Salary Slip Available',
    description: 'Your July 2026 salary slip is available for download.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 'NOTIF-4',
    type: 'system',
    icon: '🎉',
    title: 'Company Holiday Announcement',
    description: 'Office will remain closed on Sept 15 for Independence Day.',
    timestamp: '3 days ago',
    read: true,
  },
]

// ── Mock Recent Activity ──────────────────────────────────
export const MOCK_RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'ACT-1',
    type: 'check_in',
    title: 'Checked in at 09:14 AM',
    timestamp: 'Today, 09:14 AM',
    statusType: 'success',
  },
  {
    id: 'ACT-2',
    type: 'leave_applied',
    title: 'Leave request submitted (Sept 5–8)',
    timestamp: 'Yesterday, 04:20 PM',
    statusType: 'info',
  },
  {
    id: 'ACT-3',
    type: 'leave_approved',
    title: 'Leave request approved for Aug 25–27',
    timestamp: '20 Aug, 10:30 AM',
    statusType: 'success',
  },
  {
    id: 'ACT-4',
    type: 'payroll',
    title: 'July Salary Slip generated (₹46,000)',
    timestamp: '01 Aug, 09:00 AM',
    statusType: 'info',
  },
]
