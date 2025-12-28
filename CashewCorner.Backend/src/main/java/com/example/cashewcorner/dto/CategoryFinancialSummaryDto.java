package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for category-based financial summary report data.
 * Contains aggregated financial data for products in a specific category.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryFinancialSummaryDto {
    
    /**
     * The category ID.
     */
    private Long categoryId;
    
    /**
     * The category name.
     */
    private String categoryName;
    
    /**
     * Total sales revenue for products in this category.
     */
    private BigDecimal totalSales;
    
    /**
     * Total purchase costs for products in this category.
     */
    private BigDecimal totalPurchases;
    
    /**
     * Total revenue from sales (same as totalSales).
     */
    private BigDecimal income;
    
    /**
     * Total cost of purchases (same as totalPurchases).
     */
    private BigDecimal expenses;
    
    /**
     * Profit calculated as (income - expenses).
     */
    private BigDecimal profit;
}

