<div align="center">

# ✨ ModelForge — AI-Powered E-Commerce Business Model Recommender

<img src="https://img.shields.io/badge/Status-Production_Ready-00C851?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/AI_Engine-Groq_LLM-845ef7?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/Stack-React_+_Node_+_PostgreSQL-5c7cfa?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/Models-8_Business_Types-ff6b6b?style=for-the-badge&labelColor=0D1117" />

<br/>

**A $50,000-grade AI consulting platform** that analyzes 24 entrepreneurial parameters and generates personalized e-commerce business model recommendations using **Llama 3.3 70B** via Groq.

[🚀 Getting Started](#-quick-start) · [🏗️ Architecture](#%EF%B8%8F-architecture) · [📊 Features](#-features) · [🧠 AI Engine](#-ai-engine) · [📸 Screenshots](#-screenshots)

</div>

---

## 🎯 What Is This?

ModelForge is an **intelligent recommendation engine** that helps aspiring entrepreneurs discover their optimal e-commerce business model. Instead of generic advice, it performs deep analysis across four weighted dimensions:

| Dimension | Weight | What It Measures |
|-----------|--------|------------------|
| 💰 **Financial Fit** | 35% | Startup budget, monthly burn tolerance, target revenue, CAC limits |
| ⚙️ **Operational Readiness** | 25% | Inventory willingness, logistics capability, team size, time commitment |
| 📈 **Market Position** | 25% | Geography, niche, competition level, audience size, brand recognition |
| 🎯 **Skills Match** | 15% | Tech proficiency, content creation, SEO, design, sales, data analysis |

---

## 📊 Features

### 🔮 AI-Powered Analysis
- **Groq LLM Integration** — Uses `llama-3.3-70b-versatile` for genuinely intelligent scoring
- **24-Parameter Questionnaire** — Comprehensive profiling across finance, operations, market, and skills
- **Personalized Reasoning** — Every recommendation includes custom pros, cons, and strategic rationale
- **Real-Time Scoring** — Sub-5-second analysis of all 8 business models simultaneously

### 🎨 Premium UI/UX
- **Glassmorphism Design System** — Translucent surfaces, gradient accents, and layered depth
- **Custom Cursor Animation** — Ambient glow spotlight with spring-physics and shimmer particles
- **Framer Motion Animations** — Smooth entrance animations, page transitions, and micro-interactions
- **Radar Chart Visualization** — Chart.js-powered suitability analysis with 6-axis breakdown
- **Fully Responsive** — Pixel-perfect on desktop, tablet, and mobile

### 🛡️ Production-Grade Backend
- **JWT Authentication** — Secure session management with token refresh
- **PostgreSQL + Prisma ORM** — Type-safe database with migration support
- **Redis Caching** — Session and recommendation caching for performance
- **Docker Compose** — One-command infrastructure deployment
- **Joi Validation** — Strict request payload validation on every endpoint

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
│              Port 3000 · Tailwind · Framer Motion            │
│  ┌──────────┬──────────────┬──────────┬──────────────────┐   │
│  │  Home    │ Questionnaire│  Models  │    Results/Dash   │   │
│  │  Page    │   (24 params)│  Browser │   (Radar + AI)    │   │
│  └──────────┴──────────────┴──────────┴──────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────────┐
│                  BACKEND API (Node + Express)                │
│               Port 5000 · JWT · Prisma · Joi                 │
│  ┌────────────┬──────────────┬────────────┬──────────────┐   │
│  │   Auth     │ Questionnaire│  Recommend │   Analytics   │   │
│  │ Controller │  Controller  │ Controller │  Controller   │   │
│  └────────────┴──────────────┴─────┬──────┴──────────────┘   │
└────────────────┬───────────────────┼────────────────────────┘
                 │                   │ HTTP
     ┌───────────▼──────┐  ┌────────▼──────────────────────┐
     │   PostgreSQL     │  │  RECOMMENDATION ENGINE         │
     │   Port 5433      │  │  Port 5001 · Groq SDK          │
     │   + Redis 6379   │  │  Llama 3.3 70B · JSON Mode     │
     └──────────────────┘  └────────────────────────────────┘
```

---

## 🧠 AI Engine

The recommendation engine uses **expert-level prompt engineering** with Groq's high-performance inference API:

```javascript
// System prompt injects full model knowledge base
// with startup costs, risk factors, ideal profiles

// Scoring enforces strict differentiation:
// - Minimum 30-point spread between #1 and #8
// - Heavy penalty for unmet critical requirements
// - References user's ACTUAL data points in reasoning

// Output: Strict JSON with customReasoning, customPros, customCons
```

### Supported Models

| # | Model | Startup Cost | Time to Revenue | Complexity |
|---|-------|-------------|-----------------|------------|
| 1 | 🚚 **Dropshipping** | $500-$2K | 1-2 months | ⭐⭐ |
| 2 | 🔗 **Affiliate Marketing** | $100-$1K | 4-12 months | ⭐⭐ |
| 3 | 🏪 **Direct-to-Consumer (D2C)** | $10K-$50K | 3-6 months | ⭐⭐⭐⭐ |
| 4 | 🛒 **Marketplace Selling** | $1K-$5K | 1-3 months | ⭐⭐ |
| 5 | 🏷️ **White Label / Private Label** | $5K-$25K | 3-6 months | ⭐⭐⭐⭐ |
| 6 | 📦 **Subscription Commerce** | $5K-$15K | 2-4 months | ⭐⭐⭐ |
| 7 | 💻 **Digital Products / SaaS** | $500-$5K | 2-5 months | ⭐⭐⭐ |
| 8 | 📱 **Social Commerce** | $500-$3K | 1-3 months | ⭐⭐ |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Docker** + Docker Compose (for PostgreSQL & Redis)
- **Groq API Key** → [Get one free at console.groq.com](https://console.groq.com)

### 1. Clone & Install

```bash
git clone https://github.com/kanglesoham11-code/business-model-recommendation.git
cd business-model-recommendation

# Install all dependencies
cd backend && npm install && cd ..
cd recommendation-engine && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Environment Setup

Create `.env` files in three directories:

**`backend/.env`**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://planner_user:planner_pass_dev@localhost:5433/startup_planner
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
RECOMMENDATION_ENGINE_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:3000
```

**`recommendation-engine/.env`**
```env
NODE_ENV=development
PORT=5001
GROQ_API_KEY=your_groq_api_key_here
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Infrastructure

```bash
docker-compose up -d    # PostgreSQL + Redis
```

### 4. Initialize Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

### 5. Launch All Services

Open **three terminals**:

```bash
# Terminal 1 — Recommendation Engine
cd recommendation-engine && npm run dev

# Terminal 2 — Backend API
cd backend && npm run dev

# Terminal 3 — Frontend
cd frontend && npm run dev
```

### 6. Open Browser

Navigate to **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
business-model-recommendation/
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/          # Layout, CustomCursor
│   │   ├── pages/               # Home, Models, Questionnaire, Results, Dashboard
│   │   ├── store/               # Zustand auth store
│   │   └── utils/               # API client (Axios)
│   └── index.html
│
├── backend/                     # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/         # Auth, Questionnaire, Recommendation
│   │   ├── middleware/           # JWT auth middleware
│   │   ├── routes/              # Express route definitions
│   │   └── utils/               # Logger
│   └── prisma/
│       ├── schema.prisma        # Database schema
│       └── seed.js              # 8 business model seeds
│
├── recommendation-engine/       # Groq LLM Microservice
│   └── src/
│       ├── engine/
│       │   └── scoringAlgorithm.js  # LLM prompt + Groq SDK
│       └── server.js
│
├── docker-compose.yml           # PostgreSQL + Redis
└── README.md
```

---

## 🔧 Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 · Vite 5 · Tailwind CSS · Framer Motion · Chart.js · Zustand |
| **Backend** | Node.js · Express 4 · Prisma ORM · Joi · JWT · Winston Logger |
| **AI Engine** | Groq SDK · Llama 3.3 70B Versatile · JSON Mode |
| **Database** | PostgreSQL 15 · Redis 7 |
| **Infra** | Docker Compose · Nodemon · ESLint |

</div>

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login with credentials |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/me` | Get current user |

### Questionnaire
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/questionnaire` | Submit questionnaire |
| `GET` | `/api/questionnaire/:id` | Get by ID |
| `GET` | `/api/questionnaire/user/all` | Get user's questionnaires |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/recommendations/generate` | Generate AI recommendation |
| `POST` | `/api/recommendations/simulate` | Direct model analysis |
| `GET` | `/api/recommendations/:id` | Get recommendation |
| `GET` | `/api/recommendations/models/all` | List all business models |

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

**Built with precision. Powered by AI.**

<sub>© 2026 ModelForge. Engineered for excellence.</sub>

</div>
