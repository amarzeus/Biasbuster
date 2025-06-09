import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FairnessDashboard from '../FairnessDashboard';
import { mockDataService } from '../../../services/mockDataService';

describe('FairnessDashboard', () => {
  const mockData = mockDataService.getMockAuditData();

  it('renders all dashboard components', () => {
    render(
      <FairnessDashboard
        latestAudit={mockData.latestAudit}
        auditHistory={mockData.auditHistory}
      />
    );

    // Check for main sections
    expect(screen.getByText('Risk Level')).toBeInTheDocument();
    expect(screen.getByText('Key Metrics')).toBeInTheDocument();
    expect(screen.getByText('Bias Distribution')).toBeInTheDocument();
    expect(screen.getByText('Performance by Category')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Audit History')).toBeInTheDocument();
  });

  it('displays correct risk level', () => {
    render(
      <FairnessDashboard
        latestAudit={mockData.latestAudit}
        auditHistory={mockData.auditHistory}
      />
    );

    const riskLevelText = screen.getByText(new RegExp(mockData.latestAudit.riskLevel, 'i'));
    expect(riskLevelText).toBeInTheDocument();
  });

  it('displays recommendations', () => {
    render(
      <FairnessDashboard
        latestAudit={mockData.latestAudit}
        auditHistory={mockData.auditHistory}
      />
    );

    mockData.latestAudit.recommendations.forEach(recommendation => {
      expect(screen.getByText(recommendation)).toBeInTheDocument();
    });
  });

  it('displays audit history', () => {
    render(
      <FairnessDashboard
        latestAudit={mockData.latestAudit}
        auditHistory={mockData.auditHistory}
      />
    );

    mockData.auditHistory.forEach(entry => {
      expect(screen.getByText(new RegExp(entry.riskLevel, 'i'))).toBeInTheDocument();
      expect(screen.getByText(entry.biasCount.toString())).toBeInTheDocument();
    });
  });
}); 