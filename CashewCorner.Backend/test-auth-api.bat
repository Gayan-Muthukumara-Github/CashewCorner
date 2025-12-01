@echo off
REM Cashew Corner Authentication API Testing Script
REM This script tests the authentication endpoints

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080
set AUTH_ENDPOINT=%BASE_URL%/api/auth

echo.
echo ==========================================
echo Cashew Corner Authentication API Tests
echo ==========================================
echo.

REM Test 1: Health Check
echo Test 1: Health Check
echo -------------------
curl -X GET "%AUTH_ENDPOINT%/health" ^
  -H "Content-Type: application/json"
echo.
echo.

REM Test 2: Login with valid credentials (admin)
echo Test 2: Login with valid credentials (admin)
echo --------------------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"admin\", \"password\": \"admin123\"}"
echo.
echo.

REM Test 3: Login with valid credentials (user)
echo Test 3: Login with valid credentials (user)
echo -------------------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"user\", \"password\": \"user123\"}"
echo.
echo.

REM Test 4: Login with valid credentials (manager)
echo Test 4: Login with valid credentials (manager)
echo -----------------------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"manager\", \"password\": \"manager123\"}"
echo.
echo.

REM Test 5: Login with invalid credentials
echo Test 5: Login with invalid credentials
echo --------------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"admin\", \"password\": \"wrongpassword\"}"
echo.
echo.

REM Test 6: Login with missing username
echo Test 6: Login with missing username
echo -----------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"password\": \"admin123\"}"
echo.
echo.

REM Test 7: Login with missing password
echo Test 7: Login with missing password
echo -----------------------------------
curl -s -X POST "%AUTH_ENDPOINT%/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"admin\"}"
echo.
echo.

echo ==========================================
echo Tests completed!
echo ==========================================
echo.
echo Note: Make sure the application is running on http://localhost:8080
echo.

endlocal

