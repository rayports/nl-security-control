import React from 'react';
import CommandInput from './components/CommandInput/CommandInput';
import ResultsDisplay from './components/ResultsDisplay/ResultsDisplay';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import ExampleCommands from './components/ExampleCommands/ExampleCommands';
import { sendCommand } from './services/api';

function App() {
  // Temporarily expose sendCommand for testing in browser console
  // Remove this after wiring up the UI
  if (typeof window !== 'undefined') {
    window.testSendCommand = sendCommand;
  }
  const exampleCommands = [
    'arm the system',
    'disarm the system',
    'add user John with pin 1234',
    'show me all users'
  ];

  const handleCommandSubmit = (text) => {
    console.log('Command submitted:', text);
    // TODO: Implement API call
  };

  const handleCommandClick = (command) => {
    console.log('Example command clicked:', command);
    // TODO: Fill input with command
  };

  const handleRetry = () => {
    console.log('Retry clicked');
    // TODO: Implement retry logic
  };

  return (
    <div className="app">
      <header>
        <h1>Natural Language Security Control</h1>
      </header>

      <main>
        <ExampleCommands
          commands={exampleCommands}
          onCommandClick={handleCommandClick}
        />

        <CommandInput
          onSubmit={handleCommandSubmit}
          loading={false}
        />

        <ErrorDisplay
          error={null}
          onRetry={handleRetry}
        />

        <ResultsDisplay
          result={null}
        />
      </main>
    </div>
  );
}

export default App;

