package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyingPriceFluctuationDto {

    private Integer year;

    private Integer month;

    private BigDecimal averageBuyingPrice;

    private BigDecimal highestPrice;

    private BigDecimal lowestPrice;
}
