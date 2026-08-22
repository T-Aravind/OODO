package com.nulltonow.day_flow.service;

import com.nulltonow.day_flow.model.PaySlip;
import com.nulltonow.day_flow.repository.PaySlipRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaySlipService {

    private final PaySlipRepository paySlipRepository;

    public PaySlipService(PaySlipRepository paySlipRepository) {
        this.paySlipRepository = paySlipRepository;
    }

    public List<PaySlip> getEmployeePaySlips(String employeeLoginId) {
        return paySlipRepository.findByEmployeeLoginIdOrderByYearDescMonthDesc(employeeLoginId);
    }

    public PaySlip generatePaySlip(PaySlip paySlip) {
        return paySlipRepository.save(paySlip);
    }
}
