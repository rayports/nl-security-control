# Command Examples

Natural language command examples organized by intent.

## Arm System

Basic commands to arm the security system:

- `"arm the system"`
- `"arm the system to away mode"`
- `"arm the system to home mode"`
- `"arm the system to stay mode"`
- `"arm it"`
- `"arm now"`
- `"turn on the alarm"`
- `"turn on the system"`
- `"activate the alarm"`
- `"activate security system"`
- `"enable the system"`
- `"set the alarm to armed"`
- `"set to away mode"`
- `"away mode"`
- `"home mode"`
- `"stay mode"`
- `"start the alarm"`
- `"start the system"`

**Aliases:**
- `"sesame close"`
- `"close sesame"`
- `"lock"`
- `"lock system"`
- `"lock up"`
- `"secure"`
- `"secure the system"`
- `"guard mode"`
- `"protect"`

**Example Response:**
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

---

## Disarm System

Basic commands to disarm the security system:

- `"disarm the system"`
- `"disarm"`
- `"disarm it"`
- `"disarm now"`
- `"turn off the alarm"`
- `"turn off the system"`
- `"turn the system off"`
- `"deactivate the alarm"`
- `"disable the system"`
- `"shut off the alarm"`
- `"stop the alarm"`
- `"stop the system"`

**Aliases:**
- `"sesame open"`
- `"open sesame"`
- `"unlock"`
- `"unlock system"`
- `"open the door"`
- `"let me in"`

**Example Response:**
```json
{
  "text": "disarm the system",
  "interpretation": {
    "intent": "DISARM_SYSTEM",
    "entities": {}
  },
  "api_call": {
    "endpoint": "/api/disarm-system",
    "method": "POST",
    "payload": {}
  },
  "response": {
    "success": true,
    "state": {
      "armed": false,
      "mode": "away"
    }
  }
}
```

---

## Add User

Commands to add a new user to the system:

### Basic Add User

- `"add user John with pin 4321"`
- `"add user Alice with pin 9876"`
- `"create user Bob with pin 1234"`
- `"register user Sarah with pin 5678"`
- `"add user John pin 4321"`
- `"add user Alice 9876"`
- `"add John 1234"` (without "user" keyword)
- `"register Alice 5678"`
- `"add Bob with pin 9999"`
- `"create Alice 1111"`

### With Passcode (Synonym for PIN)

- `"add user John using passcode 1234"`
- `"add user Alice with passcode 5678"`
- `"add user Bob passcode 9999"`
- `"add user Sarah 4321 passcode"`

### With Permissions

- `"add user John, she can arm the system with pin 1234"`
- `"add user John, he can disarm the system with pin 1234"`
- `"add user John, make sure he can arm and disarm our system with pin 1234"`
- `"add user Alice, she can arm with pin 5678"`
- `"add user Bob, he can disarm with pin 9999"`

### With Time Range

- `"add user John with pin 1234 from 5pm"`
- `"add user Alice with pin 5678 until next Tuesday"`
- `"add a temporary user Sarah, pin 5678 from today 5pm to Sunday 10am"`
- `"add user John with pin 1234 from this weekend to next weekend"`
- `"add user Alice with pin 9999 until next tuesday 5pm"`
- `"add user Bob with pin 4321 this weekend"`
- `"add user Sarah with pin 5678 until next christmas"`

### Narrative Commands

- `"My mother-in-law is coming to stay for the weekend, make sure she can arm and disarm our system using passcode 1234"`

**Example Response:**
```json
{
  "text": "add user John with pin 4321",
  "interpretation": {
    "intent": "ADD_USER",
    "entities": {
      "name": "John",
      "pin": "4321"
    }
  },
  "api_call": {
    "endpoint": "/api/add-user",
    "method": "POST",
    "payload": {
      "name": "John",
      "pin": "4321"
    }
  },
  "response": {
    "success": true,
    "user": {
      "name": "John",
      "pin": "****21"
    }
  }
}
```

---

## Remove User

