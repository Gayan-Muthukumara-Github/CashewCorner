# Complete Authentication Testing Guide

## 🎯 Overview

This guide provides complete cURL commands and workflows for testing the Cashew Corner authentication system including login and logout features.

---

## 🚀 Prerequisites

1. Application running on `http://localhost:8080`
2. `curl` installed (or use Postman)
3. `jq` installed (optional, for JSON parsing)

---

## 📋 Test Credentials

```
Username: admin    | Password: admin123  | Role: ADMIN
Username: user     | Password: user123   | Role: USER
Username: manager  | Password: manager123| Role: MANAGER
```

---

## 🧪 Test 1: Health Check

**Purpose:** Verify API is running

```bash
curl -X GET http://localhost:8080/api/auth/health
```

**Expected Response:**
```
Authentication service is running
```

---

## 🧪 Test 2: Login - Admin User

**Purpose:** Authenticate as admin and get tokens

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response (200 OK):**
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

---

## 🧪 Test 3: Login - Regular User

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "user123"
  }'
```

---

## 🧪 Test 4: Login - Invalid Credentials

**Purpose:** Verify error handling for wrong password

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongpassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password"
}
```

---

## 🧪 Test 5: Login - Missing Fields

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {
    "password": "Password is required"
  }
}
```

---

## 🧪 Test 6: Logout - Valid Token

**Purpose:** Logout user and blacklist token

```bash
# First, login to get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  | jq -r '.accessToken')

# Then logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "message": "Logout successful",
  "timestamp": "2025-02-03T14:35:22.456",
  "username": "admin",
  "success": true
}
```

---

## 🧪 Test 7: Logout - Missing Token

**Purpose:** Verify error handling for missing Authorization header

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json"
```

**Expected Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Missing or invalid JWT token"
}
```

---

## 🧪 Test 8: Logout - Invalid Token Format

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: InvalidToken" \
  -H "Content-Type: application/json"
```

**Expected Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Missing or invalid JWT token"
}
```

---

## 🧪 Test 9: Token Blacklist Verification

**Purpose:** Verify token is blacklisted after logout

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  | jq -r '.accessToken')

# Logout
curl -s -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Try to logout again (should fail)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Second Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

## 🔄 Complete Workflow Script

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"
AUTH_ENDPOINT="$BASE_URL/api/auth"

echo "=========================================="
echo "Complete Authentication Workflow Test"
echo "=========================================="
echo ""

# Step 1: Health Check
echo "Step 1: Health Check"
curl -s -X GET "$AUTH_ENDPOINT/health"
echo ""
echo ""

# Step 2: Login
echo "Step 2: Login as admin"
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_ENDPOINT/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
echo ""

# Step 3: Logout
echo "Step 3: Logout"
LOGOUT_RESPONSE=$(curl -s -X POST "$AUTH_ENDPOINT/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$LOGOUT_RESPONSE" | jq '.'
echo ""

# Step 4: Verify Token Blacklisted
echo "Step 4: Verify token is blacklisted"
curl -s -X POST "$AUTH_ENDPOINT/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

echo "=========================================="
echo "Workflow test completed!"
echo "=========================================="
```

---

## 📊 Test Summary Table

| Test | Endpoint | Method | Auth | Expected Status |
|------|----------|--------|------|---|
| Health Check | /api/auth/health | GET | ❌ | 200 |
| Login Success | /api/auth/login | POST | ❌ | 200 |
| Login Invalid | /api/auth/login | POST | ❌ | 401 |
| Login Missing | /api/auth/login | POST | ❌ | 400 |
| Logout Success | /api/auth/logout | POST | ✅ | 200 |
| Logout Missing | /api/auth/logout | POST | ❌ | 401 |
| Logout Invalid | /api/auth/logout | POST | ❌ | 401 |
| Logout Blacklist | /api/auth/logout | POST | ✅ | 401 |

---

## 🛠️ Useful cURL Options

```bash
# Pretty print JSON
curl ... | jq '.'

# Save response to file
curl ... -o response.json

# Show headers
curl -i ...

# Verbose output
curl -v ...

# Set timeout
curl --max-time 10 ...

# Extract specific field
curl ... | jq '.accessToken'
```

---

## 📚 Related Documentation

- CURL_TESTING_GUIDE.md
- LOGOUT_TESTING_GUIDE.md
- QUICK_REFERENCE_AUTH.md
- LOGOUT_IMPLEMENTATION_SUMMARY.md

---

## ✅ Checklist

- [ ] Application is running
- [ ] Health check passes
- [ ] Login with admin works
- [ ] Login with user works
- [ ] Login with invalid credentials fails
- [ ] Logout with valid token works
- [ ] Logout without token fails
- [ ] Token is blacklisted after logout
- [ ] All error messages are clear

---

**Status:** Ready for testing! 🚀

