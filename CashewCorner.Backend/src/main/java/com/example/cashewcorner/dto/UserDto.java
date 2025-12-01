package com.example.cashewcorner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user information.
 * Contains non-sensitive user details for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long userId;

    private String username;

    private String email;

    private String firstName;

    private String lastName;

    private String fullName;

    private String roleName;

    private Boolean isActive;

    private LocalDateTime lastLogin;

    private LocalDateTime createdAt;
}

