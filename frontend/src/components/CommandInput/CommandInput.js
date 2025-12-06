import React from 'react';
import './CommandInput.css';

function CommandInput({ value, onChange, onSubmit, loading, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = value?.trim() || '';
    if (onSubmit && text && !loading) {
      onSubmit(text);
    }
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="command-input">
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder="Enter your command..."
        disabled={disabled || loading}
        rows={3}
      />
      <button type="submit" disabled={disabled || loading || !value?.trim()}>
        {loading ? 'Processing...' : 'Execute Command'}
      </button>
    </form>
  );
}

export default CommandInput;

