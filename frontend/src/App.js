import React, { useState, useEffect } from 'react';
import CommandInput from './components/CommandInput/CommandInput';
import ResultsDisplay from './components/ResultsDisplay/ResultsDisplay';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import ExampleCommands from './components/ExampleCommands/ExampleCommands';
import CommandHistory from './components/CommandHistory/CommandHistory';
import { sendCommand } from './services/api';
import { exampleCommands } from './utils/constants';

const HISTORY_STORAGE_KEY = 'nl-security-command-history';
const MAX_HISTORY_ITEMS = 10;

function App() {
  const [commandText, setCommandText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const history = parsed.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
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
    setResult(null);
    setLoading(true);

    try {
      const response = await sendCommand(text);
      setResult(response);
      setError(null);
      
      // Add successful command to history
      addToHistory(text, true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setResult(null);
      
      // Add failed command to history
      addToHistory(text, false);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (command, success) => {
    const historyItem = {
      command: command.trim(),
      timestamp: new Date(),
      success: success
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

  const handleCommandSelect = (command) => {
    setCommandText(command);
    setError(null);
  };

  const handleRetry = () => {
    if (commandText.trim()) {
      handleSubmit(commandText);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Natural Language Security Control</h1>
      </header>

      <main>
        <ExampleCommands
          commands={exampleCommands}
          onCommandClick={handleCommandSelect}
        />

        <CommandInput
          value={commandText}
          onChange={setCommandText}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <CommandHistory
          history={commandHistory}
          onCommandSelect={handleCommandSelect}
        />

        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
        />

        <ResultsDisplay
          result={result}
        />
      </main>
    </div>
  );
}

export default App;

