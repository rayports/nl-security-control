# Natural Language Security Control - Implementation Checklist

## Phase 1: Project Setup
- [ ] Create project root directory structure
- [ ] Initialize backend service directory (e.g., `/backend`)
- [ ] Initialize frontend service directory (e.g., `/frontend`)
- [ ] Create docker-compose.yml at project root
- [ ] Create root README.md with TL;DR section
- [ ] Set up .gitignore for Node.js/Python projects

## Phase 2: Backend - Core Structure
- [ ] Choose backend language/framework (Node.js/Express, Python/FastAPI, or similar)
- [ ] Initialize package manager (package.json or requirements.txt)
- [ ] Set up project structure with directories: /routes, /services, /models, /middleware, /utils, /tests
- [ ] Configure environment variables (.env support with PORT=8080 default)
- [ ] Set up structured logging library (winston, pino, or Python logging with JSON formatter)
- [ ] Implement correlation ID middleware for request tracing

## Phase 3: Backend - Data Models
- [ ] Create in-memory User model: { name: string, pin: string, start_time: datetime|null, end_time: datetime|null, permissions: string[] }
- [ ] Create in-memory SystemState model: { armed: boolean, mode: 'away'|'home'|'stay' }
- [ ] Initialize global Maps/arrays for storage (usersMap, systemState)
- [ ] Implement helper functions: addUser(), removeUser(), getUsers(), maskPin()

## Phase 4: Backend - API Endpoints Implementation
- [ ] Implement POST /api/arm-system (accept mode, default to "away", update system state)
- [ ] Implement POST /api/disarm-system (update system state to disarmed)
- [ ] Implement POST /api/add-user (validate payload, store user, generate response)
- [ ] Implement POST /api/remove-user (support removal by name OR pin)
- [ ] Implement GET /api/list-users (return users with masked PINs)
- [ ] Implement GET /healthz (return 200 OK with status)
- [ ] Add input validation middleware to all endpoints
- [ ] Add error handling middleware with consistent JSON error format

## Phase 5: Backend - NLP/LLM Integration Layer
- [ ] Create NLP service module (/services/nlp.js or nlp.py)
- [ ] Choose NLP approach: (Option A) Rule-based with regex/keyword matching, (Option B) spaCy/NLTK, (Option C) LLM API integration
- [ ] Implement intent classifier: map text → intent (ARM_SYSTEM, DISARM_SYSTEM, ADD_USER, REMOVE_USER, LIST_USERS)
- [ ] Implement entity extractor: extract names, PINs (4-digit patterns), modes (away/home/stay keywords)
- [ ] Implement time parser: extract time ranges (basic: "5pm", "Sunday 10am"; bonus: "this weekend", "next Tuesday")
- [ ] Create function: parseCommand(text) → { intent, entities: { name?, pin?, mode?, start_time?, end_time? } }
- [ ] Implement POST /nl/execute endpoint that calls parseCommand() and routes to appropriate API endpoint

## Phase 6: Backend - Security & Quality
- [ ] Implement PIN masking in logs (replace with ****)
- [ ] Implement PIN masking in API responses (show only last 2 digits: ****34)
- [ ] Add request/response logging with correlation IDs
- [ ] Validate PIN format (4-digit string)
- [ ] Sanitize all string inputs to prevent injection
- [ ] Add rate limiting middleware (optional but recommended)

## Phase 7: Backend - Docker Configuration
- [ ] Create Dockerfile for backend service
- [ ] Set up multi-stage build (if applicable)
- [ ] Configure EXPOSE 8080
- [ ] Add HEALTHCHECK directive using curl to /healthz
- [ ] Test Docker image builds successfully: `docker build -t backend .`
- [ ] Test Docker image runs standalone: `docker run -p 8080:8080 backend`

## Phase 8: Backend - Unit Tests
- [ ] Set up testing framework (Jest, Mocha, pytest, etc.)
- [ ] Write tests for intent classification (all 5 intents with variations)
- [ ] Write tests for entity extraction (names, PINs, modes, times)
- [ ] Write tests for parseCommand() with all example commands
- [ ] Write tests for maskPin() utility function
- [ ] Write tests for user management functions (add, remove, list)
- [ ] Achieve >80% code coverage for NLP and core logic

## Phase 9: Backend - Integration Tests
- [ ] Set up HTTP testing library (supertest, requests, etc.)
- [ ] Write tests for POST /api/arm-system (all modes)
- [ ] Write tests for POST /api/disarm-system
- [ ] Write tests for POST /api/add-user (with and without times)
- [ ] Write tests for POST /api/remove-user (by name and by pin)
- [ ] Write tests for GET /api/list-users (verify PIN masking)
- [ ] Write tests for GET /healthz
- [ ] Write tests for POST /nl/execute with all example commands
- [ ] Write tests for error cases (invalid payloads, missing fields)

