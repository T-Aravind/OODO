import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react'
import type { LeaveRecord, PublicHoliday } from '../../types'
import { PUBLIC_HOLIDAYS } from '../../data/mockData'

interface LeaveCalendarProps {
  leaves: LeaveRecord[]
  employeeId?: string
  holidays?: PublicHoliday[]
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  leaves,
  employeeId,
  holidays = PUBLIC_HOLIDAYS
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return 2026
  })

  const [activeTooltip, setActiveTooltip] = useState<{
    dateStr: string
    title: string
    subtitle: string
    type: string
  } | null>(null)

  // Map dates (YYYY-MM-DD) to leaves or holidays
  const dateMap = useMemo(() => {
    const map = new Map<
      string,
      {
        type: 'approved' | 'pending' | 'rejected' | 'holiday'
        label: string
        details: string
      }
    >()

    // Public Holidays
    holidays.forEach((h) => {
      map.set(h.date, {
        type: 'holiday',
        label: h.name,
        details: `${h.type} Holiday`
      })
    })

    // Filter leaves for this employee if employeeId is specified
    const relevantLeaves = employeeId
      ? leaves.filter((l) => l.employeeId === employeeId)
      : leaves

    relevantLeaves.forEach((leave) => {
      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)

      // Loop through all days in the range
      const curr = new Date(start)
      while (curr <= end) {
        const dateStr = curr.toISOString().split('T')[0]
        const statusType = leave.status.toLowerCase() as 'approved' | 'pending' | 'rejected'

        map.set(dateStr, {
          type: statusType,
          label: `${leave.leaveType} (${leave.status})`,
          details: leave.reason
        })

        curr.setDate(curr.getDate() + 1)
      }
    })

    return map
  }, [leaves, employeeId, holidays])

  // Generate calendar grid data for all 12 months
  const monthsData = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const firstDay = new Date(selectedYear, monthIndex, 1).getDay()
      const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate()

      const days: Array<{
        dayNumber: number | null
        dateStr: string | null
        isWeekend: boolean
        event?: {
          type: 'approved' | 'pending' | 'rejected' | 'holiday'
          label: string
          details: string
        }
      }> = []

      // Leading blank spaces
      for (let i = 0; i < firstDay; i++) {
        days.push({ dayNumber: null, dateStr: null, isWeekend: false })
      }

      // Actual days
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(selectedYear, monthIndex, d)
        const dayOfWeek = dateObj.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const dateStr = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        const event = dateMap.get(dateStr)

        days.push({
          dayNumber: d,
          dateStr,
          isWeekend,
          event
        })
      }

      return {
        monthName: MONTH_NAMES[monthIndex],
        monthIndex,
        days
      }
    })
  }, [selectedYear, dateMap])

  return (
    <div className="leave-calendar-card">
      {/* Calendar Header with Year Controls */}
      <div className="calendar-card-header">
        <div className="calendar-header-title">
          <CalendarIcon size={18} className="text-primary-accent" />
          <h2 className="calendar-heading">Employee Leave Calendar</h2>
          <span className="calendar-year-badge">{selectedYear}</span>
        </div>

        <div className="calendar-year-nav">
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            className="btn-year-nav"
            title="Previous Year"
            aria-label="Previous Year"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="current-year-display">{selectedYear}</span>
          <button
            onClick={() => setSelectedYear((y) => y + 1)}
            className="btn-year-nav"
            title="Next Year"
            aria-label="Next Year"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 12-Month Multi-Month Grid */}
      <div className="multi-month-grid">
        {monthsData.map((month) => (
          <div key={month.monthIndex} className="mini-month-card">
            <h3 className="mini-month-title">{month.monthName}</h3>

            <div className="mini-month-weekdays">
              {DAY_LABELS.map((lbl, idx) => (
                <span
                  key={idx}
                  className={`weekday-label ${idx === 0 || idx === 6 ? 'weekend-lbl' : ''}`}
                >
                  {lbl}
                </span>
              ))}
            </div>

            <div className="mini-month-days-grid">
              {month.days.map((dayItem, dayIdx) => {
                if (!dayItem.dayNumber) {
                  return <div key={`blank-${dayIdx}`} className="calendar-day-cell blank" />
                }

                const event = dayItem.event
                const isToday =
                  dayItem.dateStr === new Date().toISOString().split('T')[0]

                let cellClass = 'calendar-day-cell'
                if (dayItem.isWeekend) cellClass += ' day-weekend'
                if (isToday) cellClass += ' day-today'
                if (event) cellClass += ` day-event event-${event.type}`

                return (
                  <button
                    key={`day-${dayItem.dayNumber}`}
                    className={cellClass}
                    onClick={() => {
                      if (event && dayItem.dateStr) {
                        setActiveTooltip({
                          dateStr: dayItem.dateStr,
                          title: event.label,
                          subtitle: event.details,
                          type: event.type
                        })
                      }
                    }}
                    onMouseEnter={() => {
                      if (event && dayItem.dateStr) {
                        setActiveTooltip({
                          dateStr: dayItem.dateStr,
                          title: event.label,
                          subtitle: event.details,
                          type: event.type
                        })
                      }
                    }}
                    title={
                      event
                        ? `${dayItem.dateStr}: ${event.label} - ${event.details}`
                        : dayItem.dateStr || ''
                    }
                  >
                    <span>{dayItem.dayNumber}</span>
                    {event && <span className={`event-marker-dot dot-${event.type}`} />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip Card / Info Banner */}
      {activeTooltip && (
        <div className={`calendar-hover-info-strip event-theme-${activeTooltip.type}`}>
          <div className="info-strip-content">
            <Info size={16} />
            <div>
              <strong className="font-mono text-xs">{activeTooltip.dateStr}:</strong>{' '}
              <span className="font-bold">{activeTooltip.title}</span> —{' '}
              <span className="text-xs">{activeTooltip.subtitle}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTooltip(null)}
            className="btn-close-tooltip"
            aria-label="Dismiss info"
          >
            &times;
          </button>
        </div>
      )}

      {/* Color Legend Bar */}
      <div className="calendar-legend-footer">
        <div className="legend-item">
          <span className="legend-dot dot-approved" />
          <span className="legend-text">Approved Leave</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-pending" />
          <span className="legend-text">Pending Approval</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-rejected" />
          <span className="legend-text">Rejected Leave</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-holiday" />
          <span className="legend-text">Public Holiday</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-weekend" />
          <span className="legend-text">Weekend</span>
        </div>
      </div>
    </div>
  )
}
