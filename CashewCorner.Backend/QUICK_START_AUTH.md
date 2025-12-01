# Quick Start - Cashew Corner Authentication

## 🚀 Get Started in 5 Minutes

### Step 1: Build the Application
```bash
./gradlew clean build
```

### Step 2: Run the Application
```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`

### Step 3: Test Login

**Using curl:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

**Using Postman:**
1. Create a new POST request
2. URL: `http://localhost:8080/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Step 4: Use the Token

Copy the `accessToken` from the response and use it in subsequent requests:

```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 📋 Test Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| user | user123 | USER |
| manager | manager123 | MANAGER |

## 🔗 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| /api/auth/login | POST | ❌ | User login |
| /api/auth/health | GET | ❌ | Health check |
| /actuator/health | GET | ❌ | App health |
| /h2-console | GET | ❌ | Database console |

## 📊 Response Format

### Success Response (200 OK)
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

### Error Response (401 Unauthorized)
```json
{
  "timestamp": "2025-02-03T14:35:22.456",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password"
}
```

## 🛠️ Configuration

Edit `src/main/resources/application.properties`:

```properties
# JWT Secret (change in production!)
jwt.secret=your-secret-key-change-this-in-production-environment

# Token Expiration (in milliseconds)
jwt.expiration=3600000        # 1 hour
jwt.refresh-expiration=604800000  # 7 days

# Database
spring.datasource.url=jdbc:h2:mem:cashew_corner
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## 🔐 Security Notes

- Passwords are hashed using BCrypt
- JWT tokens expire after 1 hour
- Always use HTTPS in production
- Change the JWT secret in production
- Never commit secrets to version control

## 📚 Documentation

- **AUTHENTICATION_SETUP.md** - Comprehensive setup guide
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **test-auth-api.bat** - Windows testing script
- **test-auth-api.sh** - Bash testing script

## ❓ Troubleshooting

**Q: "Cannot load driver class: org.h2.Driver"**
A: Ensure H2 dependency is set to `implementation` in build.gradle

**Q: "Invalid JWT token"**
A: Verify the JWT secret matches between token generation and validation

**Q: "User not found"**
A: Check that test data is loaded from data.sql

**Q: Port 8080 already in use**
A: Change port in application.properties:
```properties
server.port=8081
```

## 🎯 Next Steps

1. Read AUTHENTICATION_SETUP.md for detailed documentation
2. Run test-auth-api.bat (Windows) or test-auth-api.sh (Linux/Mac)
3. Integrate authentication into your frontend
4. Implement refresh token endpoint
5. Add role-based access control

## 📞 Support

For issues or questions, refer to:
- AUTHENTICATION_SETUP.md - Troubleshooting section
- IMPLEMENTATION_SUMMARY.md - Architecture overview
- Spring Security Documentation: https://spring.io/projects/spring-security
- JWT Documentation: https://jwt.io

---

**Happy coding! 🚀**

