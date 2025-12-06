# Quick Verification Checklist

Essential steps to verify the project works end-to-end.

## 1. Build & Run Project

```bash
docker compose up --build
```

**Verify:**
- [ ] Both services build without errors
- [ ] Containers start successfully (`docker compose ps` shows both Up)
- [ ] No crash loops in logs

---

## 2. Backend Check

```bash
curl http://localhost:8080/healthz
```

**Verify:**
- [ ] Returns `{"status":"ok"}` with 200 status

---

## 3. NLP Flow Check

**Option A: Via API (curl)**
```bash
curl -X POST http://localhost:8080/nl/execute \
  -H "Content-Type: application/json" \
  -d '{"text": "arm the system"}'
```

**Option B: Via Frontend UI**
- Open `http://localhost:3005`
- Type "arm the system" and click "Execute Command"

**Verify:**
- [ ] Returns/Displays intent `"ARM_SYSTEM"`
- [ ] Shows system is armed in response
- [ ] No error messages

---

## 4. Frontend Check

1. Open `http://localhost:3005` in browser
2. Type: `add user TestUser with pin 1234`
3. Click "Execute Command"

**Verify:**
- [ ] Page loads without errors
- [ ] Command input and submit button work
- [ ] Results display shows:
  - [ ] Intent: `"ADD_USER"`
  - [ ] User added successfully
  - [ ] PIN is masked (e.g., `****34`)
- [ ] No error displayed

---

## 5. Run All Tests

```bash
# Backend tests
cd backend && npm test && cd ..

# Frontend tests
cd frontend && npm test -- --watchAll=false && cd ..

# E2E tests (ensure docker compose is running)
cd e2e && npm test && cd ..
```

**Verify:**
- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] All E2E tests pass
- [ ] No test failures

---

## 6. Stop Containers

```bash
docker compose down
```

**Verify:**
- [ ] Containers stop cleanly
- [ ] No errors on shutdown

---

## ✅ Ready for Submission

If all checks pass, the project is verified and ready for submission.

