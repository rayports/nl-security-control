export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const exampleCommands = [
  'arm the system',
  'disarm the system',
  'add user John with pin 4321',
  'show me all users',
  'remove user John'
];

export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  INVALID_RESPONSE: 'Invalid response from server.'
};

