# Natural Language Security Control - Project Structure

## Directory Tree

```
nl-security-control/
├── README.md
├── docker-compose.yml
├── .gitignore
├── .env.example
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── EXAMPLES.md
│   ├── LLM_INTEGRATION_PLAN.md
│   ├── POTENTIAL_ISSUES.md
│   ├── AI_WORKFLOW.md
│   ├── project_structure.md
│   ├── requirements.md
│   └── guides/
│       └── USAGE_GUIDE.md
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── jest.config.js
│   ├── src/
│   │   ├── index.js
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── correlationId.js
│   │   │   └── requestLogger.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── SystemState.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── api.routes.js
│   │   │   ├── nl.routes.js
│   │   │   └── health.routes.js
│   │   ├── services/
│   │   │   ├── nlp.service.js
│   │   │   ├── intentClassifier.js
│   │   │   ├── user.service.js
│   │   │   └── system.service.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── pinMasker.js
│   │   │   ├── timeParser.js
│   │   │   └── commandAliases.js
│   │   └── storage/
│   │       └── inMemoryStore.js
│   │
│   └── tests/
│       ├── unit/
│       │   ├── nlp.service.test.js
│       │   ├── intentClassifier.test.js
│       │   ├── user.service.test.js
│       │   ├── system.service.test.js
│       │   ├── pinMasker.test.js
│       │   └── timeParser.test.js
│       ├── integration/
│       │   ├── api.test.js
│       │   ├── nl.test.js
│       │   └── health.test.js
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── nginx.conf
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── CommandInput/
│   │   │   │   ├── CommandInput.js
│   │   │   │   └── CommandInput.css
│   │   │   ├── ResultsDisplay/
│   │   │   │   ├── ResultsDisplay.js
│   │   │   │   └── ResultsDisplay.css
│   │   │   ├── ExampleCommands/
│   │   │   │   ├── ExampleCommands.js
│   │   │   │   └── ExampleCommands.css
│   │   │   └── ErrorDisplay/
│   │   │       ├── ErrorDisplay.js
│   │   │       └── ErrorDisplay.css
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── constants.js
│   │
│   └── tests/
│       └── App.test.js
│
└── e2e/
    ├── package.json
    ├── playwright.config.js
    ├── tests/
    │   ├── arm-system.spec.js
    │   ├── disarm-system.spec.js
    │   ├── add-user.spec.js
    │   ├── remove-user.spec.js
    │   └── list-users.spec.js
    └── fixtures/
        └── commands.json
```

## File Descriptions

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation with overview, quickstart, and links to detailed docs |
| `docker-compose.yml` | Orchestrates backend and frontend services with proper networking, health checks, and volume mounts |
| `.gitignore` | Excludes node_modules, .env files, build artifacts, logs, and OS-specific files |
| `.env.example` | Template showing all required environment variables for the project |

### Documentation (`/docs`)

| File | Purpose |
|------|---------|
| `API.md` | Complete API reference with request/response examples for all endpoints |
| `ARCHITECTURE.md` | Technical design, decisions, limitations, and future enhancements |
| `DEVELOPMENT.md` | Development guide: running locally, testing, troubleshooting |
| `EXAMPLES.md` | Natural language command examples organized by intent |
| `LLM_INTEGRATION_PLAN.md` | Design plan for future LLM integration (not implemented - maintains offline capability) |
| `POTENTIAL_ISSUES.md` | Documented potential issues, priorities, and status |
| `AI_WORKFLOW.md` | Documentation of prompts used with AI coding assistants |
| `project_structure.md` | This file - detailed project structure and file descriptions |
| `requirements.md` | Original project requirements and specifications |

### Documentation Guides (`/docs/guides`)

| File | Purpose |
|------|---------|
| `USAGE_GUIDE.md` | Complete guide for running, testing, and using the system (includes UI usage, clickable history, and test instructions) |

### Backend (`/backend`)

#### Root Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build for Node.js backend with Alpine base for minimal image size |
| `.dockerignore` | Excludes node_modules, tests, .env, and development files from Docker context |
| `package.json` | Dependencies: express, winston, cors, uuid, chrono-node, jest, supertest |
| `jest.config.js` | Jest configuration for unit and integration tests with coverage reporting |
| `.env.example` | Backend-specific environment variables (PORT, LOG_LEVEL, NODE_ENV) |

#### Source Files (`/src`)

| File | Purpose |
|------|---------|
| `index.js` | Application entry point - starts HTTP server and handles graceful shutdown |
| `app.js` | Express app configuration - mounts middleware pipeline and routes |

#### Configuration (`/src/config`)

| File | Purpose |
|------|---------|
| `config.js` | Centralized configuration management from environment variables with validation and defaults |

