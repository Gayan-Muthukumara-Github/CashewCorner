package com.example.cashewcorner.config;

import com.example.cashewcorner.entity.User;
import com.example.cashewcorner.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * JWT Authentication Filter.
 * Validates JWT tokens in request headers and sets authentication context.
 */
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthService authService;

    public JwtAuthenticationFilter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = extractJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                // Check if token is blacklisted
                if (authService.isTokenBlacklisted(jwt)) {
                    log.warn("JWT Token is blacklisted - Token has been logged out");
                    filterChain.doFilter(request, response);
                    return;
                }

                String username = authService.extractUsername(jwt);

                if (authService.validateToken(jwt, username)) {
                    log.debug("JWT Token Validated - [username={}]", username);

                    // Get user with role information
                    User user = authService.getUserByUsername(username);
                    List<GrantedAuthority> authorities = new ArrayList<>();

                    if (user.getRole() != null) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName()));
                        log.debug("JWT Token Authorities - [username={}, role={}]", username, user.getRole().getRoleName());
                    }

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    log.warn("JWT Token Validation Failed - [username={}]", username);
                }
            }
        } catch (Exception e) {
            log.warn("JWT Token Processing Failed - [error={}]", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from Authorization header.
     *
     * @param request the HTTP request
     * @return JWT token or null
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

