# Natural Language Security Control

A full-stack web application that allows users to control a security system using natural language commands instead of traditional REST API calls.

## TL;DR Quickstart

```bash
# Build and start all services
docker compose up --build

# Open frontend in browser
http://localhost:3005

# Health check
curl http://localhost:8080/healthz
```

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

### Prerequisites

- **Docker** and **Docker Compose** installed and running
- **Node.js 18+** (for running tests locally)
- **Ports 8080 and 3005 available**

### Quick Start

1. **Clone the repository**
2. **Start the services:**
   ```bash
   docker compose up --build
   ```
3. **Open the frontend:** http://localhost:3005
4. **Try a command:** Type "arm the system" and click Execute
5. **View details:** Click any command in the history to see the full interpretation, API call details, and response

For detailed setup and usage instructions, see the [Usage Guide](docs/guides/USAGE_GUIDE.md).

## Testing

Run all test suites to verify the project:

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test -- --watchAll=false

# E2E tests (ensure docker compose is running)
cd e2e && npm test
```

See [Usage Guide](docs/guides/USAGE_GUIDE.md) for detailed testing instructions.

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
