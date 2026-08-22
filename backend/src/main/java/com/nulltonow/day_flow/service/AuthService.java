package com.nulltonow.day_flow.service;

import com.nulltonow.day_flow.dto.AuthResponse;
import com.nulltonow.day_flow.dto.LoginRequest;
import com.nulltonow.day_flow.dto.RegisterRequest;
import com.nulltonow.day_flow.model.Employee;
import com.nulltonow.day_flow.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;

    public AuthService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Auto-generates a unique Login ID based on the format specified in the architecture:
     * e.g., EMP-1001, EMP-1002, EMP-1003 or [COMPANY_INITIALS]-1001
     */
    public synchronized String generateLoginId(String companyName) {
        String prefix = "EMP";
        if (companyName != null && !companyName.trim().isEmpty()) {
            String sanitized = companyName.replaceAll("[^a-zA-Z]", "").toUpperCase();
            if (sanitized.length() >= 3) {
                prefix = sanitized.substring(0, 3);
            } else if (!sanitized.isEmpty()) {
                prefix = sanitized;
            }
        }

        long count = employeeRepository.count();
        long nextNum = 1001 + count;
        String candidateId = String.format("%s-%04d", prefix, nextNum);

        while (employeeRepository.existsByLoginIdIgnoreCase(candidateId)) {
            nextNum++;
            candidateId = String.format("%s-%04d", prefix, nextNum);
        }

        return candidateId;
    }

    /**
     * Registers a new employee profile and assigns an auto-generated login ID.
     */
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(false, "Email address is required", null, null);
        }

        if (employeeRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            return new AuthResponse(false, "An account with this email already exists", null, null);
        }

        String loginId = generateLoginId(request.getCompanyName());

        Employee employee = new Employee();
        employee.setLoginId(loginId);
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail().trim());
        employee.setPassword(request.getPassword());
        employee.setCompanyName(request.getCompanyName());
        employee.setDepartment(request.getDepartment());
        employee.setRole(request.getRole() != null ? request.getRole() : "employee");
        employee.setPinCode(request.getPinCode());

        Employee saved = employeeRepository.save(employee);

        String fakeToken = "JWT-" + UUID.randomUUID().toString();

        AuthResponse.EmployeeDto dto = new AuthResponse.EmployeeDto(
                saved.getLoginId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getCompanyName(),
                saved.getDepartment(),
                saved.getRole(),
                saved.hasPin()
        );

        return new AuthResponse(true, "Registration successful. Generated Login ID: " + loginId, fakeToken, dto);
    }

    /**
     * Authenticates an employee via Email/Login ID with Password or PIN code.
     */
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.trim().isEmpty()) {
            return new AuthResponse(false, "Please enter your Email or Login ID", null, null);
        }

        Optional<Employee> empOpt = employeeRepository.findByEmailIgnoreCaseOrLoginIdIgnoreCase(
                identifier.trim(),
                identifier.trim()
        );

        if (empOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid credentials or account not found", null, null);
        }

        Employee emp = empOpt.get();

        // 1. PIN Code login attempt
        if (request.getPinCode() != null && !request.getPinCode().trim().isEmpty()) {
            if (!emp.hasPin()) {
                return new AuthResponse(false, "No PIN code set for this account. Please log in with password.", null, null);
            }
            if (!emp.getPinCode().equals(request.getPinCode().trim())) {
                return new AuthResponse(false, "Incorrect PIN code", null, null);
            }
        }
        // 2. Password login attempt
        else {
            if (request.getPassword() == null || !emp.getPassword().equals(request.getPassword())) {
                return new AuthResponse(false, "Incorrect password", null, null);
            }
        }

        String token = "JWT-" + UUID.randomUUID().toString();

        AuthResponse.EmployeeDto dto = new AuthResponse.EmployeeDto(
                emp.getLoginId(),
                emp.getFullName(),
                emp.getEmail(),
                emp.getCompanyName(),
                emp.getDepartment(),
                emp.getRole(),
                emp.hasPin()
        );

        return new AuthResponse(true, "Login successful", token, dto);
    }

    /**
     * Lists all registered employees for grid/directory views.
     */
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
