#!/bin/bash
# Optimized Docker Build Script with BuildKit

set -e

echo "🚀 Building Cashew Corner with BuildKit optimizations..."

# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with BuildKit cache
docker-compose build --progress=plain

echo "✅ Build complete!"
echo ""
echo "📊 Build Statistics:"
docker images cashew-corner-app --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo ""
echo "🎯 To start the application:"
echo "   docker-compose up -d"

