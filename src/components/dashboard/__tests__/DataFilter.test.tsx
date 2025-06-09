import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataFilter from '../DataFilter';

describe('DataFilter', () => {
  const mockOnFilterChange = jest.fn();
  const initialFilters = {
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
    riskLevels: ['low', 'medium'],
    categories: ['News', 'Social'],
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders with initial filters', () => {
    render(
      <DataFilter
        onFilterChange={mockOnFilterChange}
        initialFilters={initialFilters}
      />
    );

    expect(screen.getByText('Filter Data')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-31')).toBeInTheDocument();
  });

  it('handles date range changes', () => {
    render(
      <DataFilter
        onFilterChange={mockOnFilterChange}
        initialFilters={initialFilters}
      />
    );

    const startDateInput = screen.getByDisplayValue('2024-01-01');
    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...initialFilters,
      dateRange: {
        ...initialFilters.dateRange,
        start: '2024-02-01',
      },
    });
  });

  it('handles risk level changes', () => {
    render(
      <DataFilter
        onFilterChange={mockOnFilterChange}
        initialFilters={initialFilters}
      />
    );

    const highRiskCheckbox = screen.getByLabelText('high');
    fireEvent.click(highRiskCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...initialFilters,
      riskLevels: [...initialFilters.riskLevels, 'high'],
    });
  });

  it('handles category changes', () => {
    render(
      <DataFilter
        onFilterChange={mockOnFilterChange}
        initialFilters={initialFilters}
      />
    );

    const academicCheckbox = screen.getByLabelText('Academic');
    fireEvent.click(academicCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...initialFilters,
      categories: [...initialFilters.categories, 'Academic'],
    });
  });

  it('removes risk level when unchecked', () => {
    render(
      <DataFilter
        onFilterChange={mockOnFilterChange}
        initialFilters={initialFilters}
      />
    );

    const lowRiskCheckbox = screen.getByLabelText('low');
    fireEvent.click(lowRiskCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...initialFilters,
      riskLevels: ['medium'],
    });
  });

  it('removes category when unchecked', () => {
    render(
      <DataFilter
        onFilterChange={mockOnFilterChange}
        initialFilters={initialFilters}
      />
    );

    const newsCheckbox = screen.getByLabelText('News');
    fireEvent.click(newsCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...initialFilters,
      categories: ['Social'],
    });
  });
}); 