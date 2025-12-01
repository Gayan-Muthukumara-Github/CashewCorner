package com.example.cashewcorner.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignCategoryRequestDto {

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
