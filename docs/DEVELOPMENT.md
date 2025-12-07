# Development Guide

Complete guide for running, testing, and developing the Natural Language Security Control system locally.

## Prerequisites

- **Node.js** 18+ (for local development)
- **Docker** and **Docker Compose** (for containerized deployment)
- **npm** or **yarn** (package manager)

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker compose up --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

The frontend will be available at `http://localhost:3005` and the backend at `http://localhost:8080`.

---

## Running Locally (Without Docker)

### Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:8080` (configurable via `PORT` environment variable).

**Environment Variables:**
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment mode (default: development)

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` (development server).

**Environment Variables:**
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8080)

**Note:** When running frontend locally, ensure the backend is also running locally or update `REACT_APP_API_URL` to point to your backend.

---

## Testing

### Backend Unit Tests

```bash
cd backend
npm test
```

Run specific test files:
```bash
npm test -- intentClassifier.test.js
npm test -- nlp.service.test.js
```

Run only unit tests:
```bash
npm test -- --testPathPattern=unit
```

Run only integration tests:
```bash
npm test -- --testPathPattern=integration
```

### Frontend Unit Tests

```bash
cd frontend
npm test
```

Run tests without watch mode:
```bash
npm test -- --watchAll=false
```

Run specific test files:
```bash
npm test -- App.test.js
```

### End-to-End Tests

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
npx playwright test command-history
```

**Run E2E tests in headed mode (see browser):**
```bash
npx playwright test --headed
```

**Run E2E tests in debug mode:**
```bash
npx playwright test --debug
```

### Full Test Suite

Run all tests in sequence:

```bash
# Backend tests (unit + integration)
cd backend && npm test && cd ..

# Frontend tests
cd frontend && npm test -- --watchAll=false && cd ..

# E2E tests (ensure docker compose is running)
cd e2e && npm test && cd ..
```

See [Test Verification Guide](guides/TEST_VERIFICATION.md) for detailed test verification steps.

---

## Project Structure

```
nl-security-control/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (env vars)
│   │   ├── middleware/       # Express middleware (correlationId, logger, errorHandler)
│   │   ├── models/          # Data models (User, SystemState)
│   │   ├── routes/           # API routes (api.routes, nl.routes, health.routes)
│   │   ├── services/         # Business logic (user.service, system.service, nlp.service, intentClassifier)
│   │   ├── storage/          # In-memory data store
│   │   ├── utils/            # Utilities (logger, pinMasker, timeParser, commandAliases)
│   │   ├── app.js            # Express app setup
│   │   └── index.js          # Server entry point
│   ├── tests/
│   │   ├── unit/             # Unit tests
│   │   └── integration/     # Integration tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── CommandInput/
│   │   │   ├── CommandHistory/
│   │   │   ├── ErrorDisplay/
│   │   │   └── HistoryDetailView/
│   │   ├── services/         # API client (api.js)
│   │   ├── utils/            # Constants and utilities
│   │   ├── tests/            # React component tests
│   │   ├── App.js            # Main app component
│   │   └── index.js          # React entry point
│   └── Dockerfile
├── e2e/
│   ├── tests/                # Playwright E2E tests
│   └── playwright.config.js
└── docs/                      # Documentation
```

---

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```env
PORT=8080
NODE_ENV=development
```

### Frontend

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:8080
```

**Note:** `.env` files are gitignored and should not be committed.

---

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

---

## Docker Commands

### Start Services

```bash
# Build and start
docker compose up --build

# Start in detached mode
docker compose up -d

# Start specific service
docker compose up backend
```

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (if any)
docker compose down -v

# Stop specific service
docker compose stop backend
docker compose stop frontend
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

# Last 100 lines
docker compose logs --tail=100
```

### View Running Containers

```bash
docker compose ps
```

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker compose up -d --build backend

# Rebuild all services
docker compose up -d --build
```

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux
```

### Docker Container Won't Start

```bash
# Check container logs
docker compose logs backend

# Check if container is running
docker compose ps

# Restart container
docker compose restart backend
```

### Frontend Can't Connect to Backend

1. Ensure backend is running: `docker compose ps`
2. Check backend logs: `docker compose logs backend`
3. Verify `REACT_APP_API_URL` in frontend `.env` file
4. Check browser console for CORS errors

### Tests Failing

1. **Backend tests:** Ensure you're in the `backend/` directory and dependencies are installed
2. **Frontend tests:** Ensure you're in the `frontend/` directory
3. **E2E tests:** Ensure Docker Compose is running (`docker compose up -d`)

### Clear All Docker Data

```bash
# Stop and remove all containers, networks, volumes
docker compose down -v

# Remove all images (optional)
docker rmi $(docker images -q)
```

---

## Development Workflow

1. **Make code changes** in your editor
2. **Run relevant tests** to verify changes
3. **Test locally** (if running without Docker) or rebuild containers
4. **Run full test suite** before committing
5. **Commit changes** with descriptive messages

---

## Code Style

- **Backend:** Follow Express.js conventions, use async/await
- **Frontend:** Follow React best practices, functional components with hooks
- **Tests:** Use descriptive test names, follow AAA pattern (Arrange, Act, Assert)

---

## Next Steps

- See [API Documentation](API.md) for endpoint details
- See [Command Examples](EXAMPLES.md) for NL command variations
- See [Architecture](ARCHITECTURE.md) for technical design details

