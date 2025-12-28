# 🔧 ECONNREFUSED Error - Troubleshooting Guide

## ❌ Error: `connect ECONNREFUSED 127.0.0.1:8080`

This error means your application **cannot connect** to `localhost:8080` because:
1. Nothing is listening on port 8080, OR
2. The port is not properly mapped from the Docker container to your host machine

---

## 🔍 Root Cause Analysis

### What Happened:
Your Docker container was running **WITHOUT port mapping**. The application was running perfectly inside the container on port 8080, but the port was **not exposed** to your host machine.

### Evidence:
```bash
# Container WITHOUT port mapping (WRONG):
PORTS
8080-8081/tcp  ❌ No host mapping!

# Container WITH port mapping (CORRECT):
PORTS
0.0.0.0:8080-8081->8080-8081/tcp  ✅ Mapped to host!
```

---

## ✅ Solution

### The Fix:
**Always use `docker-compose up -d` instead of `docker run`** to ensure proper port mapping.

### Steps to Fix:

1. **Stop any running containers without port mapping:**
   ```bash
   docker ps -a
   docker stop <container-id>
   docker rm <container-id>
   ```

2. **Start with docker-compose (ensures port mapping):**
   ```bash
   docker-compose up -d
   ```

3. **Wait for application to start (~25 seconds):**
   ```bash
   # Windows
   timeout /t 25
   
   # Linux/Mac
   sleep 25
   ```

4. **Verify port mapping:**
   ```bash
   docker ps
   # Should show: 0.0.0.0:8080->8080/tcp
   ```

5. **Test the connection:**
   ```bash
   curl http://localhost:8080/actuator/health
   # Should return: {"status":"UP"}
   ```

---

## 🐛 Common Causes & Solutions

### 1. **Container Started Without Port Mapping**

**Symptom:**
```bash
docker ps
# Shows: 8080-8081/tcp (no 0.0.0.0 mapping)
```

**Solution:**
```bash
# Stop and remove container
docker stop <container-id>
docker rm <container-id>

# Restart with docker-compose
docker-compose up -d
```

---

### 2. **Application Not Fully Started**

**Symptom:**
```bash
curl http://localhost:8080/actuator/health
# Error: Connection refused
```

**Solution:**
```bash
# Check container logs
docker logs cashew-corner-app --tail 50

# Look for this line:
# "Started CashewCornerApplication in X seconds"

# If not started, wait longer
timeout /t 30  # Windows
sleep 30       # Linux/Mac
```

---

### 3. **Port Already in Use**

**Symptom:**
```bash
docker-compose up -d
# Error: Bind for 0.0.0.0:8080 failed: port is already allocated
```

**Solution:**
```bash
# Find what's using port 8080
# Windows:
netstat -ano | findstr :8080

# Linux/Mac:
lsof -i :8080

# Kill the process or change port in docker-compose.yml
ports:
  - "8090:8080"  # Use different host port
```

---

### 4. **Docker Not Running**

**Symptom:**
```bash
docker ps
# Error: Cannot connect to the Docker daemon
```

**Solution:**
```bash
# Start Docker Desktop (Windows/Mac)
# Or start Docker service (Linux):
sudo systemctl start docker
```

---

### 5. **Firewall Blocking Connection**

**Symptom:**
- Container running with correct port mapping
- Application started successfully
- Still getting ECONNREFUSED

**Solution:**
```bash
# Windows: Allow Docker in Windows Firewall
# Control Panel → Windows Defender Firewall → Allow an app

# Linux: Allow port in firewall
sudo ufw allow 8080/tcp

# Test from inside container first
docker exec cashew-corner-app curl http://localhost:8080/actuator/health
```

---

## 🧪 Diagnostic Commands

### Check Container Status:
```bash
docker ps -a
```
**Look for:**
- `STATUS`: Should be `Up X seconds (healthy)`
- `PORTS`: Should show `0.0.0.0:8080->8080/tcp`

