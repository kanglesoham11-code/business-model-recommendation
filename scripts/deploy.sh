#!/bin/bash

# Startup Model Planner - Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
echo "🚀 Deploying to $ENVIRONMENT environment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Build backend
echo "🔨 Building backend..."
cd backend
docker build -t startup-planner-backend:latest .
echo -e "${GREEN}✅ Backend built${NC}"

# Build recommendation engine
echo "🔨 Building recommendation engine..."
cd ../recommendation-engine
docker build -t startup-planner-engine:latest .
echo -e "${GREEN}✅ Recommendation engine built${NC}"

# Build frontend
echo "🔨 Building frontend..."
cd ../frontend
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"

# Tag and push Docker images
echo "📤 Pushing Docker images to ECR..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}
ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Push backend
docker tag startup-planner-backend:latest $ECR_REGISTRY/startup-planner-backend:latest
docker push $ECR_REGISTRY/startup-planner-backend:latest
echo -e "${GREEN}✅ Backend image pushed${NC}"

# Push engine
docker tag startup-planner-engine:latest $ECR_REGISTRY/startup-planner-engine:latest
docker push $ECR_REGISTRY/startup-planner-engine:latest
echo -e "${GREEN}✅ Engine image pushed${NC}"

# Deploy frontend to S3
echo "📤 Deploying frontend to S3..."
aws s3 sync dist/ s3://startup-planner-frontend-$ENVIRONMENT/ --delete
echo -e "${GREEN}✅ Frontend deployed to S3${NC}"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='startup-planner-$ENVIRONMENT'].Id" --output text)
if [ -n "$DISTRIBUTION_ID" ]; then
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"
fi

# Update ECS services (if using ECS)
echo "🔄 Updating ECS services..."
aws ecs update-service --cluster startup-planner-$ENVIRONMENT --service backend --force-new-deployment
aws ecs update-service --cluster startup-planner-$ENVIRONMENT --service engine --force-new-deployment
echo -e "${GREEN}✅ ECS services updated${NC}"

# Run database migrations
echo "🗄️  Running database migrations..."
# This would typically be done via a separate migration job
echo -e "${YELLOW}⚠️  Remember to run database migrations manually${NC}"

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "📊 Deployment Summary:"
echo "  Environment: $ENVIRONMENT"
echo "  Backend: $ECR_REGISTRY/startup-planner-backend:latest"
echo "  Engine: $ECR_REGISTRY/startup-planner-engine:latest"
echo "  Frontend: s3://startup-planner-frontend-$ENVIRONMENT/"
echo ""
echo "🔗 Access your application:"
echo "  Frontend: https://startupmodelplanner.com"
echo "  API: https://api.startupmodelplanner.com"
echo ""
