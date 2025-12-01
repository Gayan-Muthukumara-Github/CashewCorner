package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.Role;
import com.example.cashewcorner.entity.User;
import com.example.cashewcorner.exception.DuplicateUserException;
import com.example.cashewcorner.exception.RoleNotFoundException;
import com.example.cashewcorner.exception.UserNotFoundException;
import com.example.cashewcorner.repository.RoleRepository;
import com.example.cashewcorner.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for user management operations.
 * Handles business logic for user CRUD operations.
 */
@Slf4j
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Create a new user.
     *
     * @param createUserRequest the user creation request
     * @return UserResponseDto containing the created user information
     * @throws DuplicateUserException if username or email already exists
     * @throws RoleNotFoundException if the specified role doesn't exist
     */
    public UserResponseDto createUser(CreateUserRequestDto createUserRequest) {
        log.info("User Creation Initiated - [username={}, email={}, roleId={}]", 
                createUserRequest.getUsername(), createUserRequest.getEmail(), createUserRequest.getRoleId());

        // Check for duplicate username
        if (userRepository.existsByUsername(createUserRequest.getUsername())) {
            log.warn("User Creation Failed - Username already exists [username={}]", createUserRequest.getUsername());
            throw new DuplicateUserException("Username already exists: " + createUserRequest.getUsername());
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(createUserRequest.getEmail())) {
            log.warn("User Creation Failed - Email already exists [email={}]", createUserRequest.getEmail());
            throw new DuplicateUserException("Email already exists: " + createUserRequest.getEmail());
        }

        // Validate role exists
        Role role = roleRepository.findById(createUserRequest.getRoleId())
                .orElseThrow(() -> {
                    log.warn("User Creation Failed - Role not found [roleId={}]", createUserRequest.getRoleId());
                    return new RoleNotFoundException("Role not found with ID: " + createUserRequest.getRoleId());
                });

        // Hash password
        String hashedPassword = passwordEncoder.encode(createUserRequest.getPassword());

        // Create user entity
        User user = User.builder()
                .username(createUserRequest.getUsername())
                .passwordHash(hashedPassword)
                .email(createUserRequest.getEmail())
                .firstName(createUserRequest.getFirstName())
                .lastName(createUserRequest.getLastName())
                .role(role)
                .isActive(true)
                .build();

        // Save user
        User savedUser = userRepository.save(user);

        log.info("User Created Successfully - [userId={}, username={}, roleId={}]", 
                savedUser.getUserId(), savedUser.getUsername(), savedUser.getRole().getRoleId());

        return mapUserToResponseDto(savedUser);
    }

    /**
     * Get all users.
     *
     * @return List of UserResponseDto containing all users
     */
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        log.info("User List Request - Fetching all users");

        List<User> users = userRepository.findAll();
        
        log.info("User List Retrieved - Found {} users", users.size());

        return users.stream()
                .map(this::mapUserToResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Update user information.
     *
     * @param userId the ID of the user to update
     * @param updateUserRequest the update request
     * @return UserResponseDto containing the updated user information
     * @throws UserNotFoundException if user doesn't exist
     * @throws DuplicateUserException if email already exists for another user
     * @throws RoleNotFoundException if the specified role doesn't exist
     */
    public UserResponseDto updateUser(Long userId, UpdateUserRequestDto updateUserRequest) {
        log.info("User Update Initiated - [userId={}, fields={}]", userId, getUpdateFields(updateUserRequest));

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User Update Failed - User not found [userId={}]", userId);
                    return new UserNotFoundException("User not found with ID: " + userId);
                });

        // Check for duplicate email if email is being updated
        if (updateUserRequest.getEmail() != null && !updateUserRequest.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateUserRequest.getEmail())) {
                log.warn("User Update Failed - Email already exists [userId={}, email={}]", userId, updateUserRequest.getEmail());
                throw new DuplicateUserException("Email already exists: " + updateUserRequest.getEmail());
            }
        }

        // Update fields if provided
        if (updateUserRequest.getEmail() != null) {
            user.setEmail(updateUserRequest.getEmail());
        }
        if (updateUserRequest.getFirstName() != null) {
            user.setFirstName(updateUserRequest.getFirstName());
        }
        if (updateUserRequest.getLastName() != null) {
            user.setLastName(updateUserRequest.getLastName());
        }
        if (updateUserRequest.getRoleId() != null) {
            Role role = roleRepository.findById(updateUserRequest.getRoleId())
                    .orElseThrow(() -> {
                        log.warn("User Update Failed - Role not found [userId={}, roleId={}]", userId, updateUserRequest.getRoleId());
                        return new RoleNotFoundException("Role not found with ID: " + updateUserRequest.getRoleId());
                    });
            user.setRole(role);
        }

        // Save updated user
        User updatedUser = userRepository.save(user);

        log.info("User Updated Successfully - [userId={}, fields={}]", userId, getUpdateFields(updateUserRequest));

        return mapUserToResponseDto(updatedUser);
    }

    /**
     * Deactivate a user account.
     *
     * @param userId the ID of the user to deactivate
     * @return UserStatusResponseDto containing the operation result
     * @throws UserNotFoundException if user doesn't exist
     */
    public UserStatusResponseDto deactivateUser(Long userId) {
        log.info("User Deactivation Initiated - [userId={}]", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User Deactivation Failed - User not found [userId={}]", userId);
                    return new UserNotFoundException("User not found with ID: " + userId);
                });

        user.setIsActive(false);
        userRepository.save(user);

        log.info("User Deactivated Successfully - [userId={}, username={}]", userId, user.getUsername());

        return UserStatusResponseDto.builder()
                .message("User deactivated successfully")
                .userId(userId)
                .username(user.getUsername())
                .isActive(false)
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();
    }

    /**
     * Activate a user account.
     *
     * @param userId the ID of the user to activate
     * @return UserStatusResponseDto containing the operation result
     * @throws UserNotFoundException if user doesn't exist
     */
    public UserStatusResponseDto activateUser(Long userId) {
        log.info("User Activation Initiated - [userId={}]", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User Activation Failed - User not found [userId={}]", userId);
                    return new UserNotFoundException("User not found with ID: " + userId);
                });

        user.setIsActive(true);
        userRepository.save(user);

        log.info("User Activated Successfully - [userId={}, username={}]", userId, user.getUsername());

        return UserStatusResponseDto.builder()
                .message("User activated successfully")
                .userId(userId)
                .username(user.getUsername())
                .isActive(true)
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();
    }

    /**
     * Map User entity to UserResponseDto.
     *
     * @param user the User entity
     * @return UserResponseDto
     */
    private UserResponseDto mapUserToResponseDto(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .roleId(user.getRole() != null ? user.getRole().getRoleId() : null)
                .roleName(user.getRole() != null ? user.getRole().getRoleName() : null)
                .roleDescription(user.getRole() != null ? user.getRole().getDescription() : null)
                .isActive(user.getIsActive())
                .lastLogin(user.getLastLogin())
                .createdBy(user.getCreatedBy())
                .createdAt(user.getCreatedAt())
                .updatedBy(user.getUpdatedBy())
                .updatedAt(user.getUpdatedAt())
                .build();
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
