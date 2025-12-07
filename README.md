# Natural Language Security Control

A full-stack web application that allows users to control a security system using natural language commands instead of traditional REST API calls.

## TL;DR - System Verification

```bash
# 1. Start services
docker compose up --build

# 2. Verify backend health
curl http://localhost:8080/healthz
# Expected: {"status":"ok"}

# 3. Test a command via API
curl -X POST http://localhost:8080/nl/execute \
  -H "Content-Type: application/json" \
  -d '{"text":"arm the system"}'
# Expected: JSON response with interpretation and API call details

# 4. Open UI and test
# Browser: http://localhost:3005
# Try: "arm the system" → Click command in history to see details
```

For complete usage instructions, see [Usage Guide](docs/guides/USAGE_GUIDE.md).

## Project Overview

This system provides a natural language interface for managing a security system. Users can interact with the system using plain English commands like "arm the system" or "add user John with pin 4321" instead of learning REST API endpoints.

### Key Features

- **Natural Language Processing**: Rule-based intent classification and entity extraction
- **Security System Control**: Arm/disarm system in different modes (away, home, stay)
- **User Management**: Add, remove, and list users with PIN-based access
- **Command History**: Click any command in the history to view detailed interpretation, API call, and response
- **PIN Masking**: Automatic PIN masking for security (e.g., `****21` instead of `4321`)
- **Structured Logging**: Request correlation IDs for tracing
- **Comprehensive Testing**: Unit, integration, and E2E tests

## Quick Links

### Technical Documentation
- **[API Documentation](docs/API.md)** - Complete REST and NL endpoint reference
- **[Architecture](docs/ARCHITECTURE.md)** - Technical design, decisions, and limitations
- **[Command Examples](docs/EXAMPLES.md)** - Natural language command examples
- **[Development Guide](docs/DEVELOPMENT.md)** - How to run, test, and develop locally
- **[LLM Integration Plan](docs/LLM_INTEGRATION_PLAN.md)** - Design plan for future LLM integration (not implemented)
- **[Project Structure](docs/project_structure.md)** - Detailed project organization
- **[Requirements](docs/requirements.md)** - Original project requirements
- **[AI Workflow](docs/AI_WORKFLOW.md)** - Documentation of AI-assisted development approach

### Guides
- **[Usage Guide](docs/guides/USAGE_GUIDE.md)** - Running, testing, and using the system

## Tech Stack

**Backend:** Node.js 18, Express.js, Jest + Supertest  
**Frontend:** React 18, React Testing Library  
**Infrastructure:** Docker, Docker Compose, nginx, Playwright  
**NLP:** Custom rule-based intent classifier with chrono-node for time parsing

## Project Structure

```
nl-security-control/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── routes/      # API and NL routes
│   │   ├── services/    # Business logic and NLP
│   │   ├── models/      # Data models
│   │   ├── middleware/  # Express middleware
│   │   ├── storage/     # In-memory data store
│   │   └── utils/       # Utility functions
│   ├── tests/           # Jest tests (unit + integration)
│   └── Dockerfile
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API client
│   │   └── utils/      # Constants and utilities
│   ├── tests/          # React component tests
│   └── Dockerfile
├── e2e/                # Playwright E2E tests
│   ├── tests/          # E2E test specs
│   └── playwright.config.js
├── docs/               # Project documentation
├── docker-compose.yml  # Multi-container orchestration
└── README.md
```

## Getting Started

See [Usage Guide](docs/guides/USAGE_GUIDE.md) for complete instructions on:
- Running the system
- Using the UI (including clickable command history)
- Running tests
- Troubleshooting

## Documentation

See the [Quick Links](#quick-links) section above for all documentation. Key documents include:
- **[Usage Guide](docs/guides/USAGE_GUIDE.md)** - Running, testing, and using the system
- **[API Documentation](docs/API.md)** - Complete API reference
- **[Development Guide](docs/DEVELOPMENT.md)** - Local development details
- **[AI Workflow](docs/AI_WORKFLOW.md)** - AI-assisted development approach

## License

This project is a demonstration/portfolio project.

## Contributing

This is a demonstration project. For questions or issues, please refer to the project documentation in `/docs`.
