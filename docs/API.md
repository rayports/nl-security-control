# API Documentation

Complete reference for all REST and natural language endpoints.

## Base URL

- **Backend API:** `http://localhost:8080`
- **Frontend:** `http://localhost:3005`

## REST Endpoints

All REST endpoints are prefixed with `/api`.

### POST `/api/arm-system`

Arm the security system.

**Request Body:**
```json
{
  "mode": "away"  // Optional: "away" | "home" | "stay" (default: "away")
}
```

**Response:**
```json
{
  "success": true,
  "state": {
    "armed": true,
    "mode": "away"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid mode
- `500` - Server error

---

### POST `/api/disarm-system`

Disarm the security system.

**Request Body:** (empty)

**Response:**
```json
{
  "success": true,
  "state": {
    "armed": false,
    "mode": "away"
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### POST `/api/add-user`

Add a new user to the system.

**Request Body:**
```json
{
  "name": "John",
  "pin": "4321",
  "start_time": null,  // Optional: ISO 8601 date string
  "end_time": null,    // Optional: ISO 8601 date string
  "permissions": []    // Optional: array of permission strings ("arm", "disarm")
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "name": "John",
    "pin": "****21",  // Masked PIN
    "start_time": null,
    "end_time": null,
    "permissions": []
  }
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Invalid input (missing name/pin, invalid PIN format, duplicate user)
- `500` - Server error

**Validation:**
- `name`: Required, non-empty string
- `pin`: Required, exactly 4 digits
- `start_time` and `end_time`: Must be valid ISO 8601 dates, `start_time` must be before `end_time`, both must be in the future for temporary users

---

### POST `/api/remove-user`

Remove a user from the system.

**Request Body:**
```json
{
  "name": "John"  // OR "pin": "4321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User removed successfully",
  "user": {
    "name": "John",
    "pin": "****21"  // Masked PIN
  }
}
```

**Status Codes:**
- `200` - User removed successfully
- `404` - User not found
- `400` - Invalid input (missing name or pin)
- `500` - Server error

---

### GET `/api/list-users`

List all users in the system.

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "name": "John",
      "pin": "****21",  // Masked PIN
      "start_time": null,
      "end_time": null,
      "permissions": []
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Natural Language Endpoint

### POST `/nl/execute`

Execute a natural language command.

**Request Body:**
```json
{
  "text": "arm the system to away mode"
}
```

**Response:**
```json
{
  "text": "arm the system to away mode",
  "interpretation": {
    "intent": "ARM_SYSTEM",
    "entities": {
      "mode": "away"
    }
  },
  "api_call": {
    "endpoint": "/api/arm-system",
    "method": "POST",
    "payload": {
      "mode": "away"
    }
  },
  "response": {
    "success": true,
    "state": {
      "armed": true,
      "mode": "away"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "I didn't understand that command. Try phrases like \"arm the system\", \"add user John with pin 1234\", or \"show me all users\".",
  "correlationId": "uuid-here"
}
```

**Status Codes:**
- `200` - Command executed successfully
- `400` - Invalid command or parsing error
- `500` - Server error

**Supported Intents:**
- `ARM_SYSTEM` - Arm the security system
- `DISARM_SYSTEM` - Disarm the security system
- `ADD_USER` - Add a new user
- `REMOVE_USER` - Remove a user
- `LIST_USERS` - List all users

For example commands, see [Command Examples](EXAMPLES.md).

---

## Health Check

### GET `/healthz`

Health check endpoint for monitoring and container health checks.

**Request Body:** None

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200` - Service is healthy

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "correlationId": "uuid-here"
}
```

The `correlationId` can be used to trace the request in logs.

---

## PIN Masking

All PINs are automatically masked in API responses:

- **For responses:** Last 2 digits visible (e.g., `****21` for PIN `4321`)
- **For logs:** Fully masked (e.g., `****`)

This ensures sensitive data is never exposed in API responses or logs.

---

## Request Headers

All requests should include:

```
Content-Type: application/json
```

The backend automatically adds a `X-Correlation-Id` header to all responses for request tracing.

