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
     * Auto-generates a unique Login ID based on the exact image specification:
     * Format: [Company Initials (e.g. OI)] + [First 2 letters of First & Last name (e.g. JODO)] + [Year of Joining (e.g. 2026)] + [Serial Number (e.g. 0001)]
     * Example: John Doe at Odoo India in 2022 -> OIJODO20220001
     */
    public synchronized String generateLoginId(String companyName, String fullName) {
        // 1. Company Initials (e.g., Odoo India -> OI)
        String companyPrefix = "OI";
        if (companyName != null && !companyName.trim().isEmpty()) {
            String[] words = companyName.trim().split("\\s+");
            StringBuilder sb = new StringBuilder();
            for (String w : words) {
                if (!w.isEmpty()) {
                    sb.append(Character.toUpperCase(w.charAt(0)));
                }
            }
            if (sb.length() >= 2) {
                companyPrefix = sb.substring(0, 2);
            } else if (sb.length() == 1) {
                companyPrefix = sb.toString() + "I";
            }
        }

        // 2. First 2 letters of first name and last name (e.g. John Doe -> JO + DO = JODO)
        String nameCode = "JODO";
        if (fullName != null && !fullName.trim().isEmpty()) {
            String sanitized = fullName.trim().replaceAll("[^a-zA-Z\\s]", "").toUpperCase();
            String[] nameParts = sanitized.split("\\s+");

            if (nameParts.length >= 2) {
                String firstName = nameParts[0];
                String lastName = nameParts[nameParts.length - 1];

                String part1 = firstName.length() >= 2 ? firstName.substring(0, 2) : (firstName + "X").substring(0, 2);
                String part2 = lastName.length() >= 2 ? lastName.substring(0, 2) : (lastName + "X").substring(0, 2);
                nameCode = part1 + part2;
            } else if (nameParts.length == 1 && !nameParts[0].isEmpty()) {
                String singleName = nameParts[0];
                if (singleName.length() >= 4) {
                    nameCode = singleName.substring(0, 4);
                } else {
                    nameCode = (singleName + "XXXX").substring(0, 4);
                }
            }
        }

        // 3. Year of Joining (e.g. 2026)
        int year = java.time.LocalDate.now().getYear();

        // 4. Serial Number of Joining for that Year (e.g. 0001)
        long serial = 1;
        String candidateId = String.format("%s%s%d%04d", companyPrefix, nameCode, year, serial);

        while (employeeRepository.existsByLoginIdIgnoreCase(candidateId)) {
            serial++;
            candidateId = String.format("%s%s%d%04d", companyPrefix, nameCode, year, serial);
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

        String loginId = generateLoginId(request.getCompanyName(), request.getFullName());

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
