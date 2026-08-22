package com.nulltonow.day_flow.dto;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String companyName;
    private String department;
    private String role; // 'admin' or 'employee'
    private String pinCode;

    public RegisterRequest() {}

    public RegisterRequest(String fullName, String email, String password, String companyName, String department, String role, String pinCode) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.companyName = companyName;
        this.department = department;
        this.role = role;
        this.pinCode = pinCode;
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
}
