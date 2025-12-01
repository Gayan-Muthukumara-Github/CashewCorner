package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for logout response.
 * Contains logout confirmation and timestamp.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogoutResponseDto {

    private String message;

    private LocalDateTime timestamp;

    private String username;

    private Boolean success;
}

