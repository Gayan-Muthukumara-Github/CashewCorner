package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for selling price fluctuation report data.
 * Contains monthly aggregated selling price statistics for a product.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellingPriceFluctuationDto {

    /**
     * The year of the data.
     */
    private Integer year;

    /**
     * The month of the data (1-12).
     */
    private Integer month;

    /**
     * Average selling price for that month.
     */
    private BigDecimal averageSellingPrice;

    /**
     * Highest selling price recorded in that month.
     */
    private BigDecimal highestPrice;

    /**
     * Lowest selling price recorded in that month.
     */
    private BigDecimal lowestPrice;
}

