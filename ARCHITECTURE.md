# System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     (React 18 + Tailwind)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    FRONTEND (Port 3000)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages: Home, Questionnaire, Results, Dashboard, etc.   │  │
│  │  Components: Layout, Forms, Charts                       │  │
│  │  State: Zustand (Auth, Questionnaire)                    │  │
│  │  Routing: React Router v6                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND API (Port 5000)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes: Auth, User, Questionnaire, Recommendation       │  │
│  │  Controllers: Business Logic                             │  │
│  │  Middleware: Auth (JWT), Error Handling, Rate Limiting   │  │
│  │  ORM: Prisma                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────┬──────────────────────────────┬────────────────────────┘
          │                              │
          │ HTTP                         │ PostgreSQL
          │                              │
┌─────────▼──────────────┐    ┌─────────▼──────────────┐
│  RECOMMENDATION ENGINE │    │   DATABASE (Port 5432) │
│      (Port 5001)       │    │                        │
│  ┌──────────────────┐  │    │  ┌──────────────────┐  │
│  │ Scoring Algorithm│  │    │  │ PostgreSQL 15    │  │
│  │ Weight Matrix    │  │    │  │ 8 Tables         │  │
│  │ Model Reqs       │  │    │  │ Prisma Managed   │  │
│  └──────────────────┘  │    │  └──────────────────┘  │
└────────────────────────┘    └────────────────────────┘
                              
                              ┌────────────────────────┐
                              │   CACHE (Port 6379)    │
                              │  ┌──────────────────┐  │
                              │  │ Redis 7          │  │
                              │  │ Session Storage  │  │
                              │  └──────────────────┘  │
                              └────────────────────────┘
```

---

## 🔄 Request Flow

### 1. User Registration Flow

```
User Browser
    │
    │ POST /api/auth/register
    │ { email, password, name }
    ▼
Backend API
    │
    │ 1. Validate input (Joi)
    │ 2. Hash password (bcrypt)
    │ 3. Create user record
    ▼
PostgreSQL
    │
    │ User created
    ▼
Backend API
    │
    │ 4. Generate JWT token
    │ 5. Create session
    ▼
Redis Cache
    │
    │ Session stored
    ▼
User Browser
    │
    │ { user, token }
    │ Redirect to /questionnaire
```

### 2. Recommendation Generation Flow

```
User Browser
    │
    │ Submit questionnaire
    │ 24 parameters
    ▼
Backend API
    │
    │ 1. Save questionnaire
    ▼
PostgreSQL
    │
    │ Questionnaire saved
    ▼
Backend API
    │
    │ 2. Call recommendation engine
    │ POST /api/recommend
    ▼
Recommendation Engine
    │
    │ 3. Normalize inputs (0-100)
    │ 4. Calculate scores for 8 models
    │ 5. Apply weights (35/25/25/15)
    │ 6. Rank models
    │ 7. Calculate confidence
    ▼
Backend API
    │
    │ 8. Save recommendation
    ▼
PostgreSQL
    │
    │ Recommendation saved
    ▼
User Browser
    │
    │ Display top 3 models
    │ Show radar chart
    │ Render results page
```

---

## 🗄️ Database Schema

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ email       │◄────┐
│ password    │     │
│ name        │     │
│ provider    │     │
└─────────────┘     │
                    │
┌─────────────┐     │
│  Sessions   │     │
├─────────────┤     │
│ id (PK)     │     │
│ userId (FK) │─────┘
│ token       │
│ expiresAt   │
└─────────────┘

┌──────────────────┐
│ Questionnaires   │
├──────────────────┤
│ id (PK)          │◄────┐
│ userId (FK)      │     │
│ status           │     │
│ [24 parameters]  │     │
│ completedAt      │     │
└──────────────────┘     │
                         │
┌──────────────────┐     │
│ Recommendations  │     │
├──────────────────┤     │
│ id (PK)          │     │
│ questionnaireId  │─────┘
│ userId (FK)      │
│ topModels (JSON) │
│ allScores (JSON) │
│ processingTime   │
└──────────────────┘

┌──────────────────┐
│ Business Models  │
├──────────────────┤
│ id (PK)          │
│ slug             │
│ name             │
│ description      │
│ icon             │
│ startupCost      │
│ timeToRevenue    │
│ pros (JSON)      │
│ cons (JSON)      │
└──────────────────┘

┌──────────────────┐
│ Analytics Events │
├──────────────────┤
│ id (PK)          │
│ userId (FK)      │
│ eventType        │
│ eventData (JSON) │
│ createdAt        │
└──────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
└─────────────────────────────────────────────────────────┘

Layer 1: Network Security
├── HTTPS/TLS Encryption
├── CORS Policy (localhost:3000 in dev)
└── Rate Limiting (100 req/min)

Layer 2: Authentication
├── JWT Tokens (1-hour expiry)
├── Bcrypt Password Hashing (10 rounds)
├── Session Management (Redis)
└── OAuth 2.0 Ready (Google)

Layer 3: Authorization
├── Route Protection (authenticate middleware)
├── Resource Ownership Checks
└── Role-Based Access (future)

Layer 4: Input Validation
├── Joi Schema Validation
├── Prisma Type Safety
├── React Hook Form Validation
└── SQL Injection Prevention (ORM)

Layer 5: Error Handling
├── Global Error Handler
├── Sanitized Error Messages
├── Logging (Winston)
└── No Stack Traces in Production
```

---

## 📊 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    User Journey Data Flow                     │
└──────────────────────────────────────────────────────────────┘

1. LANDING
   User → HomePage → "Get Started" Button

