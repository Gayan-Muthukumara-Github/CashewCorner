package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawCashewInventoryDto {
    private Long rawCashewInventoryId;
    private Long cashewTypeId;
    private String cashewType;
    private String cashewQuality;
    private String location;
    private BigDecimal quantityOnHand;
    private BigDecimal reservedQuantity;
    private BigDecimal availableQuantity;
    private LocalDateTime lastUpdated;
}

