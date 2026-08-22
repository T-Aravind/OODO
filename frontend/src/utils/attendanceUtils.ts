import type { AttendanceRecord, AttendanceStatusType, PayrollAttendanceSummary } from '../types/attendance'
import type { LeaveRecord } from '../types'

export const STANDARD_WORK_MINUTES = 8 * 60 // 8 hours = 480 mins
export const STANDARD_START_HOUR = 9 // 9:00 AM
export const STANDARD_START_MINUTE = 30 // 9:30 AM is threshold for Late
export const DEFAULT_BREAK_MINUTES = 45 // 45 mins lunch/break

/**
 * Converts various time formats (e.g. "09:00 AM", "9:00 AM", "18:00", "09:00", "07:30 PM") into minutes from midnight (0..1439).
 */
export function parseTimeToMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr || typeof timeStr !== 'string') return null
  const cleaned = timeStr.trim()
  if (!cleaned || cleaned === '—' || cleaned === '-' || cleaned === 'In Progress') return null

  // Check 12-hour AM/PM format (e.g. "09:15 AM", "9:15 AM", "06:30 PM")
  const ampmMatch = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/i)
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10)
    const minutes = parseInt(ampmMatch[2], 10)
    const meridian = ampmMatch[3] ? ampmMatch[3].toUpperCase() : null

    if (meridian === 'PM' && hours < 12) hours += 12
    if (meridian === 'AM' && hours === 12) hours = 0

    return hours * 60 + minutes
  }

  return null
}

/**
 * Format total minutes to "Xh Ym" string (e.g. 540 -> "9h 00m")
 */
