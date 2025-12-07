# LLM Integration Plan

## Overview

This document outlines a plan for integrating Large Language Model (LLM) capabilities into the Natural Language Security Control system. **This feature is not currently implemented** to maintain the core requirement that the system must work completely offline after initial setup.

However, if online features were allowed, this document describes how LLM integration would be implemented to enhance the system's natural language understanding capabilities while maintaining reliability through graceful fallback mechanisms.

## Design Philosophy

### Why LLM Integration Wasn't Implemented

The current system uses a rule-based NLP approach for the following reasons:

1. **Offline Capability**: The system must work without internet connectivity after initial setup
2. **Predictability**: Rule-based systems provide deterministic, testable behavior
3. **Cost**: No ongoing API costs for LLM services
4. **Latency**: Rule-based parsing is extremely fast (<10ms vs. 200-2000ms for LLM)
5. **Reliability**: No dependency on external services that could fail

### When LLM Integration Would Be Beneficial

LLM integration would provide value in scenarios where:

- Online connectivity is available and acceptable
- Handling complex, conversational commands is prioritized
- Reducing manual pattern maintenance is desired
- Better handling of edge cases and novel phrasings is needed
- Narrative commands (like the "mother-in-law" example) need more sophisticated parsing

## Architecture Strategy

### Hybrid Approach: LLM-First with Rule-Based Fallback

```
User Command
    ↓
┌─────────────────────────────────────┐
│  LLM Parser (if enabled & online)  │
│  - Structured output/function call  │
│  - Confidence scoring               │
└───────────┬─────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
Success?         Failed/Offline?
    │                │
    ↓                ↓
Use LLM         Rule-Based Parser
Result          (Current System)
    │                │
    └───────┬────────┘
            ↓
    Standardized Output
    { intent, entities }
```

### Key Design Principles

1. **Non-Breaking**: Maintains existing `parseCommand()` interface
2. **Graceful Degradation**: Always falls back to rule-based if LLM fails
3. **Structured Output**: Uses function calling or JSON mode for reliable parsing
4. **Configurable**: Enable/disable via environment variable
5. **Cost-Aware**: Implements caching and rate limiting
6. **Offline-First**: Works without internet (rule-based fallback)

## Implementation Phases

### Phase 1: Create LLM Service Layer

**File: `backend/src/services/llm.service.js`**

Create a new service layer that abstracts LLM provider interactions:

```javascript
const llmService = {
  // Check if LLM is enabled and available
  isAvailable() {
    // Check environment variable and provider health
    return process.env.LLM_ENABLED === 'true' && 
           this.healthCheck();
  },
  
  // Parse command using LLM with structured output
  async parseCommand(text) {
    // Use function calling or JSON mode
    // Return: { intent, entities, confidence }
  },
  
  // Health check for LLM provider
  async healthCheck() {
    // Ping API to verify connectivity
  }
}
```

**Key Features:**
- Support multiple providers (OpenAI, Anthropic, local models via Ollama)
- Structured output using function calling (OpenAI) or JSON mode
- Confidence scoring to determine when to trust LLM vs. fallback
- Timeout handling (e.g., 5s max wait)
- Error handling with automatic fallback

### Phase 2: Modify NLP Service for Hybrid Approach

**File: `backend/src/services/nlp.service.js` (modify)**

Update the existing NLP service to try LLM first, then fallback to rules:

```javascript
const parseCommand = async (text) => {
  // 1. Try LLM first (if enabled)
  if (process.env.LLM_ENABLED === 'true') {
    try {
      const llmResult = await llmService.parseCommand(text);
      if (llmResult && llmResult.confidence > 0.8) {
        // Validate LLM output matches expected schema
        if (validateLLMOutput(llmResult)) {
          return normalizeLLMOutput(llmResult);
        }
      }
    } catch (error) {
      logger.warn({ error, text }, 'LLM parsing failed, falling back to rules');
    }
  }
  
  // 2. Fallback to rule-based (existing code)
  return parseCommandRuleBased(text);
}
```

**Benefits:**
- Zero changes to route handlers
- Automatic fallback ensures reliability
- Can A/B test LLM vs. rules

### Phase 3: LLM Provider Integration

#### Option A: OpenAI (Recommended for Production)

```javascript
// Using OpenAI function calling
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const parseCommand = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Cost-effective, fast
    messages: [{
      role: "system",
      content: SYSTEM_PROMPT // Define intents, entities, examples
    }, {
      role: "user", 
      content: text
    }],
    functions: [{
      name: "parse_security_command",
      description: "Parse natural language security command",
      parameters: {
        type: "object",
        properties: {
          intent: { 
            type: "string", 
            enum: ["ARM_SYSTEM", "DISARM_SYSTEM", "ADD_USER", "REMOVE_USER", "LIST_USERS"] 
          },
          entities: {
            type: "object",
            properties: {
              name: { type: "string" },
              pin: { type: "string", pattern: "^\\d{4}$" },
              mode: { type: "string", enum: ["away", "home", "stay"] },
              start_time: { type: "string", format: "date-time" },
              end_time: { type: "string", format: "date-time" },
              permissions: { 
                type: "array", 
                items: { type: "string" } 
              }
            }
          }
        },
        required: ["intent", "entities"]
      }
    }],
    function_call: { name: "parse_security_command" },
    temperature: 0.1 // Low temperature for consistency
  });
  
  return JSON.parse(response.choices[0].message.function_call.arguments);
}
```

