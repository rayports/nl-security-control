import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryDetailView from '../components/HistoryDetailView/HistoryDetailView';

describe('HistoryDetailView', () => {
  const mockHistoryItem = {
    command: 'arm the system',
    timestamp: new Date('2024-01-01T12:00:00Z'),
    success: true,
    result: {
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
    },
    error: null
  };

  test('renders nothing when historyItem is null', () => {
    const { container } = render(<HistoryDetailView historyItem={null} onClose={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders command details for successful command', () => {
    render(<HistoryDetailView historyItem={mockHistoryItem} onClose={jest.fn()} />);

    // Verify header
    expect(screen.getByText('Command Details')).toBeInTheDocument();
    
    // Verify original command
    expect(screen.getByText('Original Command')).toBeInTheDocument();
    expect(screen.getByText('arm the system')).toBeInTheDocument();

    // Verify timestamp
    expect(screen.getByText('Timestamp')).toBeInTheDocument();

    // Verify success sections
    expect(screen.getByText('Interpretation')).toBeInTheDocument();
    expect(screen.getByText('API Call')).toBeInTheDocument();
    expect(screen.getByText('Response')).toBeInTheDocument();

    // Verify no error section
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  test('renders error section for failed command', () => {
    const failedItem = {
      command: 'invalid command',
      timestamp: new Date('2024-01-01T12:00:00Z'),
      success: false,
      result: null,
      error: 'Invalid command'
    };

    render(<HistoryDetailView historyItem={failedItem} onClose={jest.fn()} />);

    // Verify error section
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Invalid command')).toBeInTheDocument();

    // Verify success sections are not shown
    expect(screen.queryByText('Interpretation')).not.toBeInTheDocument();
    expect(screen.queryByText('API Call')).not.toBeInTheDocument();
    expect(screen.queryByText('Response')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<HistoryDetailView historyItem={mockHistoryItem} onClose={onClose} />);

    const closeButton = screen.getByLabelText('Close details');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    render(<HistoryDetailView historyItem={mockHistoryItem} onClose={onClose} />);

    const overlay = screen.getByText('Command Details').closest('.history-detail-overlay');
    // Click on overlay (not modal)
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when modal content is clicked', () => {
    const onClose = jest.fn();
    render(<HistoryDetailView historyItem={mockHistoryItem} onClose={onClose} />);

    const modal = screen.getByText('Command Details').closest('.history-detail-modal');
    fireEvent.click(modal);

    expect(onClose).not.toHaveBeenCalled();
  });
});

