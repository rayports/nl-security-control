# Usage Guide

Complete guide for running, testing, and using the Natural Language Security Control system.

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 18+** (for running tests)
- **Ports 8080 and 3005 available**

---

## Quick Start

```bash
# Clone and start
git clone <repository-url>
cd nl-security-control
docker compose up --build

# Verify backend
curl http://localhost:8080/healthz
# Expected: {"status":"ok"}

# Open frontend
# Browser: http://localhost:3005
```

---

## Using the UI

1. **Enter a command** in the textarea (e.g., `arm the system`)
2. **Click "Execute Command"** or press **Enter** (Shift+Enter for new line)
3. **View results** in the command history below

### Clickable Command History

**Click any command in the history** to see detailed information in a modal:
- Original command text
- NLP interpretation (intent and extracted entities)
- API call details (endpoint, method, payload)
- Full API response or error message

This shows how the system processes each command and what API calls are made.

### Example Commands

- `arm the system to away mode`
- `add user John with pin 4321`
- `show me all users`
- `remove user John`
- `disarm the system`
- `add a temporary user Sarah, pin 5678 from today 5pm to Sunday 10am`
- `hello world` (invalid - shows error)

---

## Testing

### Run All Tests

```bash
# Backend tests
cd backend && npm install && npm test && cd ..

# Frontend tests
cd frontend && npm install && npm test -- --watchAll=false && cd ..

# E2E tests (ensure docker compose is running)
cd e2e && npm install && npx playwright install chromium && npm test && cd ..
```

**Expected:** All tests pass (~70+ total tests)

### Run Specific Test Suites

```bash
# Backend unit tests only
cd backend && npm test -- --testPathPattern=unit

# Backend integration tests only
cd backend && npm test -- --testPathPattern=integration

# Specific E2E test
cd e2e && npx playwright test arm-system
```

---

## Manual UI Testing Checklist

- [ ] Execute "arm the system" → appears in history with ✓
- [ ] Click history item → modal shows interpretation, API call, response
- [ ] Execute "add user John with pin 4321" → user added successfully
- [ ] Execute "show me all users" → list includes John
- [ ] Execute "remove user John" → user removed
- [ ] Execute "hello world" → error message displayed, appears in history with ✗
- [ ] Click error history item → modal shows error details
- [ ] Refresh page → history persists (LocalStorage)
- [ ] Test complex command: "add a temporary user Sarah, pin 5678 from today 5pm to Sunday 10am"

---

## Offline Testing

After initial setup, the project works **completely offline**.

**One-time setup (requires internet):**
```bash
docker compose build
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd e2e && npm install && cd ..
```

**Then disconnect and verify:**
- Services start: `docker compose up`
- Tests run: All test suites work offline
- UI works: All functionality available offline

---

## Troubleshooting

**Port in use:** Find process with `netstat -ano | findstr :8080` (Windows) or `lsof -i :8080` (Unix), kill it or change port

**Container won't start:** Check logs with `docker compose logs backend`, restart with `docker compose restart backend`

**Frontend can't connect:** Verify backend: `curl http://localhost:8080/healthz`, check logs: `docker compose logs backend`

**Tests fail:** Reinstall dependencies: `cd backend && rm -rf node_modules && npm install` (repeat for frontend/e2e)

**E2E timeout:** Ensure Docker Compose is running: `docker compose ps`, wait for services to be ready

For more details, see [Development Guide](../DEVELOPMENT.md) or [Potential Issues](../POTENTIAL_ISSUES.md).

---

## Quick Verification

- [ ] `docker compose up --build` starts both services
- [ ] `curl http://localhost:8080/healthz` returns `{"status":"ok"}`
- [ ] Frontend loads at http://localhost:3005
- [ ] Can execute "arm the system" in UI
- [ ] Can click command in history to see details
- [ ] All tests pass: `cd backend && npm test && cd ../frontend && npm test -- --watchAll=false && cd ../e2e && npm test`

**Expected:** ~70+ tests total, all passing

---

## Additional Resources

- **[API Documentation](../API.md)** - Complete API reference
- **[Command Examples](../EXAMPLES.md)** - Natural language command variations
- **[Architecture](../ARCHITECTURE.md)** - Technical design and decisions
- **[Development Guide](../DEVELOPMENT.md)** - Detailed development instructions

