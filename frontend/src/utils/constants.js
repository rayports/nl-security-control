export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const PLACEHOLDER_TEXT = "Try: 'arm the system' or 'add user John with pin 4321'";

export const HINT_TEXT = "You can arm/disarm the system, add/remove users, or list all users using natural language.";

export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  INVALID_RESPONSE: 'Invalid response from server.'
};

