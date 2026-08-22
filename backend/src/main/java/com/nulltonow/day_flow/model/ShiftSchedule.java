package com.nulltonow.day_flow.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "shift_schedules")
public class ShiftSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_login_id", nullable = false)
    private String employeeLoginId;

    @Column(name = "shift_name", nullable = false)
    private String shiftName; // 'MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE'

    @Column(name = "shift_date", nullable = false)
    private LocalDate shiftDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "is_holiday")
    private Boolean isHoliday = false;

    public ShiftSchedule() {}

    public ShiftSchedule(String employeeLoginId, String shiftName, LocalDate shiftDate, LocalTime startTime, LocalTime endTime, Boolean isHoliday) {
        this.employeeLoginId = employeeLoginId;
        this.shiftName = shiftName;
        this.shiftDate = shiftDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isHoliday = isHoliday;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeLoginId() {
        return employeeLoginId;
    }

    public void setEmployeeLoginId(String employeeLoginId) {
        this.employeeLoginId = employeeLoginId;
    }

    public String getShiftName() {
        return shiftName;
    }

    public void setShiftName(String shiftName) {
        this.shiftName = shiftName;
    }

    public LocalDate getShiftDate() {
        return shiftDate;
    }

    public void setShiftDate(LocalDate shiftDate) {
        this.shiftDate = shiftDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Boolean getIsHoliday() {
        return isHoliday;
    }

    public void setIsHoliday(Boolean holiday) {
        isHoliday = holiday;
    }
}
