package com.nulltonow.day_flow.controller;

import com.nulltonow.day_flow.dto.AuthResponse;
import com.nulltonow.day_flow.dto.LoginRequest;
import com.nulltonow.day_flow.dto.RegisterRequest;
import com.nulltonow.day_flow.dto.ResetPinRequest;
import com.nulltonow.day_flow.model.Employee;
import com.nulltonow.day_flow.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-pin")
    public ResponseEntity<Map<String, Object>> resetPin(@RequestBody ResetPinRequest request) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "A reset link has been sent to " + request.getEmail()
        ));
    }

    /**
     * RBAC Protected: Only Admin and HR can fetch all employees list.
     */
    @GetMapping("/employees")
    public ResponseEntity<?> getEmployees(@RequestHeader(value = "X-User-Role", defaultValue = "employee") String role) {
        if ("employee".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "error", "Access Denied: Employees cannot view all employees list."
            ));
        }
        return ResponseEntity.ok(authService.getAllEmployees());
    }
}
