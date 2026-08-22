package com.nulltonow.day_flow.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private EmployeeDto employee;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, String token, EmployeeDto employee) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.employee = employee;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public EmployeeDto getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDto employee) {
        this.employee = employee;
    }

    public static class EmployeeDto {
        private String loginId;
        private String fullName;
        private String email;
        private String companyName;
        private String department;
        private String role;
        private boolean hasPin;

        public EmployeeDto() {}

        public EmployeeDto(String loginId, String fullName, String email, String companyName, String department, String role, boolean hasPin) {
            this.loginId = loginId;
            this.fullName = fullName;
            this.email = email;
            this.companyName = companyName;
            this.department = department;
            this.role = role;
            this.hasPin = hasPin;
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

        public boolean isHasPin() {
            return hasPin;
        }

        public void setHasPin(boolean hasPin) {
            this.hasPin = hasPin;
        }
    }
}
