import React from 'react';
import './ErrorDisplay.css';

function ErrorDisplay({ error }) {
  if (!error) {
    return null;
  }

  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <div className="error-display">
      <div className="error-message">
        <strong>Error:</strong> {errorMessage}
      </div>
    </div>
  );
}

export default ErrorDisplay;