Commands to remove a user from the system:

### By Name

- `"remove user John"`
- `"delete user Alice"`
- `"remove user Bob"`
- `"delete user named Sarah"`
- `"remove John"`
- `"delete Bob"`
- `"unregister John"`
- `"unregister user Alice"`

### By PIN

- `"remove by pin 1234"`
- `"remove by passcode 5678"`
- `"delete by pin 9999"`

**Aliases:**
- `"revoke access"`
- `"kick out"`
- `"remove access"`

**Example Response:**
```json
{
  "text": "remove user John",
  "interpretation": {
    "intent": "REMOVE_USER",
    "entities": {
      "name": "John"
    }
  },
  "api_call": {
    "endpoint": "/api/remove-user",
    "method": "POST",
    "payload": {
      "name": "John"
    }
  },
  "response": {
    "success": true,
    "message": "User removed successfully",
    "user": {
      "name": "John",
      "pin": "****21"
    }
  }
}
```

---

## List Users

Commands to list all users in the system:

- `"show me all users"`
- `"list users"`
- `"list all users"`
- `"show all users"`
- `"display all users"`
- `"get all users"`
- `"who are the users"`
- `"users list"`
- `"show users"`
- `"who's registered"`
- `"who's here"`
- `"list all"`
- `"show all"`

**Aliases:**
- `"who is here"`
- `"show guests"`
- `"who has access"`
- `"access list"`

**Example Response:**
```json
{
  "text": "show me all users",
  "interpretation": {
    "intent": "LIST_USERS",
    "entities": {}
  },
  "api_call": {
    "endpoint": "/api/list-users",
    "method": "GET",
    "payload": {}
  },
  "response": {
    "success": true,
    "users": [
      {
        "name": "John",
        "pin": "****21",
        "start_time": null,
        "end_time": null,
        "permissions": []
      }
    ]
  }
}
```

---

## Complex Examples

### Temporary User with Time Range

```
"add a temporary user Sarah, pin 5678 from today 5pm to Sunday 10am"
```

This creates a user with:
- Name: "Sarah"
- PIN: "5678"
- Start time: Today at 5:00 PM
- End time: Next Sunday at 10:00 AM

### Narrative Command

```
"My mother-in-law is coming to stay for the weekend, make sure she can arm and disarm our system using passcode 1234"
```

This creates a user with:
- Name: "mother-in-law" (extracted from narrative)
- PIN: "1234"
- Permissions: ["arm", "disarm"]

### Weekend Range

```
"add user John with pin 1234 from this weekend to next weekend"
```

This creates a user with:
- Name: "John"
- PIN: "1234"
- Start time: This Saturday 00:00:00
- End time: Next Saturday 00:00:00

---

## Invalid Commands

Commands that will return an error:

- `"hello world"` - No intent detected
- `"do something random"` - Unknown command
- `"arm user"` - Ambiguous (could be arm system or add user)

**Error Response:**
```json
{
  "success": false,
  "error": "I didn't understand that command. Try phrases like \"arm the system\", \"add user John with pin 1234\", or \"show me all users\".",
  "correlationId": "uuid-here"
}
```

---

## Tips

1. **Be specific:** Include mode when arming (e.g., "arm the system to away mode")
2. **Use natural language:** The system understands various phrasings
3. **Include PIN:** Always include PIN when adding users
4. **Check permissions:** Specify permissions when adding users (e.g., "can arm", "can disarm")
5. **Time ranges:** Use natural time expressions (e.g., "today 5pm", "next Tuesday", "this weekend")

## Viewing Command Details in the UI

After executing any command in the frontend:

1. The command appears in the command history below the input field
2. **Click on any command** in the history to open a detailed view
3. The detail view shows:
   - Original command text
   - NLP interpretation (intent and extracted entities)
   - API call details (endpoint, method, payload)
   - Full API response or error message

This makes it easy to understand how the system processes each command and what API calls are made behind the scenes.

---

For more details, see [API Documentation](API.md).

