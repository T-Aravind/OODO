package com.nulltonow.day_flow.dto;

public class PinLoginRequest {
    private String email;
    private String pinCode;

    public PinLoginRequest() {}

    public PinLoginRequest(String email, String pinCode) {
        this.email = email;
        this.pinCode = pinCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }
}
