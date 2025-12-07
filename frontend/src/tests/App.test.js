import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../App';
import { sendCommand } from '../services/api';

// Mock the API service
jest.mock('../services/api');

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders core UI elements', () => {
    render(<App />);

    // Check for main heading
    expect(screen.getByText('Natural Language Security Control')).toBeInTheDocument();

    // Check for command input textarea with placeholder
    const { PLACEHOLDER_TEXT } = require('../utils/constants');
    expect(screen.getByPlaceholderText(PLACEHOLDER_TEXT)).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /execute command/i })).toBeInTheDocument();

    // Check for hint text
    const { HINT_TEXT } = require('../utils/constants');
    expect(screen.getByText(HINT_TEXT)).toBeInTheDocument();

    // Verify ExampleCommands component is NOT rendered
    expect(screen.queryByText(/example commands/i)).not.toBeInTheDocument();
  });

  test('handles successful command submission', async () => {
    const mockResponse = {
      text: 'arm the system',
      interpretation: {
        intent: 'ARM_SYSTEM',
        entities: { mode: 'away' }
      },
      api_call: {
        endpoint: '/api/arm-system',
        method: 'POST',
        payload: { mode: 'away' }
      },
      response: {
        success: true,
        state: { armed: true, mode: 'away' }
      }
    };

    sendCommand.mockResolvedValue(mockResponse);

    render(<App />);

    // Find the textarea and submit button
    const { PLACEHOLDER_TEXT } = require('../utils/constants');
    const textarea = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    const submitButton = screen.getByRole('button', { name: /execute command/i });

    // Type a command
    fireEvent.change(textarea, { target: { value: 'arm the system' } });
    expect(textarea).toHaveValue('arm the system');

    // Click submit
    fireEvent.click(submitButton);

    // Verify loading state (button should be disabled and show "Processing...")
    expect(screen.getByRole('button', { name: /processing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /processing/i })).toBeDisabled();

    // Verify API was called with correct text
    expect(sendCommand).toHaveBeenCalledWith('arm the system');
    expect(sendCommand).toHaveBeenCalledTimes(1);

    // Wait for command to appear in history (success indicator)
    await waitFor(() => {
      const historyContainer = screen.getByTestId('command-history');
      expect(within(historyContainer).getByText('arm the system')).toBeInTheDocument();
    });

    // Verify success indicator (✓) appears in history
    const historyContainer = screen.getByTestId('command-history');
    expect(within(historyContainer).getByText('✓')).toBeInTheDocument();

    // Verify button is no longer in loading state
    expect(screen.queryByRole('button', { name: /processing/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute command/i })).toBeInTheDocument();

    // Verify input field is cleared after command execution
    expect(textarea).toHaveValue('');
  });

  test('handles API error and displays error message', async () => {
    const mockError = new Error('Invalid command');
    sendCommand.mockRejectedValue(mockError);

    render(<App />);

    // Find the textarea and submit button
    const { PLACEHOLDER_TEXT } = require('../utils/constants');
    const textarea = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    const submitButton = screen.getByRole('button', { name: /execute command/i });

    // Type a command
    fireEvent.change(textarea, { target: { value: 'invalid command' } });

    // Click submit
    fireEvent.click(submitButton);

    // Verify API was called
    expect(sendCommand).toHaveBeenCalledWith('invalid command');

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    // Verify error message is displayed - query within error container to avoid matching textarea
    const errorContainer = screen.getByText(/error/i).closest('.error-display');
    expect(errorContainer).toBeInTheDocument();
    expect(within(errorContainer).getByText(/invalid command/i)).toBeInTheDocument();

    // Verify error appears in history
    await waitFor(() => {
      const historyContainer = screen.getByTestId('command-history');
      expect(within(historyContainer).getByText('invalid command')).toBeInTheDocument();
    });
    
    // Verify error indicator (✗) appears in history
    const historyContainer = screen.getByTestId('command-history');
    expect(within(historyContainer).getByText('✗')).toBeInTheDocument();
  });

  test('saves command to history after successful execution', async () => {
    const mockResponse = {
      text: 'arm the system',
      interpretation: { intent: 'ARM_SYSTEM' },
      api_call: { endpoint: '/api/arm-system' },
      response: { success: true }
    };

    sendCommand.mockResolvedValue(mockResponse);

    // Clear localStorage before test
    localStorage.clear();

    render(<App />);

    const { PLACEHOLDER_TEXT } = require('../utils/constants');
    const textarea = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    const submitButton = screen.getByRole('button', { name: /execute command/i });

    fireEvent.change(textarea, { target: { value: 'arm the system' } });
    fireEvent.click(submitButton);

    // Wait for command to appear in history
    await waitFor(() => {
      expect(screen.getByText(/command history/i)).toBeInTheDocument();
      const historyContainer = screen.getByTestId('command-history');
      expect(within(historyContainer).getByText('arm the system')).toBeInTheDocument();
    });

    // Verify command appears in history (scope to history container)
    const historyContainer = screen.getByTestId('command-history');
    expect(within(historyContainer).getByText('arm the system')).toBeInTheDocument();

    // Verify history is saved to localStorage
    const stored = localStorage.getItem('nl-security-command-history');
    expect(stored).toBeTruthy();
    const history = JSON.parse(stored);
    expect(history).toHaveLength(1);
    expect(history[0].command).toBe('arm the system');
    expect(history[0].success).toBe(true);
    // Verify full result data is stored
    expect(history[0].result).toEqual(mockResponse);
    expect(history[0].error).toBeNull();
  });

  test('saves failed command to history', async () => {
    const mockError = new Error('Invalid command');
    sendCommand.mockRejectedValue(mockError);

    localStorage.clear();

    render(<App />);

    const { PLACEHOLDER_TEXT } = require('../utils/constants');
    const textarea = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    const submitButton = screen.getByRole('button', { name: /execute command/i });

    fireEvent.change(textarea, { target: { value: 'invalid command' } });
    fireEvent.click(submitButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    // Verify history appears with failed command
    await waitFor(() => {
      expect(screen.getByText(/command history/i)).toBeInTheDocument();
    });

    // Verify failed command appears in history (scope to history container)
    const historyContainer = screen.getByTestId('command-history');
    expect(within(historyContainer).getByText('invalid command')).toBeInTheDocument();

    // Verify history is saved with success: false
    const stored = localStorage.getItem('nl-security-command-history');
    const history = JSON.parse(stored);
    expect(history).toHaveLength(1);
    expect(history[0].command).toBe('invalid command');
    expect(history[0].success).toBe(false);
    // Verify error message is stored
    expect(history[0].error).toBe('Invalid command');
    expect(history[0].result).toBeNull();
  });

  test('loads command history from localStorage on mount', () => {
    const mockHistory = [
      { command: 'arm the system', timestamp: new Date().toISOString(), success: true },
      { command: 'disarm the system', timestamp: new Date().toISOString(), success: true }
    ];
    localStorage.setItem('nl-security-command-history', JSON.stringify(mockHistory));

    render(<App />);

    // Verify history is displayed
    expect(screen.getByText(/command history/i)).toBeInTheDocument();
    
    // Verify commands appear in history (scope to history container)
    const historyContainer = screen.getByTestId('command-history');
    expect(within(historyContainer).getByText('arm the system')).toBeInTheDocument();
    expect(within(historyContainer).getByText('disarm the system')).toBeInTheDocument();
  });

  test('handles backward compatibility with old history format (without result/error)', () => {
    // Old history format without result/error fields
    const oldFormatHistory = [
      { command: 'old command', timestamp: new Date().toISOString(), success: true }
    ];
    localStorage.setItem('nl-security-command-history', JSON.stringify(oldFormatHistory));

    render(<App />);

    // Verify history loads without errors
    expect(screen.getByText(/command history/i)).toBeInTheDocument();
    const historyContainer = screen.getByTestId('command-history');
    expect(within(historyContainer).getByText('old command')).toBeInTheDocument();

    // Verify old format items have null result/error
    const stored = localStorage.getItem('nl-security-command-history');
    const history = JSON.parse(stored);
    expect(history[0].result).toBeNull();
    expect(history[0].error).toBeNull();
  });

  test('clicking history item shows detailed view', async () => {
    const mockHistory = [
      {
        command: 'arm the system',
        timestamp: new Date().toISOString(),
        success: true,
        result: {
          text: 'arm the system',
          interpretation: { intent: 'ARM_SYSTEM' },
          api_call: { endpoint: '/api/arm-system' },
          response: { success: true }
        },
        error: null
      }
    ];
    localStorage.setItem('nl-security-command-history', JSON.stringify(mockHistory));

    render(<App />);

    const { PLACEHOLDER_TEXT } = require('../utils/constants');
    const textarea = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    
    // Find and click history item
    const historyItem = screen.getByTestId('history-item-0');
    fireEvent.click(historyItem);

    // Verify detailed view is shown
    expect(screen.getByText('Command Details')).toBeInTheDocument();
    expect(screen.getByText('Original Command')).toBeInTheDocument();
    
    // Scope query to detail view modal to avoid matching history item
    const detailModal = screen.getByText('Command Details').closest('.history-detail-modal');
    expect(within(detailModal).getByText('arm the system')).toBeInTheDocument();

    // Verify command is NOT populated in textarea
    expect(textarea).toHaveValue('');
  });

  test('limits history to MAX_HISTORY_ITEMS (10)', async () => {
    sendCommand.mockResolvedValue({ text: 'test', interpretation: {}, api_call: {}, response: { success: true } });

    localStorage.clear();
    render(<App />);

    const { PLACEHOLDER_TEXT } = require('../utils/constants');
    const textarea = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    const submitButton = screen.getByRole('button', { name: /execute command/i });

    // Execute 12 commands
    for (let i = 1; i <= 12; i++) {
      fireEvent.change(textarea, { target: { value: `command ${i}` } });
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(sendCommand).toHaveBeenCalledWith(`command ${i}`);
      });
    }

    // Verify only 10 items in history
    const stored = localStorage.getItem('nl-security-command-history');
    const history = JSON.parse(stored);
    expect(history).toHaveLength(10);
    // Most recent should be command 12
    expect(history[0].command).toBe('command 12');
    // Oldest should be command 3 (commands 1 and 2 should be removed)
    expect(history[9].command).toBe('command 3');
  });

});

