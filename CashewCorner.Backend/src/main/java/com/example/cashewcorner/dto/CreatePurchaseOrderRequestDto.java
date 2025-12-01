package com.example.cashewcorner.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePurchaseOrderRequestDto {
    
    @NotNull(message = "Supplier ID is required")
    private Long supplierId;
    
    @NotNull(message = "Order date is required")
    private LocalDate orderDate;
    
    private LocalDate expectedDate;
    
    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<PurchaseOrderItemRequestDto> items;
}
