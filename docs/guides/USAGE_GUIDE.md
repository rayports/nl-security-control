# Usage Guide

Complete guide for running, testing, and using the Natural Language Security Control system.

## Prerequisites

Before starting, ensure you have:

- [ ] **Docker** and **Docker Compose** installed and running
  - Verify: `docker --version` and `docker compose version`
- [ ] **Node.js 18+** installed (for running tests locally)
  - Verify: `node --version`
- [ ] **Ports 8080 and 3005 available**
  - Check: `netstat -ano | findstr :8080` (Windows) or `lsof -i :8080` (macOS/Linux)

---

## Quick Start

### Step 1: Clone and Start Services

```bash
git clone <repository-url>
cd nl-security-control
docker compose up --build
```

**Expected:** Both services build and start successfully. Wait for "Server listening on port 8080" in the logs.

### Step 2: Verify Services

```bash
# Check container status
docker compose ps

# Health check
curl http://localhost:8080/healthz
```

**Expected:** Both containers show "Up" status, health check returns `{"status":"ok"}`

### Step 3: Open the Frontend

Open your browser to: **http://localhost:3005**

You should see:
- Command input textarea
- "Execute Command" button
- Command history section (empty initially)

---

## Using the UI

### Basic Usage

1. **Enter a command** in the textarea (e.g., `arm the system`)
2. **Click "Execute Command"** or press **Enter** (Shift+Enter for new line)
3. **View results** in the command history below

### Viewing Command Details

**Click any command in the history** to see detailed information in a modal:

- **Original Command**: The exact text you entered
- **Interpretation**: How the NLP parsed it (intent and extracted entities)
- **API Call**: The endpoint, method, and payload that was sent
- **Response**: The full API response or error message

This helps you understand:
- How the system interpreted your command
- What API calls were made behind the scenes
- The complete response from the backend

### Example Commands to Try

1. **Arm System:** `arm the system to away mode`
2. **Add User:** `add user John with pin 4321`
3. **List Users:** `show me all users`
4. **Remove User:** `remove user John`
5. **Disarm System:** `disarm the system`
6. **Complex Command:** `add a temporary user Sarah, pin 5678 from today 5pm to Sunday 10am`
7. **Invalid Command:** `hello world` (should show error message)

### UI Features

- **Enter to Submit**: Press Enter to execute (Shift+Enter for new line)
- **Command History**: All commands are saved with success/error indicators
- **Clickable History**: Click any history item to see full details
- **Error Display**: Errors appear above the history with user-friendly messages
- **Auto-clear Input**: Input field clears after command execution

---

## Testing

### Automated Test Suites

#### Backend Tests

```bash
cd backend
npm install
npm test
```

**Expected:** All unit and integration tests pass (~50+ tests)

**Run specific test suites:**
```bash
# Unit tests only
npm test -- --testPathPattern=unit

# Integration tests only
npm test -- --testPathPattern=integration

# Specific test file
npm test -- intentClassifier.test.js
```

#### Frontend Tests

```bash
cd frontend
npm install
npm test -- --watchAll=false
```

**Expected:** All React component tests pass (~10+ tests)

#### End-to-End Tests

**Prerequisites:** Ensure Docker Compose is running (`docker compose up -d`)

```bash
cd e2e
npm install
npx playwright install chromium  # First time only
npm test
```

**Expected:** All E2E tests pass (~10+ tests covering UI flows)

**Run specific E2E tests:**
```bash
npx playwright test arm-system
npx playwright test command-history
npx playwright test add-user-and-list
```

### Full Test Suite

Run all tests in sequence:

```bash
# Backend tests
cd backend && npm test && cd ..

# Frontend tests
cd frontend && npm test -- --watchAll=false && cd ..

# E2E tests (ensure docker compose is running)
cd e2e && npm test && cd ..
```

---

## Manual UI Testing

Test the following scenarios in the browser:

### 1. Basic Commands
- [ ] Arm system command executes successfully
- [ ] Command appears in history with ✓ indicator
- [ ] Can click history item to see details
- [ ] Detail view shows interpretation, API call, and response

### 2. User Management
- [ ] Add user command works
- [ ] List users shows added users
- [ ] Remove user command works
- [ ] Users are removed from list

### 3. Error Handling
- [ ] Invalid command shows error message
- [ ] Error appears above history
- [ ] Error command appears in history with ✗ indicator
- [ ] Can click error history item to see error details

### 4. Command History
- [ ] History persists across page refreshes (LocalStorage)
- [ ] Can click any history item to view details
- [ ] Detail modal shows all information correctly
- [ ] Can close modal and click another item

### 5. Complex Commands
- [ ] Time range commands work (e.g., "from today 5pm to Sunday 10am")
- [ ] Permission commands work (e.g., "can arm and disarm")
- [ ] Narrative commands work (e.g., "My mother-in-law...")

---

## Offline Testing

This project works **completely offline** after initial setup.

### Setup (Requires Internet - One Time Only)

```bash
# Build Docker images
docker compose build

# Install npm dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd e2e && npm install && cd ..
```

### Verify Offline Readiness

```bash
# Check Docker images exist
docker images | grep nl-security-control

# Check node_modules exist
ls backend/node_modules
ls frontend/node_modules
ls e2e/node_modules
```

### Test Offline

1. **Disconnect from internet**
2. **Start services:** `docker compose up`
3. **Run tests:** All test suites should work offline
4. **Use UI:** All functionality should work offline

**What works offline:**
- ✅ Running Docker containers
- ✅ Starting services
- ✅ Running all tests
- ✅ Using the application UI
- ✅ All functionality (no external API calls)

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # macOS/Linux

# Kill process or change port in docker-compose.yml
```

### Docker Container Won't Start

```bash
# Check logs
docker compose logs backend

# Restart
docker compose restart backend
```

### Frontend Can't Connect to Backend

1. Verify backend is running: `curl http://localhost:8080/healthz`
2. Check Docker logs: `docker compose logs backend`
3. Check browser console for errors

### Tests Fail

```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
cd ../e2e && rm -rf node_modules && npm install
```

### E2E Tests Timeout

1. Ensure Docker Compose is running: `docker compose ps`
2. Wait for services to be fully ready
3. Check logs: `docker compose logs`

For more troubleshooting, see [Development Guide](../DEVELOPMENT.md) or [Potential Issues](../POTENTIAL_ISSUES.md).

---

## Additional Resources

- **[API Documentation](../API.md)** - Complete API reference
- **[Command Examples](../EXAMPLES.md)** - Natural language command variations
- **[Architecture](../ARCHITECTURE.md)** - Technical design and decisions
- **[Development Guide](../DEVELOPMENT.md)** - Detailed development instructions
- **[Development Guide](../DEVELOPMENT.md)** - Detailed development and Docker commands

---

## Verification Checklist

Use this checklist to verify everything works:

### Basic Functionality
- [ ] Docker Compose starts both services
- [ ] Frontend loads at http://localhost:3005
- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Can execute "arm the system" command
- [ ] Command appears in history
- [ ] Can click history item to see details

### Testing
- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] All E2E tests pass

### UI Features
- [ ] Enter-to-submit works
- [ ] Command history displays correctly
- [ ] Clickable history shows detail modal
- [ ] Error messages display correctly
- [ ] Input clears after submission

---

## Expected Test Results

- **Backend Tests:** ~50+ tests (unit + integration)
- **Frontend Tests:** ~10+ tests (component tests)
- **E2E Tests:** ~10+ tests (UI flows)

All tests should pass. If any fail, check the troubleshooting section above.

