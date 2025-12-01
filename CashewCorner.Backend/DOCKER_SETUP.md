# Cashew Corner - Docker Setup Guide

This guide explains how to build and run the Cashew Corner inventory management system using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- At least 1GB of free disk space

## Database Configuration

The application uses **H2 in-memory database** with the following configuration:

- **Database URL**: `jdbc:h2:mem:cashew_corner`
- **Username**: `sa`
- **Password**: (empty)
- **H2 Console**: Enabled at `http://localhost:8080/h2-console`

### Key H2 Features

- **In-memory database**: Data is stored in memory and will be lost when the container stops
- **MySQL compatibility mode**: H2 is configured to run in MySQL mode for better compatibility
- **Auto-initialization**: Schema is automatically created from `src/main/resources/schema.sql`

## Building the Docker Image

### Option 1: Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

This will:
1. Build the Docker image
2. Start the container
3. Expose ports 8080 (application) and 8081 (H2 console)

### Option 2: Using Docker CLI

```bash
# Build the image
docker build -t cashew-corner:latest .

# Run the container
docker run -d \
  --name cashew-corner-app \
  -p 8080:8080 \
  -p 8081:8081 \
  cashew-corner:latest
```

## Accessing the Application

Once the container is running:

- **Application**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
- **Health Check**: http://localhost:8080/actuator/health

### H2 Console Login

To access the H2 console:

1. Navigate to http://localhost:8080/h2-console
2. Use the following connection details:
   - **JDBC URL**: `jdbc:h2:mem:cashew_corner`
   - **User Name**: `sa`
   - **Password**: (leave empty)
3. Click "Connect"

## Docker Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f cashew-corner
```

### Restart the application
```bash
docker-compose restart
```

### Rebuild and restart
```bash
docker-compose up --build -d
```

### Remove containers and images
```bash
docker-compose down --rmi all
```

## Environment Variables

You can customize the application by setting environment variables in `docker-compose.yml`:

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=prod
  - JAVA_OPTS=-Xmx512m -Xms256m
  - SERVER_PORT=8080
```

## Troubleshooting

### Container won't start

Check the logs:
```bash
docker-compose logs cashew-corner
```

### Port already in use

If port 8080 is already in use, modify the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "9090:8080"  # Change 9090 to any available port
```

### Out of memory errors

Increase the JVM memory in `docker-compose.yml`:
```yaml
environment:
  - JAVA_OPTS=-Xmx1024m -Xms512m
```

### Database schema not created

Ensure `src/main/resources/schema.sql` exists and check the application logs for SQL errors.

## Production Considerations

### Data Persistence

⚠️ **Important**: H2 in-memory database does not persist data between container restarts.

For production use, consider:

1. **Using H2 file-based storage**:
   Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:h2:file:/data/cashew_corner;DB_CLOSE_DELAY=-1;MODE=MySQL
   ```
   
   Add volume mapping in `docker-compose.yml`:
   ```yaml
   volumes:
     - h2-data:/data
   
   volumes:
     h2-data:
   ```

2. **Migrating to a production database** (MySQL, PostgreSQL):
   - Update dependencies in `build.gradle`
   - Update `application.properties` with production database credentials
   - Use environment variables for sensitive data

### Security

- Disable H2 console in production:
  ```properties
  spring.h2.console.enabled=false
  ```

- Use strong passwords and secure the application with proper authentication

- Consider using Docker secrets for sensitive configuration

## Multi-Stage Build

The Dockerfile uses a multi-stage build:

1. **Build stage**: Uses Gradle to compile and package the application
2. **Runtime stage**: Uses a minimal JRE image to run the application

This approach:
- Reduces final image size
- Improves security by excluding build tools
- Speeds up deployment

## Health Checks

The container includes a health check that:
- Runs every 30 seconds
- Checks the `/actuator/health` endpoint
- Marks the container as unhealthy after 3 failed attempts

View health status:
```bash
docker ps
```

## Schema Conversion Notes

The MySQL schema has been converted to H2 with the following changes:

1. **Data Types**:
   - `BIGINT UNSIGNED` → `BIGINT`
   - `TINYINT(1)` → `BOOLEAN`
   - `DATETIME` → `TIMESTAMP`
   - `JSON` → `VARCHAR(4000)` (for reports table)

2. **Auto-increment**:
   - MySQL: `AUTO_INCREMENT`
   - H2: `AUTO_INCREMENT` (same syntax)

3. **Generated Columns**:
   - MySQL: `GENERATED ALWAYS AS (...) VIRTUAL`
   - H2: `AS (...)` (computed columns)

4. **Timestamps**:
   - MySQL: `ON UPDATE CURRENT_TIMESTAMP`
   - H2: Removed (handle in application layer or use triggers)

5. **Engine and Charset**:
   - Removed MySQL-specific `ENGINE=InnoDB` and `CHARSET=utf8mb4`

## Support

For issues or questions, please refer to the application documentation or contact the development team.

