package com.nulltonow.day_flow.controller;

import com.nulltonow.day_flow.model.EmployeeProfile;
import com.nulltonow.day_flow.service.EmployeeProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class EmployeeProfileController {

    private final EmployeeProfileService profileService;

    public EmployeeProfileController(EmployeeProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{loginId}")
    public ResponseEntity<EmployeeProfile> getProfile(@PathVariable String loginId) {
        return ResponseEntity.ok(profileService.getProfile(loginId));
    }

    @PutMapping("/{loginId}")
    public ResponseEntity<EmployeeProfile> updateProfile(@PathVariable String loginId, @RequestBody EmployeeProfile updatedProfile) {
        return ResponseEntity.ok(profileService.updateProfile(loginId, updatedProfile));
    }
}
