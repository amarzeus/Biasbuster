import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrendAnalysisChart from '../TrendAnalysisChart';
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

describe('TrendAnalysisChart', () => {
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

  it('renders the chart component', () => {
    render(
      <TrendAnalysisChart
        data={mockData}
        metric="riskScore"
        timeRange="day"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  it('renders with different metrics', () => {
    const { rerender } = render(
      <TrendAnalysisChart
        data={mockData}
        metric="riskScore"
        timeRange="day"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();

    rerender(
      <TrendAnalysisChart
        data={mockData}
        metric="fairnessScore"
        timeRange="day"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();

    rerender(
      <TrendAnalysisChart
        data={mockData}
        metric="biasCount"
        timeRange="day"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  it('renders with different time ranges', () => {
    const { rerender } = render(
      <TrendAnalysisChart
        data={mockData}
        metric="riskScore"
        timeRange="day"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();

    rerender(
      <TrendAnalysisChart
        data={mockData}
        metric="riskScore"
        timeRange="week"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();

    rerender(
      <TrendAnalysisChart
        data={mockData}
        metric="riskScore"
        timeRange="month"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();

    rerender(
      <TrendAnalysisChart
        data={mockData}
        metric="riskScore"
        timeRange="year"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(
      <TrendAnalysisChart
        data={[]}
        metric="riskScore"
        timeRange="day"
      />
    );
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  it('maintains aspect ratio container', () => {
    render(
      <TrendAnalysisChart
        data={mockData}
        metric="riskScore"
        timeRange="day"
      />
    );
    
    const container = screen.getByTestId('mock-line-chart').parentElement;
    expect(container).toHaveClass('h-80');
  });
}); 