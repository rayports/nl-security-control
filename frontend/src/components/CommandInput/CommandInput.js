import React from 'react';
import './CommandInput.css';

function CommandInput({ onSubmit, loading, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('command');
    if (onSubmit && text) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="command-input">
      <textarea
        name="command"
        placeholder="Enter your command..."
        disabled={disabled || loading}
        rows={3}
      />
      <button type="submit" disabled={disabled || loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
}

export default CommandInput;