#### Middleware (`/src/middleware`)

| File | Purpose |
|------|---------|
| `errorHandler.js` | Global error handler - catches all errors and formats consistent JSON responses |
| `correlationId.js` | Generates unique correlation ID per request for distributed tracing |
| `requestLogger.js` | Logs all incoming requests and outgoing responses with correlation ID |

#### Models (`/src/models`)

| File | Purpose |
|------|---------|
| `User.js` | User model class with validation (name, pin, start_time, end_time, permissions) |
| `SystemState.js` | System state model with validation (armed status, mode: away/home/stay) |

#### Routes (`/src/routes`)

| File | Purpose |
|------|---------|
| `index.js` | Route aggregator - imports and exports all route modules |
| `api.routes.js` | REST API routes: /api/arm-system, /api/disarm-system, /api/add-user, /api/remove-user, /api/list-users |
| `nl.routes.js` | Natural language endpoint: POST /nl/execute |
| `health.routes.js` | Health check endpoint: GET /healthz |

#### Services (`/src/services`)

| File | Purpose |
|------|---------|
| `nlp.service.js` | Main NLP orchestration - coordinates intent classification and entity extraction |
| `intentClassifier.js` | Intent classification logic - maps text to ARM_SYSTEM, DISARM_SYSTEM, ADD_USER, REMOVE_USER, LIST_USERS |
| `user.service.js` | User management business logic - add, remove, list users with validation |
| `system.service.js` | System state management - arm, disarm, get status |

#### Utilities (`/src/utils`)

| File | Purpose |
|------|---------|
| `logger.js` | Winston logger setup with structured JSON logging and correlation ID support |
| `pinMasker.js` | PIN masking utilities - masks PINs in logs (****) and responses (****34) |
| `timeParser.js` | Natural language time parsing using chrono-node - handles "today 5pm", "next Tuesday", etc. |
| `commandAliases.js` | Command alias mapping - maps creative phrases (e.g., "sesame open") to standard intents |

#### Storage (`/src/storage`)

| File | Purpose |
|------|---------|
| `inMemoryStore.js` | In-memory data store - Map for users (key: name or pin), object for system state |

#### Tests (`/tests`)

##### Unit Tests (`/tests/unit`)

| File | Purpose |
|------|---------|
| `nlp.service.test.js` | Tests for NLP orchestration logic |
| `intentClassifier.test.js` | Tests for intent classification with all command variations |
| `user.service.test.js` | Tests for user management business logic |
| `system.service.test.js` | Tests for system state management |
| `pinMasker.test.js` | Tests for PIN masking functions |
| `timeParser.test.js` | Tests for time parsing with various formats |

##### Integration Tests (`/tests/integration`)

