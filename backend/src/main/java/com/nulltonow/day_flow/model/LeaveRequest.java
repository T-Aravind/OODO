package com.nulltonow.day_flow.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_login_id", nullable = false)
    private String employeeLoginId;

    @Column(name = "leave_type", nullable = false)
    private String leaveType; // 'ANNUAL', 'SICK', 'CASUAL', 'UNPAID'

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "number_of_days", nullable = false)
    private Integer numberOfDays;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status", nullable = false)
    private String status; // 'PENDING', 'APPROVED', 'REJECTED'

    @Column(name = "approved_by_login_id")
    private String approvedByLoginId;

    @Column(name = "manager_comment")
    private String managerComment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public LeaveRequest() {
        this.createdAt = LocalDateTime.now();
    }

    public LeaveRequest(String employeeLoginId, String leaveType, LocalDate startDate, LocalDate endDate, Integer numberOfDays, String reason, String status) {
        this.employeeLoginId = employeeLoginId;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfDays = numberOfDays;
        this.reason = reason;
        this.status = status != null ? status : "PENDING";
        this.createdAt = LocalDateTime.now();
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

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getNumberOfDays() {
        return numberOfDays;
    }

    public void setNumberOfDays(Integer numberOfDays) {
        this.numberOfDays = numberOfDays;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApprovedByLoginId() {
        return approvedByLoginId;
    }

    public void setApprovedByLoginId(String approvedByLoginId) {
        this.approvedByLoginId = approvedByLoginId;
    }

    public String getManagerComment() {
        return managerComment;
    }

    public void setManagerComment(String managerComment) {
        this.managerComment = managerComment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
