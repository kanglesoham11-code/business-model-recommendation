# Deployment Guide

## Prerequisites

- AWS Account with CLI configured
- Docker & Docker Compose installed
- Node.js 20+ installed
- PostgreSQL 15 client
- Domain name (optional)

## Local Development

### 1. Clone and Install

```bash
git clone <repository-url>
cd startup-model-planner
npm run install:all
```

### 2. Environment Setup

Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp recommendation-engine/.env.example recommendation-engine/.env
```

Update with your values.

### 3. Start Infrastructure

```bash
npm run docker:up
```

This starts PostgreSQL and Redis containers.

### 4. Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 5. Start Development Servers

```bash
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Recommendation Engine: http://localhost:5001

## Production Deployment (AWS)

### Architecture

```
┌─────────────┐
│  CloudFront │ (CDN)
└──────┬──────┘
       │
┌──────▼──────┐
│   S3 Bucket │ (Frontend)
└─────────────┘

┌─────────────┐
│     ALB     │ (Load Balancer)
└──────┬──────┘
       │
┌──────▼──────┐
│   EC2 Auto  │ (Backend + Engine)
│   Scaling   │
└──────┬──────┘
       │
┌──────▼──────┐
│   RDS PG    │ (Database)
└─────────────┘

┌─────────────┐
│  ElastiCache│ (Redis)
└─────────────┘
```

### 1. Database Setup

Create RDS PostgreSQL instance:
```bash
aws rds create-db-instance \
  --db-instance-identifier startup-planner-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20
```

### 2. Redis Setup

Create ElastiCache cluster:
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id startup-planner-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

### 3. Backend Deployment

Build and push Docker image:
```bash
cd backend
docker build -t startup-planner-backend .
docker tag startup-planner-backend:latest <ecr-repo>:latest
docker push <ecr-repo>:latest
```

Create EC2 instance and deploy:
```bash
# SSH into EC2
ssh ec2-user@<instance-ip>

# Pull and run
docker pull <ecr-repo>:latest
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL=<rds-url> \
  -e REDIS_URL=<elasticache-url> \
  -e JWT_SECRET=<secret> \
  <ecr-repo>:latest
```

### 4. Frontend Deployment

Build and deploy to S3:
```bash
cd frontend
npm run build

aws s3 sync dist/ s3://startup-planner-frontend/
aws cloudfront create-invalidation \
  --distribution-id <dist-id> \
  --paths "/*"
```

### 5. SSL Certificate

```bash
aws acm request-certificate \
  --domain-name startupmodelplanner.com \
  --validation-method DNS
```

### 6. Load Balancer Setup

Create Application Load Balancer:
```bash
aws elbv2 create-load-balancer \
  --name startup-planner-alb \
  --subnets <subnet-ids> \
  --security-groups <sg-id>
```

## Environment Variables (Production)

### Backend
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/db
REDIS_URL=redis://elasticache-endpoint:6379
JWT_SECRET=<strong-secret>
CORS_ORIGIN=https://startupmodelplanner.com
AWS_REGION=us-east-1
S3_BUCKET_NAME=startup-planner-reports
```

### Frontend
```env
VITE_API_URL=https://api.startupmodelplanner.com
```

## Monitoring

### CloudWatch Alarms

```bash
# CPU Utilization
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu \
  --metric-name CPUUtilization \
  --threshold 80

# Error Rate
aws cloudwatch put-metric-alarm \
  --alarm-name high-errors \
  --metric-name 5XXError \
  --threshold 10
```

### Logging

- Application logs: CloudWatch Logs
- Access logs: ALB logs to S3
- Error tracking: Sentry integration

## Backup Strategy

### Database Backups
- Automated daily snapshots (RDS)
- Retention: 7 days
- Manual snapshots before major updates

### Redis Backups
- Daily snapshots to S3
- Point-in-time recovery enabled

## Scaling

### Horizontal Scaling
```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name startup-planner-asg \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2
```

### Vertical Scaling
- Database: Upgrade RDS instance class
- Cache: Upgrade ElastiCache node type

## Cost Optimization

Estimated monthly costs:
- EC2 (t3.small × 2): $30
- RDS (db.t3.micro): $15
- ElastiCache (cache.t3.micro): $12
- S3 + CloudFront: $5
- **Total: ~$62/month**

## Security Checklist

- [ ] Enable AWS WAF on ALB
- [ ] Configure Security Groups (least privilege)
- [ ] Enable RDS encryption at rest
- [ ] Use AWS Secrets Manager for credentials
- [ ] Enable CloudTrail for audit logs
- [ ] Configure VPC with private subnets
- [ ] Enable MFA for AWS root account
- [ ] Regular security patches and updates

## Rollback Procedure

1. Keep previous Docker image tagged
2. Revert ALB target group to previous version
3. Restore database from snapshot if needed
4. Invalidate CloudFront cache

## Health Checks

- Backend: `GET /health`
- Engine: `GET /health`
- Database: Connection pool status
- Redis: Ping command

## Support

For deployment issues:
- Check CloudWatch Logs
- Review ALB access logs
- Verify Security Group rules
- Test database connectivity