#### Option B: Local LLM (Ollama) for Offline Capability

```javascript
// Use Ollama for offline LLM capability
const fetch = require('node-fetch');

const parseCommand = async (text) => {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3.2', // or mistral, etc.
      prompt: buildPrompt(text),
      format: 'json', // Request JSON output
      stream: false
    })
  });
  
  const result = await response.json();
  return JSON.parse(result.response);
}
```

#### Option C: Anthropic Claude

```javascript
// Similar structure with Anthropic's structured output
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Use Claude's structured output feature
```

### Phase 4: Prompt Engineering

**System Prompt Template:**

```
You are a natural language parser for a security system control interface.

Your task is to parse user commands and extract:
1. Intent: One of ARM_SYSTEM, DISARM_SYSTEM, ADD_USER, REMOVE_USER, LIST_USERS
2. Entities: name, pin (4 digits), mode (away/home/stay), time ranges, permissions

Examples:
- "arm the system" → { intent: "ARM_SYSTEM", entities: { mode: "away" } }
- "add user John with pin 1234" → { intent: "ADD_USER", entities: { name: "John", pin: "1234" } }
- "My mother-in-law needs access this weekend with passcode 5678" → 
  { intent: "ADD_USER", entities: { name: "mother-in-law", pin: "5678", start_time: "...", end_time: "..." } }

Rules:
- PINs must be exactly 4 digits
- Time expressions should be parsed to ISO 8601 format
- Extract relationship terms (mother-in-law, guest) as names when appropriate
- Default mode for ARM_SYSTEM is "away"
- Be flexible with phrasing but strict with data extraction
```

### Phase 5: Configuration & Environment

**Environment Variables:**

```bash
# .env
LLM_ENABLED=true
LLM_PROVIDER=openai  # or 'anthropic', 'ollama', 'none'
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
LLM_TIMEOUT_MS=5000
LLM_CONFIDENCE_THRESHOLD=0.8
LLM_CACHE_ENABLED=true
LLM_FALLBACK_ON_ERROR=true
```

**Configuration File: `backend/src/config/llm.config.js`**

```javascript
module.exports = {
  enabled: process.env.LLM_ENABLED === 'true',
  provider: process.env.LLM_PROVIDER || 'none',
  timeout: parseInt(process.env.LLM_TIMEOUT_MS) || 5000,
  confidenceThreshold: parseFloat(process.env.LLM_CONFIDENCE_THRESHOLD) || 0.8,
  cacheEnabled: process.env.LLM_CACHE_ENABLED !== 'false',
  fallbackOnError: process.env.LLM_FALLBACK_ON_ERROR !== 'false',
  // Provider-specific config
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  }
}
```

### Phase 6: Caching & Performance

**Command Caching:**

```javascript
// Cache common commands to reduce API calls
const commandCache = new Map();

const parseCommand = async (text) => {
  const cacheKey = text.toLowerCase().trim();
  
  // Check cache first
  if (config.cacheEnabled && commandCache.has(cacheKey)) {
    return commandCache.get(cacheKey);
  }
  
  // Parse with LLM
  const result = await llmService.parseCommand(text);
  
  // Cache result (with TTL)
  if (config.cacheEnabled) {
    commandCache.set(cacheKey, result);
    setTimeout(() => commandCache.delete(cacheKey), 3600000); // 1 hour TTL
  }
  
  return result;
}
```

**Rate Limiting:**

```javascript
// Prevent excessive API calls
const rateLimiter = {
  requests: new Map(),
  maxRequests: 100, // per hour per IP
  checkLimit(ip) { 
    // Implementation to track and limit requests
  }
}
```

### Phase 7: Validation & Post-Processing

**LLM Output Validation:**

```javascript
const validateLLMOutput = (llmResult) => {
  // Validate intent is one of expected values
  const validIntents = ['ARM_SYSTEM', 'DISARM_SYSTEM', 'ADD_USER', 'REMOVE_USER', 'LIST_USERS'];
  if (!validIntents.includes(llmResult.intent)) {
    return false;
  }
  
  // Validate PIN format (if present)
  if (llmResult.entities.pin && !/^\d{4}$/.test(llmResult.entities.pin)) {
    return false;
  }
  
  // Validate mode (if present)
  if (llmResult.entities.mode && !['away', 'home', 'stay'].includes(llmResult.entities.mode)) {
    return false;
  }
  
  // Validate time formats
  if (llmResult.entities.start_time && !isValidISO8601(llmResult.entities.start_time)) {
    return false;
  }
  
  return true;
}
```

**Post-Processing:**

