import React, { useState, useEffect } from 'react';
import CommandInput from './components/CommandInput/CommandInput';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import CommandHistory from './components/CommandHistory/CommandHistory';
import HistoryDetailView from './components/HistoryDetailView/HistoryDetailView';
import { sendCommand } from './services/api';
import { PLACEHOLDER_TEXT, HINT_TEXT } from './utils/constants';

const HISTORY_STORAGE_KEY = 'nl-security-command-history';
const MAX_HISTORY_ITEMS = 10;

function App() {
  const [commandText, setCommandText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        // Ensure backward compatibility with old history format (without result/error)
        const history = parsed.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp),
          // Old items may not have result/error, ensure they're set to null
          result: item.result || null,
          error: item.error || null
        }));
        setCommandHistory(history);
      }
    } catch (err) {
      console.error('Failed to load command history:', err);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(commandHistory));
    } catch (err) {
      console.error('Failed to save command history:', err);
    }
  }, [commandHistory]);

  const handleSubmit = async (text) => {
    setError(null);
    setLoading(true);

    try {
      const response = await sendCommand(text);
      setError(null);
      
      // Add successful command to history with full result data
      addToHistory(text, true, response, null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Add failed command to history with error message
      addToHistory(text, false, null, errorMessage);
    } finally {
      setLoading(false);
      // Clear the input field after command execution (success or failure)
      setCommandText('');
    }
  };

  const addToHistory = (command, success, result = null, error = null) => {
    const historyItem = {
      command: command.trim(),
      timestamp: new Date(),
      success: success,
      result: result || null,
      error: error || null
    };
    
    setCommandHistory(prev => {
      // Remove duplicates of the same command (keep most recent)
      const filtered = prev.filter(item => item.command !== historyItem.command);
      // Add new item at the beginning
      const updated = [historyItem, ...filtered];
      // Limit to MAX_HISTORY_ITEMS
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const handleHistoryItemClick = (historyItem) => {
    setSelectedHistoryItem(historyItem);
  };

  const handleCloseDetailView = () => {
    setSelectedHistoryItem(null);
  };

  return (
    <div className="app">
      <header>
        <h1>Natural Language Security Control</h1>
      </header>

      <main>
        <CommandInput
          value={commandText}
          onChange={setCommandText}
          onSubmit={handleSubmit}
          loading={loading}
          placeholder={PLACEHOLDER_TEXT}
          hintText={HINT_TEXT}
        />

        <ErrorDisplay
          error={error}
        />

        <CommandHistory
          history={commandHistory}
          onHistoryItemClick={handleHistoryItemClick}
        />

        <HistoryDetailView
          historyItem={selectedHistoryItem}
          onClose={handleCloseDetailView}
        />
      </main>
    </div>
  );
}

export default App;

