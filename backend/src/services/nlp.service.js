const { classifyIntent } = require('./intentClassifier');
const { parseTime } = require('../utils/timeParser');

const parseCommand = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text input is required');
  }

  const intent = classifyIntent(text);
  if (!intent) {
    throw new Error('Could not determine intent from command');
  }

  const entities = {};

  // Extract name (for ADD_USER and REMOVE_USER)
  if (intent === 'ADD_USER' || intent === 'REMOVE_USER') {
    // Patterns: "add user John", "user named Bob", "remove John", etc.
    // Be careful to not capture "add user" or "remove user" as the name
    const namePatterns = [
      // "user named John" or "user called John" - captures just the name
      /user\s+(?:named|called)\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|\s+using|,|$)/i,
      // "add a temporary user Sarah," or "add user John, she can..." - handles comma-separated format
      /(?:add|create)\s+(?:a\s+)?(?:temporary\s+|new\s+)?user\s+([A-Z][a-z]+)\s*,/i,
      // "add user John, she can..." or "add user John, he can..." - handles comma-separated format (fallback)
      /(?:add|create)\s+user\s+([A-Z][a-z]+)\s*,/i,
      // "add user John using passcode" - specific pattern for "using" (check before generic pattern)
      /(?:add|create)\s+user\s+([A-Z][a-z]+)\s+using/i,
      // "add user Bob passcode" - specific pattern for passcode without "with" or "using"
      /(?:add|create)\s+user\s+([A-Z][a-z]+)\s+passcode/i,
      // "add a temporary user Sarah" or "add user John" - captures just the name before "with", "pin", "passcode", or "using"
      /(?:add|create)\s+(?:a\s+)?(?:temporary\s+|new\s+)?user\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|\s+using|,|$)/i,
      // "remove user John" - captures just the name
      /(?:remove|delete)\s+user\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|\s+using|$)/i,
      // "add John with pin" or "remove John" - captures just the name
      /(?:add|remove|delete)\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|\s+using|$)/i,
      // "John with pin" or "John with passcode" (standalone name before pin/passcode) - captures just the name
      /\b([A-Z][a-z]+)\s+with\s+(?:pin|passcode)/i,
      // "John using passcode" - captures just the name
      /\b([A-Z][a-z]+)\s+using\s+passcode/i,
      // "John passcode" (name directly before passcode) - captures just the name
      /\b([A-Z][a-z]+)\s+passcode/i,
      // "add user Sarah 4321 passcode" - name before digits and passcode
      /(?:add|create)\s+user\s+([A-Z][a-z]+)\s+\d{4}\s+passcode/i
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const potentialName = match[1].trim();
        // Avoid capturing command words as names
        if (!['add', 'remove', 'delete', 'create', 'user', 'named', 'called'].includes(potentialName.toLowerCase())) {
          // The pattern already captured just the name, so use it directly
          // Only split if the name might contain extra words (shouldn't happen with current patterns)
          const nameParts = potentialName.split(/\s+/);
          entities.name = nameParts[0].trim();
          break;
        }
      }
    }
  }

  // Extract PIN (4-digit pattern) - supports both "pin" and "passcode"
  const pinPatterns = [
    /pin\s+(\d{4})/i,
    /with\s+pin\s+(\d{4})/i,
    /passcode\s+(\d{4})/i,
    /with\s+passcode\s+(\d{4})/i,
    /using\s+passcode\s+(\d{4})/i,
    /(\d{4})\s+pin/i,
    /(\d{4})\s+passcode/i,
    /\b(\d{4})\b/
  ];

  for (const pattern of pinPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      entities.pin = match[1];
      break;
    }
  }

  // Extract mode (for ARM_SYSTEM)
  if (intent === 'ARM_SYSTEM') {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('home')) {
      entities.mode = 'home';
    } else if (lowerText.includes('stay')) {
      entities.mode = 'stay';
    } else if (lowerText.includes('away')) {
      entities.mode = 'away';
    } else {
      // Default to 'away' if not specified
      entities.mode = 'away';
    }
  }

  // Extract time expressions (for ADD_USER with time ranges)
  if (intent === 'ADD_USER') {
    // First, try to match "from X to Y" pattern (most specific)
    // Match "from <time1> to <time2>" where time expressions can contain spaces
    const fromToPattern = /from\s+(.+?)\s+to\s+(.+?)(?:\s+with|\s+pin|\s+passcode|$)/i;
    const fromToMatch = text.match(fromToPattern);
    
    if (fromToMatch && fromToMatch[1] && fromToMatch[2]) {
      const startTimeText = fromToMatch[1].trim();
      const endTimeText = fromToMatch[2].trim();
      
      const parsedStartTime = parseTime(startTimeText);
      const parsedEndTime = parseTime(endTimeText);
      
      if (parsedStartTime) {
        entities.start_time = parsedStartTime;
      }
      if (parsedEndTime) {
        entities.end_time = parsedEndTime;
      }
    } else {
      // Fall back to existing logic for single time expressions
      // Try to find time expressions in the text
      // Look for patterns like "from 5pm", "until 10pm", "starting Monday", etc.
      const timeKeywords = ['from', 'until', 'to', 'starting', 'beginning', 'end'];
      const timeParts = text.split(/\s+/);
      
      let timeStartIdx = -1;
      let timeEndIdx = -1;

      for (let i = 0; i < timeParts.length; i++) {
        const part = timeParts[i].toLowerCase();
        if (timeKeywords.includes(part) && i + 1 < timeParts.length) {
          const timeText = timeParts.slice(i).join(' ');
          const parsedTime = parseTime(timeText);
          if (parsedTime) {
            if (part === 'from' || part === 'starting' || part === 'beginning') {
              entities.start_time = parsedTime;
            } else if (part === 'until' || part === 'to' || part === 'end') {
              entities.end_time = parsedTime;
            }
          }
        }
      }

      // Also try parsing the entire text for time expressions
      if (!entities.start_time && !entities.end_time) {
        const fullTime = parseTime(text);
        if (fullTime) {
          entities.start_time = fullTime;
        }
      }
    }

    // Extract permissions (for ADD_USER)
    entities.permissions = [];
    
    // Patterns for permission extraction
    // Check for "arm and disarm" or "disarm and arm" (both permissions)
    const armAndDisarmPattern = /(?:can|able to)\s+(?:arm\s+and\s+disarm|disarm\s+and\s+arm)/i;
    // Check for individual "can arm" or "able to arm"
    const canArmPattern = /(?:can|able to)\s+arm(?!\s+and\s+disarm)/i;
    // Check for individual "can disarm" or "able to disarm"
    const canDisarmPattern = /(?:can|able to)\s+disarm(?!\s+and\s+arm)/i;
    
    // Check for both permissions first (more specific)
    if (armAndDisarmPattern.test(text)) {
      entities.permissions = ['arm', 'disarm'];
    } else if (canArmPattern.test(text) && canDisarmPattern.test(text)) {
      // Both mentioned separately
      entities.permissions = ['arm', 'disarm'];
    } else if (canArmPattern.test(text)) {
      // Only arm permission
      entities.permissions = ['arm'];
    } else if (canDisarmPattern.test(text)) {
      // Only disarm permission
      entities.permissions = ['disarm'];
    }
    // Default: entities.permissions remains [] if no permissions mentioned
  }

  return {
    intent,
    entities
  };
};

module.exports = {
  parseCommand
};

