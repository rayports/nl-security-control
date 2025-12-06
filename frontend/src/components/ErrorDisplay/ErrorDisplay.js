import React from 'react';
import './ErrorDisplay.css';

function ErrorDisplay({ error, onRetry }) {
  if (!error) {
    return null;
  }

  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <div className="error-display">
      <div className="error-message">
        <strong>Error:</strong> {errorMessage}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorDisplay;

