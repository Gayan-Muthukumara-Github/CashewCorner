package com.example.cashewcorner.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePurchaseOrderRequestDto {

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Order date is required")
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

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<PurchaseOrderItemRequestDto> items;
}
