package com.nulltonow.day_flow.repository;

import com.nulltonow.day_flow.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeLoginIdOrderByCreatedAtDesc(String employeeLoginId);

    List<LeaveRequest> findByStatus(String status);
}
