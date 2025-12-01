package com.example.cashewcorner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignDutyRequestDto {

    @NotBlank(message = "Task type is required")
    @Size(max = 100, message = "Task type must not exceed 100 characters")
    private String taskType;

    private Long salesOrderId;

    private Long purchaseOrderId;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
