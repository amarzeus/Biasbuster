import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuditDetailsPanel from '../AuditDetailsPanel';
import { AuditEntry } from '../../../types/dashboard';

describe('AuditDetailsPanel', () => {
  const mockAudit: AuditEntry = {
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
        {
          type: 'age',
          description: 'Age bias in promotions',
          impact: 'medium',
          confidence: 0.85,
        },
      ],
      metrics: {
        accuracy: 0.85,
        f1Score: 0.82,
        falsePositiveRate: 0.15,
        falseNegativeRate: 0.18,
      },
    },
    recommendations: [
      'Review hiring criteria',
      'Implement blind screening',
      'Monitor age distribution',
    ],
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders the audit details panel', () => {
    render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Audit Details')).toBeInTheDocument();
  });

  it('displays the correct timestamp', () => {
    render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Jan 1, 2024, 10:00 AM')).toBeInTheDocument();
  });

  it('displays overview information correctly', () => {
    render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('gender')).toBeInTheDocument();
    expect(screen.getByText('Risk Level')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();
    expect(screen.getByText('Fairness Score')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.getByText('Bias Count')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays performance metrics correctly', () => {
    render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();
    expect(screen.getByText('F1 Score')).toBeInTheDocument();
    expect(screen.getByText('82.0%')).toBeInTheDocument();
    expect(screen.getByText('False Positive Rate')).toBeInTheDocument();
    expect(screen.getByText('15.0%')).toBeInTheDocument();
    expect(screen.getByText('False Negative Rate')).toBeInTheDocument();
    expect(screen.getByText('18.0%')).toBeInTheDocument();
  });

  it('displays detected biases correctly', () => {
    render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Detected Biases')).toBeInTheDocument();
    expect(screen.getByText('Gender Bias')).toBeInTheDocument();
    expect(screen.getByText('Gender bias in hiring')).toBeInTheDocument();
    expect(screen.getByText('Age Bias')).toBeInTheDocument();
    expect(screen.getByText('Age bias in promotions')).toBeInTheDocument();
  });

  it('displays recommendations correctly', () => {
    render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Review hiring criteria')).toBeInTheDocument();
    expect(screen.getByText('Implement blind screening')).toBeInTheDocument();
    expect(screen.getByText('Monitor age distribution')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct risk level color classes', () => {
    const { rerender } = render(
      <AuditDetailsPanel
        audit={mockAudit}
        onClose={mockOnClose}
      />
    );
    
    const highRiskElement = screen.getByText('high');
    expect(highRiskElement).toHaveClass('text-red-600');

    const mediumRiskAudit = {
      ...mockAudit,
      riskLevel: 'medium',
    };

    rerender(
      <AuditDetailsPanel
        audit={mediumRiskAudit}
        onClose={mockOnClose}
      />
    );
    
    const mediumRiskElement = screen.getByText('medium');
    expect(mediumRiskElement).toHaveClass('text-yellow-600');

    const lowRiskAudit = {
      ...mockAudit,
      riskLevel: 'low',
    };

    rerender(
      <AuditDetailsPanel
        audit={lowRiskAudit}
        onClose={mockOnClose}
      />
    );
    
    const lowRiskElement = screen.getByText('low');
    expect(lowRiskElement).toHaveClass('text-green-600');
  });
}); 