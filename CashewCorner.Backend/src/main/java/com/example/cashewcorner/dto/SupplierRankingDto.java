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
public class SupplierRankingDto {
    private Long supplierId;
    private String name;
    private String contactPerson;
    private String phone;
    private String email;
    private BigDecimal averageUnitPrice;
    private Integer totalOrders;
    private Integer completedOrders;
    private BigDecimal reliabilityScore;
    private BigDecimal totalPurchaseAmount;
    private Integer rank;
}

