# User Management API Documentation

## Overview

The User Management API provides comprehensive user account management functionality for Admin and Manager roles in the Cashew Corner application. It follows REST principles and implements role-based access control using Spring Security.

## Base URL
```
http://localhost:8080/api/users
```

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Role-Based Access Control

- **ADMIN**: Full access to all user management operations
- **MANAGER**: Read-only access (can list users only)
- **USER**: No access to user management endpoints

## Endpoints

### 1. Create User
**POST** `/api/users`

Creates a new user account. Only accessible by ADMIN role.

**Request Body:**
```json
{
  "username": "string",
  "password": "string", 
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "roleId": number
}
```

**Validation Rules:**
- `username`: Required, 3-100 characters, must be unique
- `password`: Required, 6-255 characters
- `email`: Required, valid email format, max 150 characters, must be unique
- `firstName`: Required, max 100 characters
- `lastName`: Required, max 100 characters
- `roleId`: Required, must exist in roles table

**Response (201 Created):**
```json
{
  "userId": 5,
  "username": "manager1",
  "email": "manager1@cashew.lk",
  "firstName": "Manager",
  "lastName": "One",
  "fullName": "Manager One",
  "roleId": 3,
  "roleName": "MANAGER",
  "roleDescription": "Manager role with limited admin access",
  "isActive": true,
  "lastLogin": null,
  "createdBy": null,
  "createdAt": "2025-11-10T23:45:00",
  "updatedBy": null,
  "updatedAt": "2025-11-10T23:45:00"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager1",
    "password": "pass123",
    "email": "manager1@cashew.lk",
    "firstName": "Manager",
    "lastName": "One",
    "roleId": 3
  }'
```

### 2. Get All Users
**GET** `/api/users`

Retrieves all users. Accessible by ADMIN and MANAGER roles.

**Response (200 OK):**
```json
[
  {
    "userId": 1,
    "username": "admin",
    "email": "admin@cashewcorner.com",
    "firstName": "Admin",
    "lastName": "User",
    "fullName": "Admin User",
    "roleId": 1,
    "roleName": "ADMIN",
    "roleDescription": "Administrator role with full access",
    "isActive": true,
    "lastLogin": "2025-11-10T23:30:00",
    "createdBy": null,
    "createdAt": "2025-11-10T20:00:00",
    "updatedBy": null,
    "updatedAt": "2025-11-10T23:30:00"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 3. Update User
**PUT** `/api/users/{userId}`

Updates user information. Only accessible by ADMIN role.

**Path Parameters:**
- `userId`: Long - The ID of the user to update

**Request Body (all fields optional):**
```json
{
  "email": "string",
  "firstName": "string", 
  "lastName": "string",
  "roleId": number
}
```

**Response (200 OK):**
```json
{
  "userId": 5,
  "username": "manager1",
  "email": "manager.updated@cashew.com",
  "firstName": "Updated",
  "lastName": "Manager",
  "fullName": "Updated Manager",
  "roleId": 3,
  "roleName": "MANAGER",
  "roleDescription": "Manager role with limited admin access",
  "isActive": true,
  "lastLogin": null,
  "createdBy": null,
  "createdAt": "2025-11-10T23:45:00",
  "updatedBy": null,
  "updatedAt": "2025-11-10T23:50:00"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8080/api/users/5 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager.updated@cashew.com",
    "firstName": "Updated",
    "lastName": "Manager"
  }'
```

### 4. Deactivate User
**PATCH** `/api/users/{userId}/deactivate`

Deactivates a user account. Only accessible by ADMIN role.

**Path Parameters:**
- `userId`: Long - The ID of the user to deactivate

**Response (200 OK):**
```json
{
  "message": "User deactivated successfully",
  "userId": 5,
  "username": "manager1",
  "isActive": false,
  "timestamp": "2025-11-10T23:55:00",
  "success": true
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8080/api/users/5/deactivate \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 5. Activate User
**PATCH** `/api/users/{userId}/activate`

Activates a user account. Only accessible by ADMIN role.

**Path Parameters:**
- `userId`: Long - The ID of the user to activate

**Response (200 OK):**
```json
{
  "message": "User activated successfully",
  "userId": 5,
  "username": "manager1", 
  "isActive": true,
  "timestamp": "2025-11-10T23:57:00",
  "success": true
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8080/api/users/5/activate \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "timestamp": "2025-11-10T23:45:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {
    "username": "Username is required",
    "email": "Email must be valid"
  }
}
```

### 401 Unauthorized - Authentication Required
```json
{
  "timestamp": "2025-11-10T23:45:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token is missing or invalid"
}
```

### 403 Forbidden - Access Denied
```json
{
  "timestamp": "2025-11-10T23:45:00",
  "status": 403,
  "error": "Forbidden", 
  "message": "Access denied"
}
```

### 404 Not Found - User/Role Not Found
```json
{
  "timestamp": "2025-11-10T23:45:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with ID: 999"
}
```

### 409 Conflict - Duplicate User
```json
{
  "timestamp": "2025-11-10T23:45:00",
  "status": 409,
  "error": "Conflict",
  "message": "Username already exists: manager1"
}
```

## Role IDs

The following role IDs are available:
- `1`: ADMIN - Full system access
- `2`: USER - Regular user access  
- `3`: MANAGER - Limited admin access

## Testing

Use the provided PowerShell test script:
```bash
powershell -ExecutionPolicy Bypass -File test-user-management.ps1
```

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Role-Based Access Control**: Different access levels for different roles
3. **Password Hashing**: Passwords are hashed using BCrypt
4. **Input Validation**: Comprehensive validation using Jakarta Validation
5. **Audit Logging**: All operations are logged with structured logging
6. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
