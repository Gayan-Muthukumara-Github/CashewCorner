# syntax=docker/dockerfile:1.4
# Stage 1 — Build
FROM gradle:8.5-jdk17-alpine AS build

WORKDIR /app

# Copy dependency definitions first (better layer caching)
COPY build.gradle settings.gradle gradle.properties ./
COPY gradle gradle
COPY gradlew .

RUN chmod +x gradlew

# Download dependencies ONLY (cached separately from source code)
# Using BuildKit cache mount for Gradle cache directory
RUN --mount=type=cache,target=/home/gradle/.gradle/caches \
    --mount=type=cache,target=/home/gradle/.gradle/wrapper \
    ./gradlew dependencies --no-daemon --parallel

# Copy source code (separate layer - only invalidates if source changes)
COPY src src

# Build JAR with all optimizations
# - BuildKit cache mounts for Gradle caches
# - Parallel builds
# - Build cache enabled
# - Tests skipped (run separately in CI/CD)
RUN --mount=type=cache,target=/home/gradle/.gradle/caches \
    --mount=type=cache,target=/home/gradle/.gradle/wrapper \
    ./gradlew bootJar --no-daemon --parallel --build-cache -x test --info

# Stage 2 — Runtime (Optimized)
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

# Install curl for healthcheck (combine RUN commands to reduce layers)
RUN apk add --no-cache curl && \
    addgroup -S spring && \
    adduser -S spring -G spring

# Copy JAR from build stage
COPY --from=build --chown=spring:spring /app/build/libs/*.jar app.jar

# Switch to non-root user
USER spring:spring

# Expose ports
EXPOSE 8080 8081

# Optimized JVM settings for containers
# - UseContainerSupport: JVM respects container memory limits
# - MaxRAMPercentage: Use up to 75% of container memory
# - +UseG1GC: Better garbage collection for containers
# - +UseStringDeduplication: Reduce memory footprint
# - +OptimizeStringConcat: Faster string operations
ENV JAVA_OPTS="-Xmx512m -Xms256m \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=100 \
    -XX:+UseStringDeduplication \
    -XX:+OptimizeStringConcat \
    -Djava.security.egd=file:/dev/./urandom"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Use exec form for better signal handling
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
