package com.nulltonow.day_flow.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "remote_work_requests")
public class RemoteWorkRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_login_id", nullable = false)
    private String employeeLoginId;

    @Column(name = "location_type", nullable = false)
    private String locationType; // 'HOME', 'CLIENT_SITE', 'REMOTE'

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status", nullable = false)
    private String status; // 'PENDING', 'APPROVED', 'REJECTED'

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public RemoteWorkRequest() {
        this.createdAt = LocalDateTime.now();
    }

    public RemoteWorkRequest(String employeeLoginId, String locationType, LocalDate startDate, LocalDate endDate, String reason, String status) {
        this.employeeLoginId = employeeLoginId;
        this.locationType = locationType;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public String getLocationType() {
        return locationType;
    }

    public void setLocationType(String locationType) {
        this.locationType = locationType;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
