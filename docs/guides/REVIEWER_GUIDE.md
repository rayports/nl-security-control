# Reviewer Guide

Complete step-by-step instructions for reviewers to test and evaluate this project.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Docker** and **Docker Compose** installed and running
  - Verify: `docker --version` and `docker compose version`
- [ ] **Node.js 18+** installed (for running tests locally)
  - Verify: `node --version`
- [ ] **Git** installed (to clone the repository)
- [ ] **4GB+ free disk space** (for Docker images and node_modules)
- [ ] **Ports 8080 and 3005 available** (check with `netstat` or `lsof`)

---

## Quick Start (5 Minutes)

### Step 1: Clone and Navigate

```bash
git clone <repository-url>
cd nl-security-control
```

### Step 2: Build and Start Services

```bash
docker compose up --build
```

**Expected Output:**
- Both services build successfully
- Containers start without errors
- You see logs from both backend and frontend

**Wait for:** "Server listening on port 8080" in backend logs

### Step 3: Verify Services Are Running

**Option A: Check Docker Status**
```bash
docker compose ps
```

**Expected:** Both `nl-backend` and `nl-frontend` show status "Up"

**Option B: Health Check**
```bash
curl http://localhost:8080/healthz
```

**Expected:** `{"status":"ok"}`

### Step 4: Open Frontend

Open your browser and navigate to:
```
http://localhost:3005
```

**Expected:** You see the Natural Language Security Control interface with:
- Command input textarea
- "Execute Command" button
- Command History section (empty initially)

### Step 5: Test a Command

1. Type in the textarea: `arm the system`
2. Click "Execute Command"
3. **Expected:** Command appears in history with ✓ indicator

**Success Criteria:**
- ✅ No errors displayed
- ✅ Command appears in history
- ✅ You can click on the history item to see details

---

## Full Verification (15 Minutes)

### Part 1: Run All Tests

**Backend Tests:**
```bash
cd backend
npm install
npm test
```

**Expected:** All tests pass (unit + integration)

**Frontend Tests:**
```bash
cd ../frontend
npm install
npm test -- --watchAll=false
```

**Expected:** All React component tests pass

**E2E Tests:**
```bash
cd ../e2e
npm install
npm test
```

**Note:** Ensure Docker Compose is still running (`docker compose up` in another terminal)

**Expected:** All E2E tests pass

### Part 2: Manual Testing

Test these commands in the frontend UI:

1. **Arm System:** `arm the system to away mode`
2. **Add User:** `add user John with pin 4321`
3. **List Users:** `show me all users`
4. **Remove User:** `remove user John`
5. **Disarm System:** `disarm the system`
6. **Invalid Command:** `hello world` (should show error)

**Expected:** All commands work correctly, errors are handled gracefully

---

## Offline Testing

This project is designed to work **completely offline** after initial setup. This means:

**After cloning from GitHub and completing the one-time setup steps below, you can disconnect from the internet and everything will continue to work.**

### Pre-requisites for Offline Testing

**Step 1: Clone Repository (requires internet)**
```bash
git clone <repository-url>
cd nl-security-control
```

**Step 2: One-Time Setup (requires internet)**
```bash
# Build Docker images (downloads base images from Docker Hub)
docker compose build

# Install npm dependencies (downloads packages from npm registry)
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd e2e && npm install && cd ..
```

**Step 3: Disconnect from Internet**

**Step 4: Verify Offline Functionality**
```bash
# Start services (works offline - no network needed)
docker compose up

# Run tests (works offline - all dependencies already installed)
cd backend && npm test
cd ../frontend && npm test -- --watchAll=false
cd ../e2e && npm test
```

### What Requires Internet (One-Time Only)

- ✅ Cloning the repository from GitHub
- ✅ Downloading Docker base images (node:18-alpine, nginx:alpine)
- ✅ Downloading npm packages from npm registry

### What Works Offline (After Setup)

- ✅ Running Docker containers
- ✅ Starting backend and frontend services
- ✅ Running all tests (unit, integration, E2E)
- ✅ Using the application UI
- ✅ All functionality (no external API calls)

### Offline Verification Checklist

- [ ] Docker images built successfully (before going offline)
- [ ] All npm dependencies installed (before going offline)
- [ ] Services start without network errors (offline)
- [ ] Tests run without network requests (offline)
- [ ] Frontend loads and communicates with backend (offline)
- [ ] No external API calls in code (verified - all local)