## Phase 10: Frontend - Core Structure
- [ ] Initialize React app (Create React App, Vite, or Next.js)
- [ ] Set up component structure: /components/CommandInput, /components/ResultsDisplay
- [ ] Configure API endpoint URL via environment variable (REACT_APP_API_URL=http://localhost:8080)
- [ ] Set up state management (useState for local state)

## Phase 11: Frontend - UI Components
- [ ] Create CommandInput component with textarea/input field
- [ ] Add submit button with onClick handler
- [ ] Create ResultsDisplay component with sections for: user input, NLP interpretation, API call details, API response
- [ ] Implement form submission handler: sendCommand(text)
- [ ] Display loading state while API request is in flight
- [ ] Display errors in UI when API returns error response
- [ ] Style components with basic CSS or Tailwind (keep simple but functional)

## Phase 12: Frontend - API Integration
- [ ] Implement fetch() call to POST /nl/execute
- [ ] Parse response and extract: interpretation (intent, entities), api_call (endpoint, payload), response (result)
- [ ] Display all response data in ResultsDisplay component
- [ ] Handle network errors and display user-friendly messages
- [ ] Add CORS handling (ensure backend allows frontend origin)

## Phase 13: Frontend - Docker Configuration
- [ ] Create Dockerfile for frontend service
- [ ] Use nginx to serve static React build
- [ ] Configure EXPOSE 3005 (or chosen port)
- [ ] Add build step in Dockerfile
- [ ] Test Docker image builds successfully: `docker build -t frontend .`
- [ ] Test Docker image runs standalone: `docker run -p 3005:3005 frontend`

## Phase 14: Frontend - Bonus Features (Optional)
- [ ] Add command history display (store previous commands in state)
- [ ] Add example commands section with clickable examples
- [ ] Add copy-to-clipboard for example commands
- [ ] Improve UI styling and responsiveness

## Phase 15: Docker Compose Integration
- [ ] Create docker-compose.yml with services: backend, frontend
- [ ] Configure backend service: build context, ports (8080:8080), environment variables, healthcheck
- [ ] Configure frontend service: build context, ports (3005:3005), depends_on backend
- [ ] Add network configuration for service communication
- [ ] Test: `docker compose up --build` brings up both services
- [ ] Test: `docker compose down` cleanly stops services
- [ ] Test: Backend healthcheck works in compose environment

## Phase 16: End-to-End Tests
- [ ] Set up E2E testing framework (Playwright, Cypress, Selenium)
- [ ] Write E2E test: User types "arm the system" → sees successful response
- [ ] Write E2E test: User types "add user John with pin 4321" → sees user added
- [ ] Write E2E test: User types "show me all users" → sees user list with masked PINs
- [ ] Write E2E test: User types "remove user John" → sees user removed
- [ ] Write E2E test: User types invalid command → sees error message
- [ ] Configure E2E tests to run against dockerized environment

## Phase 17: Documentation - README
- [ ] Write TL;DR section with quick start commands
- [ ] Write Prerequisites section (Docker, Docker Compose versions)
- [ ] Write Setup & Installation section (git clone, docker compose up)
- [ ] Write Verification section with curl commands for /healthz and /nl/execute
- [ ] Write Architecture Overview section (NLP layer, API layer, frontend layer)
- [ ] Write API Documentation section (list all endpoints with examples)
- [ ] Write Testing section (how to run unit, integration, E2E tests)
- [ ] Write Example Commands section (list all 8+ example commands)
- [ ] Write Assumptions & Design Decisions section
- [ ] Write Technology Stack section (languages, frameworks, libraries)
- [ ] Add screenshots or ASCII diagrams of UI (optional)

## Phase 18: Testing Documentation
- [ ] Document how to run backend unit tests
- [ ] Document how to run backend integration tests
- [ ] Document how to run frontend tests (if any)
- [ ] Document how to run E2E tests
- [ ] Document test coverage reporting commands
- [ ] Add testing section to README

## Phase 19: Quality Assurance
- [ ] Run all tests and ensure they pass
- [ ] Test docker compose up --build on fresh clone
- [ ] Verify all 8 example commands work end-to-end
- [ ] Verify healthz endpoint returns 200
- [ ] Verify PINs are masked in logs and API responses
- [ ] Check for any hardcoded values that should be environment variables
- [ ] Run linter/formatter on all code
- [ ] Check for any TODO or FIXME comments
- [ ] Verify error messages are user-friendly

## Phase 20: Bonus Implementation (If Time Permits)
- [ ] Integrate actual LLM API (OpenAI, Anthropic Claude) for NLP
- [ ] Implement sophisticated time parsing with dateparser library
- [ ] Add comprehensive monitoring/metrics endpoint
- [ ] Add creative command aliases ("sesame open" → disarm)
- [ ] Add request/response caching layer
- [ ] Add API request logging dashboard

## Phase 21: Final Polish
- [ ] Review all code for clarity and consistency
- [ ] Ensure all files have proper headers/comments
- [ ] Verify .gitignore excludes node_modules, .env, build artifacts
- [ ] Add LICENSE file (if applicable)
- [ ] Add CONTRIBUTING.md (optional)
- [ ] Final test of complete workflow from fresh clone
- [ ] Create GitHub repository and push code
- [ ] Verify repository is public and accessible
- [ ] Double-check README renders correctly on GitHub

## Phase 22: Submission
- [ ] Share GitHub repository URL
- [ ] Verify repository contains all required files
- [ ] Verify docker compose up --build works from fresh checkout
- [ ] Verify README has all required sections
- [ ] Verify test suite is included and documented