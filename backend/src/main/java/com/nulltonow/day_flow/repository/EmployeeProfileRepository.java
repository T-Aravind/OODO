package com.nulltonow.day_flow.repository;

import com.nulltonow.day_flow.model.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Long> {

    Optional<EmployeeProfile> findByEmployeeLoginId(String employeeLoginId);
}
