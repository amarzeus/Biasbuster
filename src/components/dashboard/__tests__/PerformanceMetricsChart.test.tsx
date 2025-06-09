import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceMetricsChart from '../PerformanceMetricsChart';

describe('PerformanceMetricsChart', () => {
  const mockPerformance = {
    News: {
      accuracy: 0.85,
      precision: 0.82,
      recall: 0.88,
    },
    Social: {
      accuracy: 0.78,
      precision: 0.75,
      recall: 0.81,
    },
    Academic: {
      accuracy: 0.92,
      precision: 0.90,
      recall: 0.94,
    },
  };

  it('renders the chart with correct title', () => {
    render(<PerformanceMetricsChart performance={mockPerformance} />);
    expect(screen.getByText('Performance Metrics by Category')).toBeInTheDocument();
  });

  it('renders with correct height', () => {
    const { container } = render(<PerformanceMetricsChart performance={mockPerformance} />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer).toHaveClass('h-80');
  });

  it('handles empty performance data', () => {
    render(<PerformanceMetricsChart performance={{}} />);
    expect(screen.getByText('Performance Metrics by Category')).toBeInTheDocument();
  });

  it('handles single category performance', () => {
    const singlePerformance = {
      News: {
        accuracy: 0.85,
        precision: 0.82,
        recall: 0.88,
      },
    };
    render(<PerformanceMetricsChart performance={singlePerformance} />);
    expect(screen.getByText('Performance Metrics by Category')).toBeInTheDocument();
  });

  it('renders with correct chart options', () => {
    const { container } = render(<PerformanceMetricsChart performance={mockPerformance} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('displays all metrics for each category', () => {
    render(<PerformanceMetricsChart performance={mockPerformance} />);
    Object.keys(mockPerformance).forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
}); 