package com.nulltonow.day_flow.repository;

import com.nulltonow.day_flow.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeLoginIdOrderByDateDesc(String employeeLoginId);

    Optional<Attendance> findByEmployeeLoginIdAndDate(String employeeLoginId, LocalDate date);

    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Attendance> findByDate(LocalDate date);
}
