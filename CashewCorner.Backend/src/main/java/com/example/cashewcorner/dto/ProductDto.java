package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long productId;
    private String sku;
    private String name;
    private String description;
    private String unit;
    private BigDecimal costPrice;
    private BigDecimal sellPrice;
    private BigDecimal reorderLevel;
    private Boolean isActive;
    private List<ProductCategoryDto> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
