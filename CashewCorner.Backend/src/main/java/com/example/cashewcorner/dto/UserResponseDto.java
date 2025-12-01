package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user response.
 * Contains user information without sensitive data for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

    private Long userId;

    private String username;

    private String email;

    private String firstName;

    private String lastName;

    private String fullName;

    private Long roleId;

    private String roleName;

    private String roleDescription;

    private Boolean isActive;

    private LocalDateTime lastLogin;

    private Long createdBy;

    private LocalDateTime createdAt;

    private Long updatedBy;

    private LocalDateTime updatedAt;
}
