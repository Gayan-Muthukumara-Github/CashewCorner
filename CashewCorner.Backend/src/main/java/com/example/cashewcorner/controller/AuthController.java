package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.LoginRequestDto;
import com.example.cashewcorner.dto.LoginResponseDto;
import com.example.cashewcorner.dto.LogoutResponseDto;
import com.example.cashewcorner.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication endpoints.
 * Handles user login and token management.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Login endpoint.
     * Authenticates user with username and password, returns JWT tokens.
     *
     * @param loginRequest the login request containing email and password
     * @return ResponseEntity with login response containing tokens
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        log.info("User Login Request - [email={}]", loginRequest.getEmail());

        LoginResponseDto response = authService.login(loginRequest);

        log.info("User Login Response - [email={}, message={}]", loginRequest.getEmail(), response.getMessage());

        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint.
     * Logs out the authenticated user by blacklisting their token.
     *
     * @param authHeader the Authorization header containing the JWT token
     * @return ResponseEntity with logout response
     */
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDto> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        log.info("User Logout Request - [authHeader={}]", authHeader != null ? "present" : "missing");

        // Extract token from Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("User Logout Failed - Missing or invalid Authorization header");
            throw new com.example.cashewcorner.exception.InvalidTokenException("Missing or invalid JWT token");
        }

        String token = authHeader.substring(7);
        String username = authService.extractUsername(token);

        LogoutResponseDto response = authService.logout(token, username);

        // Clear security context
        SecurityContextHolder.clearContext();

        log.info("User Logout Response - [username={}, message={}]", username, response.getMessage());

        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint.
     * Returns a simple response to verify the API is running.
     *
     * @return ResponseEntity with health status
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.debug("Health check endpoint called");
        return ResponseEntity.ok("Authentication service is running");
    }
}

