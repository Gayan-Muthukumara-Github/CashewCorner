package com.example.cashewcorner.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarkPayrollPaidRequestDto {
    @Size(max = 100, message = "Payment method must not exceed 100 characters")
    private String paymentMethod;
}
