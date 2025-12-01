package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDutyDto {
    private Long dutyId;
    private Long employeeId;
    private String employeeName;
    private String taskType;
    private Long salesOrderId;
    private String salesOrderNumber;
    private Long purchaseOrderId;
    private String purchaseOrderNumber;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
