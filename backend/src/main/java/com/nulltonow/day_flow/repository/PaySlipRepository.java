package com.nulltonow.day_flow.repository;

import com.nulltonow.day_flow.model.PaySlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaySlipRepository extends JpaRepository<PaySlip, Long> {

    List<PaySlip> findByEmployeeLoginIdOrderByYearDescMonthDesc(String employeeLoginId);

    Optional<PaySlip> findByEmployeeLoginIdAndMonthAndYear(String employeeLoginId, Integer month, Integer year);
}
