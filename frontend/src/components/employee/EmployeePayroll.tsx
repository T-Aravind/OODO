import React, { useState } from 'react'
import {
  MOCK_CURRENT_EMPLOYEE,
  MOCK_SALARY_SLIPS,
  EmployeeSalarySlip,
} from '../../mock/employeeData'

export const EmployeePayroll: React.FC = () => {
  const [slips] = useState<EmployeeSalarySlip[]>(MOCK_SALARY_SLIPS)
  const [selectedSlip, setSelectedSlip] = useState<EmployeeSalarySlip | null>(null)

  const handleDownload = (slipMonth: string) => {
    alert(`Downloading PDF salary slip for ${slipMonth} 2026...`)
  }

  return (
    <div className="payroll-view-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2>Payroll & Salary Slips</h2>
          <p className="sub-text">View monthly breakdown & download paystubs</p>
        </div>
      </div>

      {/* Salary Overview Card (READ ONLY) */}
      <div className="card-box salary-overview-box">
        <div className="box-title">
          <h3>Salary Structure Overview</h3>
          <span className="readonly-badge">🔒 Read Only Data</span>
        </div>

        <div className="sal-overview-grid">
          <div className="sal-block">
            <span className="lbl">Basic Salary</span>
            <span className="val">₹{MOCK_CURRENT_EMPLOYEE.salary.basic.toLocaleString()}</span>
          </div>

          <div className="sal-block">
            <span className="lbl">HRA (House Rent)</span>
            <span className="val">₹{MOCK_CURRENT_EMPLOYEE.salary.hra.toLocaleString()}</span>
          </div>

          <div className="sal-block">
            <span className="lbl">Special Allowances</span>
            <span className="val">₹{MOCK_CURRENT_EMPLOYEE.salary.allowances.toLocaleString()}</span>
          </div>

          <div className="sal-block deduction">
            <span className="lbl">Deductions (PF / Tax)</span>
            <span className="val">- ₹{MOCK_CURRENT_EMPLOYEE.salary.deductions.toLocaleString()}</span>
          </div>

          <div className="sal-block net-take-home">
            <span className="lbl">Net Take-Home Salary</span>
            <span className="val-lg">₹{MOCK_CURRENT_EMPLOYEE.salary.netSalary.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Salary Slips Table */}
      <div className="card-box table-box">
        <div className="box-title">
          <h3>Monthly Salary Slips</h3>
        </div>
        <div className="responsive-table-wrapper">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Gross Salary</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slips.map((slip) => (
                <tr key={slip.id}>
                  <td>
                    <strong>{slip.month} {slip.year}</strong>
                  </td>
                  <td>₹{slip.grossSalary.toLocaleString()}</td>
                  <td className="text-danger">- ₹{slip.deductions.toLocaleString()}</td>
                  <td>
                    <strong className="text-success">₹{slip.netSalary.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${slip.status === 'Paid' ? 'present' : 'halfday'}`}>
                      {slip.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-group">
                      <button
                        className="btn-sm-outline"
                        onClick={() => setSelectedSlip(slip)}
                      >
                        👁️ View
                      </button>
                      <button
                        className="btn-sm-primary"
                        onClick={() => handleDownload(slip.month)}
                      >
                        📥 Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Preview Modal */}
      {selectedSlip && (
        <div className="modal-backdrop" onClick={() => setSelectedSlip(null)}>
          <div className="modal-dialog slip-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Salary Slip — {selectedSlip.month} {selectedSlip.year}</h3>
              <button className="btn-close" onClick={() => setSelectedSlip(null)}>
                ✕
              </button>
            </div>

            <div className="paystub-container">
              {/* Slip Header */}
              <div className="paystub-header">
                <div className="paystub-brand">
                  <span className="brand-logo">⚡</span>
                  <div>
                    <h4>DAYFLOW TECHNOLOGIES PRIVATE LIMITED</h4>
                    <p>Bangalore Tech Park, Karnataka - 560102</p>
                  </div>
                </div>
                <div className="paystub-badge">
                  <span>SALARY SLIP</span>
                  <p>{selectedSlip.month.toUpperCase()} {selectedSlip.year}</p>
                </div>
              </div>

              {/* Employee Meta Grid */}
              <div className="paystub-emp-grid">
                <div>
                  <span className="lbl">Employee Name:</span>
                  <span className="val">{MOCK_CURRENT_EMPLOYEE.name}</span>
                </div>
                <div>
                  <span className="lbl">Employee ID:</span>
                  <span className="val">{MOCK_CURRENT_EMPLOYEE.id}</span>
                </div>
                <div>
                  <span className="lbl">Designation:</span>
                  <span className="val">{MOCK_CURRENT_EMPLOYEE.designation}</span>
                </div>
                <div>
                  <span className="lbl">Department:</span>
                  <span className="val">{MOCK_CURRENT_EMPLOYEE.department}</span>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="paystub-breakdown-grid">
                {/* Earnings Table */}
                <div className="breakdown-col">
                  <h5>EARNINGS</h5>
                  <div className="row-item">
                    <span>Basic Salary</span>
                    <span>₹{MOCK_CURRENT_EMPLOYEE.salary.basic.toLocaleString()}</span>
                  </div>
                  <div className="row-item">
                    <span>HRA</span>
                    <span>₹{MOCK_CURRENT_EMPLOYEE.salary.hra.toLocaleString()}</span>
                  </div>
                  <div className="row-item">
                    <span>Special Allowance</span>
                    <span>₹{MOCK_CURRENT_EMPLOYEE.salary.allowances.toLocaleString()}</span>
                  </div>
                  <div className="row-item total">
                    <span>Total Earnings</span>
                    <span>₹{selectedSlip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions Table */}
                <div className="breakdown-col">
                  <h5>DEDUCTIONS</h5>
                  <div className="row-item">
                    <span>Provident Fund (PF)</span>
                    <span>₹2,500</span>
                  </div>
                  <div className="row-item">
                    <span>Professional Tax</span>
                    <span>₹1,500</span>
                  </div>
                  <div className="row-item total">
                    <span>Total Deductions</span>
                    <span>₹{selectedSlip.deductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight */}
              <div className="paystub-net-banner">
                <span>NET PAYABLE AMOUNT:</span>
                <span className="net-val">₹{selectedSlip.netSalary.toLocaleString()}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-modal-cancel"
                onClick={() => setSelectedSlip(null)}
              >
                Close
              </button>
              <button
                className="btn-modal-submit"
                onClick={() => handleDownload(selectedSlip.month)}
              >
                📥 Download PDF Paystub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