---

## Troubleshooting

### Issue: Port already in use

**Error:** `Error: listen EADDRINUSE: address already in use :::8080`

**Solution:**
```bash
# Find process using port 8080
# Windows:
netstat -ano | findstr :8080

# macOS/Linux:
lsof -i :8080

# Kill the process or change port in docker-compose.yml
```

### Issue: Docker build fails

**Error:** `Cannot connect to Docker daemon`

**Solution:**
- Ensure Docker Desktop is running
- Restart Docker Desktop
- Check: `docker ps` should work

### Issue: Frontend can't connect to backend

**Error:** CORS errors or connection refused

**Solution:**
1. Verify backend is running: `curl http://localhost:8080/healthz`
2. Check Docker logs: `docker compose logs backend`
3. Verify frontend environment: Check `REACT_APP_API_URL` in frontend

### Issue: Tests fail

**Error:** Module not found or test failures

**Solution:**
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
cd ../e2e && rm -rf node_modules && npm install
```

### Issue: E2E tests timeout

**Error:** `Test timeout of 30000ms exceeded`

**Solution:**
1. Ensure Docker Compose is running: `docker compose ps`
2. Wait for services to be fully ready (check logs)
3. Increase timeout in `e2e/playwright.config.js` if needed

### Issue: Health check fails in Docker

**Error:** `curl: command not found` in healthcheck

**Solution:**
- The backend Dockerfile uses Node.js HTTP check (not curl)
- This should work, but if issues occur, rebuild: `docker compose up --build`

---

## Verification Checklist

Use this checklist to verify everything works:

### Basic Functionality
- [ ] Docker Compose starts both services
- [ ] Frontend loads at http://localhost:3005
- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Can execute "arm the system" command
- [ ] Command appears in history
- [ ] Can view command details by clicking history item

### API Endpoints
- [ ] `GET /healthz` returns 200
- [ ] `POST /api/arm-system` works
- [ ] `POST /api/disarm-system` works
- [ ] `POST /api/add-user` works
- [ ] `GET /api/list-users` works
- [ ] `POST /api/remove-user` works
- [ ] `POST /nl/execute` works with natural language

### Testing
- [ ] All backend unit tests pass
- [ ] All backend integration tests pass
- [ ] All frontend unit tests pass
- [ ] All E2E tests pass

### Code Quality
- [ ] No console errors in browser
- [ ] No errors in Docker logs
- [ ] Code is well-structured and documented
- [ ] Tests are comprehensive

---

## Expected Test Results

### Backend Tests
- **Unit Tests:** ~40+ tests passing
- **Integration Tests:** ~10+ tests passing
- **Total:** All tests should pass

### Frontend Tests
- **Component Tests:** ~10+ tests passing
- **All tests should pass**

### E2E Tests
- **Test Suites:** 7 test files
- **Total Tests:** ~10+ tests passing
- **All tests should pass**

---

## Common Questions

**Q: Do I need to install Node.js if I'm using Docker?**  
A: Yes, for running tests locally. Docker runs the application, but tests are run with local Node.js.

**Q: Can I run this without Docker?**  
A: Yes, see [Development Guide](docs/DEVELOPMENT.md) for local setup instructions.

**Q: What if I don't have Docker?**  
A: You can run backend and frontend locally with Node.js, but E2E tests require Docker.

**Q: How long should the first build take?**  
A: 5-10 minutes depending on internet speed (downloading Docker images and npm packages).

**Q: What browsers are supported?**  
A: Modern browsers (Chrome, Firefox, Safari, Edge). E2E tests use Chromium.

---

## Additional Resources

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Development Guide](docs/DEVELOPMENT.md)** - Detailed development instructions
- **[Test Verification](TEST_VERIFICATION.md)** - Test execution guide (same directory)
- **[Architecture](docs/ARCHITECTURE.md)** - Technical design details
- **[Command Examples](docs/EXAMPLES.md)** - Natural language command examples

---

## Support

If you encounter issues not covered here:

1. Check Docker logs: `docker compose logs`
2. Check browser console for frontend errors
3. Verify all prerequisites are installed
4. Review [Development Guide](docs/DEVELOPMENT.md) troubleshooting section

