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
- **PIN Masking**: Automatic PIN masking for security (e.g., `****21` instead of `4321`)
- **Structured Logging**: Request correlation IDs for tracing
- **Comprehensive Testing**: Unit, integration, and E2E tests

## Quick Links

- **[API Documentation](docs/API.md)** - Complete REST and NL endpoint reference
- **[Development Guide](docs/DEVELOPMENT.md)** - How to run, test, and develop locally
- **[Architecture](docs/ARCHITECTURE.md)** - Technical design, decisions, and limitations
- **[Command Examples](docs/EXAMPLES.md)** - Natural language command examples
- **[Test Verification](TEST_VERIFICATION.md)** - How to verify the project with test suites
- **[Requirements](docs/requirements.md)** - Original project requirements
- **[Project Structure](docs/project_structure.md)** - Detailed project organization

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

1. **Clone the repository**
2. **Start the services:**
   ```bash
   docker compose up --build
   ```
3. **Open the frontend:** http://localhost:3005
4. **Try a command:** Type "arm the system" and click Execute

For detailed setup instructions, see the [Development Guide](docs/DEVELOPMENT.md).

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

See [TEST_VERIFICATION.md](TEST_VERIFICATION.md) for detailed test verification steps.

## Documentation

- **[API Documentation](docs/API.md)** - Complete API reference with request/response examples
- **[Development Guide](docs/DEVELOPMENT.md)** - Local development, testing, and troubleshooting
- **[Architecture](docs/ARCHITECTURE.md)** - Design decisions, tech stack, and limitations
- **[Command Examples](docs/EXAMPLES.md)** - Natural language command variations and examples

## License

This project is a demonstration/portfolio project.

## Contributing

This is a demonstration project. For questions or issues, please refer to the project documentation in `/docs`.
