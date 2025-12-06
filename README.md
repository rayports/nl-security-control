# Natural Language Security Control

A full-stack web application that allows users to control a security system using natural language commands instead of traditional REST API calls.

## TL;DR Quickstart

```bash
# Build and start all services
docker compose up --build

# Open frontend in browser
http://localhost:3005

# Health check
curl http://localhost:8080/healthz
```

## Project Overview

This system provides a natural language interface for managing a security system. Users can interact with the system using plain English commands like "arm the system" or "add user John with pin 4321" instead of learning REST API endpoints.

### Key Features

- **Natural Language Processing**: Rule-based intent classification and entity extraction
- **Security System Control**: Arm/disarm system in different modes (away, home, stay)
- **User Management**: Add, remove, and list users with PIN-based access
- **PIN Masking**: Automatic PIN masking for security (e.g., `****21` instead of `4321`)
- **Structured Logging**: Request correlation IDs for tracing
- **Comprehensive Testing**: Unit, integration, and E2E tests

### Architecture Summary

- **Backend**: Node.js/Express REST API with NLP layer for command interpretation
- **Frontend**: React SPA with real-time command execution and result display
- **NLP Engine**: Rule-based intent classifier with entity extraction (name, PIN, mode, time)

## Tech Stack

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **NLP**: Custom rule-based intent classifier
- **Time Parsing**: chrono-node
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Build Tool**: react-scripts (Create React App)
- **Testing**: Jest + React Testing Library

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: nginx (for frontend)
- **E2E Testing**: Playwright

## Backend API Documentation

### REST Endpoints

All REST endpoints are prefixed with `/api`.

#### POST `/api/arm-system`

Arm the security system.

**Request Body:**
```json
{
  "mode": "away"  // Optional: "away" | "home" | "stay" (default: "away")
}
```

**Response:**
```json
{
  "success": true,
  "state": {
    "armed": true,
    "mode": "away"
  }
}
```

#### POST `/api/disarm-system`

Disarm the security system.

**Request Body:** (empty)

**Response:**
```json
{
  "success": true,
  "state": {
    "armed": false,
    "mode": "away"
  }
}
```

#### POST `/api/add-user`

Add a new user to the system.

**Request Body:**
```json
{
  "name": "John",
  "pin": "4321",
  "start_time": null,  // Optional: ISO 8601 date string
  "end_time": null,    // Optional: ISO 8601 date string
  "permissions": []    // Optional: array of permission strings
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "name": "John",
    "pin": "****21",  // Masked PIN
    "start_time": null,
    "end_time": null,
    "permissions": []
  }
}
```

#### POST `/api/remove-user`

Remove a user from the system.

**Request Body:**
```json
{
  "identifier": "John"  // User name or PIN
}
```

**Response:**
```json
{
  "success": true,
  "message": "User removed successfully",
  "user": {
    "name": "John",
    "pin": "****21"  // Masked PIN
  }
}
```

#### GET `/api/list-users`

List all users in the system.

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "name": "John",
      "pin": "****21",  // Masked PIN
      "start_time": null,
      "end_time": null,
      "permissions": []
    }
  ]
}
```

### Natural Language Endpoint

#### POST `/nl/execute`

Execute a natural language command.

**Request Body:**
```json
{
  "text": "arm the system to away mode"
}
```

**Response:**
```json
{
  "text": "arm the system to away mode",
  "interpretation": {
    "intent": "ARM_SYSTEM",
    "entities": {
      "mode": "away"
    }
  },
  "api_call": {
    "endpoint": "/api/arm-system",
    "method": "POST",
    "payload": {
      "mode": "away"
    }
  },
  "response": {
    "success": true,
    "state": {
      "armed": true,
      "mode": "away"
    }
  }
}
```

### Health Check

#### GET `/healthz`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Example NL Commands

The system supports various phrasings for each intent:

### Arm System
- "arm the system"
- "arm the system to away mode"
- "turn on the alarm"
- "activate security system"

### Disarm System
- "disarm the system"
- "disarm"
- "turn off the alarm"
- "deactivate security"

### Add User
- "add user John with pin 4321"
- "create user Alice with pin 9876"
- "register user Bob with pin 1234"

### Remove User
- "remove user John"
- "delete user Alice"
- "unregister user Bob"

### List Users
- "show me all users"
- "list users"
- "display all users"
- "get users"

## Development Instructions

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Running Backend Locally

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:8080` (configurable via `PORT` environment variable).

