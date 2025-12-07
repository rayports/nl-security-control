/**
 * Command Aliases - Maps creative/natural language aliases to standard intents
 * This allows users to use memorable phrases like "sesame open" instead of "disarm the system"
 */

const ALIASES = {
  // DISARM_SYSTEM aliases
  'sesame open': 'DISARM_SYSTEM',
  'open sesame': 'DISARM_SYSTEM',
  'unlock': 'DISARM_SYSTEM',
  'unlock system': 'DISARM_SYSTEM',
  'open the door': 'DISARM_SYSTEM',
  'let me in': 'DISARM_SYSTEM',
  
  // ARM_SYSTEM aliases
  'sesame close': 'ARM_SYSTEM',
  'close sesame': 'ARM_SYSTEM',
  'lock': 'ARM_SYSTEM',
  'lock system': 'ARM_SYSTEM',
  'lock up': 'ARM_SYSTEM',
  'secure': 'ARM_SYSTEM',
  'secure the system': 'ARM_SYSTEM',
  'guard mode': 'ARM_SYSTEM',
  'protect': 'ARM_SYSTEM',
  
  // LIST_USERS aliases
  'who is here': 'LIST_USERS',
  'show guests': 'LIST_USERS',
  'who has access': 'LIST_USERS',
  'access list': 'LIST_USERS',
  
  // ADD_USER aliases (less common, but included for completeness)
  'invite': 'ADD_USER',
  'grant access': 'ADD_USER',
  
  // REMOVE_USER aliases
  'revoke access': 'REMOVE_USER',
  'kick out': 'REMOVE_USER',
  'remove access': 'REMOVE_USER'
};

/**
 * Check if a command text matches any alias
 * @param {string} text - Command text to check
 * @returns {string|null} - Intent if alias found, null otherwise
 */
const checkAlias = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lowerText = text.toLowerCase().trim();
  
  // Direct match
  if (ALIASES[lowerText]) {
    return ALIASES[lowerText];
  }
  
  // Check for aliases that might be part of a longer sentence
  // e.g., "please sesame open" or "sesame open now"
  for (const [alias, intent] of Object.entries(ALIASES)) {
    // Match alias as a whole phrase (word boundaries)
    const aliasPattern = new RegExp(`\\b${alias.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (aliasPattern.test(lowerText)) {
      return intent;
    }
  }
  
  return null;
};

/**
 * Get all available aliases for a given intent (for documentation/testing)
 * @param {string} intent - Intent to get aliases for
 * @returns {string[]} - Array of alias phrases
 */
const getAliasesForIntent = (intent) => {
  return Object.entries(ALIASES)
    .filter(([_, mappedIntent]) => mappedIntent === intent)
    .map(([alias, _]) => alias);
};

module.exports = {
  checkAlias,
  getAliasesForIntent,
  ALIASES
};

