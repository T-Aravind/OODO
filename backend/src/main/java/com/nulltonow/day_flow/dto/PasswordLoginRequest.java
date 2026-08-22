package com.nulltonow.day_flow.dto;

public class PasswordLoginRequest {
    private String email;
    private String password;

    public PasswordLoginRequest() {}

    public PasswordLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
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
}
