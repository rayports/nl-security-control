const { checkAlias } = require('../utils/commandAliases');

const classifyIntent = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lowerText = text.toLowerCase().trim();
  
  // Check for command aliases first (e.g., "sesame open" -> DISARM_SYSTEM)
  const aliasIntent = checkAlias(text);
  if (aliasIntent) {
    return aliasIntent;
  }

  // DISARM_SYSTEM patterns (check first to avoid matching "arm" in "disarm")
  const disarmPatterns = [
    /disarm\s+(the\s+)?system/i,
    /^disarm$/i,  // "disarm" as standalone word
    /disarm\s+(it|now)/i,  // "disarm it", "disarm now"
    /turn\s+off\s+(the\s+)?(alarm|system)/i,
    /turn\s+(it|the\s+system)\s+off/i,  // "turn it off", "turn the system off"
    /deactivate\s+(the\s+)?(alarm|system)/i,
    /disable\s+(the\s+)?(alarm|system)/i,
    /shut\s+off\s+(the\s+)?(alarm|system)/i,
    /stop\s+(the\s+)?(alarm|system)/i  // "stop the alarm"
  ];

  // ARM_SYSTEM patterns (more specific to avoid matching "disarm")
  const armPatterns = [
    /^arm\s+(the\s+)?system/i,
    /\barm\s+(the\s+)?system\b/i,
    /\barm\s+(it|now)\b/i,  // "arm it", "arm now"
    /turn\s+on\s+(the\s+)?(alarm|system)/i,
    /activate\s+(the\s+)?(alarm|system)/i,
    /enable\s+(the\s+)?(alarm|system)/i,
    /set\s+(the\s+)?(alarm|system)\s+to\s+(armed|on)/i,
    /set\s+to\s+(away|home|stay)\s+mode/i,  // "set to away mode"
    /(away|home|stay)\s+mode/i,  // "away mode", "home mode" (standalone)
    /start\s+(the\s+)?(alarm|system)/i  // "start the alarm"
  ];

  // REMOVE_USER patterns (check before ADD_USER to avoid "unregister" matching "register")
  const removeUserPatterns = [
    /remove\s+(a\s+)?user/i,
    /delete\s+(a\s+)?user/i,
    /unregister\s+(a\s+)?user/i,
    /drop\s+(a\s+)?user/i,
    /^remove\s+[A-Z][a-z]+/i,  // "remove John"
    /^delete\s+[A-Z][a-z]+/i,  // "delete John"
    /remove\s+user\s+[A-Z][a-z]+/i,  // "remove user John"
    /delete\s+user\s+[A-Z][a-z]+/i,  // "delete user John"
    /remove\s+by\s+pin\s+\d{4}/i,  // "remove by pin 1234"
    /remove\s+by\s+passcode\s+\d{4}/i,  // "remove by passcode 1234"
    /delete\s+by\s+pin\s+\d{4}/i,  // "delete by pin 1234"
    /unregister\s+[A-Z][a-z]+/i  // "unregister John"
  ];

  // ADD_USER patterns
  const addUserPatterns = [
    /add\s+(a\s+)?(?:temporary\s+|new\s+)?user/i,
    /create\s+(a\s+)?(?:temporary\s+|new\s+)?user/i,
    /^register\s+(a\s+)?(?:temporary\s+|new\s+)?user/i,
    /\bregister\s+(a\s+)?(?:temporary\s+|new\s+)?user\b/i,
    /new\s+user/i,
    // Patterns without "user" keyword: "add John 1234", "register Alice 5678"
    /^(?:add|register|create)\s+[A-Z][a-z]+\s+(?:with\s+)?(?:pin|passcode|code)\s+\d{4}/i,
    /^(?:add|register|create)\s+[A-Z][a-z]+\s+\d{4}/i,  // "add John 1234"
    // "register John", "add Alice" (will need PIN extraction separately)
    /^(?:register|add|create)\s+[A-Z][a-z]+(?:\s+with|\s+pin|\s+passcode|$)/i
  ];

  // LIST_USERS patterns
  const listUsersPatterns = [
    /list\s+(all\s+)?users/i,
    /show\s+(me\s+)?(all\s+)?users/i,
    /show\s+users/i,  // "show users" (without "all")
    /get\s+(all\s+)?users/i,
    /display\s+(all\s+)?users/i,
    /who\s+(are\s+)?(the\s+)?users/i,
    /who'?s\s+(registered|here|in\s+the\s+system)/i,  // "who's registered", "who's here"
    /users?\s+list/i,
    /(?:list|show|get|display)\s+all/i  // "list all", "show all"
  ];

  // Check patterns in order of specificity
  // ADD_USER and REMOVE_USER should be checked first to avoid matching "arm"/"disarm" in permission contexts
  if (addUserPatterns.some(pattern => pattern.test(lowerText))) {
    return 'ADD_USER';
  }

  if (removeUserPatterns.some(pattern => pattern.test(lowerText))) {
    return 'REMOVE_USER';
  }

  // DISARM before ARM to avoid matching "arm" in "disarm"
  if (disarmPatterns.some(pattern => pattern.test(lowerText))) {
    return 'DISARM_SYSTEM';
  }

  if (armPatterns.some(pattern => pattern.test(lowerText))) {
    return 'ARM_SYSTEM';
  }

  if (listUsersPatterns.some(pattern => pattern.test(lowerText))) {
    return 'LIST_USERS';
  }

  // Narrative ADD_USER detection: if text contains passcode/pin AND permissions but no explicit "add user"
  // This is a heuristic for narrative commands like "My mother-in-law... make sure she can arm and disarm... using passcode 1234"
  const hasPasscode = /(?:passcode|pin)\s+\d{4}/i.test(text);
  const hasPermissions = /(?:can|able to)\s+(?:arm|disarm)/i.test(text);
  const hasExplicitAddUser = addUserPatterns.some(pattern => pattern.test(lowerText));
  
  if (hasPasscode && hasPermissions && !hasExplicitAddUser) {
    return 'ADD_USER';
  }

  // Ambiguous input detection
  // Check for commands that could match multiple intents
  const ambiguousPatterns = [
    {
      pattern: /\barm\s+user\b/i,  // "arm user" - could be ARM_SYSTEM or ADD_USER with permissions
      suggestion: 'Did you mean "arm the system" or "add user"?'
    },
    {
      pattern: /\bdisarm\s+user\b/i,  // "disarm user" - unclear
      suggestion: 'Did you mean "disarm the system" or "remove user"?'
    },
    {
      pattern: /^(arm|disarm|lock|unlock)$/i,  // Single word commands
      suggestion: 'Please be more specific. Try "arm the system" or "disarm the system".'
    }
  ];

  // If we detect ambiguous input but no clear intent, return null with context
  // (The error handler will provide a helpful message)
  for (const ambiguous of ambiguousPatterns) {
    if (ambiguous.pattern.test(lowerText) && !addUserPatterns.some(p => p.test(lowerText)) && 
        !removeUserPatterns.some(p => p.test(lowerText)) && 
        !armPatterns.some(p => p.test(lowerText)) && 
        !disarmPatterns.some(p => p.test(lowerText))) {
      return null;  // Will trigger "could not determine intent" with helpful error message
    }
  }

  return null;
};

module.exports = {
  classifyIntent
};