| File | Purpose |
|------|---------|
| `api.test.js` | HTTP tests for all /api/* endpoints using supertest |
| `nl.test.js` | HTTP tests for /nl/execute with all example commands |
| `health.test.js` | Tests for /healthz endpoint |


### Frontend (`/frontend`)

#### Root Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: (1) build React app, (2) serve with nginx |
| `.dockerignore` | Excludes node_modules, tests, build artifacts from Docker context |
| `package.json` | Dependencies: react, react-dom, testing-library |
| `nginx.conf` | Nginx configuration for serving React SPA with proper routing |
| `.env.example` | Frontend environment variables (REACT_APP_API_URL) |

#### Public Assets (`/public`)

| File | Purpose |
|------|---------|
| `index.html` | HTML template with root div for React mounting |
| `favicon.ico` | Application favicon |

#### Source Files (`/src`)

| File | Purpose |
|------|---------|
| `index.js` | React entry point - renders App component to DOM |
| `index.css` | Global styles and CSS reset |
| `App.js` | Main application component - manages state and orchestrates child components |
| `App.css` | App component styles |

#### Components

##### CommandInput (`/src/components/CommandInput`)

| File | Purpose |
|------|---------|
| `CommandInput.js` | Text input and submit button component with loading state |
| `CommandInput.css` | Styles for input field and button |

##### CommandHistory (`/src/components/CommandHistory`)

| File | Purpose |
|------|---------|
| `CommandHistory.js` | Displays list of previously executed commands with success/error indicators |
| `CommandHistory.css` | Styles for history list and items |

##### HistoryDetailView (`/src/components/HistoryDetailView`)

| File | Purpose |
|------|---------|
| `HistoryDetailView.js` | Modal component showing detailed view of a selected history item (command, interpretation, API call, response) |
| `HistoryDetailView.css` | Styles for detail view modal |

##### ErrorDisplay (`/src/components/ErrorDisplay`)

| File | Purpose |
|------|---------|
| `ErrorDisplay.js` | Error message display component |
| `ErrorDisplay.css` | Error styling (red borders, warning icons) |

#### Services (`/src/services`)

| File | Purpose |
|------|---------|
| `api.js` | API client for backend communication - handles fetch requests and error handling |

#### Utilities (`/src/utils`)

| File | Purpose |
|------|---------|
| `constants.js` | API endpoints, example commands, error messages |

#### Tests (`/tests`)

| File | Purpose |
|------|---------|
| `App.test.js` | React component tests for App (rendering, state management, history) |
| `HistoryDetailView.test.js` | React component tests for HistoryDetailView modal |

### E2E Tests (`/e2e`)

#### Root Files

| File | Purpose |
|------|---------|
| `package.json` | Playwright and testing dependencies |
| `playwright.config.js` | Playwright configuration for multi-browser testing |

#### Tests (`/tests`)

| File | Purpose |
|------|---------|
| `smoke.spec.js` | E2E smoke test: Verifies UI renders correctly |
| `arm-system.spec.js` | E2E test: User arms system via NL command |
| `disarm-system.spec.js` | E2E test: User disarms system via NL command |
| `add-user-and-list.spec.js` | E2E test: User adds new user and lists users with masked PINs |
| `remove-user.spec.js` | E2E test: User removes existing user |
| `invalid-command.spec.js` | E2E test: Error handling for invalid commands |
| `command-history.spec.js` | E2E test: Command history display and detail view |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ CommandInput │  │ResultsDisplay│  │   Examples   │      │
│  └──────┬───────┘  └──────▲───────┘  └──────────────┘      │
│         │                  │                                 │
│         │   ┌──────────────┴──────────────┐                 │
│         └───►      API Service (api.js)   │                 │
│             └──────────────┬──────────────┘                 │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Express)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Pipeline                      │   │
│  │  Correlation ID → Logger → Validator → Error Handler │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │                    Routes                             │   │
│  │  /healthz  │  /nl/execute  │  /api/*                 │   │
│  └──────┬─────────────┬─────────────┬───────────────────┘   │
│         │             │             │                        │
│         ▼             ▼             ▼                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Health  │  │   NLP    │  │   API    │                  │
│  │ Service  │  │ Service  │  │ Services │                  │
│  └──────────┘  └────┬─────┘  └────┬─────┘                  │
│                     │             │                         │
│                     ▼             ▼                         │
│              ┌────────────────────────────┐                 │
│              │   Intent    │   Entity     │                 │
│              │ Classifier  │  Extractor   │                 │
│              └─────────┬──────────────────┘                 │
│                        │                                     │
│                        ▼                                     │
│              ┌──────────────────┐                           │
│              │  User Service    │                           │
│              │  System Service  │                           │
│              └─────────┬────────┘                           │
│                        │                                     │
│                        ▼                                     │
│              ┌──────────────────┐                           │
│              │  In-Memory Store │                           │
│              │  (Maps/Objects)  │                           │
│              └──────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Layered Architecture
- **Routes Layer**: HTTP request handling and routing
- **Service Layer**: Business logic and NLP processing
- **Storage Layer**: In-memory data persistence

### 2. Middleware Pipeline
Requests flow through: `Correlation ID → Logger → Routes → Error Handler`

### 3. Separation of Concerns
- **Intent Classification**: Separate from entity extraction
- **NLP Service**: Orchestrates but doesn't implement classification
- **Services**: Business logic isolated from HTTP concerns

### 4. Testability
- Each layer can be tested independently
- Fixtures provide consistent test data
- Integration tests verify entire request/response cycle

### 5. Docker-First Development
- All services containerized
- docker-compose.yml provides one-command startup
- Multi-stage builds for optimized images

### 6. Security by Default
- PINs masked in all logs
- PINs partially masked in API responses
- Input validation on all endpoints
- Correlation IDs for security audit trails

### 7. Configuration Management
- Environment variables for all config
- Sensible defaults for development
- Separate .env.example as documentation

### 8. Structured Logging
- JSON format for log aggregation
- Correlation IDs for request tracing
- Different log levels (debug, info, warn, error)

## File Count Summary

- **Backend**: 27 files (17 source + 10 test files)
- **Frontend**: 16 files (11 source + 1 test + 4 config)
- **E2E**: 7 files (5 tests + 2 config)
- **Root**: 4 files
- **Total**: ~54 files to create

## Next Steps

1. Create all configuration files (package.json, Dockerfile, docker-compose.yml)
2. Implement backend services (NLP, user management, system control)
3. Implement REST API endpoints
4. Create frontend React components
5. Write unit tests for core logic
6. Write integration tests for APIs
7. Write E2E tests for user flows
8. Create comprehensive README
9. Verify `docker compose up --build` works end-to-end
