@echo off
REM Optimized Docker Build Script with BuildKit for Windows

echo 🚀 Building Cashew Corner with BuildKit optimizations...

REM Enable BuildKit for faster builds
set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1

REM Build with BuildKit cache
docker-compose build --progress=plain

echo.
echo ✅ Build complete!
echo.
echo 📊 Build Statistics:
docker images cashew-corner-app
echo.
echo 🎯 To start the application:
echo    docker-compose up -d

