# cURL Testing Guide - Cashew Corner Authentication

## 🚀 Quick Test Commands

### 1. Health Check
```bash
curl -X GET http://localhost:8080/api/auth/health
```

**Expected Response:**
```
Authentication service is running
```

---

### 2. Login - Admin User
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
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNzAwMDAwMCwiZXhwIjoxNzA3MDAzNjAwLCJ1c2VySWQiOjF9.xxx",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNzAwMDAwMCwiZXhwIjoxNzA3NjA0ODAwLCJ1c2VySWQiOjEsInR5cGUiOiJyZWZyZXNoIn0.xxx",
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

### 3. Login - Regular User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "user123"
  }'
```

---

### 4. Login - Manager User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager",
    "password": "manager123"
  }'
```

---

### 5. Login - Invalid Credentials
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

### 6. Login - Missing Username
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "admin123"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {
    "username": "Username is required"
  }
}
```

---

### 7. Login - Missing Password
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin"
  }'
```

---

### 8. Logout (with Token)
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Replace `YOUR_ACCESS_TOKEN_HERE` with the token from login response**

**Expected Response (200 OK):**
```json
{
  "message": "Logout successful",
  "timestamp": "2025-02-03T14:35:22.456"
}
```

---

### 9. Logout - Without Token
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

## 📝 Complete Test Workflow

### Step 1: Login and Save Token
```bash
# Login and save the response
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

# Extract the access token (requires jq)
TOKEN=$(echo $RESPONSE | jq -r '.accessToken')

echo "Access Token: $TOKEN"
```

### Step 2: Use Token in Subsequent Requests
```bash
# Use the token in Authorization header
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🔧 Advanced cURL Options

### Pretty Print JSON Response
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq '.'
```

### Save Response to File
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  -o response.json
```

### Show Response Headers
```bash
curl -i -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Verbose Output (Debug)
```bash
curl -v -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Set Custom Timeout
```bash
curl --max-time 10 -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

---

## 📊 Test Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| user | user123 | USER |
| manager | manager123 | MANAGER |

---

## 🎯 Common Issues & Solutions

### Issue: "Connection refused"
**Solution:** Make sure the application is running on port 8080
```bash
./gradlew bootRun
```

### Issue: "curl: command not found"
**Solution:** Install curl or use Postman/Insomnia instead

### Issue: "Invalid JSON"
**Solution:** Ensure JSON is properly formatted (use jq to validate)
```bash
echo '{"username": "admin", "password": "admin123"}' | jq '.'
```

### Issue: "Token expired"
**Solution:** Get a new token by logging in again

---

## 💡 Tips

1. **Save tokens to environment variables** for easier testing
2. **Use jq** to parse and extract JSON values
3. **Use Postman** for more complex testing scenarios
4. **Enable verbose mode** (-v flag) for debugging
5. **Check application logs** for detailed error information

---

## 📚 Related Documentation

- QUICK_START_AUTH.md - Quick start guide
- AUTHENTICATION_SETUP.md - Detailed setup guide
- IMPLEMENTATION_SUMMARY.md - Implementation details

