package com.nulltonow.day_flow.dto;

public class ResetPinRequest {
    private String email;

    public ResetPinRequest() {}

    public ResetPinRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
