package com.example.cashewcorner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdjustRawCashewStockRequestDto {

    @NotNull(message = "Cashew type ID is required")
    private Long cashewTypeId;

    @NotNull(message = "Quantity is required")
    private BigDecimal quantity;

    @NotBlank(message = "Adjustment type is required")
    @Size(max = 50, message = "Adjustment type must not exceed 50 characters")
    private String adjustmentType; // ADD, REMOVE, USAGE, DAMAGE, CORRECTION

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}

