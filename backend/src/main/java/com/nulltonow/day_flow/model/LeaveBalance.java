package com.nulltonow.day_flow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_balances")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_login_id", nullable = false, unique = true)
    private String employeeLoginId;

    @Column(name = "annual_leave_balance")
    private Integer annualLeaveBalance = 15;

    @Column(name = "sick_leave_balance")
    private Integer sickLeaveBalance = 10;

    @Column(name = "casual_leave_balance")
    private Integer casualLeaveBalance = 7;

    @Column(name = "total_taken")
    private Integer totalTaken = 0;

    public LeaveBalance() {}

    public LeaveBalance(String employeeLoginId, Integer annualLeaveBalance, Integer sickLeaveBalance, Integer casualLeaveBalance, Integer totalTaken) {
        this.employeeLoginId = employeeLoginId;
        this.annualLeaveBalance = annualLeaveBalance;
        this.sickLeaveBalance = sickLeaveBalance;
        this.casualLeaveBalance = casualLeaveBalance;
        this.totalTaken = totalTaken;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeLoginId() {
        return employeeLoginId;
    }

    public void setEmployeeLoginId(String employeeLoginId) {
        this.employeeLoginId = employeeLoginId;
    }

    public Integer getAnnualLeaveBalance() {
        return annualLeaveBalance;
    }

    public void setAnnualLeaveBalance(Integer annualLeaveBalance) {
        this.annualLeaveBalance = annualLeaveBalance;
    }

    public Integer getSickLeaveBalance() {
        return sickLeaveBalance;
    }

    public void setSickLeaveBalance(Integer sickLeaveBalance) {
        this.sickLeaveBalance = sickLeaveBalance;
    }

    public Integer getCasualLeaveBalance() {
        return casualLeaveBalance;
    }

    public void setCasualLeaveBalance(Integer casualLeaveBalance) {
        this.casualLeaveBalance = casualLeaveBalance;
    }

    public Integer getTotalTaken() {
        return totalTaken;
    }

    public void setTotalTaken(Integer totalTaken) {
        this.totalTaken = totalTaken;
    }
}
