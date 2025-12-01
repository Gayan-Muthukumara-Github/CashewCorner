@echo off
REM Cashew Corner Login & Logout Testing Script
REM This script tests the complete login and logout workflow

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080
set AUTH_ENDPOINT=%BASE_URL%/api/auth

echo.
echo ==========================================
echo Cashew Corner Login & Logout Tests
echo ==========================================
echo.

REM Test 1: Login with admin
echo Test 1: Login with admin credentials
echo -----------------------------------
for /f "tokens=*" %%A in ('curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"admin\", \"password\": \"admin123\"}"') do (
  set LOGIN_RESPONSE=%%A
)

echo Login Response:
echo !LOGIN_RESPONSE!
echo.

REM Extract token using PowerShell (if available)
echo Extracting access token...
for /f "tokens=*" %%A in ('powershell -Command "ConvertFrom-Json '!LOGIN_RESPONSE!' | Select-Object -ExpandProperty accessToken"') do (
  set TOKEN=%%A
)

if "!TOKEN!"=="" (
  echo Failed to extract token. Please ensure jq or PowerShell is available.
  echo.
  echo Manual token extraction:
  echo Copy the "accessToken" value from the login response above.
  echo.
  pause
  goto :eof
)

echo Access Token: !TOKEN!
echo.

REM Test 2: Logout with token
echo Test 2: Logout with valid token
echo --------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/logout" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json"
echo.
echo.

REM Test 3: Try to logout again with same token
echo Test 3: Try to logout again with same token (should fail)
echo -------------------------------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/logout" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -H "Content-Type: application/json"
echo.
echo.

REM Test 4: Logout without token
echo Test 4: Logout without Authorization header (should fail)
echo ---------------------------------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/logout" ^
  -H "Content-Type: application/json"
echo.
echo.

REM Test 5: Logout with invalid token format
echo Test 5: Logout with invalid token format (should fail)
echo -------------------------------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/logout" ^
  -H "Authorization: InvalidToken" ^
  -H "Content-Type: application/json"
echo.
echo.

REM Test 6: Login with user role
echo Test 6: Login with user credentials
echo -----------------------------------
for /f "tokens=*" %%A in ('curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"user\", \"password\": \"user123\"}"') do (
  set USER_LOGIN_RESPONSE=%%A
)

echo User Login Response:
echo !USER_LOGIN_RESPONSE!
echo.

REM Extract user token
for /f "tokens=*" %%A in ('powershell -Command "ConvertFrom-Json '!USER_LOGIN_RESPONSE!' | Select-Object -ExpandProperty accessToken"') do (
  set USER_TOKEN=%%A
)

if not "!USER_TOKEN!"=="" (
  echo Test 7: Logout user
  echo ------------------
  curl -s -X POST "%AUTH_ENDPOINT%/logout" ^
    -H "Authorization: Bearer !USER_TOKEN!" ^
    -H "Content-Type: application/json"
  echo.
  echo.
)

echo ==========================================
echo Tests completed!
echo ==========================================
echo.
echo Note: Make sure the application is running on http://localhost:8080
echo.

endlocal

