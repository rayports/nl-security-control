import React, { useState } from 'react';
import CommandInput from './components/CommandInput/CommandInput';
import ResultsDisplay from './components/ResultsDisplay/ResultsDisplay';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import ExampleCommands from './components/ExampleCommands/ExampleCommands';
import { sendCommand } from './services/api';
import { exampleCommands } from './utils/constants';

function App() {
  const [commandText, setCommandText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (text) => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await sendCommand(text);
      setResult(response);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
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

