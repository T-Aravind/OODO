package com.nulltonow.day_flow.repository;

import com.nulltonow.day_flow.model.RemoteWorkRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemoteWorkRequestRepository extends JpaRepository<RemoteWorkRequest, Long> {

    List<RemoteWorkRequest> findByEmployeeLoginIdOrderByCreatedAtDesc(String employeeLoginId);

    List<RemoteWorkRequest> findByStatus(String status);
}
