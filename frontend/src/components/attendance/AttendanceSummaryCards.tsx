import React from 'react'
import { UserCheck, Plane, Briefcase, Clock, Zap, Users, AlertCircle, XCircle } from 'lucide-react'
import type { PayrollAttendanceSummary } from '../../types/attendance'

interface EmployeeSummaryProps {
  mode: 'employee'
  summary: PayrollAttendanceSummary
}

interface AdminSummaryProps {
  mode: 'admin'
  stats: {
    totalEmployees: number
    presentToday: number
    absentToday: number
    onLeaveToday: number
    lateToday: number
  }
}

type AttendanceSummaryCardsProps = EmployeeSummaryProps | AdminSummaryProps

export const AttendanceSummaryCards: React.FC<AttendanceSummaryCardsProps> = (props) => {
  if (props.mode === 'employee') {
    const { summary } = props
    const attendanceRate = summary.totalWorkingDays > 0
      ? Math.round((summary.presentDays / summary.totalWorkingDays) * 100)
      : 100

    return (
      <div className="attendance-summary-cards-grid employee-grid">
        {/* Days Present Card */}
        <div className="summary-metric-card metric-present card-hover-lift">
          <div className="summary-card-top">
            <div className="summary-icon-box bg-emerald-50 text-emerald-600">
              <UserCheck size={20} />
            </div>
            <span className="summary-mini-pill green">{attendanceRate}% Rate</span>
          </div>
          <div className="summary-content">
            <span className="summary-label">Days Present</span>
            <div className="summary-main-val">
              {summary.presentDays}
              <span className="summary-sub-total"> / {summary.totalWorkingDays}</span>
            </div>
            <span className="summary-caption text-emerald-700">
              {summary.lateDays > 0 ? `🟢 ${summary.lateDays} late entries` : '🟢 100% on-time check-ins'}
            </span>
          </div>
        </div>

        {/* Leaves Card */}
        <div className="summary-metric-card metric-leave card-hover-lift">
          <div className="summary-card-top">
            <div className="summary-icon-box bg-purple-50 text-purple-600">
              <Plane size={20} />
            </div>
            <span className="summary-mini-pill purple">Approved</span>
          </div>
          <div className="summary-content">
            <span className="summary-label">Leaves Count</span>
            <div className="summary-main-val">{summary.paidLeaveDays + summary.unpaidLeaveDays} <span className="summary-unit">days</span></div>
            <span className="summary-caption text-purple-700">
              {summary.unpaidLeaveDays > 0 ? `✈ ${summary.unpaidLeaveDays} unpaid leave` : '✈ All paid leaves'}
            </span>
          </div>
        </div>

        {/* Total Working Days Card */}
        <div className="summary-metric-card metric-working-days card-hover-lift">
          <div className="summary-card-top">
            <div className="summary-icon-box bg-blue-50 text-blue-600">
              <Briefcase size={20} />
            </div>
            <span className="summary-mini-pill blue">Scheduled</span>
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Working Days</span>
            <div className="summary-main-val">{summary.totalWorkingDays} <span className="summary-unit">days</span></div>
            <span className="summary-caption text-blue-700">
              💼 Standard work month
            </span>
          </div>
        </div>

        {/* Payable Days (Payroll Readiness) Card */}
        <div className="summary-metric-card metric-payable card-hover-lift">
          <div className="summary-card-top">
            <div className="summary-icon-box bg-indigo-50 text-indigo-600">
              <Zap size={20} />
            </div>
            <span className="summary-mini-pill indigo">Payroll Ready</span>
          </div>
          <div className="summary-content">
            <span className="summary-label">Payable Days (Salary)</span>
            <div className="summary-main-val text-indigo-600">{summary.payableDays} <span className="summary-unit">days</span></div>
            <span className="summary-caption text-indigo-700">
              ⚡ Calculated for payslip
            </span>
          </div>
        </div>

        {/* Productive Hours Card */}
        <div className="summary-metric-card metric-hours card-hover-lift">
          <div className="summary-card-top">
            <div className="summary-icon-box bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
            {summary.totalExtraMinutes > 0 && (
              <span className="summary-mini-pill amber">+{summary.totalExtraHoursFormatted} OT</span>
            )}
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Work Hours</span>
            <div className="summary-main-val font-mono">{summary.totalWorkHoursFormatted}</div>
            <span className="summary-caption text-amber-700">
              {summary.totalExtraMinutes > 0 ? `⏱ Overtime accumulated` : '⏱ Standard duration'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Admin Summary
  const { stats } = props
  const presentRate = stats.totalEmployees > 0
    ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
    : 0

  return (
    <div className="attendance-summary-cards-grid admin-grid">
      {/* Total Employees */}
      <div className="summary-metric-card metric-total card-hover-lift">
        <div className="summary-card-top">
          <div className="summary-icon-box bg-slate-100 text-slate-700">
            <Users size={20} />
          </div>
          <span className="summary-mini-pill slate">Company</span>
        </div>
        <div className="summary-content">
          <span className="summary-label">Total Headcount</span>
          <div className="summary-main-val">{stats.totalEmployees}</div>
          <span className="summary-caption text-slate-500">🏢 Active roster</span>
        </div>
      </div>

      {/* Present Today */}
      <div className="summary-metric-card metric-present card-hover-lift">
        <div className="summary-card-top">
          <div className="summary-icon-box bg-emerald-50 text-emerald-600">
            <UserCheck size={20} />
          </div>
          <span className="summary-mini-pill green">{presentRate}% In</span>
        </div>
        <div className="summary-content">
          <span className="summary-label">Present Today</span>
          <div className="summary-main-val text-emerald-600">{stats.presentToday}</div>
          <span className="summary-caption text-emerald-700">🟢 Checked in & working</span>
        </div>
      </div>

      {/* Late Today */}
      <div className="summary-metric-card metric-late card-hover-lift">
        <div className="summary-card-top">
          <div className="summary-icon-box bg-amber-50 text-amber-600">
            <AlertCircle size={20} />
          </div>
          <span className="summary-mini-pill amber">After 9:30 AM</span>
        </div>
        <div className="summary-content">
          <span className="summary-label">Late Arrivals</span>
          <div className="summary-main-val text-amber-600">{stats.lateToday}</div>
          <span className="summary-caption text-amber-700">🟡 Shift delay logged</span>
        </div>
      </div>

      {/* On Leave Today */}
      <div className="summary-metric-card metric-leave card-hover-lift">
        <div className="summary-card-top">
          <div className="summary-icon-box bg-purple-50 text-purple-600">
            <Plane size={20} />
          </div>
          <span className="summary-mini-pill purple">Approved</span>
        </div>
        <div className="summary-content">
          <span className="summary-label">On Leave Today</span>
          <div className="summary-main-val text-purple-600">{stats.onLeaveToday}</div>
          <span className="summary-caption text-purple-700">✈ Scheduled time off</span>
        </div>
      </div>

      {/* Absent Today */}
      <div className="summary-metric-card metric-absent card-hover-lift">
        <div className="summary-card-top">
          <div className="summary-icon-box bg-rose-50 text-rose-600">
            <XCircle size={20} />
          </div>
          <span className="summary-mini-pill red">Action Req.</span>
        </div>
        <div className="summary-content">
          <span className="summary-label">Absent / Unpunched</span>
          <div className="summary-main-val text-rose-600">{stats.absentToday}</div>
          <span className="summary-caption text-rose-700">🔴 Awaiting punch-in</span>
        </div>
      </div>
    </div>
  )
}
