package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollDto {
    private Long payrollId;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal grossPay;
    private BigDecimal deductions;
    private BigDecimal netPay;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
}
