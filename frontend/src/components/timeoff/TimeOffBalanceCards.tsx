import React from 'react'
import { Calendar, HeartPulse, Sparkles } from 'lucide-react'
import type { LeaveAllocation } from '../../types'

interface TimeOffBalanceCardsProps {
  allocation?: LeaveAllocation
  mode?: 'employee' | 'admin'
}

export const TimeOffBalanceCards: React.FC<TimeOffBalanceCardsProps> = ({
  allocation
}) => {
  const ptoTotal = allocation?.paidTimeOffTotal ?? 24
  const ptoUsed = allocation?.paidTimeOffUsed ?? 4
  const ptoAvailable = Math.max(0, ptoTotal - ptoUsed)

  const sickTotal = allocation?.sickLeaveTotal ?? 7
  const sickUsed = allocation?.sickLeaveUsed ?? 1
  const sickAvailable = Math.max(0, sickTotal - sickUsed)

  const ptoPercent = Math.round((ptoAvailable / ptoTotal) * 100)
  const sickPercent = Math.round((sickAvailable / sickTotal) * 100)

  return (
    <div className="timeoff-balances-container">
      <div className="timeoff-balance-cards-grid">
        {/* Paid Time Off Card */}
        <div className="timeoff-kpi-card card-pto card-hover-lift">
          <div className="card-top-row">
            <div className="kpi-icon-box bg-blue-50 text-blue-600">
              <Calendar size={20} />
            </div>
            <span className="balance-status-pill blue">
              {ptoPercent}% Available
            </span>
          </div>

          <div className="card-body-metrics">
            <span className="kpi-label">Paid Time Off</span>
            <div className="kpi-main-number">
              {ptoAvailable.toString().padStart(2, '0')}{' '}
              <span className="kpi-unit-text">Days Available</span>
            </div>

            <div className="kpi-progress-bar-bg">
              <div
                className="kpi-progress-bar-fill fill-blue"
                style={{ width: `${ptoPercent}%` }}
              />
            </div>

            <div className="kpi-footer-sub">
              <span>{ptoUsed} days utilized</span>
              <span>•</span>
              <span>{ptoTotal} days annual quota</span>
            </div>
          </div>
        </div>

        {/* Sick Time Off Card */}
        <div className="timeoff-kpi-card card-sick card-hover-lift">
          <div className="card-top-row">
            <div className="kpi-icon-box bg-emerald-50 text-emerald-600">
              <HeartPulse size={20} />
            </div>
            <span className="balance-status-pill green">
              {sickPercent}% Available
            </span>
          </div>

          <div className="card-body-metrics">
            <span className="kpi-label">Sick Time Off</span>
            <div className="kpi-main-number">
              {sickAvailable.toString().padStart(2, '0')}{' '}
              <span className="kpi-unit-text">Days Available</span>
            </div>

            <div className="kpi-progress-bar-bg">
              <div
                className="kpi-progress-bar-fill fill-green"
                style={{ width: `${sickPercent}%` }}
              />
            </div>

            <div className="kpi-footer-sub">
              <span>{sickUsed} days utilized</span>
              <span>•</span>
              <span>Medical cert required &gt;2d</span>
            </div>
          </div>
        </div>

        {/* Unpaid / Special Leave Card */}
        <div className="timeoff-kpi-card card-unpaid card-hover-lift">
          <div className="card-top-row">
            <div className="kpi-icon-box bg-purple-50 text-purple-600">
              <Sparkles size={20} />
            </div>
            <span className="balance-status-pill purple">
              Policy Benefit
            </span>
          </div>

          <div className="card-body-metrics">
            <span className="kpi-label">Unpaid & Special Leave</span>
            <div className="kpi-main-number">
              Flexible <span className="kpi-unit-text">Allowance</span>
            </div>

            <div className="kpi-progress-bar-bg">
              <div
                className="kpi-progress-bar-fill fill-purple"
                style={{ width: `100%` }}
              />
            </div>

            <div className="kpi-footer-sub">
              <span>Approval upon manager review</span>
              <span>•</span>
              <span>Standard corporate policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
