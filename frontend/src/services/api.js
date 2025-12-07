import { API_BASE_URL } from '../utils/constants';

/**
 * Map technical error messages to user-friendly messages
 */
const getUserFriendlyError = (errorMessage) => {
  if (!errorMessage) {
    return 'An error occurred. Please try again.';
  }

  const lowerMessage = errorMessage.toLowerCase();

  // Map common technical errors to user-friendly messages
  if (lowerMessage.includes('could not determine intent') || 
      lowerMessage.includes('didn\'t understand')) {
    return 'I didn\'t understand that command. Try phrases like "arm the system", "add user John with pin 1234", or "show me all users".';
  }

  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (lowerMessage.includes('required') || lowerMessage.includes('missing')) {
    return 'Please provide a command to execute.';
  }

  // Return the original message if it's already user-friendly
  return errorMessage;
};

export const sendCommand = async (text) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Please enter a command.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/nl/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text.trim() })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `Server error: ${response.status}`;
      throw new Error(getUserFriendlyError(errorMessage));
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Apply user-friendly mapping to any error message
      const friendlyMessage = getUserFriendlyError(error.message);
      throw new Error(friendlyMessage);
    }
    throw new Error('Network error. Please check your connection.');
  }
};

