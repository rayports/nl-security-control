import React from 'react';
import './CommandInput.css';

function CommandInput({ value, onChange, onSubmit, loading, disabled, placeholder, hintText }) {
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

  const handleKeyDown = (e) => {
    // Submit on Enter (but allow Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = value?.trim() || '';
      if (onSubmit && text && !loading) {
        onSubmit(text);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="command-input">
      <textarea
        value={value || ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Enter your command..."}
        disabled={disabled || loading}
        rows={3}
      />
      {hintText && (
        <div className="command-hint">
          {hintText}
        </div>
      )}
      <button type="submit" disabled={disabled || loading || !value?.trim()}>
        {loading ? 'Processing...' : 'Execute Command'}
      </button>
    </form>
  );
}

export default CommandInput;

