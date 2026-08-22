package com.nulltonow.day_flow.controller;

import com.nulltonow.day_flow.model.Attendance;
import com.nulltonow.day_flow.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(@RequestBody Map<String, String> payload) {
        String loginId = payload.get("employeeLoginId");
        String location = payload.get("workLocation");
        Attendance attendance = attendanceService.checkIn(loginId, location);
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(@RequestBody Map<String, String> payload) {
        String loginId = payload.get("employeeLoginId");
        Attendance attendance = attendanceService.checkOut(loginId);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/employee/{loginId}")
    public ResponseEntity<List<Attendance>> getEmployeeAttendance(@PathVariable String loginId) {
        return ResponseEntity.ok(attendanceService.getEmployeeAttendance(loginId));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> getTodayAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendanceForToday());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }
}
