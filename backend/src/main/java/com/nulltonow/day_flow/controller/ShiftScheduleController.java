package com.nulltonow.day_flow.controller;

import com.nulltonow.day_flow.model.ShiftSchedule;
import com.nulltonow.day_flow.service.ShiftScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class ShiftScheduleController {

    private final ShiftScheduleService shiftScheduleService;

    public ShiftScheduleController(ShiftScheduleService shiftScheduleService) {
        this.shiftScheduleService = shiftScheduleService;
    }

    @GetMapping("/employee/{loginId}")
    public ResponseEntity<List<ShiftSchedule>> getEmployeeShifts(@PathVariable String loginId) {
        return ResponseEntity.ok(shiftScheduleService.getEmployeeShifts(loginId));
    }

    @PostMapping
    public ResponseEntity<ShiftSchedule> assignShift(@RequestBody ShiftSchedule shiftSchedule) {
        return ResponseEntity.ok(shiftScheduleService.assignShift(shiftSchedule));
    }
}
