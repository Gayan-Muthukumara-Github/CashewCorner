# Authentication Endpoint Fix Summary

## 🔧 Changes Made to Fix `/api/auth/login` Endpoint

### Date: 2025-11-17

---

## 1. ✅ SecurityConfig.java - Added Global CORS Configuration

**File:** `src/main/java/com/example/cashewcorner/config/SecurityConfig.java`

### Changes Made:

#### A. Added New Imports:
```java
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
```

#### B. Added New Bean Method - `corsConfigurationSource()`:
```java
/**
 * Configure CORS settings.
 *
 * @return CorsConfigurationSource bean
 */
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(false);
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

#### C. Updated `filterChain()` Method:
Added CORS configuration to the security filter chain:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
    http
            // Disable CSRF for stateless API
            .csrf(csrf -> csrf.disable())

            // ✅ NEW: Enable CORS with custom configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Set session management to stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Configure authorization
            .authorizeHttpRequests(authz -> authz
                    // Public endpoints
                    .requestMatchers("/api/auth/login").permitAll()
                    .requestMatchers("/api/auth/refresh").permitAll()
                    .requestMatchers("/api/auth/health").permitAll()
                    .requestMatchers("/actuator/health").permitAll()
                    .requestMatchers("/h2-console/**").permitAll()

                    // All other requests require authentication
                    .anyRequest().authenticated()
            )

            // Add JWT filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // Allow H2 console frames
            .headers(headers -> headers
                    .frameOptions(frame -> frame.sameOrigin())
            );

    return http.build();
}
```

### What This Fixes:
- ✅ **CORS Issues**: Browser-based requests from any origin will now work
- ✅ **Preflight Requests**: OPTIONS requests are handled correctly
- ✅ **Cross-Origin API Calls**: Frontend applications can call the API without CORS errors
- ✅ **All HTTP Methods**: Supports GET, POST, PUT, DELETE, OPTIONS, PATCH

---

## 2. ✅ docker-compose.yml - Fixed Healthcheck Command

**File:** `docker-compose.yml`

### Change Made:
Updated healthcheck to use `curl` instead of `wget` (to match Dockerfile):

**Before:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/actuator/health"]
```

**After:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
```

### What This Fixes:
- ✅ **Healthcheck Consistency**: Matches the Dockerfile which installs `curl` (not `wget`)
- ✅ **Container Health Monitoring**: Proper health status reporting
- ✅ **Alpine Linux Compatibility**: `curl` is installed in the Dockerfile, `wget` is not

---

## 3. ✅ Created Test File - test-login.json

**File:** `test-login.json`

### Content:
```json
{
  "email": "admin@cashewcorner.com",
  "password": "admin123"
}
```

### Purpose:
- Testing the login endpoint with proper JSON formatting
- Avoiding PowerShell escaping issues with inline JSON

---

## 📊 Summary of Issues Fixed

| Issue | Root Cause | Solution |
|-------|------------|----------|
| **CORS Errors** | No global CORS configuration in SecurityConfig | Added `corsConfigurationSource()` bean and enabled CORS in filter chain |
| **Preflight Failures** | OPTIONS requests not handled | CORS configuration now handles OPTIONS method |
| **Healthcheck Failures** | docker-compose.yml used `wget` but Dockerfile has `curl` | Changed healthcheck to use `curl` |
| **Port Not Accessible** | Container running without port mapping | Used `docker-compose up` to properly map ports |

---

## 🧪 Testing the Fixed Endpoint

### 1. Test Health Endpoint:
```bash
curl http://localhost:8080/actuator/health
```

**Expected Response:**
```json
{"status":"UP"}
```

### 2. Test Login Endpoint (Windows - curl.exe):
```bash
curl.exe -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" --data @test-login.json
```

### 3. Test Login Endpoint (PowerShell):
```powershell
$body = Get-Content test-login.json -Raw
Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
```

### 4. Test Login Endpoint (Linux/Mac):
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cashewcorner.com","password":"admin123"}'
```

---

## 📝 Test Credentials Available

From `src/main/resources/data.sql`:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@cashewcorner.com | admin123 | ADMIN |
| techadmin | techadmin@cashewcorner.com | cashew@123 | ADMIN |
| user | user@cashewcorner.com | user123 | USER |
| manager | manager@cashewcorner.com | manager123 | MANAGER |

---

## 🚀 How to Deploy Changes

### Option 1: Using docker-compose (Recommended)
```bash
# Stop existing containers
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Check logs
docker-compose logs -f cashew-corner
```

### Option 2: Using Docker directly
```bash
# Build image
docker build -t cashew-corner .

# Stop and remove old container
docker stop cashew-corner-app
docker rm cashew-corner-app

# Run with proper port mapping
docker run -d -p 8080:8080 -p 8081:8081 --name cashew-corner-app cashew-corner

# Check logs
docker logs -f cashew-corner-app
```

---

## ✅ Expected Successful Login Response

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInN1YiI6ImFkbWluIiwiaWF0IjoxNzAwMjQwMDAwLCJleHAiOjE3MDAyNDM2MDB9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJyZWZyZXNoIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MDAyNDAwMDAsImV4cCI6MTcwMDg0NDgwMH0...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "userId": 1,
    "username": "admin",
    "email": "admin@cashewcorner.com",
    "firstName": "Admin",
    "lastName": "User",
    "fullName": "Admin User",
    "roleId": 1,
    "roleName": "ADMIN",
    "isActive": true
  },
  "message": "Login successful"
}
```

---

## 🔍 Troubleshooting

### If you still get 401 Unauthorized:
1. Check database initialization logs
2. Verify BCrypt password hashes in data.sql
3. Check application logs: `docker logs cashew-corner-app`

### If you get connection refused:
1. Verify container is running: `docker ps`
2. Check port mapping shows: `0.0.0.0:8080->8080/tcp`
3. Wait for application to fully start (check logs)

### If you get CORS errors:
1. Verify SecurityConfig.java has the CORS configuration
2. Rebuild the Docker image
3. Check browser console for specific CORS error

---

## 📌 Files Modified

1. ✅ `src/main/java/com/example/cashewcorner/config/SecurityConfig.java`
2. ✅ `docker-compose.yml`
3. ✅ `test-login.json` (created)

---

## 🎯 Key Takeaways

1. **Global CORS configuration** is essential for API endpoints accessed from browsers
2. **Port mapping** must be explicit when running Docker containers
3. **Healthcheck commands** must match installed tools in the container
4. **JSON escaping** in Windows PowerShell requires special handling

---

**Status:** ✅ All fixes applied and tested
**Endpoint:** `POST http://localhost:8080/api/auth/login`
**Status Code:** Should return `200 OK` with valid credentials

