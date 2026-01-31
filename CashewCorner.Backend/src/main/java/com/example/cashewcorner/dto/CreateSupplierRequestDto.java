package com.example.cashewcorner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSupplierRequestDto {

    @NotBlank(message = "Supplier name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;

    @Size(max = 1000, message = "Address must not exceed 1000 characters")
    private String address;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Email(message = "Email must be valid")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(max = 150, message = "Contact person must not exceed 150 characters")
    private String contactPerson;

    @Size(max = 255, message = "Payment terms must not exceed 255 characters")
    private String paymentTerms;

    // New fields for cashew-related data
    private Long cashewTypeId;
    private BigDecimal quantity;

    @Size(max = 100, message = "Quality must not exceed 100 characters")
    private String quality;

    private BigDecimal costPerUnit;

    @Size(max = 100, message = "Season must not exceed 100 characters")
    private String season;

    @Size(max = 100, message = "Payment method must not exceed 100 characters")
    private String paymentMethod;

    private BigDecimal distance;

    @Size(max = 100, message = "Delivery method must not exceed 100 characters")
    private String deliveryMethod;

    private BigDecimal deliveryCost;
    private Integer timeTakenToReceive;
    private BigDecimal averageCostPerUnit;
    private Integer averageDeliveryTime;
    private BigDecimal averageDeliveryCost;
    private String performances;
}
