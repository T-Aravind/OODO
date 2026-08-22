package com.nulltonow.day_flow.service;

import com.nulltonow.day_flow.model.LeaveBalance;
import com.nulltonow.day_flow.model.LeaveRequest;
import com.nulltonow.day_flow.repository.LeaveBalanceRepository;
import com.nulltonow.day_flow.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveService(LeaveRequestRepository leaveRequestRepository, LeaveBalanceRepository leaveBalanceRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
    }

    public LeaveRequest applyLeave(LeaveRequest request) {
        request.setStatus("PENDING");
        return leaveRequestRepository.save(request);
    }

    public LeaveRequest approveOrRejectLeave(Long leaveRequestId, String managerLoginId, boolean approve, String comment) {
        Optional<LeaveRequest> opt = leaveRequestRepository.findById(leaveRequestId);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Leave request not found with ID: " + leaveRequestId);
        }

        LeaveRequest leave = opt.get();
        leave.setStatus(approve ? "APPROVED" : "REJECTED");
        leave.setApprovedByLoginId(managerLoginId);
        leave.setManagerComment(comment);

        if (approve) {
            Optional<LeaveBalance> balanceOpt = leaveBalanceRepository.findByEmployeeLoginId(leave.getEmployeeLoginId());
            if (balanceOpt.isPresent()) {
                LeaveBalance balance = balanceOpt.get();
                int days = leave.getNumberOfDays() != null ? leave.getNumberOfDays() : 1;
                balance.setTotalTaken(balance.getTotalTaken() + days);

                if ("ANNUAL".equalsIgnoreCase(leave.getLeaveType())) {
                    balance.setAnnualLeaveBalance(Math.max(0, balance.getAnnualLeaveBalance() - days));
                } else if ("SICK".equalsIgnoreCase(leave.getLeaveType())) {
                    balance.setSickLeaveBalance(Math.max(0, balance.getSickLeaveBalance() - days));
                } else if ("CASUAL".equalsIgnoreCase(leave.getLeaveType())) {
                    balance.setCasualLeaveBalance(Math.max(0, balance.getCasualLeaveBalance() - days));
                }
                leaveBalanceRepository.save(balance);
            }
        }

        return leaveRequestRepository.save(leave);
    }

    public List<LeaveRequest> getEmployeeLeaves(String employeeLoginId) {
        return leaveRequestRepository.findByEmployeeLoginIdOrderByCreatedAtDesc(employeeLoginId);
    }

    public LeaveBalance getLeaveBalance(String employeeLoginId) {
        return leaveBalanceRepository.findByEmployeeLoginId(employeeLoginId)
                .orElseGet(() -> leaveBalanceRepository.save(new LeaveBalance(employeeLoginId, 15, 10, 7, 0)));
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getPendingLeaves() {
        return leaveRequestRepository.findByStatus("PENDING");
    }
}
