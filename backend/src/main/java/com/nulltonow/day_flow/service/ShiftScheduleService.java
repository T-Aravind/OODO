package com.nulltonow.day_flow.service;

import com.nulltonow.day_flow.model.ShiftSchedule;
import com.nulltonow.day_flow.repository.ShiftScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ShiftScheduleService {

    private final ShiftScheduleRepository shiftScheduleRepository;

    public ShiftScheduleService(ShiftScheduleRepository shiftScheduleRepository) {
        this.shiftScheduleRepository = shiftScheduleRepository;
    }

    public List<ShiftSchedule> getEmployeeShifts(String employeeLoginId) {
        return shiftScheduleRepository.findByEmployeeLoginIdOrderByShiftDateAsc(employeeLoginId);
    }

    public List<ShiftSchedule> getEmployeeShiftsForWeek(String employeeLoginId, LocalDate startDate, LocalDate endDate) {
        return shiftScheduleRepository.findByEmployeeLoginIdAndShiftDateBetween(employeeLoginId, startDate, endDate);
    }

    public ShiftSchedule assignShift(ShiftSchedule shiftSchedule) {
        return shiftScheduleRepository.save(shiftSchedule);
    }
}
