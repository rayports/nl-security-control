import React from 'react';
import './ExampleCommands.css';

function ExampleCommands({ commands, onCommandClick }) {
  if (!commands || commands.length === 0) {
    return null;
  }

  return (
    <div className="example-commands">
      <h3>Example Commands</h3>
      <div className="commands-list">
        {commands.map((command, index) => (
          <button
            key={index}
            onClick={() => onCommandClick && onCommandClick(command)}
            className="example-command-button"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExampleCommands;

