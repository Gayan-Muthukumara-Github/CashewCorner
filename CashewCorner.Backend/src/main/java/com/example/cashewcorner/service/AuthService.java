package com.example.cashewcorner.service;

import com.example.cashewcorner.config.JwtUtil;
import com.example.cashewcorner.dto.LoginRequestDto;
import com.example.cashewcorner.dto.LoginResponseDto;
import com.example.cashewcorner.dto.LogoutResponseDto;
import com.example.cashewcorner.dto.UserDto;
import com.example.cashewcorner.entity.User;
import com.example.cashewcorner.exception.AuthenticationException;
import com.example.cashewcorner.exception.UserNotFoundException;
import com.example.cashewcorner.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Service for authentication operations.
 * Handles user login and token generation.
 */
@Slf4j
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Token blacklist for logout functionality
    private static final Set<String> tokenBlacklist = new HashSet<>();

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Authenticate user and generate tokens.
     *
     * @param loginRequest the login request containing email and password
     * @return login response with tokens and user information
     * @throws AuthenticationException if authentication fails
     */
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        log.info("User Login Initiated - [email={}]", loginRequest.getEmail());

        // Find user by email
        User user = userRepository.findActiveByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    log.warn("User Login Failed - User not found [email={}]", loginRequest.getEmail());
                    return new AuthenticationException("Invalid email or password");
                });

        // Validate password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            log.warn("User Login Failed - Invalid password [email={}]", loginRequest.getEmail());
            throw new AuthenticationException("Invalid email or password");
        }

        // Check if user is active
        if (!user.getIsActive()) {
            log.warn("User Login Failed - User account is inactive [email={}]", loginRequest.getEmail());
            throw new AuthenticationException("User account is inactive");
        }

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getUserId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername(), user.getUserId());

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("User Login Successful - [email={}]", user.getEmail());

        // Build response
        return LoginResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getTokenExpiration() / 1000) // Convert to seconds
                .user(mapUserToDto(user))
                .message("Login successful")
                .build();
    }

    /**
     * Map User entity to UserDto.
     *
     * @param user the user entity
     * @return user DTO
     */
    private UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .roleName(user.getRole() != null ? user.getRole().getRoleName() : null)
                .isActive(user.getIsActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * Validate JWT token.
     *
     * @param token    the JWT token
     * @param username the username to validate against
     * @return true if valid, false otherwise
     */
    public Boolean validateToken(String token, String username) {
        log.debug("Token Validation - [username={}]", username);
        return jwtUtil.validateToken(token, username);
    }

    /**
     * Extract username from JWT token.
     *
     * @param token the JWT token
     * @return username
     */
    public String extractUsername(String token) {
        return jwtUtil.extractUsername(token);
    }

    /**
     * Extract user ID from JWT token.
     *
     * @param token the JWT token
     * @return user ID
     */
    public Long extractUserId(String token) {
        return jwtUtil.extractUserId(token);
    }

    /**
     * Get user by username with role information.
     *
     * @param username the username
     * @return User entity with role information
     * @throws UserNotFoundException if user not found
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }

    /**
     * Logout user by blacklisting the token.
     *
     * @param token the JWT token to blacklist
     * @param username the username of the user logging out
     * @return logout response
     */
    public LogoutResponseDto logout(String token, String username) {
        log.info("User Logout Initiated - [username={}]", username);

        // Validate token before logout
        if (!jwtUtil.validateToken(token, username)) {
            log.warn("User Logout Failed - Invalid token [username={}]", username);
            throw new AuthenticationException("Invalid or expired token");
        }

        // Add token to blacklist
        tokenBlacklist.add(token);
        log.debug("Token added to blacklist - [username={}]", username);

        // Update user's last activity (optional)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        log.info("User Logout Successful - [username={}]", username);

        return LogoutResponseDto.builder()
                .message("Logout successful")
                .timestamp(LocalDateTime.now())
                .username(username)
                .success(true)
                .build();
    }

    /**
     * Check if a token is blacklisted.
     *
     * @param token the JWT token
     * @return true if token is blacklisted, false otherwise
     */
    public Boolean isTokenBlacklisted(String token) {
        return tokenBlacklist.contains(token);
    }
}

