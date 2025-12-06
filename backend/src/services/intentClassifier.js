const classifyIntent = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lowerText = text.toLowerCase().trim();

  // DISARM_SYSTEM patterns (check first to avoid matching "arm" in "disarm")
  const disarmPatterns = [
    /disarm\s+(the\s+)?system/i,
    /turn\s+off\s+(the\s+)?(alarm|system)/i,
    /deactivate\s+(the\s+)?(alarm|system)/i,
    /disable\s+(the\s+)?(alarm|system)/i,
    /turn\s+it\s+off/i,
    /shut\s+off\s+(the\s+)?(alarm|system)/i
  ];

  // ARM_SYSTEM patterns (more specific to avoid matching "disarm")
  const armPatterns = [
    /^arm\s+(the\s+)?system/i,
    /\barm\s+(the\s+)?system\b/i,
    /turn\s+on\s+(the\s+)?(alarm|system)/i,
    /activate\s+(the\s+)?(alarm|system)/i,
    /enable\s+(the\s+)?(alarm|system)/i,
    /set\s+(the\s+)?(alarm|system)\s+to\s+(armed|on)/i
  ];

  // ADD_USER patterns
  const addUserPatterns = [
    /add\s+(a\s+)?user/i,
    /create\s+(a\s+)?user/i,
    /register\s+(a\s+)?user/i,
    /new\s+user/i
  ];

  // REMOVE_USER patterns
  const removeUserPatterns = [
    /remove\s+(a\s+)?user/i,
    /delete\s+(a\s+)?user/i,
    /unregister\s+(a\s+)?user/i,
    /drop\s+(a\s+)?user/i,
    /^remove\s+[A-Z][a-z]+/i,
    /^delete\s+[A-Z][a-z]+/i
  ];

  // LIST_USERS patterns
  const listUsersPatterns = [
    /list\s+(all\s+)?users/i,
    /show\s+(me\s+)?(all\s+)?users/i,
    /get\s+(all\s+)?users/i,
    /display\s+(all\s+)?users/i,
    /who\s+(are\s+)?(the\s+)?users/i,
    /users?\s+list/i
  ];

  // Check patterns in order of specificity (DISARM before ARM)
  if (disarmPatterns.some(pattern => pattern.test(lowerText))) {
    return 'DISARM_SYSTEM';
  }

  if (armPatterns.some(pattern => pattern.test(lowerText))) {
    return 'ARM_SYSTEM';
  }

  if (addUserPatterns.some(pattern => pattern.test(lowerText))) {
    return 'ADD_USER';
  }

  if (removeUserPatterns.some(pattern => pattern.test(lowerText))) {
    return 'REMOVE_USER';
  }

  if (listUsersPatterns.some(pattern => pattern.test(lowerText))) {
    return 'LIST_USERS';
  }

  return null;
};

module.exports = {
  classifyIntent
};

