import { API_BASE_URL } from '../utils/constants';

export const sendCommand = async (text) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Command text is required');
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
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
};

