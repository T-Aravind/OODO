package com.nulltonow.day_flow.controller;

import com.nulltonow.day_flow.model.LeaveBalance;
import com.nulltonow.day_flow.model.LeaveRequest;
import com.nulltonow.day_flow.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/request")
    public ResponseEntity<LeaveRequest> applyLeave(@RequestBody LeaveRequest request) {
        return ResponseEntity.ok(leaveService.applyLeave(request));
    }

    @PostMapping("/approve")
    public ResponseEntity<LeaveRequest> approveOrRejectLeave(@RequestBody Map<String, Object> payload) {
        Long leaveId = Long.valueOf(payload.get("leaveRequestId").toString());
        String managerId = payload.get("managerLoginId") != null ? payload.get("managerLoginId").toString() : "ADMIN";
        boolean approve = Boolean.TRUE.equals(payload.get("approve"));
        String comment = payload.get("comment") != null ? payload.get("comment").toString() : "";

        return ResponseEntity.ok(leaveService.approveOrRejectLeave(leaveId, managerId, approve, comment));
    }

    @GetMapping("/employee/{loginId}")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaves(@PathVariable String loginId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(loginId));
    }

    @GetMapping("/balance/{loginId}")
    public ResponseEntity<LeaveBalance> getLeaveBalance(@PathVariable String loginId) {
        return ResponseEntity.ok(leaveService.getLeaveBalance(loginId));
    }
}
