# PowerShell script to test User Management API endpoints
# Requires the application to be running on localhost:8080

Write-Host "Testing Cashew Corner User Management System" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Configuration
$baseUrl = "http://localhost:8080"
$loginUrl = "$baseUrl/api/auth/login"
$usersUrl = "$baseUrl/api/users"

# Test credentials (techadmin has ADMIN role)
$loginBody = @{
    username = "techadmin"
    password = "cashew@123"
} | ConvertTo-Json

Write-Host "`n1. Testing Login with Admin credentials..." -ForegroundColor Yellow

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.accessToken
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host "User: $($loginResponse.user.username) ($($loginResponse.user.roleName))" -ForegroundColor Cyan
    
} catch {
    Write-Host "Login failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Testing Create User..." -ForegroundColor Yellow

$createUserBody = @{
    username = "manager1"
    password = "pass123"
    email = "manager1@cashew.lk"
    firstName = "Manager"
    lastName = "One"
    roleId = 3
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri $usersUrl -Method POST -Headers $headers -Body $createUserBody
    Write-Host "User created successfully!" -ForegroundColor Green
    Write-Host "User ID: $($createResponse.userId)" -ForegroundColor Cyan
    Write-Host "Username: $($createResponse.username)" -ForegroundColor Cyan
    Write-Host "Role: $($createResponse.roleName)" -ForegroundColor Cyan
    $newUserId = $createResponse.userId
    
} catch {
    Write-Host "Create user failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorDetails = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorDetails)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Get All Users..." -ForegroundColor Yellow

try {
    $usersResponse = Invoke-RestMethod -Uri $usersUrl -Method GET -Headers $headers
    Write-Host "Users retrieved successfully!" -ForegroundColor Green
    Write-Host "Total users: $($usersResponse.Count)" -ForegroundColor Cyan
    
    foreach ($user in $usersResponse) {
        Write-Host "- $($user.username) ($($user.roleName)) - Active: $($user.isActive)" -ForegroundColor White
    }
    
} catch {
    Write-Host "Get users failed! Error: $($_.Exception.Message)" -ForegroundColor Red
}

if ($newUserId) {
    Write-Host "`n4. Testing Update User..." -ForegroundColor Yellow
    
    $updateUserBody = @{
        email = "manager.updated@cashew.com"
        firstName = "Updated"
        lastName = "Manager"
    } | ConvertTo-Json
    
    try {
        $updateResponse = Invoke-RestMethod -Uri "$usersUrl/$newUserId" -Method PUT -Headers $headers -Body $updateUserBody
        Write-Host "User updated successfully!" -ForegroundColor Green
        Write-Host "Updated email: $($updateResponse.email)" -ForegroundColor Cyan
        Write-Host "Updated name: $($updateResponse.fullName)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "Update user failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n5. Testing Deactivate User..." -ForegroundColor Yellow
    
    try {
        $deactivateResponse = Invoke-RestMethod -Uri "$usersUrl/$newUserId/deactivate" -Method PATCH -Headers $headers
        Write-Host "User deactivated successfully!" -ForegroundColor Green
        Write-Host "Message: $($deactivateResponse.message)" -ForegroundColor Cyan
        Write-Host "Active status: $($deactivateResponse.isActive)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "Deactivate user failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n6. Testing Activate User..." -ForegroundColor Yellow
    
    try {
        $activateResponse = Invoke-RestMethod -Uri "$usersUrl/$newUserId/activate" -Method PATCH -Headers $headers
        Write-Host "User activated successfully!" -ForegroundColor Green
        Write-Host "Message: $($activateResponse.message)" -ForegroundColor Cyan
        Write-Host "Active status: $($activateResponse.isActive)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "Activate user failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n7. Testing Access Control (Manager role)..." -ForegroundColor Yellow

# Login as manager (should only be able to list users, not create/update/deactivate)
$managerLoginBody = @{
    username = "manager"
    password = "manager123"
} | ConvertTo-Json

try {
    $managerLoginResponse = Invoke-RestMethod -Uri $loginUrl -Method POST -ContentType "application/json" -Body $managerLoginBody
    $managerToken = $managerLoginResponse.accessToken
    $managerHeaders = @{
        "Authorization" = "Bearer $managerToken"
        "Content-Type" = "application/json"
    }
    
    Write-Host "Manager login successful!" -ForegroundColor Green
    
    # Test manager can list users
    try {
        $managerUsersResponse = Invoke-RestMethod -Uri $usersUrl -Method GET -Headers $managerHeaders
        Write-Host "Manager can list users: SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "Manager cannot list users: FAILED" -ForegroundColor Red
    }
    
    # Test manager cannot create users (should fail)
    try {
        $testCreateBody = @{
            username = "testuser"
            password = "test123"
            email = "test@test.com"
            firstName = "Test"
            lastName = "User"
            roleId = 2
        } | ConvertTo-Json
        
        $managerCreateResponse = Invoke-RestMethod -Uri $usersUrl -Method POST -Headers $managerHeaders -Body $testCreateBody
        Write-Host "Manager can create users: UNEXPECTED SUCCESS (should fail)" -ForegroundColor Red
    } catch {
        Write-Host "Manager cannot create users: SUCCESS (access denied as expected)" -ForegroundColor Green
    }
    
} catch {
    Write-Host "Manager login failed! Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nUser Management API testing completed!" -ForegroundColor Green
