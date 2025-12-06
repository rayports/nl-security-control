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

    // Check for command input textarea
    expect(screen.getByPlaceholderText('Enter your command...')).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /execute command/i })).toBeInTheDocument();

    // Check for example commands section
    expect(screen.getByText(/example commands/i)).toBeInTheDocument();
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
    const textarea = screen.getByPlaceholderText('Enter your command...');
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

    // Wait for API to resolve and results to appear
    await waitFor(() => {
      expect(screen.getByText('User Input')).toBeInTheDocument();
    });

    // Verify results are displayed - query within results container to avoid matching example buttons
    const resultsContainer = screen.getByText('User Input').closest('.results-display');
    expect(resultsContainer).toBeInTheDocument();
    
    // Verify the result text appears in the results section (not just in textarea or example button)
    const userInputSection = within(resultsContainer).getByText('arm the system');
    expect(userInputSection).toBeInTheDocument();
    
    // Verify section headings
    expect(within(resultsContainer).getByText('Interpretation')).toBeInTheDocument();
    expect(within(resultsContainer).getByText('API Call')).toBeInTheDocument();
    expect(within(resultsContainer).getByText('Response')).toBeInTheDocument();

    // Verify button is no longer in loading state
    expect(screen.queryByRole('button', { name: /processing/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute command/i })).toBeInTheDocument();
  });

  test('handles API error and displays error message', async () => {
    const mockError = new Error('Invalid command');
    sendCommand.mockRejectedValue(mockError);

    render(<App />);

    // Find the textarea and submit button
    const textarea = screen.getByPlaceholderText('Enter your command...');
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

    // Verify retry button appears
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();

    // Verify results are not displayed
    expect(screen.queryByText('User Input')).not.toBeInTheDocument();
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

    const textarea = screen.getByPlaceholderText('Enter your command...');
    const submitButton = screen.getByRole('button', { name: /execute command/i });

    fireEvent.change(textarea, { target: { value: 'arm the system' } });
    fireEvent.click(submitButton);

    // Wait for command to complete
    await waitFor(() => {
      expect(screen.getByText('User Input')).toBeInTheDocument();
    });

    // Verify history appears
    await waitFor(() => {
      expect(screen.getByText(/command history/i)).toBeInTheDocument();
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
  });

  test('saves failed command to history', async () => {
    const mockError = new Error('Invalid command');
    sendCommand.mockRejectedValue(mockError);

    localStorage.clear();

    render(<App />);

    const textarea = screen.getByPlaceholderText('Enter your command...');
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

  test('clicking history item populates command input', async () => {
    const mockHistory = [
      { command: 'arm the system', timestamp: new Date().toISOString(), success: true }
    ];
    localStorage.setItem('nl-security-command-history', JSON.stringify(mockHistory));

    render(<App />);

    const textarea = screen.getByPlaceholderText('Enter your command...');
    
    // Find and click history item
    const historyItem = screen.getByTestId('history-item-0');
    fireEvent.click(historyItem);

    // Verify command is populated in textarea
    expect(textarea).toHaveValue('arm the system');
  });

  test('limits history to MAX_HISTORY_ITEMS (10)', async () => {
    sendCommand.mockResolvedValue({ text: 'test', interpretation: {}, api_call: {}, response: { success: true } });

    localStorage.clear();
    render(<App />);

    const textarea = screen.getByPlaceholderText('Enter your command...');
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

