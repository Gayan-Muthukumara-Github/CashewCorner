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
public class RawCashewInventorySummaryDto {
    private Long totalCashewTypes;
    private Long lowStockItems;
    private BigDecimal totalQuantityOnHand;
    private Long locationsCount;
}

