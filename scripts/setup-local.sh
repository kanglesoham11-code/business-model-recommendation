#!/bin/bash

# Local Development Setup Script

set -e

echo "🚀 Setting up Startup Model Planner for local development..."

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version OK"

# Check Docker
echo "📋 Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi
echo "✅ Docker is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
npm run install:all
echo "✅ Dependencies installed"

# Setup environment files
echo "⚙️  Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
fi

if [ ! -f recommendation-engine/.env ]; then
    cp recommendation-engine/.env.example recommendation-engine/.env
    echo "✅ Created recommendation-engine/.env"
fi

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d postgres redis
echo "✅ Docker containers started"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run database migrations
echo "🗄️  Running database migrations..."
cd backend
npx prisma migrate dev --name init
echo "✅ Database migrations completed"

# Seed database
echo "🌱 Seeding database..."
npx prisma db seed
echo "✅ Database seeded"

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "  1. Review and update environment variables in .env files"
echo "  2. Start development servers: npm run dev"
echo "  3. Access the application:"
echo "     - Frontend: http://localhost:3000"
echo "     - Backend API: http://localhost:5000"
echo "     - Recommendation Engine: http://localhost:5001"
echo ""
echo "📚 Documentation:"
echo "  - API Docs: docs/API.md"
echo "  - Deployment: docs/DEPLOYMENT.md"
echo "  - Engine Logic: docs/RECOMMENDATION_ENGINE.md"
echo ""
