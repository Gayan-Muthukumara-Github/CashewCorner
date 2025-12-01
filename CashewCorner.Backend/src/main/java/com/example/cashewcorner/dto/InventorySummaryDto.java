package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventorySummaryDto {
    private Long totalProducts;
    private Long lowStockItems;
    private BigDecimal totalInventoryValue;
    private Long locationsCount;
}
