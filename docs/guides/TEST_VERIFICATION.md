# Test Verification Guide

Essential steps to verify the project works end-to-end using automated test suites.

## 1. Build & Run Project

```bash
docker compose up --build
```

**Verify:**
- [ ] Both services build without errors
- [ ] Containers start successfully (`docker compose ps` shows both Up)
- [ ] No crash loops in logs

---

## 2. Backend Unit Tests

```bash
cd backend
npm test -- --testPathPattern=unit
```

**Verify:**
- [ ] All unit tests pass (intentClassifier, nlp.service, user.service, system.service, pinMasker, timeParser)
- [ ] No test failures
- [ ] Test coverage is reasonable

---

## 3. Backend Integration Tests

```bash
cd backend
npm test -- --testPathPattern=integration
```

**Verify:**
- [ ] Health endpoint test passes (`/healthz`)
- [ ] API routes tests pass (`/api/*` endpoints)
- [ ] NLP endpoint tests pass (`/nl/execute` with various commands)
- [ ] All integration tests pass

---

## 4. Frontend Unit Tests

```bash
cd frontend
npm test -- --watchAll=false
```

**Verify:**
- [ ] All React component tests pass
- [ ] App component tests pass (rendering, state management, history)
- [ ] HistoryDetailView tests pass
- [ ] No test failures

---

## 5. End-to-End Tests

**Prerequisites:** Ensure Docker Compose is running (`docker compose up`)

```bash
cd e2e
npm test
```

**Verify:**
- [ ] Smoke test passes (UI rendering)
- [ ] Arm system test passes
- [ ] Disarm system test passes
- [ ] Add user and list users test passes
- [ ] Remove user test passes
- [ ] Invalid command test passes
- [ ] Command history test passes
- [ ] All E2E tests pass

---

## 6. Full Test Suite (All Tests)

Run all tests in sequence to verify complete functionality:

```bash
# Backend tests (unit + integration)
cd backend && npm test && cd ..

# Frontend tests
cd frontend && npm test -- --watchAll=false && cd ..

# E2E tests (ensure docker compose is running)
cd e2e && npm test && cd ..
```

**Verify:**
- [ ] All backend tests pass (unit + integration)
- [ ] All frontend tests pass
- [ ] All E2E tests pass
- [ ] No test failures across all suites

---

## 7. Stop Containers

```bash
docker compose down
```

**Verify:**
- [ ] Containers stop cleanly
- [ ] No errors on shutdown

---

## ✅ Ready for Submission

If all test suites pass, the project is verified and ready for submission.

### Test Coverage Summary

- **Backend Unit Tests**: NLP layer, services, utilities
- **Backend Integration Tests**: HTTP endpoints, API routes, NLP execution
- **Frontend Unit Tests**: React components, state management, history
- **E2E Tests**: Full user flows from UI to backend

All critical functionality is covered by automated tests.