### Check Application Logs:
```bash
docker logs cashew-corner-app --tail 100
```
**Look for:**
- `Tomcat started on port 8080 (http)`
- `Started CashewCornerApplication in X seconds`
- No ERROR messages

### Check Port Mapping:
```bash
docker port cashew-corner-app
```
**Expected output:**
```
8080/tcp -> 0.0.0.0:8080
8081/tcp -> 0.0.0.0:8081
```

### Test Connection from Host:
```bash
curl http://localhost:8080/actuator/health
```
**Expected output:**
```json
{"status":"UP"}
```

### Test Connection from Inside Container:
```bash
docker exec cashew-corner-app curl http://localhost:8080/actuator/health
```
**Expected output:**
```json
{"status":"UP"}
```

---

## 📋 Complete Troubleshooting Checklist

- [ ] **Docker is running**
  ```bash
  docker --version
  docker ps
  ```

- [ ] **Container is running**
  ```bash
  docker ps | grep cashew-corner-app
  ```

- [ ] **Ports are mapped correctly**
  ```bash
  docker ps
  # Should show: 0.0.0.0:8080->8080/tcp
  ```

- [ ] **Application has started**
  ```bash
  docker logs cashew-corner-app | grep "Started CashewCornerApplication"
  ```

- [ ] **Health endpoint responds**
  ```bash
  curl http://localhost:8080/actuator/health
  ```

- [ ] **Port 8080 is not in use by another process**
  ```bash
  # Windows:
  netstat -ano | findstr :8080
  
  # Linux/Mac:
  lsof -i :8080
  ```

- [ ] **Firewall allows connections**
  - Check Windows Firewall / Linux iptables / Mac firewall

---

## 🚀 Quick Fix Script

### Windows (PowerShell):
```powershell
# Stop all containers
docker-compose down

# Remove orphaned containers
docker ps -a | Select-String "cashew" | ForEach-Object { docker rm -f $_.ToString().Split()[0] }

# Start fresh
docker-compose up -d

# Wait for startup
Start-Sleep -Seconds 30

# Test
curl http://localhost:8080/actuator/health
```

### Linux/Mac (Bash):
```bash
#!/bin/bash
# Stop all containers
docker-compose down

# Remove orphaned containers
docker ps -a | grep cashew | awk '{print $1}' | xargs -r docker rm -f

# Start fresh
docker-compose up -d

# Wait for startup
sleep 30

# Test
curl http://localhost:8080/actuator/health
```

---

## ✅ Verification

After applying the fix, you should see:

1. **Container running with port mapping:**
   ```bash
   docker ps
   # PORTS: 0.0.0.0:8080->8080/tcp ✅
   ```

2. **Health endpoint responding:**
   ```bash
   curl http://localhost:8080/actuator/health
   # {"status":"UP"} ✅
   ```

3. **Login endpoint working:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     --data @test-login.json
   # Returns JWT tokens ✅
   ```

---

## 📚 Prevention

### Always Use Docker Compose:
```bash
# ✅ CORRECT - Uses docker-compose.yml with port mapping
docker-compose up -d

# ❌ WRONG - Manual docker run (easy to forget port mapping)
docker run -d cashew-corner-app
```

### Verify After Starting:
```bash
# Start container
docker-compose up -d

# Verify immediately
docker ps
docker logs cashew-corner-app --tail 20
curl http://localhost:8080/actuator/health
```

---

## 🎯 Summary

**Problem:** Container running without port mapping → `ECONNREFUSED`

**Solution:** Use `docker-compose up -d` to ensure proper port mapping

**Verification:**
```bash
docker ps  # Check for 0.0.0.0:8080->8080/tcp
curl http://localhost:8080/actuator/health  # Should return {"status":"UP"}
```

**Status:** ✅ **FIXED - Application now accessible on http://localhost:8080**

