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
public class StockMovementDto {
    private Long movementId;
    private Long productId;
    private String productName;
    private String productSku;
    private String movementType;
    private String relatedType;
    private Long relatedId;
    private BigDecimal quantity;
    private BigDecimal balanceAfter;
    private LocalDateTime movementDate;
    private String notes;
}
