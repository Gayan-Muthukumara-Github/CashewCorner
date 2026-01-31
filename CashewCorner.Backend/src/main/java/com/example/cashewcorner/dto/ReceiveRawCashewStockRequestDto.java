package com.example.cashewcorner.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class ReceiveRawCashewStockRequestDto {

    @NotNull(message = "Cashew type ID is required")
    private Long cashewTypeId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    private Long purchaseOrderId;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}

