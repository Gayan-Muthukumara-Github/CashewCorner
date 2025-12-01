package com.example.cashewcorner.dto;

import jakarta.validation.constraints.DecimalMin;
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
public class UpdateProductRequestDto {

    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 50, message = "Unit must not exceed 50 characters")
    private String unit;

    @DecimalMin(value = "0.00", message = "Cost price must be greater than or equal to 0")
    private BigDecimal costPrice;

    @DecimalMin(value = "0.00", message = "Sell price must be greater than or equal to 0")
    private BigDecimal sellPrice;

    @DecimalMin(value = "0.00", message = "Reorder level must be greater than or equal to 0")
    private BigDecimal reorderLevel;
}
