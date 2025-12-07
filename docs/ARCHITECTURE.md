# Architecture

Technical design, decisions, and limitations of the Natural Language Security Control system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ CommandInput │  │CommandHistory│  │ ErrorDisplay │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                  │
│                    ┌───────▼────────┐                         │
│                    │   api.js      │                         │
│                    │  (fetch API)  │                         │
│                    └───────┬────────┘                         │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTP
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      Backend (Express)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │correlationId │  │requestLogger │  │errorHandler │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                      Routes Layer                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │  /api/*      │  │  /nl/execute │  │  /healthz    │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────┘ │  │
│  └─────────┼──────────────────┼──────────────────────────┘  │
│            │                  │                               │
│  ┌─────────▼──────────┐  ┌───▼───────────────────────────┐  │
│  │  Service Layer      │  │    NLP Service Layer          │  │
│  │  ┌──────────────┐   │  │  ┌──────────────┐            │  │
│  │  │user.service  │   │  │  │nlp.service   │            │  │
│  │  │system.service│   │  │  │intentClassifier│          │  │
│  │  └──────┬───────┘   │  │  └──────┬───────┘            │  │
│  └─────────┼────────────┘  └──────────┼────────────────────┘  │
│            │                         │                        │
│  ┌─────────▼─────────────────────────▼────────────────────┐  │
│  │              Data Layer                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ User Model   │  │SystemState   │  │inMemoryStore │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Backend

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **NLP:** Custom rule-based intent classifier
- **Time Parsing:** chrono-node
- **Logging:** winston (structured JSON logging)
- **Testing:** Jest + Supertest

### Frontend

- **Framework:** React 18
- **Build Tool:** react-scripts (Create React App)
- **Testing:** Jest + React Testing Library
- **HTTP Client:** Fetch API

### Infrastructure

- **Containerization:** Docker + Docker Compose
- **Web Server:** nginx (for frontend production build)
- **E2E Testing:** Playwright

## Design Decisions

### Rule-Based NLP (Not LLM-Based)

**Why:**
- Predictable and deterministic behavior
- No external API dependencies or costs
- Fast execution (no network latency)
- Full control over intent classification logic
- Easy to debug and test

**Trade-offs:**
- Requires explicit pattern matching rules
- Less flexible than LLM-based approaches
- Manual maintenance of intent patterns
- May not handle all command variations

**Implementation:**
- Regex-based pattern matching for intent classification
- Entity extraction using regex and utility functions
- Support for command aliases (e.g., "sesame open" → DISARM_SYSTEM)
- Ambiguous input detection and helpful error messages

### Clean Separation of Services

**Why:**
- Single Responsibility Principle
- Easier to test individual components
- Better code organization and maintainability
- Clear boundaries between layers (routes → services → models → storage)

**Architecture Layers:**
1. **Routes Layer:** HTTP request handling, validation
2. **Service Layer:** Business logic (user.service, system.service)
3. **NLP Layer:** Intent classification and entity extraction
4. **Model Layer:** Data validation and structure
5. **Storage Layer:** In-memory data persistence

### In-Memory Store

**Why:**
- Simplicity for MVP/demonstration
- No database setup required
- Fast read/write operations
- Sufficient for proof-of-concept

**Trade-offs:**
- Data is lost on server restart
- Not suitable for production without persistence layer
- No data durability guarantees
- Single-instance only (no clustering)

**Implementation:**
- `Map` data structure for user storage (keyed by name and PIN)
- Plain object for system state
- Helper functions for CRUD operations

### Structured Logging with Correlation IDs

**Why:**
- Request tracing across services
- Easier debugging of distributed requests
- Better observability
- Industry best practice for microservices

**Implementation:**
- Winston logger with JSON format
- Correlation ID middleware assigns unique ID per request
- Correlation ID included in all logs and error responses
- Request/response logging with correlation ID

### PIN Masking

**Why:**
- Security best practice
- Prevents accidental exposure of sensitive data
- Shows partial information (last 2 digits) for verification
- Different masking levels for logs vs. API responses

**Implementation:**
- `maskPinForResponse()`: Shows last 2 digits (e.g., `****21`)
- `maskPinForLog()`: Fully masks for logs (e.g., `****`)
- Applied automatically in all API responses and logs

### Command History with Detail View

**Why:**
- Better user experience
- Allows users to review past commands
- Shows full interpretation and API call details
- Helps with debugging and understanding system behavior

**Implementation:**
- LocalStorage persistence
- Clickable history items
- Modal detail view showing:
  - Original command
  - Timestamp
  - NLP interpretation
  - API call details
  - Response or error

## Assumptions

1. **User Intent:** Users will use relatively standard phrasings for commands
2. **PIN Format:** All PINs are exactly 4 digits
3. **User Names:** User names are simple strings (no special validation)
4. **Single Instance:** System runs as a single instance (no clustering)
5. **Network:** Frontend and backend are on the same network or accessible via localhost
6. **Language:** Only English commands are supported
7. **Time Zones:** Time parsing doesn't handle timezone conversions (uses local time)

## Limitations

1. **No Persistence:** All data is stored in memory and lost on restart
2. **No Authentication:** No user authentication or authorization
3. **Limited NLP:** Rule-based NLP may not handle all command variations
4. **No Rate Limiting:** API endpoints have no rate limiting
5. **Limited Validation:** Some endpoints have minimal input validation
6. **Single Language:** Only supports English commands
7. **No Time Zones:** Time parsing doesn't handle timezone conversions
8. **No Concurrent Safety:** In-memory store is not thread-safe (though Node.js is single-threaded, async operations could cause issues in edge cases)
9. **No Scheduling:** Cannot schedule commands for future execution
10. **No Audit Logging:** No persistent audit trail of system changes
11. **Name Uniqueness Required:** User names must be unique because the storage model uses name as the Map key. In a production system, this would be replaced with unique IDs to allow multiple users with the same name (e.g., multiple "Sarah"s). PINs are intentionally allowed to be duplicated (common in real security systems for family members, guests, etc.)

## Performance Considerations

- **In-memory store:** Provides O(1) lookups for users
- **Rule-based NLP:** Very fast execution (no network calls, regex matching)
- **Frontend:** React for efficient rendering and state management
- **Docker:** Multi-stage builds minimize image sizes
- **No database overhead:** Fast operations but no persistence

## Security Considerations

- **PIN Masking:** PINs are masked in all API responses and logs
- **No Authentication:** No user authentication/authorization (for demo purposes)
- **CORS:** Enabled for frontend-backend communication
- **Input Validation:** Basic validation on critical endpoints
- **Error Messages:** User-friendly error messages without exposing internals

## Future Enhancements

Potential improvements for production:

1. **Persistence:**
   - Database integration (PostgreSQL, MongoDB)
   - Data migration scripts
   - Backup and recovery

2. **Authentication & Authorization:**
   - User authentication (JWT, OAuth)
   - Role-based access control
   - API key management

3. **Enhanced NLP:**
   - Machine learning-based intent classification
   - Support for more command variations
   - Multi-language support

4. **Real-time Features:**
   - WebSocket support for real-time updates
   - Push notifications
   - Live system status

5. **Operational:**
   - Rate limiting and API throttling
   - Health check improvements
   - Metrics and monitoring (Prometheus, Grafana)
   - Audit logging
   - Configuration management

6. **Scalability:**
   - Horizontal scaling support
   - Load balancing
   - Caching layer (Redis)

7. **Advanced Features:**
   - Command scheduling
   - Time zone support
   - Advanced time parsing
   - Command templates
   - Batch operations

8. **User Management Improvements:**
   - Unique ID system to allow duplicate names
   - Support for multiple users with the same name
   - Improved removal logic for ambiguous cases (e.g., when multiple users share a PIN)

## Testing Strategy

- **Unit Tests:** Test individual functions and components in isolation
- **Integration Tests:** Test HTTP endpoints and service interactions
- **E2E Tests:** Test full user flows from UI to backend
- **Test Coverage:** Comprehensive coverage of critical paths

For testing instructions, see [Usage Guide](guides/USAGE_GUIDE.md).

