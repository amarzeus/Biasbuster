import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RiskLevelIndicator from '../RiskLevelIndicator';

describe('RiskLevelIndicator', () => {
  it('renders low risk level correctly', () => {
    render(<RiskLevelIndicator riskLevel="low" score={0.2} />);
    
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
    expect(screen.getByText('20.0%')).toBeInTheDocument();
    expect(screen.getByText('The current bias levels are within acceptable ranges.')).toBeInTheDocument();
  });

  it('renders medium risk level correctly', () => {
    render(<RiskLevelIndicator riskLevel="medium" score={0.5} />);
    
    expect(screen.getByText('Medium Risk')).toBeInTheDocument();
    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(screen.getByText('Some bias concerns have been detected. Review recommended.')).toBeInTheDocument();
  });

  it('renders high risk level correctly', () => {
    render(<RiskLevelIndicator riskLevel="high" score={0.8} />);
    
    expect(screen.getByText('High Risk')).toBeInTheDocument();
    expect(screen.getByText('80.0%')).toBeInTheDocument();
    expect(screen.getByText('Significant bias issues detected. Immediate action required.')).toBeInTheDocument();
  });

  it('applies correct color classes for each risk level', () => {
    const { rerender } = render(<RiskLevelIndicator riskLevel="low" score={0.2} />);
    expect(screen.getByText('Low Risk').parentElement).toHaveClass('bg-green-500');

    rerender(<RiskLevelIndicator riskLevel="medium" score={0.5} />);
    expect(screen.getByText('Medium Risk').parentElement).toHaveClass('bg-yellow-500');

    rerender(<RiskLevelIndicator riskLevel="high" score={0.8} />);
    expect(screen.getByText('High Risk').parentElement).toHaveClass('bg-red-500');
  });
}); 