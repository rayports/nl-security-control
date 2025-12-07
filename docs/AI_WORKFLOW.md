# AI-Assisted Development Workflow

## Overview

This document showcases my approach to completing the take-home assignment using AI pair programming tools. I utilized multiple AI assistants (GPT, Claude, and Cursor) throughout the development process, with Claude providing the most effective assistance for my implementation strategy.

## General Workflow

My development process followed this pattern:

1. **Requirements Analysis**: Used Claude to extract detailed requirements from the PDF specification
2. **Project Planning**: Generated comprehensive project structure and setup documentation
3. **Development Environment Setup**: Created VS Code extension recommendations and configuration
4. **Incremental Implementation**: Used Cursor as an AI pair programmer, working step-by-step
   - Each step: Cursor proposes a plan → I approve → Cursor implements → I validate
   - This ensured controlled, reviewable progress with no unexpected changes

---

## Phase 1: Requirements Extraction and Project Planning

### Prompt 1: Requirements Analysis

```
You are a senior software engineer and requirements analyst. Read the entire 
attached PDF very carefully, line by line, and extract all information that is 
relevant to completing this take-home assignment. Do NOT summarize vaguely: 
I need precise, explicit details.

Organize the output so it is directly usable to design and implement the codebase:
1. Requirements Table: List every requirement (including implied or recommended 
   ones) as a table with columns: ID, Category (e.g. NLP, Backend/API, Frontend, 
   Docker/DevOps, Testing, Documentation, Bonus), Title, and Detailed Description.
2. Must-have vs Optional: Identify optional or recommended features, but treat 
   them as must-have for implementation purposes.
3. Implementation Checklist: At the end, generate a markdown checklist of concrete 
   engineering tasks that a developer could follow step-by-step to build the codebase.
4. No vague summaries: Use precise, implementation-focused language so these items 
   can be used as the source of truth for later code generation.

Generate the project folder structure from the requirements.
```

**Output:**
```
Created: project_structure.md
- Comprehensive requirements table with all features categorized
- Complete folder structure for Node.js backend + React frontend
- Implementation checklist with step-by-step tasks
```

---

### Prompt 2: VS Code Extension Recommendations

```
Given the requirements and project structure for this project (Node.js backend, 
React frontend, Jest testing, Docker, and Playwright), tell me which VS Code 
extensions I should install to make development smoother, safer, and more productive.

Include:
- Required extensions
- Recommended extensions
- Nice-to-have extensions
- DevOps/Docker-related extensions
- Testing/debugging tools
- Any settings.json or workspace-specific configuration you suggest
```

**Output:**
```
Created documentation files:
- README.md - Project overview and instructions
- INDEX.txt - Quick reference index
- COMPLETE_SETUP_SUMMARY.md - Comprehensive setup guide
- VSCODE_SETUP.md - In-depth extension reference
- VSCODE_SETUP_SUMMARY.md - Quick reference guide
- EXTENSIONS_QUICK_REFERENCE.md - Copy-paste commands
- PROJECT_STRUCTURE.md - Complete architecture
```

---

### Prompt 3: Cursor AI Configuration

```
Generate two short prompts for initializing Cursor:

1) A setup prompt telling Cursor:
   - it is my AI pair programmer,
   - to use ./docs/requirements.md and ./docs/project_structure.md as the only 
     source of truth,
   - to work incrementally (plan first, wait for approval, touch only needed files).

2) A commit-message prompt telling Cursor to generate concise commit messages 
   based only on the diff.

Return both in code blocks.
```

**Output:**

**Setup Prompt:**
```
You are my AI pair programmer for this repository. The full specification for 
this project is already written in:
- ./docs/requirements.md
- ./docs/project_structure.md

Treat these two documents as the SINGLE source of truth. Do NOT invent new 
behaviors, endpoints, file names, or directories that conflict with these docs.

Important working style:
- We will implement the codebase INCREMENTALLY, one clearly-defined step at a time.
- Never attempt to implement the entire project in one step.
- For each task, first propose a short 3–5 step plan, then wait for my approval.
- When implementing, touch ONLY the files needed for that step.

Acknowledge when you understand, then wait for the first task.
```

