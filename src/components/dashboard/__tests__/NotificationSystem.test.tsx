import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationSystem, { Notification, NotificationType } from '../NotificationSystem';

describe('NotificationSystem', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success' as NotificationType,
      message: 'Success notification',
      timestamp: new Date('2024-01-01T12:00:00'),
    },
    {
      id: '2',
      type: 'warning' as NotificationType,
      message: 'Warning notification',
      timestamp: new Date('2024-01-01T12:01:00'),
    },
    {
      id: '3',
      type: 'error' as NotificationType,
      message: 'Error notification',
      timestamp: new Date('2024-01-01T12:02:00'),
    },
    {
      id: '4',
      type: 'info' as NotificationType,
      message: 'Info notification',
      timestamp: new Date('2024-01-01T12:03:00'),
    },
  ];

  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all notifications', () => {
    render(<NotificationSystem notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Success notification')).toBeInTheDocument();
    expect(screen.getByText('Warning notification')).toBeInTheDocument();
    expect(screen.getByText('Error notification')).toBeInTheDocument();
    expect(screen.getByText('Info notification')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', () => {
    render(<NotificationSystem notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);
    
    expect(mockOnDismiss).toHaveBeenCalledWith('1');
  });

  it('displays correct timestamp for each notification', () => {
    render(<NotificationSystem notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('12:00:00 PM')).toBeInTheDocument();
    expect(screen.getByText('12:01:00 PM')).toBeInTheDocument();
    expect(screen.getByText('12:02:00 PM')).toBeInTheDocument();
    expect(screen.getByText('12:03:00 PM')).toBeInTheDocument();
  });

  it('applies correct styles for each notification type', () => {
    render(<NotificationSystem notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    const notifications = screen.getAllByRole('alert');
    
    expect(notifications[0]).toHaveClass('bg-green-50');
    expect(notifications[1]).toHaveClass('bg-yellow-50');
    expect(notifications[2]).toHaveClass('bg-red-50');
    expect(notifications[3]).toHaveClass('bg-blue-50');
  });

  it('renders correct icons for each notification type', () => {
    render(<NotificationSystem notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    const successIcon = screen.getByText('Success notification').closest('div')?.querySelector('svg');
    const warningIcon = screen.getByText('Warning notification').closest('div')?.querySelector('svg');
    const errorIcon = screen.getByText('Error notification').closest('div')?.querySelector('svg');
    const infoIcon = screen.getByText('Info notification').closest('div')?.querySelector('svg');
    
    expect(successIcon).toHaveClass('text-green-400');
    expect(warningIcon).toHaveClass('text-yellow-400');
    expect(errorIcon).toHaveClass('text-red-400');
    expect(infoIcon).toHaveClass('text-blue-400');
  });

  it('handles empty notifications array', () => {
    render(<NotificationSystem notifications={[]} onDismiss={mockOnDismiss} />);
    
    const notifications = screen.queryAllByRole('alert');
    expect(notifications).toHaveLength(0);
  });
}); 