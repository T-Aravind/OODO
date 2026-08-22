import React from 'react'
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react'
import { MONTH_NAMES } from '../../utils/attendanceUtils'

interface AttendanceMonthNavProps {
  currentYear: number
  currentMonth: number // 0-11
  onChangeMonth: (year: number, month: number) => void
  onResetToCurrent?: () => void
  showTodayBtn?: boolean
}

export const AttendanceMonthNav: React.FC<AttendanceMonthNavProps> = ({
  currentYear,
  currentMonth,
  onChangeMonth,
  onResetToCurrent,
  showTodayBtn = true
}) => {
  const handlePrev = () => {
    if (currentMonth === 0) {
      onChangeMonth(currentYear - 1, 11)
    } else {
      onChangeMonth(currentYear, currentMonth - 1)
    }
  }

  const handleNext = () => {
    if (currentMonth === 11) {
      onChangeMonth(currentYear + 1, 0)
    } else {
      onChangeMonth(currentYear, currentMonth + 1)
    }
  }

  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = parseInt(e.target.value, 10)
    onChangeMonth(currentYear, selectedMonth)
  }

  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(e.target.value, 10)
    onChangeMonth(selectedYear, currentMonth)
  }

  const yearOptions = [2024, 2025, 2026, 2027]

  return (
    <div className="attendance-month-nav-container">
      {/* Arrow Buttons & Current Month Badge */}
      <div className="month-nav-button-group">
        <button
          onClick={handlePrev}
          className="month-nav-btn prev-btn"
          title="Previous Month"
          aria-label="Previous Month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="month-nav-selector-capsule">
          <Calendar size={15} className="text-primary-accent" />
          <select
            value={currentMonth}
            onChange={handleMonthSelect}
            className="month-dropdown-select"
            aria-label="Select month"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={handleYearSelect}
            className="year-dropdown-select"
            aria-label="Select year"
          >
            {yearOptions.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNext}
          className="month-nav-btn next-btn"
          title="Next Month"
          aria-label="Next Month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Optional Jump to Today Button */}
      {showTodayBtn && onResetToCurrent && (
        <button
          onClick={onResetToCurrent}
          className="btn-jump-today"
          title="Jump to Current Month"
        >
          <RotateCcw size={13} />
          <span>Current Period</span>
        </button>
      )}
    </div>
  )
}
