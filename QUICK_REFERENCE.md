# Quick Reference Guide

## 🚀 Common Commands

### Development

```bash
# Start everything
npm run dev

# Start individual services
npm run dev --workspace=frontend
npm run dev --workspace=backend
npm run dev --workspace=recommendation-engine

# Install dependencies
npm run install:all

# Docker operations
npm run docker:up      # Start containers
npm run docker:down    # Stop containers
```

### Database

```bash
cd backend

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### Testing

```bash
# Run all tests
npm run test

# Run specific workspace tests
npm run test --workspace=backend
npm run test --workspace=frontend

# Run with coverage
npm run test -- --coverage
```

### Build

```bash
# Build all
npm run build

# Build specific workspace
npm run build --workspace=frontend
npm run build --workspace=backend
```

---

## 🌐 URLs & Ports

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:5000 | 5000 |
| Recommendation Engine | http://localhost:5001 | 5001 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |
| Prisma Studio | http://localhost:5555 | 5555 |

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login
POST   /api/auth/logout        # Logout
GET    /api/auth/me            # Get current user
POST   /api/auth/refresh       # Refresh token
```

### Questionnaire
```
POST   /api/questionnaire      # Create questionnaire
GET    /api/questionnaire/:id  # Get by ID
PUT    /api/questionnaire/:id  # Update
DELETE /api/questionnaire/:id  # Delete
GET    /api/questionnaire/user/all  # Get user's questionnaires
```

### Recommendations
```
POST   /api/recommendations/generate     # Generate recommendation
GET    /api/recommendations/:id          # Get by ID
GET    /api/recommendations/models/all   # Get all models
GET    /api/recommendations/models/:slug # Get model by slug
```

### Analytics
```
POST   /api/analytics/track      # Track event
GET    /api/analytics/dashboard  # Get dashboard data
```

### User
```
GET    /api/users/profile  # Get profile
PUT    /api/users/profile  # Update profile
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://planner_user:planner_pass_dev@localhost:5432/startup_planner
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
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

## 🗄️ Database Tables

```
users                 # User accounts
sessions              # Active sessions
questionnaires        # User questionnaires (24 params)
recommendations       # Generated recommendations
reports               # PDF reports
analytics_events      # Event tracking
business_models       # 8 business models
```

---

## 📊 Business Models

| Slug | Name | Cost | Time to Revenue |
|------|------|------|-----------------|
| d2c | Direct-to-Consumer | $$$ | 3-6 months |
| subscription | Subscription Commerce | $$ | 1-3 months |
| affiliate | Affiliate Marketing | $ | 4-12 months |
| dropshipping | Dropshipping | $ | 1-2 months |
| marketplace | Marketplace Selling | $$ | 2-4 months |
| social-commerce | Social Commerce | $ | 1-3 months |
| digital-products | Digital Products/SaaS | $$ | 2-5 months |
| white-label | White Label | $$$ | 4-8 months |

---

## 🎯 Questionnaire Parameters (24)

### Financial (6)
- startupBudget
- monthlyBurnTolerance
- targetARR
- timeToProfitability
- existingRevenue
- maxCAC

### Operational (6)
- inventoryWillingness (1-5)
- logisticsCapability (1-5)
- teamSize
- hoursPerWeek
- supplierAccess (boolean)
- warehouseAvailability (boolean)

### Market (6)
- targetGeography
- nicheType
- businessType (B2B/B2C/B2B2C)
- competitionLevel (1-5)
- existingAudienceSize
- brandRecognition (1-5)

### Skills (6)
- techStackProficiency (1-5)
- contentCreationAbility (1-5)
- seoSemExperience (1-5)
- designSkills (1-5)
- salesExperience (1-5)
- dataAnalysisCapability (1-5)

---

## 🧮 Scoring Algorithm

### Category Weights
```
Financial:    35%
Operational:  25%
Market:       25%
Skills:       15%
```

### Score Range
```
0-100%  = Match percentage
60-95%  = Confidence level
```

### Processing
```
Average: <50ms
Max:     <200ms
```

---

## 🐛 Troubleshooting

### Port in use
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### Database connection failed
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules */node_modules
npm run install:all
```

### Prisma errors
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## 📦 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart [service]

# Rebuild service
docker-compose up -d --build [service]

# Remove volumes
docker-compose down -v

# Execute command in container
docker-compose exec [service] [command]
```

---

## 🔐 Authentication Flow

```
1. User registers/logs in
2. Backend generates JWT token (1-hour expiry)
3. Token stored in Zustand + localStorage
4. Token sent in Authorization header
5. Backend validates token on protected routes
```

---

## 📈 Success Metrics

| Metric | Target |
|--------|--------|
| User Rating | 4.5+/5.0 |
| Completion Rate | >75% |
| Response Time | <2s p95 |
| Uptime | 99.5% |
| Return Users | >60% @ 30 days |

---

## 🎨 UI Components

### Pages
- HomePage
- QuestionnairePage (4 steps)
- ResultsPage
- DashboardPage
- ModelsPage
- LoginPage
- RegisterPage
- NotFoundPage

### Components
- Layout (Header + Footer)
- More to be added...

---

## 🔄 State Management

### authStore
```javascript
{
  user: { id, email, name },
  token: "jwt_token",
  setAuth(user, token),
  logout(),
  updateUser(userData)
}
```

### questionnaireStore
```javascript
{
  currentStep: 0-3,
  questionnaireId: "uuid",
  answers: { ...24 params },
  setStep(step),
  nextStep(),
  prevStep(),
  updateAnswers(newAnswers),
  reset()
}
```

---

## 📚 Documentation

- [README.md](README.md) - Project overview
- [GETTING_STARTED.md](GETTING_STARTED.md) - Setup guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete summary
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [docs/API.md](docs/API.md) - API documentation
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment guide
- [docs/RECOMMENDATION_ENGINE.md](docs/RECOMMENDATION_ENGINE.md) - Algorithm docs

---

## 🆘 Getting Help

1. Check documentation in `/docs`
2. Review troubleshooting section
3. Check GitHub issues
4. Ask in team chat
5. Review code comments

---

## ✅ Pre-Development Checklist

- [ ] Node.js 20+ installed
- [ ] Docker Desktop running
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Environment files created
- [ ] Database migrated and seeded
- [ ] All services start successfully
- [ ] Can access frontend at localhost:3000
- [ ] Can register and login
- [ ] Can complete questionnaire

---

**Quick Start**: `./scripts/setup-local.sh && npm run dev`

**Version**: 1.0.0  
**Last Updated**: April 17, 2026
