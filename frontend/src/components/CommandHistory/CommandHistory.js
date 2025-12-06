import React from 'react';
import './CommandHistory.css';

function CommandHistory({ history, onCommandSelect }) {
  if (!history || history.length === 0) {
    return null;
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="command-history" data-testid="command-history">
      <h3>Command History</h3>
      <div className="history-list">
        {history.map((item, index) => (
          <div
            key={index}
            className={`history-item ${item.success ? 'success' : 'error'}`}
            onClick={() => onCommandSelect && onCommandSelect(item.command)}
            data-testid={`history-item-${index}`}
          >
            <div className="history-command">{item.command}</div>
            <div className="history-meta">
              <span className="history-status">
                {item.success ? '✓' : '✗'}
              </span>
              <span className="history-timestamp">
                {formatTimestamp(item.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommandHistory;