**Commit Message Prompt:**
```
Before I commit, generate a concise, professional commit message based strictly 
on the changes in the current diff.

Requirements:
- Summarize what was added, removed, or modified.
- Keep it short (under 72 characters for the title).
- Include a one-sentence body if needed.
- Do NOT invent extra details — only describe the actual changes shown.

After giving the commit message, stop and wait for confirmation before doing 
anything else.
```

---

## Phase 2: Incremental Backend Development with Cursor

> **Note**: The steps below are representative examples from my development process, not a complete record of every interaction. They are included here to illustrate the iterative, plan-approve-implement workflow I followed throughout the entire project. The actual implementation involved many more steps following this same pattern.

### Step 1: Minimal Backend Scaffolding

**User:**
```
Reset this task.

Do NOT create the full backend scaffolding.

For this step, create ONLY the following files and nothing else:
- backend/package.json (minimal)
- backend/src/index.js (empty placeholder or minimal Express bootstrap)
- backend/src/app.js (empty placeholder of Express app)
- backend/src/config/config.js (empty placeholder)

Do NOT create middleware, utils, routes, models, services, tests, Dockerfile, 
or any other files yet.

Before creating files, propose a 2–4 step plan and wait for my approval.

After creation, tell me how to validate this step locally, including:
- commands to run
- expected output
- how to verify folder structure
```

**Cursor:**
```
Acknowledged. Proposing plan:

1. Create backend/package.json with minimal Express dependencies
2. Create backend/src/index.js with basic server startup
3. Create backend/src/app.js as Express app export
4. Create backend/src/config/config.js as empty placeholder

Proceed with this plan?
```

**User:**
```
Yes
```

**Cursor:**
```
[Implements the 4 files as specified]

Validation:
1. Run: cd backend && npm install
2. Run: npm start
3. Expected: Server listening on port 3000
4. Verify: Check folder structure matches plan
```

---

### Step 2: Git Configuration

**User:**
```
I'd like to commit the current state of the backend to GitHub before moving on.

1. Create a suitable .gitignore file at the project root that fits this stack 
   (Node.js backend now, React frontend and Playwright E2E tests later). Include 
   ignores for:
   - node_modules
   - build/dist artifacts
   - coverage reports
   - .env and other local config
   - OS/editor junk (e.g., .DS_Store, .vscode if appropriate)

2. Suggest three concise, professional commit messages for this point in the 
   project (initial backend scaffolding only). Do NOT run any git commands; 
   just suggest messages.

After updating .gitignore, show me the diff and then:
- Confirm the repo is in a good state for an initial commit.
- Tell me which of the suggested commit messages you think fits best and why.
```

**Cursor:**
```
Creating .gitignore with comprehensive exclusions...

[Shows diff of .gitignore]

Suggested commit messages:
1. "chore: initialize backend scaffolding with Express setup"
2. "feat: add minimal Node.js backend structure"
3. "init: create backend foundation with Express and config"

Recommendation: Message #1 - Uses conventional commit format, clearly indicates 
this is project setup work (chore), and describes what was added.

Repository is ready for initial commit.
```

---

### Step 3: Middleware Implementation

**User:**
```
Next task: Set up the backend middleware folder and implement ONLY two pieces 
of middleware:
1. correlationId.js
2. requestLogger.js

Paths to create/modify:
- backend/src/middleware/correlationId.js
- backend/src/middleware/requestLogger.js
- backend/src/app.js (import + use the middleware)

Rules:
- Do NOT create any other middleware files yet.
- Keep implementations simple and follow project_structure.md.
- correlationId.js: assign a unique ID to each request (e.g., using uuid) and 
  attach it to req for logging.
- requestLogger.js: log method, URL, status, and correlation ID using console.log 
  or the logger utility if available.

Before writing code:
- Propose a 2–3 step plan and wait for my approval.

After implementation:
- Show the diff
- Tell me how to validate middleware is working (commands + expected output)
```

