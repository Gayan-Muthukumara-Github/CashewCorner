# Quick Reference - Authentication & Logout

## 🚀 Start Application
```bash
./gradlew bootRun
```

---

## 🔑 Test Credentials
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| user | user123 | USER |
| manager | manager123 | MANAGER |

---

## 📡 API Endpoints

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Logout
```bash
POST /api/auth/logout
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

### Health Check
```bash
GET /api/auth/health
```

---

## 🧪 Quick cURL Commands

### 1️⃣ Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2️⃣ Extract Token (Linux/Mac)
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  | jq -r '.accessToken')

echo $TOKEN
```

### 3️⃣ Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 4️⃣ Verify Token Blacklisted
```bash
# Try to logout again (should fail)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📊 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login/Logout successful |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials or token |
| 500 | Server Error | Internal server error |

---

## 🔐 Token Format

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNzAwMDAwMCwiZXhwIjoxNzA3MDAzNjAwLCJ1c2VySWQiOjF9.xxx
```

**Structure:**
- `Bearer` - Token type
- `eyJhbGciOiJIUzUxMiJ9` - Header (Base64)
- `eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNzAwMDAwMCwiZXhwIjoxNzA3MDAzNjAwLCJ1c2VySWQiOjF9` - Payload (Base64)
- `xxx` - Signature (HMAC-SHA512)

---

## ⏱️ Token Expiration

- **Access Token**: 1 hour (3600 seconds)
- **Refresh Token**: 7 days (604800 seconds)

---

## 🛠️ Testing Tools

### Option 1: cURL (All Platforms)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Option 2: PowerShell (Windows)
```powershell
.\test-auth-workflow.ps1
```

### Option 3: Batch Script (Windows)
```cmd
test-logout.bat
```

### Option 4: Postman
1. Create POST request
2. URL: `http://localhost:8080/api/auth/login`
3. Body: `{"username": "admin", "password": "admin123"}`
4. Send

---

## 📝 Complete Workflow

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' > login.json

# 2. Extract token
TOKEN=$(jq -r '.accessToken' login.json)

# 3. Use token in protected request
curl -X GET http://localhost:8080/api/protected \
  -H "Authorization: Bearer $TOKEN"

# 4. Logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# 5. Verify token is blacklisted
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
# Should return 401 Unauthorized
```

---

## ❌ Common Errors & Solutions

### "Connection refused"
```
Solution: Make sure app is running
./gradlew bootRun
```

### "Invalid username or password"
```
Solution: Check credentials
Valid: admin/admin123, user/user123, manager/manager123
```

### "Missing or invalid JWT token"
```
Solution: Include Authorization header
-H "Authorization: Bearer YOUR_TOKEN"
```

### "Token has been logged out"
```
Solution: Token is blacklisted, login again
```

---

## 📚 Documentation

- **CURL_TESTING_GUIDE.md** - Detailed cURL examples
- **LOGOUT_TESTING_GUIDE.md** - Logout feature guide
- **AUTHENTICATION_SETUP.md** - Full setup guide
- **QUICK_START_AUTH.md** - Quick start guide

---

## 🎯 Key Features

✅ JWT-based authentication
✅ BCrypt password hashing
✅ Token blacklist on logout
✅ Automatic token expiration
✅ Structured logging
✅ Error handling
✅ CORS support

---

## 💡 Pro Tips

1. **Save token to variable** for easier testing
2. **Use jq** to parse JSON responses
3. **Check logs** for debugging
4. **Use Postman** for complex scenarios
5. **Test both success and failure** cases

---

## 🔗 Useful Links

- JWT.io - https://jwt.io
- Spring Security - https://spring.io/projects/spring-security
- cURL Documentation - https://curl.se/docs/

---

**Last Updated:** 2025-02-03
**Version:** 1.0

