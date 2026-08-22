package com.nulltonow.day_flow.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @Column(name = "login_id", nullable = false, unique = true)
    private String loginId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "department")
    private String department;

    @Column(name = "role")
    private String role; // 'admin' or 'employee'

    @Column(name = "pin_code")
    private String pinCode;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Employee() {
        this.createdAt = LocalDateTime.now();
    }

    public Employee(String loginId, String fullName, String email, String password, String companyName, String department, String role, String pinCode) {
        this.loginId = loginId;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.companyName = companyName;
        this.department = department;
        this.role = role != null ? role : "employee";
        this.pinCode = pinCode;
        this.createdAt = LocalDateTime.now();
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean hasPin() {
        return pinCode != null && !pinCode.trim().isEmpty();
    }
}
