# Troubleshooting Guide - Cashew Corner

## Common Issues and Solutions

### 1. ❌ Error: "Cannot load driver class: org.h2.Driver"

**Error Message:**
```
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'dataSource'
...
Caused by: java.lang.IllegalStateException: Cannot load driver class: org.h2.Driver
```

**Cause:**
The H2 database driver was not available on the classpath during application startup.

**Solution:**
Changed the H2 dependency scope from `runtimeOnly` to `implementation` in `build.gradle`:

```gradle
// Before (incorrect)
runtimeOnly 'com.h2database:h2'

// After (correct)
implementation 'com.h2database:h2'
```

**Why this works:**
- `runtimeOnly`: Makes the dependency available only at runtime, not during compilation
- `implementation`: Makes the dependency available at both compile-time and runtime
- Spring Boot DevTools and certain classloader scenarios require the driver to be on the implementation classpath

**Steps to fix:**
1. Update `build.gradle` with the correct scope
2. Refresh Gradle dependencies: `./gradlew clean build`
3. Restart the application

---

### 2. ❌ Schema Not Created / Tables Missing

**Symptoms:**
- Application starts but tables are not created
- SQL errors when trying to access database

**Solution:**
Verify the following in `application.properties`:

```properties
# Ensure schema initialization is enabled
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.continue-on-error=false

# Ensure JPA doesn't try to auto-create schema
spring.jpa.hibernate.ddl-auto=none
```

**Verification:**
1. Access H2 Console: http://localhost:8080/h2-console
2. Login with:
   - JDBC URL: `jdbc:h2:mem:cashew_corner`
   - Username: `sa`
   - Password: (empty)
3. Run: `SHOW TABLES;`
4. You should see 18 tables

---

### 3. ❌ Port 8080 Already in Use

**Error Message:**
```
Web server failed to start. Port 8080 was already in use.
```

**Solution:**

**Option A: Change application port**
Add to `application.properties`:
```properties
server.port=9090
```

**Option B: Stop the process using port 8080**
Windows:
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -i :8080
kill -9 <PID>
```

**Option C: Change Docker port mapping**
Edit `docker-compose.yml`:
```yaml
ports:
  - "9090:8080"  # External:Internal
```

---

### 4. ❌ H2 Console Not Accessible

**Symptoms:**
- Cannot access http://localhost:8080/h2-console
- 404 error or blank page

**Solution:**

Verify H2 console is enabled in `application.properties`:
```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

If using Spring Security, you may need to permit access to H2 console:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**")
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            );
        return http.build();
    }
}
```

---

### 5. ❌ Docker Build Fails

**Common Issues:**

**Issue A: Gradle daemon issues**
```bash
# Clean build
docker-compose down --rmi all
docker-compose build --no-cache
```

**Issue B: Out of memory during build**
Edit `Dockerfile` to increase Gradle memory:
```dockerfile
RUN gradle bootJar --no-daemon -x test -Dorg.gradle.jvmargs="-Xmx2048m"
```

**Issue C: Network issues downloading dependencies**
```bash
# Build with host network
docker build --network=host -t cashew-corner:latest .
```

---

### 6. ❌ Application Starts but Crashes Immediately

**Check logs:**
```bash
# Docker
docker-compose logs cashew-corner

# Local
./gradlew bootRun
```

**Common causes:**

**A. Memory issues**
Increase JVM memory in `docker-compose.yml`:
```yaml
environment:
  - JAVA_OPTS=-Xmx1024m -Xms512m
```

**B. Database connection issues**
Check `application.properties` for correct H2 configuration:
```properties
spring.datasource.url=jdbc:h2:mem:cashew_corner;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL
spring.datasource.driverClassName=org.h2.Driver
```

**C. Schema errors**
Check for SQL syntax errors in `schema.sql`:
- Ensure H2-compatible syntax
- Check for missing semicolons
- Verify foreign key references

---

### 7. ❌ Data Lost After Container Restart

**Cause:**
H2 is configured as in-memory database by default.

**Solution for Development:**
Use file-based H2 database:

Update `application.properties`:
```properties
spring.datasource.url=jdbc:h2:file:./data/cashew_corner;DB_CLOSE_DELAY=-1;MODE=MySQL
```

Create data directory:
```bash
mkdir data
```

**Solution for Production:**
Migrate to a persistent database (MySQL, PostgreSQL):

1. Add database dependency to `build.gradle`:
```gradle
implementation 'com.mysql:mysql-connector-j'
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cashew_corner
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

### 8. ❌ Gradle Build Fails with "Cannot find symbol"

**Cause:**
Missing Lombok annotation processor or outdated dependencies.

**Solution:**
```bash
# Clean and rebuild
./gradlew clean build --refresh-dependencies
```

Verify Lombok is properly configured in `build.gradle`:
```gradle
compileOnly 'org.projectlombok:lombok'
annotationProcessor 'org.projectlombok:lombok'
```

---

### 9. ❌ Health Check Failing in Docker

**Symptoms:**
Container shows as "unhealthy" in `docker ps`

**Solution:**

**Option A: Install wget in Alpine image**
Update `Dockerfile`:
```dockerfile
FROM eclipse-temurin:17-jre-alpine

# Install wget for health checks
RUN apk add --no-cache wget

# ... rest of Dockerfile
```

**Option B: Use curl instead**
Update `Dockerfile`:
```dockerfile
# Install curl
RUN apk add --no-cache curl

# Update health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
```

**Option C: Disable health check**
Comment out HEALTHCHECK in `Dockerfile` or `docker-compose.yml`

---

### 10. ❌ Spring Security Blocking All Requests

**Symptoms:**
- All endpoints return 401 Unauthorized
- Cannot access application or H2 console

**Temporary Solution (Development Only):**
Create a security configuration to permit all requests:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
```

**⚠️ Warning:** Only use this in development. Implement proper security for production.

---

## Getting Help

### Check Application Logs
```bash
# Docker
docker-compose logs -f cashew-corner

# Local
./gradlew bootRun --info
```

### Check Database Connection
Access H2 Console and verify:
1. Connection successful
2. Tables created
3. Can run queries

### Verify Dependencies
```bash
./gradlew dependencies
```

### Clean Build
```bash
# Clean Gradle cache
./gradlew clean

# Clean Docker
docker-compose down --rmi all --volumes

# Rebuild everything
./gradlew clean build
docker-compose up --build
```

---

## Useful Commands

### Gradle
```bash
# Build without tests
./gradlew build -x test

# Run application
./gradlew bootRun

# Clean build
./gradlew clean build

# Refresh dependencies
./gradlew build --refresh-dependencies
```

### Docker
```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop and remove
docker-compose down

# Complete cleanup
docker-compose down --rmi all --volumes
```

### Database
```bash
# Access H2 Console
http://localhost:8080/h2-console

# Check health
curl http://localhost:8080/actuator/health
```

---

## Still Having Issues?

1. Check the logs for specific error messages
2. Verify all configuration files match the examples
3. Ensure you're using Java 17
4. Try a clean build: `./gradlew clean build`
5. Check the official documentation for Spring Boot and H2

