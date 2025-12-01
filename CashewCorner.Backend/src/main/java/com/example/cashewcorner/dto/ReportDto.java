package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDto {
    private Long reportId;
    private String reportType;
    private Map<String, Object> parameters;
    private String generatedBy;
    private LocalDateTime generatedAt;
    private String filePath;
    private Map<String, Object> data;
}
