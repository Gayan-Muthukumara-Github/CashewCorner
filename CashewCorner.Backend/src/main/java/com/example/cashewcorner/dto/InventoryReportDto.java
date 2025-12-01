package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryReportDto {
    private Long totalProducts;
    private Long lowStockItems;
    private BigDecimal totalInventoryValue;
    private Long locationsCount;
    private List<InventoryDto> inventoryItems;
    private List<InventoryDto> lowStockList;
}