export function formatMinutesToHours(minutes: number): string {
  if (minutes < 0) minutes = 0
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins.toString().padStart(2, '0')}m`
}

/**
 * Format total minutes to digital "HH:MM" string (e.g. 540 -> "09:00")
 */
export function formatMinutesToDigital(minutes: number): string {
  if (minutes < 0) minutes = 0
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Calculate net work hours based on CheckIn, CheckOut, and Break Duration.
 */
export function calculateWorkHours(
  checkIn: string | null,
  checkOut: string | null,
  breakMinutes: number = DEFAULT_BREAK_MINUTES
): { workMinutes: number; formatted: string; digital: string } {
  if (!checkIn) {
    return { workMinutes: 0, formatted: '—', digital: '00:00' }
  }

  if (!checkOut) {
    return { workMinutes: 0, formatted: 'In Progress', digital: 'In Progress' }
  }

  const inMins = parseTimeToMinutes(checkIn)
  const outMins = parseTimeToMinutes(checkOut)

  if (inMins === null || outMins === null) {
    return { workMinutes: 0, formatted: '—', digital: '00:00' }
  }

  const rawMinutes = Math.max(0, outMins - inMins)
  // Deduct break duration only if raw session > 2 hours (120 mins); for short test/demo sessions don't force break deduction below 0
  const netMinutes = rawMinutes > 120 ? Math.max(0, rawMinutes - breakMinutes) : rawMinutes

  return {
    workMinutes: netMinutes,
    formatted: formatMinutesToHours(netMinutes),
    digital: formatMinutesToDigital(netMinutes)
  }
}

/**
 * Calculate Extra Hours (Overtime or Deficit) relative to standard work minutes (default 8 hrs).
 */
export function calculateExtraHours(
  workMinutes: number,
  standardMinutes: number = STANDARD_WORK_MINUTES
): { extraMinutes: number; formatted: string; digital: string; isOvertime: boolean } {
  if (workMinutes <= 0) {
    return { extraMinutes: 0, formatted: '0h 00m', digital: '00:00', isOvertime: false }
  }

  const diff = workMinutes - standardMinutes
  if (diff > 0) {
    return {
      extraMinutes: diff,
      formatted: `+${formatMinutesToHours(diff)}`,
      digital: formatMinutesToDigital(diff),
      isOvertime: true
    }
  }

  return {
    extraMinutes: 0,
    formatted: '0h 00m',
    digital: '00:00',
    isOvertime: false
  }
}

/**
 * Determine status dynamically if not explicitly specified.
 */
export function getAttendanceStatus(
  checkIn: string | null,
  _checkOut: string | null,
  isLeave = false,
  isAbsent = false,
  isHalfDay = false,
  isWeekend = false
): AttendanceStatusType {
  if (isWeekend) return 'weekend'
  if (isLeave) return 'leave'
  if (isAbsent || !checkIn) return 'absent'
  if (isHalfDay) return 'half_day'

  const inMins = parseTimeToMinutes(checkIn)
  if (inMins !== null) {
    const lateThresholdMins = STANDARD_START_HOUR * 60 + STANDARD_START_MINUTE
    if (inMins > lateThresholdMins) {
      return 'late'
    }
    return 'present'
  }

  return 'present'
}

/**
 * Month names list
 */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

/**
 * Checks whether a given Date is a weekend (Saturday or Sunday).
 */
export function isWeekendDay(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
}

/**
 * Format Date to standard YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Format ISO date string (YYYY-MM-DD) to friendly format: "28/10/2025" or "28 Oct 2025"
 */
export function formatDateDisplay(dateStr: string, format: 'slash' | 'long' | 'medium' = 'slash'): string {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr

  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)

  const dateObj = new Date(year, month, day)
  if (isNaN(dateObj.getTime())) return dateStr

  if (format === 'slash') {
    const dStr = String(day).padStart(2, '0')
    const mStr = String(month + 1).padStart(2, '0')
    return `${dStr}/${mStr}/${year}`
  }

  if (format === 'long') {
    const dStr = String(day).padStart(2, '0')
    const mName = MONTH_NAMES[month]
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    return `${dStr} ${mName} ${year}, ${weekday}`
  }

  const dStr = String(day).padStart(2, '0')
  const mShort = SHORT_MONTH_NAMES[month]
  return `${dStr} ${mShort} ${year}`
}

/**
 * Calculate Monthly Payroll & Attendance Summary for an Employee.
 * Determines total working days, present days, leaves, unpaid leaves, and payable days.
 */
export function calculatePayrollSummary(
  employeeId: string,
  employeeName: string,
  year: number,
  month: number, // 0-indexed (0 = Jan, 9 = Oct)
  attendanceRecords: AttendanceRecord[],
  leaveRecords: LeaveRecord[] = []
): PayrollAttendanceSummary {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let totalWorkingDays = 0
  let presentDays = 0
  let lateDays = 0
  let halfDays = 0
  let absentDays = 0
  let paidLeaveDays = 0
  let unpaidLeaveDays = 0
  let totalWorkMinutes = 0
  let totalExtraMinutes = 0

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`

  // Filter records for this employee in this month
  const empRecords = attendanceRecords.filter(
    (r) => r.employeeId === employeeId && r.date.startsWith(monthPrefix)
  )
  const recordMap = new Map<string, AttendanceRecord>()
  empRecords.forEach((r) => recordMap.set(r.date, r))

  // Loop through all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day)
    const isWeekend = isWeekendDay(d)
    const dateStr = formatDateISO(d)

    if (!isWeekend) {
      totalWorkingDays++

      const record = recordMap.get(dateStr)
      if (record) {
        if (record.status === 'present') {
          presentDays++
        } else if (record.status === 'late') {
          presentDays++
          lateDays++
        } else if (record.status === 'half_day') {
          halfDays++
          presentDays += 0.5
        } else if (record.status === 'leave') {
          if (record.isUnpaidLeave) {
            unpaidLeaveDays++
          } else {
            paidLeaveDays++
          }
        } else if (record.status === 'absent') {
          absentDays++
        }

        // Calculate hours
        if (record.checkIn && record.checkOut) {
          const hours = calculateWorkHours(record.checkIn, record.checkOut, record.breakDuration ?? DEFAULT_BREAK_MINUTES)
          totalWorkMinutes += hours.workMinutes
          const extra = calculateExtraHours(hours.workMinutes)
          totalExtraMinutes += extra.extraMinutes
        }
      }
    }
  }

  // Count leaves from leave records if not already in attendance
  leaveRecords.forEach((lr) => {
    if (lr.employeeId === employeeId && lr.status === 'Approved') {
      const start = new Date(lr.startDate)
      if (start.getFullYear() === year && start.getMonth() === month) {
        if (lr.leaveType === 'Unpaid Leave') {
          unpaidLeaveDays += lr.days
        }
      }
    }
  })

  // Payable days = Working days - absentDays - unpaidLeaveDays - (halfDays * 0.5)
  const payableDays = Math.max(
    0,
    totalWorkingDays - absentDays - unpaidLeaveDays - (halfDays > 0 ? halfDays * 0.5 : 0)
  )

  return {
    employeeId,
    employeeName,
    month: month + 1,
    year,
    totalCalendarDays: daysInMonth,
    totalWorkingDays,
    presentDays: Math.floor(presentDays),
    lateDays,
    halfDays,
    absentDays,
    paidLeaveDays,
    unpaidLeaveDays,
    payableDays,
    totalWorkMinutes,
    totalWorkHoursFormatted: formatMinutesToHours(totalWorkMinutes),
    totalExtraMinutes,
    totalExtraHoursFormatted: formatMinutesToHours(totalExtraMinutes)
  }
}
