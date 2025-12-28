# Socket Hangup Issue - Root Causes & Fixes

## 🔍 What is Socket Hangup?

A **socket hangup** (ECONNRESET, Connection reset by peer) occurs when:
- The server closes the connection unexpectedly
- The client's request times out before the server responds
- Network issues between client and server
- Server runs out of resources (memory, threads, connections)

---

## 🚨 Root Causes in Your Dockerfile Setup

### 1. ❌ **Missing Tomcat Timeout Configuration**

**Problem:**
- No explicit connection timeout settings
- Default Tomcat timeouts might be too short
- Connections close prematurely during long operations

**Symptoms:**
- `ECONNRESET` errors
- `Connection reset by peer`
- Requests fail intermittently
- Works locally but fails in Docker

---

### 2. ❌ **Low Memory Allocation**

**Problem:**
Your Dockerfile had:
```dockerfile
ENV JAVA_OPTS="-Xmx512m -Xms256m"
```

**Issues:**
- No container-aware JVM settings
- Fixed heap size doesn't adapt to container limits
- Can cause OutOfMemoryError → connection drops

---

### 3. ❌ **No Graceful Shutdown**

**Problem:**
- Spring Boot wasn't configured for graceful shutdown
- Active connections get killed during restart/stop
- In-flight requests fail with socket hangup

---

## ✅ Fixes Applied

### Fix #1: Added Tomcat Timeout Configuration

**File:** `src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8080
server.tomcat.connection-timeout=60000
server.tomcat.keep-alive-timeout=60000
server.connection-timeout=60000
```

**What this does:**
- `connection-timeout`: Max time (60s) to wait for HTTP request
- `keep-alive-timeout`: Max time (60s) to keep connection alive between requests
- Prevents premature connection closure

---

### Fix #2: Enhanced JVM Options for Containers

**File:** `Dockerfile`

**Before:**
```dockerfile
ENV JAVA_OPTS="-Xmx512m -Xms256m"
```

**After:**
```dockerfile
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
```

**What this does:**
- `-XX:+UseContainerSupport`: JVM respects Docker memory limits
- `-XX:MaxRAMPercentage=75.0`: Uses up to 75% of container memory
- Prevents OOM errors that cause connection drops

---

### Fix #3: Added Graceful Shutdown

**File:** `src/main/resources/application.properties`

```properties
# Spring Boot Configuration
spring.main.allow-circular-references=false
spring.lifecycle.timeout-per-shutdown-phase=30s
server.shutdown=graceful
```

**What this does:**
- `server.shutdown=graceful`: Waits for active requests to complete before shutdown
- `timeout-per-shutdown-phase=30s`: Max 30s to finish in-flight requests
- Prevents socket hangup during container restart

---

## 📊 Complete Configuration Changes

### application.properties (Lines 3-12)

```properties
# Server Configuration
server.port=8080
server.tomcat.connection-timeout=60000
server.tomcat.keep-alive-timeout=60000
server.connection-timeout=60000

# Spring Boot Configuration
spring.main.allow-circular-references=false
spring.lifecycle.timeout-per-shutdown-phase=30s
server.shutdown=graceful
```

### Dockerfile (Line 54)

```dockerfile
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
```

---

## 🧪 Testing the Fixes

### 1. Rebuild the Docker Image

```bash
docker-compose down
docker-compose up -d --build
```

### 2. Test with Long-Running Request

```bash
# This should NOT timeout or hangup
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  --data @test-login.json \
  --max-time 60
```

### 3. Monitor Container Health

```bash
# Check if container stays healthy
docker ps
docker logs cashew-corner-app --tail 50
```

### 4. Test Graceful Shutdown

```bash
# Start a request in background
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  --data @test-login.json &

# Immediately restart container
docker-compose restart cashew-corner

# The request should complete successfully (not hangup)
```

---

## 🔧 Additional Recommendations

### For Production: Increase Memory

Edit `docker-compose.yml`:

```yaml
environment:
  - JAVA_OPTS=-Xmx1024m -Xms512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0
```

### For High Traffic: Increase Thread Pool

Add to `application.properties`:

```properties
# Tomcat Thread Pool
server.tomcat.threads.max=200
server.tomcat.threads.min-spare=10
server.tomcat.max-connections=10000
server.tomcat.accept-count=100
```

### For Better Connection Handling

Add to `application.properties`:

```properties
# HTTP/2 Support (reduces connection overhead)
server.http2.enabled=true

# Compression (reduces payload size)
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain
```

---

## 🐛 Debugging Socket Hangup Issues

### Check Container Logs

```bash
docker logs cashew-corner-app --tail 200 | grep -i "error\|exception\|timeout"
```

### Check Container Resource Usage

```bash
docker stats cashew-corner-app
```

Look for:
- **High CPU %**: Might need more CPU or optimization
- **High MEM %**: Increase memory limits
- **High NET I/O**: Network bottleneck

### Enable Debug Logging

Add to `application.properties`:

```properties
logging.level.org.apache.tomcat=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Test with Verbose cURL

```bash
curl -v -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  --data @test-login.json
```

Look for:
- `* Connection #0 to host localhost left intact` ✅ Good
- `* Recv failure: Connection reset by peer` ❌ Socket hangup

---

## 📋 Summary of Changes

| File | Lines Changed | Purpose |
|------|---------------|---------|
| `application.properties` | 3-7 | Added Tomcat timeout configuration |
| `application.properties` | 9-12 | Added graceful shutdown |
| `Dockerfile` | 54 | Enhanced JVM options for containers |

---

## ✅ Expected Behavior After Fixes

1. ✅ **No more premature connection closures**
2. ✅ **Requests complete even during high load**
3. ✅ **Graceful shutdown doesn't kill active requests**
4. ✅ **Better memory management in Docker**
5. ✅ **Consistent behavior between local and Docker**

---

## 🚀 Deploy the Fixes

```bash
# Stop current container
docker-compose down

# Rebuild with fixes
docker-compose up -d --build

# Verify it's running
docker ps

# Test the endpoint
curl.exe -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  --data @test-login.json
```

---

## 📞 Still Getting Socket Hangup?

If you still experience issues, check:

1. **Network Issues**
   - Firewall blocking connections
   - VPN interfering with localhost
   - Windows Defender blocking Docker

2. **Port Conflicts**
   ```bash
   netstat -ano | findstr :8080
   ```

3. **Docker Network Issues**
   ```bash
   docker network inspect cashew-network
   ```

4. **Application Errors**
   ```bash
   docker logs cashew-corner-app | grep -i "error"
   ```

---

## 🎯 Key Takeaways

1. **Always set explicit timeouts** for containerized applications
2. **Use container-aware JVM settings** (`-XX:+UseContainerSupport`)
3. **Enable graceful shutdown** to prevent connection drops
4. **Monitor container resources** (CPU, memory, network)
5. **Test with realistic load** before production deployment

---

**Status:** ✅ All socket hangup fixes applied
**Next Step:** Rebuild and test the application

