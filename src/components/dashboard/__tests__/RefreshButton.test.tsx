import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RefreshButton from '../RefreshButton';

describe('RefreshButton', () => {
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    mockOnRefresh.mockClear();
  });

  it('renders refresh button with correct text', () => {
    render(<RefreshButton onRefresh={mockOnRefresh} isLoading={false} />);
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
  });

  it('calls onRefresh when clicked', () => {
    render(<RefreshButton onRefresh={mockOnRefresh} isLoading={false} />);
    fireEvent.click(screen.getByText('Refresh Data'));
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('displays loading state correctly', () => {
    render(<RefreshButton onRefresh={mockOnRefresh} isLoading={true} />);
    expect(screen.getByText('Refreshing...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct styles when loading', () => {
    render(<RefreshButton onRefresh={mockOnRefresh} isLoading={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('does not call onRefresh when clicked while loading', () => {
    render(<RefreshButton onRefresh={mockOnRefresh} isLoading={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnRefresh).not.toHaveBeenCalled();
  });
}); 