package com.example.cashewcorner.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePayrollRequestDto {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Period start date is required")
    private LocalDate periodStart;

    @NotNull(message = "Period end date is required")
    private LocalDate periodEnd;

    @NotNull(message = "Gross pay is required")
    @DecimalMin(value = "0.00", message = "Gross pay must be greater than or equal to 0")
    private BigDecimal grossPay;

    @DecimalMin(value = "0.00", message = "Deductions must be greater than or equal to 0")
    private BigDecimal deductions;

    private LocalDate paymentDate;

    @Size(max = 100, message = "Payment method must not exceed 100 characters")
    private String paymentMethod;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