### Running Frontend Locally

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` (development server).

### Running Unit Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Running Integration Tests

**Backend:**
```bash
cd backend
npm test -- tests/integration
```

### Running E2E Tests

**Prerequisites:** Ensure the app is running via `docker compose up -d`

```bash
cd e2e
npm install
npx playwright install chromium  # First time only
npm test
```

**Run specific E2E tests:**
```bash
npx playwright test arm-system
npx playwright test add-user-and-list
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ CommandInput │  │ ResultsDisplay│  │ ErrorDisplay │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                  │
│                    ┌───────▼────────┐                         │
│                    │   api.js      │                         │
│                    │  (fetch API)  │                         │
│                    └───────┬────────┘                         │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTP
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      Backend (Express)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │correlationId │  │requestLogger │  │errorHandler │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                      Routes Layer                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │  /api/*      │  │  /nl/execute │  │  /healthz    │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────┘ │  │
│  └─────────┼──────────────────┼──────────────────────────┘  │
│            │                  │                               │
│  ┌─────────▼──────────┐  ┌───▼───────────────────────────┐  │
│  │  Service Layer      │  │    NLP Service Layer          │  │
│  │  ┌──────────────┐   │  │  ┌──────────────┐            │  │
│  │  │user.service  │   │  │  │nlp.service   │            │  │
│  │  │system.service│   │  │  │intentClassifier│          │  │
│  │  └──────┬───────┘   │  │  └──────┬───────┘            │  │
│  └─────────┼────────────┘  └──────────┼────────────────────┘  │
│            │                         │                        │
│  ┌─────────▼─────────────────────────▼────────────────────┐  │
│  │              Data Layer                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ User Model   │  │SystemState   │  │inMemoryStore │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

## Design Decisions

### Rule-Based NLP (Not LLM-Based)

**Why:** 
- Predictable and deterministic behavior
- No external API dependencies or costs
- Fast execution (no network latency)
- Full control over intent classification logic
- Easy to debug and test

**Trade-offs:**
- Requires explicit pattern matching rules
- Less flexible than LLM-based approaches
- Manual maintenance of intent patterns

### Clean Separation of Services

**Why:**
- Single Responsibility Principle
- Easier to test individual components
- Better code organization and maintainability
- Clear boundaries between layers (routes → services → models → storage)

### In-Memory Store

**Why:**
- Simplicity for MVP/demonstration
- No database setup required
- Fast read/write operations
- Sufficient for proof-of-concept

**Trade-offs:**
- Data is lost on server restart
- Not suitable for production without persistence layer
- No data durability guarantees

### Structured Logging with Correlation IDs

**Why:**
- Request tracing across services
- Easier debugging of distributed requests
- Better observability
- Industry best practice for microservices

### PIN Masking

**Why:**
- Security best practice
- Prevents accidental exposure of sensitive data
- Shows partial information (last 2 digits) for verification
- Different masking levels for logs vs. API responses

## Assumptions / Limitations

### Assumptions

1. **User Intent**: Users will use relatively standard phrasings for commands
2. **PIN Format**: All PINs are exactly 4 digits
3. **User Names**: User names are simple strings (no special validation)
4. **Single Instance**: System runs as a single instance (no clustering)
5. **Network**: Frontend and backend are on the same network or accessible via localhost

### Limitations

1. **No Persistence**: All data is stored in memory and lost on restart
2. **No Authentication**: No user authentication or authorization
3. **Limited NLP**: Rule-based NLP may not handle all command variations
4. **No Rate Limiting**: API endpoints have no rate limiting
5. **No Validation**: Limited input validation on some endpoints
6. **Single Language**: Only supports English commands
7. **No Time Zones**: Time parsing doesn't handle timezone conversions
8. **No Concurrent Safety**: In-memory store is not thread-safe (Node.js is single-threaded, but async operations could cause issues)

## How to Reset the System During Testing

### Option 1: Restart Backend Container

```bash
docker compose restart backend
```

This will reset the in-memory store (all users and system state).

### Option 2: Stop and Start Containers

```bash
docker compose down
docker compose up -d
```

### Option 3: Manual API Calls

You can manually reset by:
1. Disarming the system: `POST /api/disarm-system`
2. Removing all users: `POST /api/remove-user` for each user

### Option 4: During E2E Tests

E2E tests are designed to be self-contained. Each test sets up its own state and doesn't depend on previous tests. However, if you need a clean slate:

```bash
docker compose restart backend
```

## How to Stop Containers

### Stop All Services

```bash
docker compose down
```

### Stop and Remove Volumes (if any)

```bash
docker compose down -v
```

### Stop Specific Service

```bash
docker compose stop backend
docker compose stop frontend
```

### View Running Containers

```bash
docker compose ps
```

### View Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs backend
docker compose logs frontend

# Follow logs
docker compose logs -f
```

## Additional Information for Evaluation

### Project Structure

```
nl-security-control/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── routes/      # API and NL routes
│   │   ├── services/    # Business logic and NLP
│   │   ├── models/      # Data models
│   │   ├── middleware/   # Express middleware
│   │   ├── storage/     # In-memory data store
│   │   └── utils/       # Utility functions
│   ├── tests/           # Jest tests (unit + integration)
│   └── Dockerfile
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API client
│   │   └── utils/     # Constants and utilities
│   ├── tests/          # React component tests
│   └── Dockerfile
├── e2e/                # Playwright E2E tests
│   ├── tests/          # E2E test specs
│   └── playwright.config.js
├── docs/               # Project documentation
├── docker-compose.yml  # Multi-container orchestration
└── README.md
```

### Testing Coverage

- **Backend Unit Tests**: Utilities, NLP layer, services, models
- **Backend Integration Tests**: HTTP endpoints, NL execution
- **Frontend Unit Tests**: React components
- **E2E Tests**: Full user flows (arm, disarm, add user, remove user, list users, error handling)

### Environment Variables

**Backend:**
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment mode (default: development)

**Frontend:**
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8080)

### Performance Considerations

- In-memory store provides O(1) lookups
- Rule-based NLP is very fast (no network calls)
- Frontend uses React for efficient rendering
- Docker multi-stage builds minimize image sizes

### Security Considerations

- PINs are masked in all API responses
- No authentication/authorization (for demo purposes)
- CORS enabled for frontend-backend communication
- Input validation on critical endpoints

### Future Enhancements

Potential improvements for production:
- Database persistence (PostgreSQL, MongoDB)
- User authentication and authorization
- Rate limiting and API throttling
- Enhanced NLP with machine learning
- WebSocket support for real-time updates
- Multi-language support
- Audit logging
- Configuration management
- Health check improvements

---

## License

This project is a demonstration/portfolio project.

## Contributing

This is a demonstration project. For questions or issues, please refer to the project documentation in `/docs`.

