package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesOrderDto {
    private Long salesOrderId;
    private String soNumber;
    private Long customerId;
    private String customerName;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private String status;
    private BigDecimal totalAmount;
    private List<SalesOrderItemDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
