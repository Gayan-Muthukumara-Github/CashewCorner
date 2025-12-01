package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDto {
    private Long employeeId;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String designation;
    private String department;
    private String phone;
    private String email;
    private LocalDate hireDate;
    private BigDecimal salaryBase;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
