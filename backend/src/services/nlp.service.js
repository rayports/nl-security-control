const { classifyIntent } = require('./intentClassifier');
const { parseTime, parseWeekendRange } = require('../utils/timeParser');
const chrono = require('chrono-node');

const parseCommand = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text input is required');
  }

  const intent = classifyIntent(text);
  if (!intent) {
    throw new Error('I didn\'t understand that command. Try phrases like "arm the system", "add user John with pin 1234", or "show me all users".');
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
      // NEW: "add John 1234" or "register John 5678" - name directly after verb, before PIN
      /^(?:add|register|create)\s+([A-Z][a-z]+)\s+(?:with\s+)?(?:pin|passcode|code)\s+\d{4}/i,
      /^(?:add|register|create)\s+([A-Z][a-z]+)\s+\d{4}/i,  // "add John 1234"
      // NEW: "register John" or "add Alice" (without PIN yet)
      /^(?:register|add|create)\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|$)/i,
      // "remove user John" - captures just the name
      /(?:remove|delete)\s+user\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|\s+using|$)/i,
      // "remove John" or "delete Alice" - captures just the name
      /(?:remove|delete)\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|\s+using|$)/i,
      // "unregister John" - captures just the name
      /unregister\s+([A-Z][a-z]+)(?:\s+with|\s+pin|\s+passcode|\s+using|$)/i,
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

    // Fallback name extraction heuristic for narrative commands
    // When existing patterns don't find a clear name (or find an incorrect one like "system"),
    // try to extract relationship terms from narrative text
    // This handles cases like "My mother-in-law... make sure she can arm... using passcode 1234"
    if (intent === 'ADD_USER') {
      const relationshipTerms = [
        'mother-in-law',
        'father-in-law',
        'mother',
        'father',
        'sister',
        'brother',
        'guest',
        'visitor'
      ];
      
      const lowerText = text.toLowerCase();
      let foundRelationshipTerm = null;
      
      for (const term of relationshipTerms) {
        // Look for "my <term>" or "<term>" patterns
        const pattern = new RegExp(`(?:my\\s+)?${term.replace(/-/g, '\\-')}`, 'i');
        if (pattern.test(lowerText)) {
          foundRelationshipTerm = term;
          break;
        }
      }
      
      // Override name if we found a relationship term (this handles narrative commands where
      // existing patterns might incorrectly match words like "system" from "our system using passcode")
      if (foundRelationshipTerm) {
        entities.name = foundRelationshipTerm;
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
    // Check for time expressions - scheduling is not supported
    // Look for time indicators that suggest scheduling
    const timeIndicators = [
      /\b(?:next|this|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend|christmas|thanksgiving)\s+\d{1,2}\s*(?:am|pm|:\d{2})/i,  // "next tuesday 9pm"
      /\b(?:next|this|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend)\b/i,  // "next tuesday", "tomorrow"
      /\b\d{1,2}\s*(?:am|pm|:\d{2})\b/i,  // "9pm", "10:30"
      /\b(?:at|on|in)\s+(?:next|this|tomorrow|\d)/i  // "at 9pm", "on tuesday"
    ];
    
    const hasTimeExpression = timeIndicators.some(pattern => pattern.test(text));
    
    if (hasTimeExpression) {
      // Try to parse a time to confirm it's a real time expression
      const parsedTime = chrono.parseDate(text);
      if (parsedTime && parsedTime.getTime() > new Date().getTime()) {
        // It's a future time - this is a scheduling request
        throw new Error('Scheduling is not supported. The system cannot arm at a specific time in the future. Please use "arm the system" to arm immediately.');
      }
    }
    
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

  // Check for time expressions in DISARM_SYSTEM commands (scheduling not supported)
  if (intent === 'DISARM_SYSTEM') {
    const timeIndicators = [
      /\b(?:next|this|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend)\s+\d{1,2}\s*(?:am|pm|:\d{2})/i,
      /\b(?:next|this|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend)\b/i,
      /\b\d{1,2}\s*(?:am|pm|:\d{2})\b/i,
      /\b(?:at|on|in)\s+(?:next|this|tomorrow|\d)/i
    ];
    
    const hasTimeExpression = timeIndicators.some(pattern => pattern.test(text));
    
    if (hasTimeExpression) {
      const parsedTime = chrono.parseDate(text);
      if (parsedTime && parsedTime.getTime() > new Date().getTime()) {
        throw new Error('Scheduling is not supported. The system cannot disarm at a specific time in the future. Please use "disarm the system" to disarm immediately.');
      }
    }
  }

  // Extract time expressions (for ADD_USER with time ranges)
  if (intent === 'ADD_USER') {
    // First, check if the text contains standalone "this weekend" or "next weekend"
    // Extract the weekend phrase from the text (not part of "from X to Y")
    const weekendMatch = text.match(/\b(this|next)\s+weekend\b/i);
    if (weekendMatch && !text.match(/from\s+.*\s+to\s+.*weekend/i)) {
      const weekendPhrase = weekendMatch[0].toLowerCase();
      const weekendRange = parseWeekendRange(weekendPhrase);
      if (weekendRange) {
        entities.start_time = weekendRange.start;
        entities.end_time = weekendRange.end;
      }
    }
    
    // If we didn't find a standalone weekend, continue with other patterns
    if (!entities.start_time && !entities.end_time) {
      // Try to match "from X to Y" pattern (most specific)
      // Match "from <time1> to <time2>" where time expressions can contain spaces
      // Enhanced to handle "from today 5pm to next tuesday 5pm", "from this weekend to next weekend", etc.
      const fromToPattern = /from\s+(.+?)\s+to\s+(.+?)(?:\s+with|\s+pin|\s+passcode|$)/i;
      const fromToMatch = text.match(fromToPattern);
      
      if (fromToMatch && fromToMatch[1] && fromToMatch[2]) {
        const startTimeText = fromToMatch[1].trim();
        const endTimeText = fromToMatch[2].trim();
        
        // Check if either is a weekend range
        const startWeekend = parseWeekendRange(startTimeText);
        const endWeekend = parseWeekendRange(endTimeText);
        
        let parsedStartTime = null;
        if (startWeekend) {
          parsedStartTime = startWeekend.start;
          entities.start_time = parsedStartTime;
        } else {
          parsedStartTime = parseTime(startTimeText);
          if (parsedStartTime) {
            // If "today 5pm" is in the past, adjust to tomorrow at 5pm
            const now = new Date();
            if (parsedStartTime.getTime() < now.getTime() && startTimeText.toLowerCase().includes('today')) {
              // It's "today X" but that time has passed - move to tomorrow
              const tomorrow = new Date(now);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const hours = parsedStartTime.getHours();
              const minutes = parsedStartTime.getMinutes();
              tomorrow.setHours(hours, minutes, 0, 0);
              parsedStartTime = tomorrow;
            }
            entities.start_time = parsedStartTime;
          }
        }
        
        if (endWeekend) {
          entities.end_time = endWeekend.end; // Use end of weekend range
        } else {
          // Use the start time as reference for parsing the end time
          // This ensures "Sunday" means the Sunday after the start time
          const referenceDate = parsedStartTime || new Date();
          const parsedEndTime = parseTime(endTimeText, referenceDate);
          if (parsedEndTime) {
            // If end time is before start time, it might be the wrong week
            // Try parsing with a later reference if we have a start time
            if (parsedStartTime && parsedEndTime.getTime() <= parsedStartTime.getTime()) {
              // End time is before or equal to start time - try parsing with a later reference
              const laterReference = new Date(parsedStartTime);
              laterReference.setDate(laterReference.getDate() + 7); // Add a week
              const retryEndTime = parseTime(endTimeText, laterReference);
              if (retryEndTime && retryEndTime.getTime() > parsedStartTime.getTime()) {
                entities.end_time = retryEndTime;
              } else {
                entities.end_time = parsedEndTime; // Use original, validation will catch if wrong
              }
            } else {
              entities.end_time = parsedEndTime;
            }
          }
        }
      } else {
        // Try standalone time expressions with keywords
        // Look for patterns like "until next friday", "starting Monday", "from 5pm", etc.
        const timeKeywords = ['from', 'until', 'to', 'starting', 'beginning', 'end'];
        const lowerText = text.toLowerCase();
        
        // Check for "until <time>" or "to <time>" patterns
        const untilPattern = /(?:until|to)\s+(.+?)(?:\s+with|\s+pin|\s+passcode|$)/i;
        const untilMatch = text.match(untilPattern);
        if (untilMatch && untilMatch[1]) {
          const timeText = untilMatch[1].trim();
          const weekend = parseWeekendRange(timeText);
          if (weekend) {
            entities.end_time = weekend.end;
          } else {
            const parsedTime = parseTime(timeText);
            if (parsedTime) {
              entities.end_time = parsedTime;
            }
          }
        }
        
        // Check for "from <time>" or "starting <time>" patterns
        const fromPattern = /(?:from|starting|beginning)\s+(.+?)(?:\s+with|\s+pin|\s+passcode|$)/i;
        const fromMatch = text.match(fromPattern);
        if (fromMatch && fromMatch[1]) {
          const timeText = fromMatch[1].trim();
          const weekend = parseWeekendRange(timeText);
          if (weekend) {
            entities.start_time = weekend.start;
          } else {
            const parsedTime = parseTime(timeText);
            if (parsedTime) {
              entities.start_time = parsedTime;
            }
          }
        }
        
        // If no specific time keywords found, try parsing standalone time expressions
        // This handles cases like "add user John until next friday" (without "until" keyword)
        if (!entities.start_time && !entities.end_time) {
          // Look for time expressions that might be standalone
          // Try parsing phrases that contain time-related words
          const timePhrases = [
            /(?:this|next)\s+weekend/i,
            /(?:this|next)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
            /(?:this|next)\s+christmas/i,
            /(?:this|next)\s+thanksgiving/i,
            /tomorrow/i,
            /today\s+\d+pm/i,
            /\d+pm/i
          ];
          
          for (const phrase of timePhrases) {
            const match = text.match(phrase);
            if (match) {
              const parsedTime = parseTime(match[0]);
              if (parsedTime) {
                // If we found a time but no start_time, use it as end_time (common pattern: "until X")
                if (!entities.end_time) {
                  entities.end_time = parsedTime;
                }
                break;
              }
            }
          }
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

