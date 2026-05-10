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
public class PurchaseOrderDto {
    private Long purchaseOrderId;
    private String poNumber;
    private Long supplierId;
    private String supplierName;
    private LocalDate orderDate;
    private LocalDate expectedDate;
    private String phone;
    private String email;
    private String contactPerson;
    private String paymentTerms;
    private Boolean isApproved;
    private BigDecimal quantity;
    private String quality;
    private BigDecimal costPerUnit;
    private String season;
    private String paymentMethod;
    private BigDecimal distance;
    private String deliveryMethod;
    private BigDecimal deliveryCost;
    private Integer timeTakenToReceive;
    private BigDecimal averageCostPerUnit;
    private Integer averageDeliveryTime;
    private BigDecimal averageDeliveryCost;
    private String performances;
    private String status;
    private BigDecimal totalAmount;
    private List<PurchaseOrderItemDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

