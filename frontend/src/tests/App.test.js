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
});

