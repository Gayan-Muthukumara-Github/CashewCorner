package com.example.cashewcorner.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT utility class for token generation and validation.
 * Handles creation and parsing of JWT tokens.
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret:your-secret-key-change-this-in-production-environment}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshTokenExpiration;

    /**
     * Generate JWT access token for a user.
     *
     * @param username the username
     * @param userId   the user ID
     * @return JWT token
     */
    public String generateAccessToken(String username, Long userId) {
        log.debug("Generating access token - [username={}]", username);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return createToken(claims, username, jwtExpiration);
    }

    /**
     * Generate JWT refresh token for a user.
     *
     * @param username the username
     * @param userId   the user ID
     * @return JWT refresh token
     */
    public String generateRefreshToken(String username, Long userId) {
        log.debug("Generating refresh token - [username={}]", username);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "refresh");
        return createToken(claims, username, refreshTokenExpiration);
    }

    /**
     * Create a JWT token with claims.
     *
     * @param claims     the claims to include
     * @param subject    the subject (username)
     * @param expiration the expiration time in milliseconds
     * @return JWT token
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Extract username from JWT token.
     *
     * @param token the JWT token
     * @return username
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract user ID from JWT token.
     *
     * @param token the JWT token
     * @return user ID
     */
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    /**
     * Extract expiration date from JWT token.
     *
     * @param token the JWT token
     * @return expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract a specific claim from JWT token.
     *
     * @param token          the JWT token
     * @param claimsResolver the claims resolver function
     * @param <T>            the type of the claim
     * @return the claim value
     */
    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from JWT token.
     *
     * @param token the JWT token
     * @return all claims
     */
    private Claims extractAllClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Check if JWT token is expired.
     *
     * @param token the JWT token
     * @return true if expired, false otherwise
     */
    public Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            log.warn("Token expiration check failed - [error={}]", e.getMessage());
            return true;
        }
    }

    /**
     * Validate JWT token.
     *
     * @param token    the JWT token
     * @param username the username to validate against
     * @return true if valid, false otherwise
     */
    public Boolean validateToken(String token, String username) {
        try {
            final String extractedUsername = extractUsername(token);
            return (extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (Exception e) {
            log.warn("Token validation failed - [username={}, error={}]", username, e.getMessage());
            return false;
        }
    }

    /**
     * Get token expiration time in milliseconds.
     *
     * @return expiration time
     */
    public long getTokenExpiration() {
        return jwtExpiration;
    }
}

