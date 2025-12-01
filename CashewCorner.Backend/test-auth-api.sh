#!/bin/bash

# Cashew Corner Authentication API Testing Script
# This script tests the authentication endpoints

BASE_URL="http://localhost:8080"
AUTH_ENDPOINT="$BASE_URL/api/auth"

echo "=========================================="
echo "Cashew Corner Authentication API Tests"
echo "=========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "-------------------"
curl -X GET "$AUTH_ENDPOINT/health" \
  -H "Content-Type: application/json"
echo ""
echo ""

# Test 2: Login with valid credentials (admin)
echo "Test 2: Login with valid credentials (admin)"
echo "--------------------------------------------"
ADMIN_LOGIN=$(curl -s -X POST "$AUTH_ENDPOINT/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

echo "$ADMIN_LOGIN" | jq '.'
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.accessToken')
echo ""
echo "Access Token: $ADMIN_TOKEN"
echo ""

# Test 3: Login with valid credentials (user)
echo "Test 3: Login with valid credentials (user)"
echo "-------------------------------------------"
USER_LOGIN=$(curl -s -X POST "$AUTH_ENDPOINT/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "user123"
  }')

echo "$USER_LOGIN" | jq '.'
USER_TOKEN=$(echo "$USER_LOGIN" | jq -r '.accessToken')
echo ""
echo "Access Token: $USER_TOKEN"
echo ""

# Test 4: Login with invalid credentials
echo "Test 4: Login with invalid credentials"
echo "--------------------------------------"
curl -s -X POST "$AUTH_ENDPOINT/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongpassword"
  }' | jq '.'
echo ""

# Test 5: Login with missing username
echo "Test 5: Login with missing username"
echo "-----------------------------------"
curl -s -X POST "$AUTH_ENDPOINT/login" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "admin123"
  }' | jq '.'
echo ""

# Test 6: Login with missing password
echo "Test 6: Login with missing password"
echo "-----------------------------------"
curl -s -X POST "$AUTH_ENDPOINT/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin"
  }' | jq '.'
echo ""

echo "=========================================="
echo "Tests completed!"
echo "=========================================="

