# Getting Started with Startup Model Planner

Welcome! This guide will help you set up and run the Startup Model Planner on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js 20+** - [Download](https://nodejs.org/)
- **npm 10+** - Comes with Node.js
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

### Optional
- **PostgreSQL 15** - If not using Docker
- **Redis 7** - If not using Docker
- **VS Code** - Recommended IDE

### Verify Installation

```bash
node --version    # Should be v20.x.x or higher
npm --version     # Should be 10.x.x or higher
docker --version  # Should be 20.x.x or higher
git --version     # Should be 2.x.x or higher
```

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/startup-model-planner.git
cd startup-model-planner

# 2. Run the setup script
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh

# 3. Start all services
npm run dev
```

That's it! The application should now be running.

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/startup-model-planner.git
cd startup-model-planner

# 2. Install root dependencies
npm install

# 3. Install workspace dependencies
npm run install:all

# 4. Set up environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp recommendation-engine/.env.example recommendation-engine/.env

# 5. Start Docker containers (PostgreSQL & Redis)
docker-compose up -d postgres redis

# 6. Wait for PostgreSQL to be ready (about 10 seconds)
sleep 10

# 7. Run database migrations
cd backend
npx prisma migrate dev --name init
npx prisma db seed
cd ..

# 8. Start all development servers
npm run dev
```

---

## 🌐 Access the Application

Once running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main web application |
| **Backend API** | http://localhost:5000 | REST API server |
| **Recommendation Engine** | http://localhost:5001 | Scoring microservice |
| **PostgreSQL** | localhost:5432 | Database (use any SQL client) |
| **Redis** | localhost:6379 | Cache server |

### Test the Setup

1. Open http://localhost:3000 in your browser
2. Click "Get Started" to begin the questionnaire
3. Fill out the form and submit
4. View your personalized recommendations!

---

## 📁 Project Structure

```
startup-model-planner/
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # State management
│   │   └── utils/        # Utilities & API client
│   └── package.json
│
├── backend/              # Express API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, etc.
│   │   └── utils/        # Helpers
│   ├── prisma/           # Database schema & migrations
│   └── package.json
│
├── recommendation-engine/ # Scoring algorithm
│   ├── src/
│   │   └── engine/       # Core algorithm logic
│   └── package.json
│
├── docs/                 # Documentation
├── scripts/              # Automation scripts
└── docker-compose.yml    # Container orchestration
```

---

## 🔧 Development Workflow

### Running Individual Services

```bash
# Frontend only
npm run dev --workspace=frontend

# Backend only
npm run dev --workspace=backend

# Recommendation engine only
npm run dev --workspace=recommendation-engine
```

### Database Management

```bash
# Open Prisma Studio (visual database editor)
cd backend
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-seed database
npx prisma db seed
```

### Docker Commands

```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart postgres

# Remove all containers and volumes
docker-compose down -v
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test --workspace=backend
npm run test --workspace=frontend

# Run tests in watch mode
npm run test -- --watch
```

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Questionnaire saves progress
- [ ] Recommendation generates successfully
- [ ] Results page displays correctly
- [ ] Dashboard shows user's questionnaires
- [ ] Business models page loads

---

## 🐛 Troubleshooting

### Port Already in Use

If you see "Port 3000/5000/5001 is already in use":

```bash
# Find and kill the process (macOS/Linux)
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
lsof -ti:5001 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules recommendation-engine/node_modules
npm run install:all
```

### Prisma Client Error

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Docker Issues

```bash
# Reset Docker completely
docker-compose down -v
docker system prune -a
docker-compose up -d
```

---

## 📝 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://planner_user:planner_pass_dev@localhost:5432/startup_planner
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_ENGINE_URL=http://localhost:5001
```

### Recommendation Engine (.env)

```env
NODE_ENV=development
PORT=5001
```

---

## 🎯 Common Tasks

### Create a New User

```bash
# Via API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Test the Recommendation Engine

```bash
curl -X POST http://localhost:5001/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "startupBudget": 10000,
    "monthlyBurnTolerance": 2000,
    "targetARR": 100000,
    "timeToProfitability": 12,
    "inventoryWillingness": 4,
    "logisticsCapability": 3,
    "teamSize": 2,
    "hoursPerWeek": 30,
    "businessType": "B2C",
    "techStackProficiency": 4,
    "contentCreationAbility": 3,
    "seoSemExperience": 2
  }'
```

### View Database

```bash
# Option 1: Prisma Studio (GUI)
cd backend
npx prisma studio

# Option 2: psql (CLI)
docker exec -it startup-planner-db psql -U planner_user -d startup_planner
```

---

## 📚 Next Steps

1. **Read the Documentation**
   - [API Documentation](docs/API.md)
   - [Deployment Guide](docs/DEPLOYMENT.md)
   - [Recommendation Engine](docs/RECOMMENDATION_ENGINE.md)

2. **Explore the Code**
   - Start with `frontend/src/App.jsx`
   - Check out `backend/src/server.js`
   - Review `recommendation-engine/src/engine/scoringAlgorithm.js`

3. **Make Your First Change**
   - Modify a component in `frontend/src/components/`
   - Add a new API endpoint in `backend/src/routes/`
   - Adjust scoring weights in `recommendation-engine/src/engine/weightMatrix.js`

4. **Join the Team**
   - Review open issues
   - Check the project board
   - Submit your first PR

---

## 🆘 Getting Help

- **Documentation**: Check the `/docs` folder
- **Issues**: Open a GitHub issue
- **Questions**: Ask in team chat
- **Bugs**: Report with reproduction steps

---

## ✅ Verification Checklist

Before starting development, verify:

- [ ] All services start without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5000/health
- [ ] Engine responds at http://localhost:5001/health
- [ ] Database connection works
- [ ] You can register a new user
- [ ] You can complete a questionnaire
- [ ] Recommendations generate successfully

---

**Happy Coding! 🚀**

If you encounter any issues, refer to the troubleshooting section or reach out to the team.