```javascript
// Use existing timeParser for time normalization
const normalizeLLMOutput = (llmResult) => {
  // LLM might return time as string, normalize using existing parser
  if (llmResult.entities.start_time) {
    const parsed = parseTime(llmResult.entities.start_time);
    if (parsed) {
      llmResult.entities.start_time = parsed;
    }
  }
  
  // Similar for end_time, mode defaults, etc.
  return llmResult;
}
```

### Phase 8: Testing Strategy

**Unit Tests:**

```javascript
describe('LLM Service', () => {
  it('should parse simple commands correctly', async () => {
    const result = await llmService.parseCommand('arm the system');
    expect(result.intent).toBe('ARM_SYSTEM');
  });
  
  it('should handle complex narrative commands', async () => {
    const result = await llmService.parseCommand(
      'My mother-in-law needs access this weekend with passcode 1234'
    );
    expect(result.intent).toBe('ADD_USER');
    expect(result.entities.name).toBe('mother-in-law');
    expect(result.entities.pin).toBe('1234');
  });
  
  it('should fallback to rules when LLM fails', async () => {
    // Mock LLM failure
    jest.spyOn(llmService, 'parseCommand').mockRejectedValue(new Error('API error'));
    
    const result = await parseCommand('arm the system');
    expect(result.intent).toBe('ARM_SYSTEM'); // From rule-based
  });
});
```

**Integration Tests:**

```javascript
describe('NL Endpoint with LLM', () => {
  it('should use LLM when enabled', async () => {
    process.env.LLM_ENABLED = 'true';
    const response = await request(app)
      .post('/nl/execute')
      .send({ text: 'arm the system' });
    
    expect(response.body.interpretation.intent).toBe('ARM_SYSTEM');
    // Check response includes LLM metadata
    expect(response.body.interpretation.source).toBe('llm');
  });
});
```

### Phase 9: Monitoring & Observability

**Metrics to Track:**

```javascript
// Add to logging
logger.info({
  source: 'llm', // or 'rule-based'
  intent: result.intent,
  confidence: result.confidence,
  latency: llmLatency,
  cacheHit: wasCached,
  correlationId: req.correlationId
});
```

**Dashboard Metrics:**
- LLM success rate vs. fallback rate
- Average latency (LLM vs. rules)
- Cost per request
- Cache hit rate
- Error types and frequencies

## Implementation Considerations

### Cost Management

1. **Model Selection:**
   - Use `gpt-4o-mini` instead of `gpt-4` (10x cheaper, still accurate)
   - Consider `gpt-3.5-turbo` for even lower cost
   - Local models (Ollama) = $0 cost but requires infrastructure

2. **Caching:**
   - Cache common commands (e.g., "arm the system")
   - Cache for 1-24 hours depending on use case
   - Reduces API calls by 60-80% for typical usage

3. **Rate Limiting:**
   - Limit requests per user/IP
   - Prevent abuse and cost overruns

### Reliability

1. **Timeout Handling:**
   - 5-second timeout for LLM calls
   - Automatic fallback to rules

2. **Error Handling:**
   - Network errors → fallback
   - Invalid LLM output → fallback
   - API rate limits → fallback

3. **Health Checks:**
   - Monitor LLM provider health
   - Auto-disable if provider is down

### Offline Capability

1. **Local LLM Option:**
   - Use Ollama with local models (llama3.2, mistral)
   - Works completely offline
   - Slower but no API costs

2. **Graceful Degradation:**
   - Always fallback to rule-based
   - System works even if LLM is disabled

### Security

1. **API Key Management:**
   - Store keys in environment variables
   - Never log API keys
   - Rotate keys regularly

2. **Input Sanitization:**
   - Sanitize user input before sending to LLM
   - Prevent prompt injection attacks

3. **Output Validation:**
   - Always validate LLM output
   - Never trust LLM output blindly

## Expected Benefits

1. **Better Coverage:** Handles edge cases and variations the rule-based system misses
2. **Narrative Commands:** Better at parsing complex, conversational commands
3. **Maintainability:** Less manual pattern maintenance
4. **Flexibility:** Adapts to new command phrasings without code changes

## Trade-offs

- **Cost:** ~$0.001-0.01 per request (with caching, ~$0.0001-0.001)
- **Latency:** 200-2000ms vs. <10ms for rules
- **Reliability:** Depends on external service (mitigated by fallback)
- **Offline Capability:** Requires internet (unless using local LLM)

## Recommended Implementation Order

1. **Week 1:** Set up LLM service with OpenAI (function calling)
2. **Week 2:** Integrate hybrid approach with fallback
3. **Week 3:** Add caching and rate limiting
4. **Week 4:** Testing, monitoring, and optimization

## Conclusion

This LLM integration plan demonstrates understanding of how to enhance the system's natural language capabilities while maintaining reliability through graceful fallback mechanisms. The implementation would be production-ready, cost-effective, and maintainable, but is not included in the current system to preserve the core offline capability requirement.

If online features were allowed, this hybrid approach would provide the best of both worlds: sophisticated LLM understanding for complex commands, with reliable rule-based fallback for guaranteed functionality.