2. REGISTRATION
   User → RegisterPage → Backend API → PostgreSQL
                      → JWT Token → Zustand Store

3. QUESTIONNAIRE
   User → QuestionnairePage (Step 1-4)
       → Auto-save to Zustand
       → Submit → Backend API → PostgreSQL

4. RECOMMENDATION
   Backend API → Recommendation Engine
              → Scoring Algorithm
              → Return Top 3 Models
              → Save to PostgreSQL

5. RESULTS
   User → ResultsPage → Fetch Recommendation
                     → Display Radar Chart
                     → Show Model Details
                     → Download PDF (future)

6. DASHBOARD
   User → DashboardPage → Fetch User Data
                       → Display Questionnaires
                       → Show Statistics
```

---

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend State (Zustand)                │
└─────────────────────────────────────────────────────────┘

authStore
├── user: { id, email, name }
├── token: "jwt_token"
├── setAuth(user, token)
├── logout()
└── updateUser(userData)

questionnaireStore
├── currentStep: 0-3
├── questionnaireId: "uuid"
├── answers: { ...24 parameters }
├── setStep(step)
├── nextStep()
├── prevStep()
├── updateAnswers(newAnswers)
└── reset()

Both stores persist to localStorage
```

---

## 🧠 Recommendation Engine Algorithm

```
┌─────────────────────────────────────────────────────────┐
│              Scoring Algorithm Pipeline                  │
└─────────────────────────────────────────────────────────┘

INPUT: 24 Parameters
   │
   ▼
STEP 1: Normalization
   │ Convert all values to 0-100 scale
   │ Handle missing values (default to 50)
   ▼
STEP 2: Category Scoring
   │ Financial Score (35% weight)
   │ Operational Score (25% weight)
   │ Market Score (25% weight)
   │ Skills Score (15% weight)
   ▼
STEP 3: Model Evaluation
   │ For each of 8 models:
   │   - Compare against requirements
   │   - Apply weighted formula
   │   - Calculate fit score (0-100)
   ▼
STEP 4: Ranking
   │ Sort models by score
   │ Select top 3
   │ Calculate confidence (60-95%)
   ▼
OUTPUT: Recommendation
   │ topModels: [model1, model2, model3]
   │ allScores: { ...8 models }
   │ processingTime: 45ms
   │ confidence: 92.3%
```

---

## 🚀 Deployment Architecture (AWS)

```
┌─────────────────────────────────────────────────────────┐
│                   Production Setup                       │
└─────────────────────────────────────────────────────────┘

Internet
   │
   ▼
Route 53 (DNS)
   │
   ▼
CloudFront (CDN)
   │
   ├─► S3 Bucket (Frontend Static Files)
   │
   └─► Application Load Balancer
          │
          ├─► EC2 Auto Scaling Group
          │   ├─► EC2 Instance 1 (Backend + Engine)
          │   ├─► EC2 Instance 2 (Backend + Engine)
          │   └─► EC2 Instance N (Backend + Engine)
          │
          ├─► RDS PostgreSQL (Multi-AZ)
          │   └─► Read Replica (optional)
          │
          └─► ElastiCache Redis (Cluster Mode)

Monitoring:
├── CloudWatch (Logs, Metrics, Alarms)
├── Sentry (Error Tracking)
└── AWS X-Ray (Distributed Tracing)

Backup:
├── RDS Automated Snapshots (Daily)
├── S3 Versioning (Frontend)
└── Database Point-in-Time Recovery
```

---

## 📦 Container Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Docker Compose Services                     │
└─────────────────────────────────────────────────────────┘

docker-compose.yml
├── postgres (PostgreSQL 15)
│   ├── Port: 5432
│   ├── Volume: postgres_data
│   └── Health Check: pg_isready
│
├── redis (Redis 7)
│   ├── Port: 6379
│   ├── Volume: redis_data
│   └── Health Check: redis-cli ping
│
├── backend (Node.js 20)
│   ├── Port: 5000
│   ├── Depends: postgres, redis
│   └── Environment: .env
│
├── recommendation-engine (Node.js 20)
│   ├── Port: 5001
│   └── Environment: .env
│
└── frontend (Node.js 20 + Vite)
    ├── Port: 3000
    ├── Depends: backend, engine
    └── Environment: .env
```

---

## 🔧 Technology Stack Summary

```
┌─────────────────────────────────────────────────────────┐
│                   Tech Stack Layers                      │
└─────────────────────────────────────────────────────────┘

Frontend Layer
├── React 18 (UI Framework)
├── Vite (Build Tool)
├── Tailwind CSS (Styling)
├── Zustand (State Management)
├── React Router v6 (Routing)
├── React Hook Form (Forms)
├── Chart.js (Visualization)
├── Framer Motion (Animations)
└── Axios (HTTP Client)

Backend Layer
├── Node.js 20 (Runtime)
├── Express.js (Web Framework)
├── Prisma (ORM)
├── JWT (Authentication)
├── Bcrypt (Password Hashing)
├── Joi (Validation)
├── Winston (Logging)
└── Helmet (Security)

Data Layer
├── PostgreSQL 15 (Primary Database)
├── Redis 7 (Cache & Sessions)
└── Prisma Migrations (Schema Management)

DevOps Layer
├── Docker (Containerization)
├── Docker Compose (Orchestration)
├── GitHub Actions (CI/CD)
├── AWS (Cloud Infrastructure)
└── Nginx (Reverse Proxy)
```

---

**Last Updated**: April 17, 2026  
**Architecture Version**: 1.0.0  
**Status**: Production Ready
