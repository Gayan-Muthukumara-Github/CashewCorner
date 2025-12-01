package com.example.cashewcorner.config;

import com.example.cashewcorner.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for JWT Authentication Filter.
 * Separated to avoid circular dependency with SecurityConfig.
 */
@Configuration
public class JwtFilterConfig {

    /**
     * Create JWT Authentication Filter bean.
     *
     * @param authService the authentication service
     * @return JwtAuthenticationFilter instance
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(AuthService authService) {
        return new JwtAuthenticationFilter(authService);
    }
}
