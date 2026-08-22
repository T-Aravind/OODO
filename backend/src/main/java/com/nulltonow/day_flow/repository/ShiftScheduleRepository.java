package com.nulltonow.day_flow.repository;

import com.nulltonow.day_flow.model.ShiftSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftScheduleRepository extends JpaRepository<ShiftSchedule, Long> {

    List<ShiftSchedule> findByEmployeeLoginIdOrderByShiftDateAsc(String employeeLoginId);

    List<ShiftSchedule> findByEmployeeLoginIdAndShiftDateBetween(String employeeLoginId, LocalDate startDate, LocalDate endDate);
}
