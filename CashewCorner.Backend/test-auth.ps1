# Test Authentication Endpoints for Cashew Corner

Write-Host "Testing Cashew Corner Authentication System" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Test 1: Login with admin credentials
Write-Host "`n1. Testing Login with admin credentials..." -ForegroundColor Yellow

$loginBody = @{
    username = "techadmin"
    password = "cashew@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.accessToken.Substring(0,50))..." -ForegroundColor Cyan
    Write-Host "User: $($loginResponse.user.username) ($($loginResponse.user.role))" -ForegroundColor Cyan
    
    $token = $loginResponse.accessToken
    
    # Test 2: Logout
    Write-Host "`n2. Testing Logout..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $logoutResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/logout" -Method POST -Headers $headers
    Write-Host "Logout successful!" -ForegroundColor Green
    Write-Host "Message: $($logoutResponse.message)" -ForegroundColor Cyan
    
    # Test 3: Try to use the logged out token (should fail)
    Write-Host "`n3. Testing token after logout (should fail)..." -ForegroundColor Yellow
    
    try {
        $testResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/logout" -Method POST -Headers $headers
        Write-Host "Token should have been blacklisted!" -ForegroundColor Red
    } catch {
        Write-Host "Token correctly blacklisted!" -ForegroundColor Green
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "Login failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAuthentication test completed!" -ForegroundColor Green
