package com.example.cashewcorner.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRawCashewRequestDto {

    @Size(max = 100, message = "Cashew type must not exceed 100 characters")
    private String cashewType;

    @Size(max = 100, message = "Cashew quality must not exceed 100 characters")
    private String cashewQuality;
}

