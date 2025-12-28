package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for monthly transaction summary report data.
 * Contains aggregated sales and purchase data for a specific month.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionSummaryDto {
    
    /**
     * The year of the data.
     */
    private Integer year;
    
    /**
     * The month of the data (1-12).
     */
    private Integer month;
    
    /**
     * Total sales amount for the month.
     */
    private BigDecimal totalSales;
    
    /**
     * Total purchases amount for the month.
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

