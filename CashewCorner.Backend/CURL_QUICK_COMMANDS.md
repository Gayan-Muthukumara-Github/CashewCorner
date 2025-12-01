# cURL Quick Commands - Authentication & Logout

## 🚀 Copy-Paste Ready Commands

### 1️⃣ Health Check
```bash
curl -X GET http://localhost:8080/api/auth/health
```

---

### 2️⃣ Login (Admin)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

---

### 3️⃣ Login (User)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "user123"}'
```

---

### 4️⃣ Login (Manager)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "manager", "password": "manager123"}'
```

---

### 5️⃣ Login with Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "wrongpassword"}'
```

---

### 6️⃣ Logout (Replace TOKEN with actual token)
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

---

### 7️⃣ Logout without Token (Should Fail)
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json"
```

---

### 8️⃣ Logout with Invalid Token Format (Should Fail)
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: InvalidToken" \
  -H "Content-Type: application/json"
```

---

## 🔄 Complete Workflow (Linux/Mac)

```bash
#!/bin/bash

# Step 1: Login and save response
echo "Step 1: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Step 2: Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
echo "Token: $TOKEN"
echo ""

# Step 3: Logout
echo "Step 2: Logging out..."
LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Logout Response:"
echo "$LOGOUT_RESPONSE" | jq '.'
echo ""

# Step 4: Try to use token again
echo "Step 3: Attempting to use token after logout..."
curl -s -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
```

---

## 🪟 Complete Workflow (Windows PowerShell)

```powershell
# Step 1: Login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post `
    -Headers @{"Content-Type" = "application/json"} `
    -Body '{"username": "admin", "password": "admin123"}'

Write-Host "Login Response:"
$loginResponse | ConvertTo-Json | Write-Host
Write-Host ""

# Step 2: Extract token
$token = $loginResponse.accessToken
Write-Host "Token: $token"
Write-Host ""

# Step 3: Logout
Write-Host "Logging out..."
$logoutResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/logout" `
    -Method Post `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

Write-Host "Logout Response:"
$logoutResponse | ConvertTo-Json | Write-Host
Write-Host ""

# Step 4: Try to use token again
Write-Host "Attempting to use token after logout..."
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/auth/logout" `
        -Method Post `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
} catch {
    Write-Host "Expected error: Token is blacklisted"
    Write-Host $_.Exception.Response.StatusCode
}
```

---

## 📊 One-Liner Commands

### Login and Extract Token
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.accessToken')
```

### Logout with Token
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
```

### Login, Logout, and Verify (All in One)
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.accessToken') && \
curl -s -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.' && \
curl -s -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
```

---

## 🔧 Useful cURL Options

### Pretty Print JSON
```bash
curl ... | jq '.'
```

### Extract Specific Field
```bash
curl ... | jq '.accessToken'
```

### Save Response to File
```bash
curl ... -o response.json
```

### Show Response Headers
```bash
curl -i ...
```

### Verbose Output
```bash
curl -v ...
```

### Set Timeout
```bash
curl --max-time 10 ...
```

### Follow Redirects
```bash
curl -L ...
```

---

## 📋 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login/Logout successful |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials or token |
| 500 | Server Error | Internal server error |

---

## 🧪 Test Scenarios

### Scenario 1: Successful Login and Logout
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.accessToken')

# Logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Scenario 2: Invalid Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "wrongpassword"}'
```

### Scenario 3: Missing Authorization Header
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json"
```

### Scenario 4: Token Already Blacklisted
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.accessToken')

# First logout (success)
curl -s -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Second logout (should fail)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 💾 Save Commands to File

### Linux/Mac
```bash
cat > auth-commands.sh << 'EOF'
#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.accessToken')

curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
EOF

chmod +x auth-commands.sh
./auth-commands.sh
```

---

## 🎯 Quick Tips

1. **Always include Authorization header** for logout
2. **Use Bearer prefix** in Authorization header
3. **Save token to variable** for easier testing
4. **Use jq** for pretty JSON output
5. **Test both success and failure** cases

---

**Ready to test!** 🚀

