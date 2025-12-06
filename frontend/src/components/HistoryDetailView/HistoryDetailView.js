import React from 'react';
import './HistoryDetailView.css';

function HistoryDetailView({ historyItem, onClose }) {
  if (!historyItem) {
    return null;
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="history-detail-overlay" onClick={onClose}>
      <div className="history-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-detail-header">
          <h2>Command Details</h2>
          <button 
            className="history-detail-close" 
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        </div>

        <div className="history-detail-content">
          <section className="detail-section">
            <h3>Original Command</h3>
            <p>{historyItem.command}</p>
          </section>

          <section className="detail-section">
            <h3>Timestamp</h3>
            <p>{formatTimestamp(historyItem.timestamp)}</p>
          </section>

          {historyItem.success && historyItem.result ? (
            <>
              <section className="detail-section">
                <h3>Interpretation</h3>
                <pre>{JSON.stringify(historyItem.result.interpretation, null, 2)}</pre>
              </section>

              <section className="detail-section">
                <h3>API Call</h3>
                <pre>{JSON.stringify(historyItem.result.api_call, null, 2)}</pre>
              </section>

              <section className="detail-section">
                <h3>Response</h3>
                <pre>{JSON.stringify(historyItem.result.response, null, 2)}</pre>
              </section>
            </>
          ) : (
            <section className="detail-section error-section">
              <h3>Error</h3>
              <p className="error-message">{historyItem.error || 'Unknown error occurred'}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryDetailView;

