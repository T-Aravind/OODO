package com.nulltonow.day_flow.controller;

import com.nulltonow.day_flow.model.Employee;
import com.nulltonow.day_flow.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * GET /api/employees
     * Access: Admin and HR only.
     * Employees are strictly forbidden from viewing the directory.
     */
    @GetMapping
    public ResponseEntity<?> getAllEmployees(
            @RequestHeader(value = "X-User-Role", defaultValue = "employee") String role,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if ("employee".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "error", "Access Denied: Employees do not have permission to view the employee directory."
            ));
        }

        List<Employee> employees = employeeRepository.findAll();
        return ResponseEntity.ok(employees);
    }

    /**
     * GET /api/employees/me
     * Access: All authenticated users (Admin, HR, Employee).
     * Returns the currently authenticated employee's own record.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentEmployee(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        Optional<Employee> emp = Optional.empty();
        if (userId != null && !userId.trim().isEmpty()) {
            emp = employeeRepository.findById(userId.trim());
        } else if (userEmail != null && !userEmail.trim().isEmpty()) {
            emp = employeeRepository.findByEmailIgnoreCaseOrLoginIdIgnoreCase(userEmail.trim(), userEmail.trim());
        }

        if (emp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "error", "Employee profile not found for current session."
            ));
        }

        return ResponseEntity.ok(emp.get());
    }

    /**
     * GET /api/employees/{id}
     * Access: Admin & HR can access any employee.
     * Employee can ONLY access their own ID (IDOR Protection).
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-User-Role", defaultValue = "employee") String role,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        // IDOR Check: If Employee role, requested id MUST match their own ID
        if ("employee".equalsIgnoreCase(role)) {
            if (userId == null || !userId.equalsIgnoreCase(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "success", false,
                        "error", "Access Denied: You are not authorized to view another employee's record."
                ));
            }
        }

        Optional<Employee> emp = employeeRepository.findById(id);
        if (emp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "error", "Employee not found with ID: " + id
            ));
        }

        return ResponseEntity.ok(emp.get());
    }

    /**
     * POST /api/employees
     * Access: Admin and HR only.
     */
    @PostMapping
    public ResponseEntity<?> createEmployee(
            @RequestBody Employee newEmployee,
            @RequestHeader(value = "X-User-Role", defaultValue = "employee") String role
    ) {
        if ("employee".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "error", "Access Denied: Employees cannot create new employee records."
            ));
        }

        Employee saved = employeeRepository.save(newEmployee);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