**Cursor:**
```
Proposing plan:

1. Install uuid package for correlation IDs
2. Create correlationId.js middleware to generate and attach req.correlationId
3. Create requestLogger.js middleware to log requests with correlation ID
4. Update app.js to use both middleware in correct order

Proceed with this plan?
```

**User:**
```
Yes
```

**Cursor:**
```
[Implements the middleware files and updates app.js]

Validation:
1. Run: npm install uuid
2. Run: npm start
3. Test: curl http://localhost:3000
4. Expected output: Console logs showing:
   - Incoming: GET / [correlation-id-here]
   - Outgoing: GET / 404 [correlation-id-here]
```

---

### Step 4: Debugging Session

**User:**
```
I'm testing the step you gave me and I encountered this error:

[PowerShell error output showing module not found]

Please help me identify this error, the cause of it, tell me which files to 
inspect, propose a solution, and wait for my approval before applying changes.

After you propose a solution, we'll test it one step at a time and confirm it 
works before moving on. Do not make additional changes beyond the current step 
until I explicitly approve.
```

**Cursor:**
```
Analyzing the issue:

Error: Module 'uuid' not found
Cause: Package not installed or incorrect import syntax

Files to inspect:
1. backend/package.json - check if uuid is listed in dependencies
2. backend/src/middleware/correlationId.js - check import statement
3. node_modules/ - verify uuid was actually installed

Proposed solution:
1. Verify uuid is in package.json dependencies
2. Run: cd backend && npm install
3. If error persists, check import syntax (should be: import { v4 as uuidv4 } 
   from 'uuid')

Shall I proceed with verifying and fixing these items?
```

---

### Step 5: Error Handler Middleware

**User:**
```
Next task: add the global error handling middleware.

Create or modify ONLY the following file:
- backend/src/middleware/errorHandler.js

And update ONLY backend/src/app.js to register this middleware (after routes, 
before export).

Requirements for errorHandler.js:
- Export a function (err, req, res, next)
- Log the error message along with the request's correlation ID
- Respond with a structured JSON payload:
  { success: false, error: err.message, correlationId: req.correlationId }
- Default status code should be 500 unless the error has a status property

Before writing code:
- Propose a 2–3 step plan and wait for my approval.

After implementation:
- Show the diff
- Tell me how to validate the error handler locally (e.g., create a temporary 
  route that throws an error)
```

**Cursor:**
```
Proposing plan for error handler middleware:

1. Create errorHandler.js with (err, req, res, next) signature
2. Implement error logging with correlation ID
3. Send structured JSON response with appropriate status code
4. Update app.js to use errorHandler after all routes

Proceed with this plan?
```

**User:**
```
Yes
```

**Cursor:**
```
[Implements errorHandler.js and updates app.js]

Validation:
1. Add temporary test route to app.js:
   app.get('/test-error', (req, res) => { throw new Error('Test error'); });
2. Run: npm start
3. Test: curl http://localhost:3000/test-error
4. Expected output:
   - Console: Error log with correlation ID
   - Response: {"success":false,"error":"Test error","correlationId":"..."}
```

---

## Key Takeaways

The examples above demonstrate my core development methodology:

1. **Incremental Development**: Breaking down the project into small, manageable steps prevented scope creep and made debugging easier
2. **Plan-Approve-Implement**: The workflow of proposing plans before implementation ensured I stayed in control
3. **Single Source of Truth**: Maintaining requirements.md and project_structure.md prevented AI hallucinations
4. **Validation at Each Step**: Testing after every change caught issues early
5. **Clear Constraints**: Explicitly telling the AI what NOT to do was as important as what to do

This same pattern was applied consistently throughout the entire codebase—from backend routes and services, to frontend components, to Docker configuration and testing setup.