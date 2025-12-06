import React from 'react';
import './ResultsDisplay.css';

function ResultsDisplay({ result }) {
  if (!result) {
    return null;
  }

  return (
    <div className="results-display">
      <section className="result-section">
        <h3>User Input</h3>
        <p>{result.text}</p>
      </section>

      <section className="result-section">
        <h3>Interpretation</h3>
        <pre>{JSON.stringify(result.interpretation, null, 2)}</pre>
      </section>

      <section className="result-section">
        <h3>API Call</h3>
        <pre>{JSON.stringify(result.api_call, null, 2)}</pre>
      </section>

      <section className="result-section">
        <h3>Response</h3>
        <pre>{JSON.stringify(result.response, null, 2)}</pre>
      </section>
    </div>
  );
}

export default ResultsDisplay;

