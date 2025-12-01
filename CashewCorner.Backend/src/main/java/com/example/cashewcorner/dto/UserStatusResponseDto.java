package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user status change response.
 * Contains confirmation message and user status information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusResponseDto {

    private String message;

    private Long userId;

    private String username;

    private Boolean isActive;

    private LocalDateTime timestamp;

    private Boolean success;
}
