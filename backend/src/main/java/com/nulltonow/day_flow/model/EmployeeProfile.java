package com.nulltonow.day_flow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_profiles")
public class EmployeeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_login_id", nullable = false, unique = true)
    private String employeeLoginId;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "address")
    private String address;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "ifsc_code")
    private String ifscCode;

    public EmployeeProfile() {}

    public EmployeeProfile(String employeeLoginId, String phoneNumber, String emergencyContact, String address, String bankAccountNumber, String bankName, String ifscCode) {
        this.employeeLoginId = employeeLoginId;
        this.phoneNumber = phoneNumber;
        this.emergencyContact = emergencyContact;
        this.address = address;
        this.bankAccountNumber = bankAccountNumber;
        this.bankName = bankName;
        this.ifscCode = ifscCode;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }
}
