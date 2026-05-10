package com.example.cashewcorner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSalesOrderStatusRequestDto {

    @NotBlank(message = "Sales order status is required")
    private String status;
}
