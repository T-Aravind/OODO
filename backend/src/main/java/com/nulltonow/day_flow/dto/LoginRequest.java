package com.nulltonow.day_flow.dto;

public class LoginRequest {
    private String identifier; // Email or generated loginId (e.g. EMP-1001 or user@company.com)
    private String password;
    private String pinCode;
    private String role; // 'admin' or 'employee'

    public LoginRequest() {}

    public LoginRequest(String identifier, String password, String pinCode, String role) {
        this.identifier = identifier;
        this.password = password;
        this.pinCode = pinCode;
        this.role = role;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
