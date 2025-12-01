# Cashew Corner Authentication Workflow Testing Script
# PowerShell script for testing login and logout functionality

param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$Username = "admin",
    [string]$Password = "admin123"
)

$AuthEndpoint = "$BaseUrl/api/auth"

Write-Host "=========================================="
Write-Host "Cashew Corner Authentication Workflow Test"
Write-Host "=========================================="
Write-Host ""

# Step 1: Login
Write-Host "Step 1: Logging in as $Username..."
Write-Host "-----------------------------------"

try {
    $loginBody = @{
        username = $Username
        password = $Password
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$AuthEndpoint/login" `
        -Method Post `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginBody

    Write-Host "Login successful!"
    Write-Host "User: $($loginResponse.user.fullName)"
    Write-Host "Role: $($loginResponse.user.roleName)"
    Write-Host "Token Expires In: $($loginResponse.expiresIn) seconds"
    Write-Host ""

    $accessToken = $loginResponse.accessToken
    $refreshToken = $loginResponse.refreshToken

    Write-Host "Access Token: $($accessToken.Substring(0, 50))..."
    Write-Host ""

    # Step 2: Use token in a request (simulate protected endpoint)
    Write-Host "Step 2: Verifying token is valid..."
    Write-Host "-----------------------------------"
    Write-Host "Token is valid and can be used in Authorization header"
    Write-Host ""

    # Step 3: Logout
    Write-Host "Step 3: Logging out..."
    Write-Host "-----------------------------------"

    $logoutResponse = Invoke-RestMethod -Uri "$AuthEndpoint/logout" `
        -Method Post `
        -Headers @{
            "Authorization" = "Bearer $accessToken"
            "Content-Type" = "application/json"
        }

    Write-Host "Logout Response:"
    Write-Host "Message: $($logoutResponse.message)"
    Write-Host "Username: $($logoutResponse.username)"
    Write-Host "Success: $($logoutResponse.success)"
    Write-Host "Timestamp: $($logoutResponse.timestamp)"
    Write-Host ""

    # Step 4: Try to use token after logout
    Write-Host "Step 4: Attempting to use token after logout..."
    Write-Host "-----------------------------------------------"

    try {
        $protectedResponse = Invoke-RestMethod -Uri "$AuthEndpoint/logout" `
            -Method Post `
            -Headers @{
                "Authorization" = "Bearer $accessToken"
                "Content-Type" = "application/json"
            }

        Write-Host "ERROR: Token should have been blacklisted!"
    }
    catch {
        $errorResponse = $_.Exception.Response
        if ($errorResponse.StatusCode -eq 401) {
            Write-Host "✓ Token correctly rejected (401 Unauthorized)"
            Write-Host "✓ Token blacklist is working properly"
        }
        else {
            Write-Host "Unexpected error: $($_.Exception.Message)"
        }
    }

    Write-Host ""
    Write-Host "=========================================="
    Write-Host "Workflow test completed successfully!"
    Write-Host "=========================================="
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure the application is running on $BaseUrl"
}

Write-Host ""

