# Cashew Corner - Authentication System Setup Guide

## Overview

This guide explains the complete user authentication system implemented for the Cashew Corner inventory management application using Spring Boot 3.5.6, JWT tokens, and H2 database.

## Architecture

The authentication system follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    REST API Layer                           │
│              (AuthController)                               │
│         POST /api/auth/login                                │
│         GET /api/auth/health                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Service Layer                              │
│              (AuthService)                                  │
│  - User authentication                                      │
│  - Token generation                                         │
│  - Password validation                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Data Access Layer                              │
│           (UserRepository)                                  │
│  - User lookup by username                                  │
│  - User lookup by email                                     │
│  - Active user queries                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Database Layer                             │
│              (H2 In-Memory)                                 │
│  - users table                                              │
│  - roles table                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Entities
- **User.java** - Maps to `users` table with JPA annotations
- **Role.java** - Maps to `roles` table with JPA annotations

### 2. DTOs (Data Transfer Objects)
- **LoginRequestDto** - Contains username and password for login
- **LoginResponseDto** - Contains access token, refresh token, and user info
- **UserDto** - User information without sensitive data

### 3. Repository
- **UserRepository** - JpaRepository with custom query methods:
  - `findByUsername(String username)`
  - `findByEmail(String email)`
  - `findActiveByUsername(String username)`

### 4. Service Layer
- **AuthService** - Business logic for authentication:
  - `login(LoginRequestDto)` - Authenticates user and generates tokens
  - `validateToken(String token, String username)` - Validates JWT
  - `extractUsername(String token)` - Extracts username from token
  - `extractUserId(String token)` - Extracts user ID from token

### 5. Configuration
- **SecurityConfig** - Spring Security configuration:
  - BCryptPasswordEncoder bean
  - SecurityFilterChain configuration
  - JWT filter registration
  - CORS configuration
  
- **JwtUtil** - JWT token utility:
  - `generateAccessToken()` - Creates access token (15 minutes)
  - `generateRefreshToken()` - Creates refresh token (7 days)
  - `validateToken()` - Validates token signature and expiration
  - `extractClaim()` - Extracts specific claims from token

- **JwtAuthenticationFilter** - OncePerRequestFilter:
  - Extracts JWT from Authorization header
  - Validates token
  - Sets authentication in SecurityContext

### 6. Controller
- **AuthController** - REST endpoints:
  - `POST /api/auth/login` - User login endpoint
  - `GET /api/auth/health` - Health check endpoint

### 7. Exception Handling
- **AuthenticationException** - Invalid credentials
- **InvalidTokenException** - Invalid or expired JWT
- **UserNotFoundException** - User not found
- **GlobalExceptionHandler** - Centralized exception handling

## Test Credentials

The following test users are automatically created on application startup:

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | admin123 | ADMIN | admin@cashewcorner.com |
| user | user123 | USER | user@cashewcorner.com |
| manager | manager123 | MANAGER | manager@cashewcorner.com |

## Running the Application

### Prerequisites
- Java 17 or higher
- Gradle 8.14.3 or higher

### Build
```bash
./gradlew clean build
```

### Run
```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`

## Testing the Authentication System

### 1. Health Check
```bash
curl -X GET http://localhost:8080/api/auth/health
```

Expected Response:
```
Authentication service is running
```

### 2. Login with Valid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Expected Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "userId": 1,
    "username": "admin",
    "email": "admin@cashewcorner.com",
    "firstName": "Admin",
    "lastName": "User",
    "fullName": "Admin User",
    "roleName": "ADMIN",
    "isActive": true,
    "lastLogin": "2025-02-03T14:35:22.456",
    "createdAt": "2025-02-03T14:35:22.456"
  },
  "message": "Login successful"
}
```

### 3. Login with Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongpassword"
  }'
```

Expected Response (401 Unauthorized):
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password"
}
```

### 4. Using JWT Token
```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

## Configuration Properties

Edit `src/main/resources/application.properties`:

```properties
# JWT Configuration
jwt.secret=your-secret-key-change-this-in-production-environment-use-strong-random-key
jwt.expiration=3600000  # 1 hour in milliseconds
jwt.refresh-expiration=604800000  # 7 days in milliseconds

# Database
spring.datasource.url=jdbc:h2:mem:cashew_corner
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# SQL Initialization
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:data.sql
```

## Security Best Practices

1. **JWT Secret**: Change the default JWT secret in production
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Access tokens expire in 1 hour, refresh tokens in 7 days
4. **Password Hashing**: Passwords are hashed using BCrypt with strength 10
5. **CORS**: Configure CORS appropriately for your frontend domain
6. **Session Management**: Stateless session management using JWT

## Logging

The application follows Planyear logging guidelines with structured logging:

```
2025-02-03 14:35:22.456 INFO [billing-service,2.0.1,abc123,xyz456,true] [USER,5f3d1a900000,tenant-01] 8901 --- [nio-8080-exec-5] o.l.b.PaymentProcessor : Payment successful for order 6789
```

Key log messages:
- `User Login Initiated` - Login attempt started
- `User Login Successful` - Login completed successfully
- `User Login Failed` - Login failed with reason
- `JWT Token Validated` - Token validation successful
- `JWT Token Validation Failed` - Token validation failed

## Troubleshooting

### Issue: "Cannot load driver class: org.h2.Driver"
**Solution**: Ensure H2 dependency is set to `implementation` scope in build.gradle

### Issue: "Invalid JWT token"
**Solution**: Verify the JWT secret matches between token generation and validation

### Issue: "User not found"
**Solution**: Check that test data is loaded from data.sql

### Issue: "CORS error"
**Solution**: Update CORS configuration in SecurityConfig for your frontend domain

## Next Steps

1. Implement refresh token endpoint
2. Add role-based access control (RBAC)
3. Implement user registration endpoint
4. Add password reset functionality
5. Implement audit logging
6. Add rate limiting for login attempts
7. Implement OAuth2/OpenID Connect integration

## References

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [H2 Database Documentation](https://www.h2database.com)

