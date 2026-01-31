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
public class PurchaseOrderItemDto {
    private Long purchaseOrderItemId;
    private Long cashewTypeId;
    private String cashewType;
    private String cashewQuality;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
    private BigDecimal receivedQuantity;
}

