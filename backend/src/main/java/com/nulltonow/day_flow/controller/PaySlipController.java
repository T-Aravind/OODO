package com.nulltonow.day_flow.controller;

import com.nulltonow.day_flow.model.PaySlip;
import com.nulltonow.day_flow.service.PaySlipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payslips")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class PaySlipController {

    private final PaySlipService paySlipService;

    public PaySlipController(PaySlipService paySlipService) {
        this.paySlipService = paySlipService;
    }

    @GetMapping("/employee/{loginId}")
    public ResponseEntity<List<PaySlip>> getEmployeePaySlips(@PathVariable String loginId) {
        return ResponseEntity.ok(paySlipService.getEmployeePaySlips(loginId));
    }

    @PostMapping
    public ResponseEntity<PaySlip> generatePaySlip(@RequestBody PaySlip paySlip) {
        return ResponseEntity.ok(paySlipService.generatePaySlip(paySlip));
    }
}
