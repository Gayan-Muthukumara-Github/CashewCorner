package com.example.cashewcorner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateReportRequestDto {

    @NotBlank(message = "Report type is required")
    private String reportType;

    private Map<String, Object> parameters;
}
