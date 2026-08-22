package com.nulltonow.day_flow.service;

import com.nulltonow.day_flow.model.EmployeeProfile;
import com.nulltonow.day_flow.repository.EmployeeProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmployeeProfileService {

    private final EmployeeProfileRepository profileRepository;

    public EmployeeProfileService(EmployeeProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public EmployeeProfile getProfile(String employeeLoginId) {
        return profileRepository.findByEmployeeLoginId(employeeLoginId)
                .orElseGet(() -> profileRepository.save(new EmployeeProfile(
                        employeeLoginId,
                        "+1 (555) 019-2834",
                        "+1 (555) 019-9999",
                        "123 Innovation Way, Tech Park",
                        "**** **** 4829",
                        "Silicon Valley Bank",
                        "SVBK0001042"
                )));
    }

    public EmployeeProfile updateProfile(String employeeLoginId, EmployeeProfile updatedProfile) {
        Optional<EmployeeProfile> existingOpt = profileRepository.findByEmployeeLoginId(employeeLoginId);
        EmployeeProfile profile = existingOpt.orElseGet(() -> new EmployeeProfile());

        profile.setEmployeeLoginId(employeeLoginId);
        if (updatedProfile.getPhoneNumber() != null) profile.setPhoneNumber(updatedProfile.getPhoneNumber());
        if (updatedProfile.getEmergencyContact() != null) profile.setEmergencyContact(updatedProfile.getEmergencyContact());
        if (updatedProfile.getAddress() != null) profile.setAddress(updatedProfile.getAddress());
        if (updatedProfile.getBankAccountNumber() != null) profile.setBankAccountNumber(updatedProfile.getBankAccountNumber());
        if (updatedProfile.getBankName() != null) profile.setBankName(updatedProfile.getBankName());
        if (updatedProfile.getIfscCode() != null) profile.setIfscCode(updatedProfile.getIfscCode());

        return profileRepository.save(profile);
    }
}
