# Quick Start Guide - Cashew Corner

## 🚀 Quick Start with Docker

### Start the application
```bash
docker-compose up -d
```

### Access the application
- Application: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console
- Health Check: http://localhost:8080/actuator/health

### Stop the application
```bash
docker-compose down
```

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Java 17 or higher
- Gradle 8.5 or higher (or use the included Gradle wrapper)

### Build the application
```bash
./gradlew build
```

### Run the application
```bash
./gradlew bootRun
```

### Run tests
```bash
./gradlew test
```

---

## 🐳 Docker Commands

### Build and start
```bash
docker-compose up --build -d
```

### View logs
```bash
docker-compose logs -f
```

### Restart
```bash
docker-compose restart
```

### Clean up
```bash
docker-compose down --rmi all --volumes
```

---

## 📊 H2 Database Access

### Console Login Details
- **JDBC URL**: `jdbc:h2:mem:cashew_corner`
- **Username**: `sa`
- **Password**: (empty)

### Access H2 Console
1. Navigate to: http://localhost:8080/h2-console
2. Enter the connection details above
3. Click "Connect"

---

## 🔍 Verify Installation

### Check if container is running
```bash
docker ps | grep cashew-corner
```

### Check application health
```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### Check logs for errors
```bash
docker-compose logs cashew-corner | grep -i error
```

---

## 📝 Database Schema

The database schema is automatically initialized from:
- `src/main/resources/schema.sql`

To verify schema creation:
1. Access H2 Console
2. Run: `SHOW TABLES;`
3. You should see all 18 tables created

---

## 🔧 Troubleshooting

### Port 8080 already in use
Edit `docker-compose.yml` and change the port mapping:
```yaml
ports:
  - "9090:8080"  # Use port 9090 instead
```

### Container fails to start
```bash
# Check logs
docker-compose logs cashew-corner

# Check container status
docker ps -a | grep cashew-corner
```

### Rebuild from scratch
```bash
# Stop and remove everything
docker-compose down --rmi all --volumes

# Rebuild and start
docker-compose up --build -d
```

---

## 📦 Project Structure

```
cashew-corner/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   │       ├── schema.sql          # H2 database schema
│   │       └── application.properties
│   └── test/
├── build.gradle                     # Gradle build configuration
├── Dockerfile                       # Docker image definition
├── docker-compose.yml              # Docker Compose configuration
└── .dockerignore                   # Docker build exclusions
```

---

## 🎯 Next Steps

1. ✅ Start the application with Docker
2. ✅ Access H2 console and verify schema
3. ✅ Check health endpoint
4. 🔨 Implement your business logic
5. 🧪 Write and run tests
6. 🚀 Deploy to production

For detailed documentation, see `DOCKER_SETUP.md`.

