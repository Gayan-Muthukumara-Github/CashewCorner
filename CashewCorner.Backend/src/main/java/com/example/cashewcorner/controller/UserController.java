package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for user management endpoints.
 * Handles user CRUD operations for Admin and Manager roles.
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Create a new user account.
     * Only accessible by ADMIN role.
     *
     * @param createUserRequest the user creation request
     * @return ResponseEntity with created user details
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody CreateUserRequestDto createUserRequest) {
        log.info("User Creation Request - [username={}, email={}, roleId={}]", 
                createUserRequest.getUsername(), createUserRequest.getEmail(), createUserRequest.getRoleId());

        UserResponseDto createdUser = userService.createUser(createUserRequest);

        log.info("User Creation Response - [userId={}, username={}]", 
                createdUser.getUserId(), createdUser.getUsername());

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    /**
     * Get all users.
     * Accessible by ADMIN and MANAGER roles.
     *
     * @return ResponseEntity with list of all users
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        log.info("User List Request - Fetching all users");

        List<UserResponseDto> users = userService.getAllUsers();

        log.info("User List Response - Found {} users", users.size());

        return ResponseEntity.ok(users);
    }

    /**
     * Update user information.
     * Only accessible by ADMIN role.
     *
     * @param userId the ID of the user to update
     * @param updateUserRequest the update request
     * @return ResponseEntity with updated user details
     */
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRequestDto updateUserRequest) {
        
        log.info("User Update Request - [userId={}, fields={}]", userId, getUpdateFields(updateUserRequest));

        UserResponseDto updatedUser = userService.updateUser(userId, updateUserRequest);

        log.info("User Update Response - [userId={}, username={}]", 
                updatedUser.getUserId(), updatedUser.getUsername());

        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Deactivate a user account.
     * Only accessible by ADMIN role.
     *
     * @param userId the ID of the user to deactivate
     * @return ResponseEntity with operation result
     */
    @PatchMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserStatusResponseDto> deactivateUser(@PathVariable Long userId) {
        log.info("User Deactivation Request - [userId={}]", userId);

        UserStatusResponseDto response = userService.deactivateUser(userId);

        log.info("User Deactivation Response - [userId={}, success={}]", userId, response.getSuccess());

        return ResponseEntity.ok(response);
    }

    /**
     * Activate a user account.
     * Only accessible by ADMIN role.
     *
     * @param userId the ID of the user to activate
     * @return ResponseEntity with operation result
     */
    @PatchMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserStatusResponseDto> activateUser(@PathVariable Long userId) {
        log.info("User Activation Request - [userId={}]", userId);

        UserStatusResponseDto response = userService.activateUser(userId);

        log.info("User Activation Response - [userId={}, success={}]", userId, response.getSuccess());

        return ResponseEntity.ok(response);
    }

    /**
     * Get string representation of fields being updated for logging.
     *
     * @param updateRequest the update request
     * @return comma-separated list of fields being updated
     */
    private String getUpdateFields(UpdateUserRequestDto updateRequest) {
        StringBuilder fields = new StringBuilder();
        if (updateRequest.getEmail() != null) fields.append("email,");
        if (updateRequest.getFirstName() != null) fields.append("firstName,");
        if (updateRequest.getLastName() != null) fields.append("lastName,");
        if (updateRequest.getRoleId() != null) fields.append("roleId,");
        
        String result = fields.toString();
        return result.endsWith(",") ? result.substring(0, result.length() - 1) : result;
    }
}
