package com.nulltonow.day_flow.service;

import com.nulltonow.day_flow.model.Attendance;
import com.nulltonow.day_flow.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public Attendance checkIn(String employeeLoginId, String workLocation) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeLoginIdAndDate(employeeLoginId, today);

        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
        } else {
            attendance = new Attendance();
            attendance.setEmployeeLoginId(employeeLoginId);
            attendance.setDate(today);
            attendance.setCheckInTime(LocalDateTime.now());
            attendance.setStatus("PRESENT");
            attendance.setWorkLocation(workLocation != null ? workLocation : "OFFICE");
            attendance = attendanceRepository.save(attendance);
        }

        return attendance;
    }

    public Attendance checkOut(String employeeLoginId) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeLoginIdAndDate(employeeLoginId, today);

        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
        } else {
            // Graceful auto-check-in fallback if checking out without previous check-in for today
            attendance = new Attendance();
            attendance.setEmployeeLoginId(employeeLoginId);
            attendance.setDate(today);
            attendance.setCheckInTime(LocalDateTime.now().minusHours(8));
            attendance.setStatus("PRESENT");
            attendance.setWorkLocation("OFFICE");
            attendance.setNotes("Auto-logged check-in upon checkout");
        }

        attendance.setCheckOutTime(LocalDateTime.now());

        if (attendance.getCheckInTime() != null) {
            long minutes = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime()).toMinutes();
            double hours = Math.round((minutes / 60.0) * 10.0) / 10.0;
            attendance.setWorkedHours(hours);
        }

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getEmployeeAttendance(String employeeLoginId) {
        return attendanceRepository.findByEmployeeLoginIdOrderByDateDesc(employeeLoginId);
    }

    public List<Attendance> getAllAttendanceForToday() {
        return attendanceRepository.findByDate(LocalDate.now());
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}
