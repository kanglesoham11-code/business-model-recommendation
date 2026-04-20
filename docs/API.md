# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.startupmodelplanner.com/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user profile (requires authentication).

---

### Questionnaire

#### POST /questionnaire
Create a new questionnaire.

**Request Body:**
```json
{
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
}
```

#### GET /questionnaire/:id
Get questionnaire by ID.

#### PUT /questionnaire/:id
Update questionnaire.

#### GET /questionnaire/user/all
Get all questionnaires for authenticated user.

---

### Recommendations

#### POST /recommendations/generate
Generate recommendation from questionnaire.

**Request Body:**
```json
{
  "questionnaireId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendation": {
      "id": "uuid",
      "topModels": [
        {
          "model": "d2c",
          "score": 87.5,
          "confidence": 92.3
        }
      ],
      "allScores": {},
      "processingTime": 45,
      "engineVersion": "1.0.0"
    }
  }
}
```

#### GET /recommendations/:id
Get recommendation by ID.

#### GET /recommendations/models/all
Get all business models.

#### GET /recommendations/models/:slug
Get specific business model details.

---

### Analytics

#### POST /analytics/track
Track analytics event.

**Request Body:**
```json
{
  "eventType": "questionnaire_complete",
  "eventData": {
    "duration": 300
  }
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

- 100 requests per minute per IP
- Authenticated users: 200 requests per minute
