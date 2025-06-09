import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataComparisonPanel from '../DataComparisonPanel';
import { AuditEntry } from '../../../types/dashboard';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
}));

jest.mock('chart.js', () => ({
  Chart: jest.fn(),
  registerables: [],
  register: jest.fn(),
}));

describe('DataComparisonPanel', () => {
  const mockData: AuditEntry[] = [
    {
      id: '1',
      timestamp: new Date('2024-01-01T10:00:00'),
      riskLevel: 'high',
      riskScore: 0.85,
      biasCount: 5,
      fairnessScore: 0.75,
      category: 'gender',
      details: {
        detectedBiases: [
          {
            type: 'gender',
            description: 'Gender bias in hiring',
            impact: 'high',
            confidence: 0.95,
          },
        ],
        metrics: {
          accuracy: 0.85,
          f1Score: 0.82,
          falsePositiveRate: 0.15,
          falseNegativeRate: 0.18,
        },
      },
      recommendations: ['Review hiring criteria', 'Implement blind screening'],
    },
    {
      id: '2',
      timestamp: new Date('2024-01-02T11:00:00'),
      riskLevel: 'medium',
      riskScore: 0.65,
      biasCount: 3,
      fairnessScore: 0.82,
      category: 'age',
      details: {
        detectedBiases: [
          {
            type: 'age',
            description: 'Age bias in promotions',
            impact: 'medium',
            confidence: 0.85,
          },
        ],
        metrics: {
          accuracy: 0.87,
          f1Score: 0.86,
          falsePositiveRate: 0.14,
          falseNegativeRate: 0.13,
        },
      },
      recommendations: ['Review promotion criteria', 'Monitor age distribution'],
    },
  ];

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders the comparison panel', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Data Comparison')).toBeInTheDocument();
  });

  it('displays time range selector', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByLabelText('Time Range')).toBeInTheDocument();
    expect(screen.getByLabelText('Time Range')).toHaveValue('month');
  });

  it('displays metric selector', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByLabelText('Metric')).toBeInTheDocument();
    expect(screen.getByLabelText('Metric')).toHaveValue('riskScore');
  });

  it('changes time range when selected', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    const timeRangeSelect = screen.getByLabelText('Time Range');
    fireEvent.change(timeRangeSelect, { target: { value: 'week' } });
    
    expect(timeRangeSelect).toHaveValue('week');
  });

  it('changes metric when selected', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    const metricSelect = screen.getByLabelText('Metric');
    fireEvent.change(metricSelect, { target: { value: 'fairnessScore' } });
    
    expect(metricSelect).toHaveValue('fairnessScore');
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays summary section', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Current Period')).toBeInTheDocument();
    expect(screen.getByText('Previous Period')).toBeInTheDocument();
  });

  it('renders the chart component', () => {
    render(
      <DataComparisonPanel
        data={mockData}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(
      <DataComparisonPanel
        data={[]}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });
}); 