package com.nulltonow.day_flow.config;

import com.nulltonow.day_flow.model.*;
import com.nulltonow.day_flow.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final PaySlipRepository paySlipRepository;
    private final ShiftScheduleRepository shiftScheduleRepository;

    public DataInitializer(
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            LeaveBalanceRepository leaveBalanceRepository,
            PaySlipRepository paySlipRepository,
            ShiftScheduleRepository shiftScheduleRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.paySlipRepository = paySlipRepository;
        this.shiftScheduleRepository = shiftScheduleRepository;
    }

    @Override
    public void run(String... args) {
        // Seed default employees if empty
        if (employeeRepository.count() == 0) {
            Employee emp1 = new Employee("OIALRI20260001", "Alex Rivers", "alex@company.com", "password123", "Odoo India", "Engineering", "employee", "1234");
            Employee emp2 = new Employee("OISACH20260002", "Sarah Chen", "sarah@company.com", "password123", "Odoo India", "Design", "employee", "5678");
            Employee emp3 = new Employee("OIMISC20260003", "Michael Scott", "michael@company.com", "password123", "Odoo India", "Sales", "admin", "0000");

            employeeRepository.save(emp1);
            employeeRepository.save(emp2);
            employeeRepository.save(emp3);

            // Seed Leave Balances
            leaveBalanceRepository.save(new LeaveBalance("OIALRI20260001", 15, 10, 7, 2));
            leaveBalanceRepository.save(new LeaveBalance("OISACH20260002", 12, 8, 5, 4));
            leaveBalanceRepository.save(new LeaveBalance("OIMISC20260003", 20, 10, 10, 0));

            // Seed Attendance Records
            LocalDate today = LocalDate.now();
            attendanceRepository.save(new Attendance("OIALRI20260001", today, LocalDateTime.now().minusHours(4), null, 4.0, "PRESENT", "OFFICE", "Morning check-in"));
            attendanceRepository.save(new Attendance("OISACH20260002", today, LocalDateTime.now().minusHours(3), null, 3.0, "PRESENT", "HOME", "Remote WFH"));

            // Seed Pay Slips
            paySlipRepository.save(new PaySlip("OIALRI20260001", 7, 2026, new BigDecimal("6500.00"), new BigDecimal("500.00"), new BigDecimal("300.00"), new BigDecimal("6700.00"), "PAID", LocalDate.of(2026, 7, 31)));
            paySlipRepository.save(new PaySlip("OISACH20260002", 7, 2026, new BigDecimal("7200.00"), new BigDecimal("600.00"), new BigDecimal("400.00"), new BigDecimal("7400.00"), "PAID", LocalDate.of(2026, 7, 31)));

            // Seed Shift Schedules
            shiftScheduleRepository.save(new ShiftSchedule("OIALRI20260001", "MORNING", today, LocalTime.of(9, 0), LocalTime.of(17, 0), false));
            shiftScheduleRepository.save(new ShiftSchedule("OISACH20260002", "FLEXIBLE", today, LocalTime.of(10, 0), LocalTime.of(18, 0), false));
        }
    }
}
