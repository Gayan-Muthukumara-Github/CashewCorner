# Logout Feature Testing Guide

## 🚀 Complete Login & Logout Workflow

### Step 1: Login and Extract Token

```bash
# Login with admin credentials
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNzAwMDAwMCwiZXhwIjoxNzA3MDAzNjAwLCJ1c2VySWQiOjF9.xxx",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9.xxx",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {...},
  "message": "Login successful"
}
```

**Save the token:**
```bash
TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNzAwMDAwMCwiZXhwIjoxNzA3MDAzNjAwLCJ1c2VySWQiOjF9.xxx"
```

---

### Step 2: Use Token in Protected Requests

```bash
# Example: Use token in a protected endpoint
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

### Step 3: Logout with Token

```bash
# Logout using the token
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

### Step 4: Verify Token is Blacklisted

```bash
# Try to use the same token after logout
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Token has been logged out"
}
```

---

## 📝 Logout Test Cases

### Test 1: Logout with Valid Token
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer YOUR_VALID_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected:** 200 OK with logout success message

---

### Test 2: Logout without Authorization Header
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

### Test 3: Logout with Invalid Token Format
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

### Test 4: Logout with Expired Token
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer EXPIRED_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

### Test 5: Logout Twice with Same Token
```bash
# First logout (should succeed)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Second logout with same token (should fail)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**First Response:** 200 OK
**Second Response:** 401 Unauthorized (token already blacklisted)

---

## 🔄 Complete Workflow Script (Bash)

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"
AUTH_ENDPOINT="$BASE_URL/api/auth"

echo "=========================================="
echo "Login & Logout Workflow Test"
echo "=========================================="
echo ""

# Step 1: Login
echo "Step 1: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_ENDPOINT/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
USERNAME=$(echo "$LOGIN_RESPONSE" | jq -r '.user.username')

echo "Extracted Token: $TOKEN"
echo "Username: $USERNAME"
echo ""

# Step 2: Logout
echo "Step 2: Logging out..."
LOGOUT_RESPONSE=$(curl -s -X POST "$AUTH_ENDPOINT/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Logout Response:"
echo "$LOGOUT_RESPONSE" | jq '.'
echo ""

# Step 3: Try to use token after logout
echo "Step 3: Attempting to use token after logout..."
PROTECTED_RESPONSE=$(curl -s -X POST "$AUTH_ENDPOINT/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Protected Endpoint Response (should fail):"
echo "$PROTECTED_RESPONSE" | jq '.'
echo ""

echo "=========================================="
echo "Workflow test completed!"
echo "=========================================="
```

---

## 🔧 Advanced Testing with Variables

### Save Token to File
```bash
# Login and save token to file
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  | jq -r '.accessToken' > token.txt

# Read token from file
TOKEN=$(cat token.txt)

# Use token
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Test Multiple Users
```bash
# Test logout for different users
for user in admin user manager; do
  echo "Testing logout for user: $user"
  
  # Login
  TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"$user\", \"password\": \"${user}123\"}" \
    | jq -r '.accessToken')
  
  # Logout
  curl -s -X POST http://localhost:8080/api/auth/logout \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | jq '.'
  
  echo ""
done
```

---

## 📊 Logout Feature Architecture

```
┌─────────────────────────────────────────┐
│   Client sends logout request           │
│   with Authorization header             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   AuthController.logout()               │
│   - Extract token from header           │
│   - Validate token format               │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   AuthService.logout()                  │
│   - Validate token signature            │
│   - Add token to blacklist              │
│   - Return logout response              │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Token Blacklist (HashSet)             │
│   - Stores blacklisted tokens           │
│   - Checked on every request            │
└─────────────────────────────────────────┘
```

---

## 🔐 Security Considerations

1. **Token Blacklist**: Tokens are added to an in-memory blacklist upon logout
2. **Stateless Validation**: Each request checks if token is blacklisted
3. **Token Expiration**: Tokens automatically expire after 1 hour
4. **Security Context**: Cleared on logout to prevent session hijacking

---

## 💡 Tips & Best Practices

1. **Always include Authorization header** for logout
2. **Use Bearer prefix** in Authorization header
3. **Save tokens temporarily** for testing workflows
4. **Test both success and failure cases**
5. **Monitor application logs** for debugging

---

## 📚 Related Documentation

- CURL_TESTING_GUIDE.md - General cURL testing guide
- AUTHENTICATION_SETUP.md - Authentication system setup
- QUICK_START_AUTH.md - Quick start guide

