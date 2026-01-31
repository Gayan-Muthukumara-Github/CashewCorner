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
public class SupplierDto {
    private Long supplierId;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String contactPerson;
    private String paymentTerms;
    private Boolean isApproved;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // New fields for cashew-related data
    private Long cashewTypeId;
    private String cashewTypeName;
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
}
