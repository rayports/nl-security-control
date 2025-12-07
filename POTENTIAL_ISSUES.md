# Potential Issues and Solutions

This document identifies potential issues reviewers might encounter and how to address them.

## Critical Issues

### 1. Frontend Health Check Uses `wget` (May Not Be Available)

**Location:** `frontend/Dockerfile` line 33

**Issue:**
```dockerfile
CMD wget --quiet --tries=1 --spider http://localhost:3005/health || exit 1
```

**Problem:** `nginx:alpine` image may not have `wget` installed by default.

**Solution:** The health check is optional and won't prevent the container from starting. If health checks fail, the container will still run. However, to fix:

**Option A:** Remove health check (simplest)
```dockerfile
# Remove or comment out the HEALTHCHECK line
```

**Option B:** Use `curl` (if available) or install `wget`
```dockerfile
RUN apk add --no-cache wget
```

**Option C:** Use nginx's built-in check
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD nginx -t && curl -f http://localhost:3005/ || exit 1
```

**Status:** Non-blocking - container will still work, health check just won't pass.

---

### 2. Docker Compose Health Check Uses `curl`

**Location:** `docker-compose.yml` line 13

**Issue:**
```yaml
test: ["CMD", "curl", "-f", "http://localhost:8080/healthz"]
```

**Problem:** Backend uses `node:18-alpine` which may not have `curl` installed.

**Current Status:** The backend Dockerfile uses Node.js HTTP check instead, which is correct. However, the docker-compose.yml references `curl`.

**Solution:** Update docker-compose.yml to use Node.js check:
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:8080/healthz', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 5s
```

**Status:** Should be fixed for consistency.

---

## Medium Priority Issues

### 3. Port Conflicts

**Issue:** Ports 8080 or 3005 may already be in use.

**Symptoms:**
- `Error: listen EADDRINUSE: address already in use :::8080`
- Docker containers fail to start

**Solution:**
```bash
# Find process using port
# Windows:
netstat -ano | findstr :8080

# macOS/Linux:
lsof -i :8080

# Kill process or change ports in docker-compose.yml
```

**Prevention:** Document this in README/reviewer guide.

---

### 4. Node.js Version Mismatch

**Issue:** Local Node.js version may differ from Docker (Node 18).

**Symptoms:**
- Tests fail locally but pass in Docker
- Different behavior between local and containerized runs

**Solution:**
- Use `nvm` or `n` to manage Node versions
- Document required Node version (18+)
- Consider using `.nvmrc` file

---

### 5. Missing Dependencies After Clone

**Issue:** `node_modules` not committed (correctly), but reviewers might forget to install.

**Symptoms:**
- `Module not found` errors
- Tests fail immediately

**Solution:**
- Clear instructions in README
- Add `npm install` to quick start guide
- Consider adding a setup script

---

### 6. E2E Tests Require Docker Running

**Issue:** E2E tests will fail if Docker Compose isn't running.

**Symptoms:**
- `ECONNREFUSED` errors in E2E tests
- Tests timeout

**Solution:**
- Clear documentation in TEST_VERIFICATION.md
- Add check in E2E test setup
- Provide clear error message if services aren't running

---

## Low Priority Issues

### 7. Time Zone Differences

**Issue:** Time parsing may behave differently in different time zones.

**Symptoms:**
- Tests fail in different time zones
- "today 5pm" resolves to different times

**Solution:**
- Tests use relative times where possible
- Document time zone assumptions
- Consider using UTC for consistency

**Status:** Currently handled with relative time parsing.

---

### 8. Docker Image Size

**Issue:** Docker images may be large if not optimized.

**Current Status:**
- Using multi-stage builds (good)
- Using Alpine images (good)
- Could optimize further with `.dockerignore`

**Solution:** Already using best practices, but could add size optimization tips.

---

### 9. Offline Testing

**Issue:** First-time setup requires internet for:
- Docker image pulls
- npm package downloads

**Solution:**
- Document offline testing process
- Provide instructions for pre-downloading dependencies
- Note that after initial setup, everything works offline

**Status:** Documented in REVIEWER_GUIDE.md.

---

### 10. Windows vs Unix Path Differences

**Issue:** Some commands may differ between Windows and Unix.

**Symptoms:**
- Path separators (`\` vs `/`)
- Command differences (`dir` vs `ls`)

**Solution:**
- Use Docker commands (platform-agnostic)
- Document Windows-specific alternatives where needed
- Test on both platforms if possible

---

## Recommendations for Fixes

### Immediate Fixes (Before Submission)

1. **Fix docker-compose.yml health check** - Use Node.js instead of curl
2. **Fix frontend Dockerfile health check** - Remove or use nginx check
3. **Add .nvmrc file** - Specify Node 18
4. **Add setup verification script** - Check prerequisites

### Nice-to-Have Improvements

1. **Add pre-commit hooks** - Run tests before commit
2. **Add CI/CD configuration** - GitHub Actions workflow
3. **Add size optimization** - Further reduce Docker image sizes
4. **Add Windows-specific instructions** - PowerShell alternatives

---

## Testing Checklist

Before submission, verify:

- [ ] Docker Compose starts without errors
- [ ] Health checks pass (or are removed if problematic)
- [ ] All tests pass on clean clone
- [ ] Works on both Windows and Unix systems
- [ ] Works offline after initial setup
- [ ] No external API dependencies
- [ ] Clear error messages for common issues
- [ ] Documentation is complete and accurate

---

## Quick Fixes Script

Create a `fix-issues.sh` or `fix-issues.ps1` script:

```bash
#!/bin/bash
# Quick fixes for common issues

# Fix docker-compose health check
# (Manual edit required - see POTENTIAL_ISSUES.md)

# Fix frontend Dockerfile health check
# (Manual edit required - see POTENTIAL_ISSUES.md)

# Verify Node version
node --version | grep -q "v18" || echo "Warning: Node 18 recommended"

# Check Docker
docker --version || echo "Error: Docker not installed"

# Check ports
lsof -i :8080 && echo "Warning: Port 8080 in use"
lsof -i :3005 && echo "Warning: Port 3005 in use"
```

---

## Summary

**Critical Issues:** 2 (health checks)
**Medium Priority:** 4 (ports, Node version, dependencies, E2E setup)
**Low Priority:** 4 (time zones, image size, offline, platform differences)

**Action Required:**
1. Fix health checks in docker-compose.yml and frontend Dockerfile
2. Add clear prerequisites documentation
3. Test on clean environment
4. Verify offline functionality

