package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for category sales/purchase volume report data.
 * Contains monthly aggregated volume data for products in a specific category.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryVolumeReportDto {
    
    /**
     * The category ID.
     */
    private Long categoryId;
    
    /**
     * The category name.
     */
    private String categoryName;
    
    /**
     * The month of the data (1-12).
     */
    private Integer month;
    
    /**
     * Total quantity sold (if type=SALES) or purchased (if type=PURCHASE).
     */
    private BigDecimal quantitySoldOrPurchased;
    
    /**
     * Average unit price for the month.
     */
    private BigDecimal averageUnitPrice;
    
    /**
     * Total sales/purchase value for the category in that month.
     */
    private BigDecimal totalValue;
}

