import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BiasDistributionChart from '../BiasDistributionChart';

describe('BiasDistributionChart', () => {
  const mockDistribution = {
    Gender: 0.3,
    Race: 0.2,
    Age: 0.15,
    Socioeconomic: 0.25,
    Political: 0.1,
  };

  it('renders the chart with correct title', () => {
    render(<BiasDistributionChart distribution={mockDistribution} />);
    expect(screen.getByText('Bias Distribution')).toBeInTheDocument();
  });

  it('renders with correct height', () => {
    const { container } = render(<BiasDistributionChart distribution={mockDistribution} />);
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer).toHaveClass('h-80');
  });

  it('handles empty distribution', () => {
    render(<BiasDistributionChart distribution={{}} />);
    expect(screen.getByText('Bias Distribution')).toBeInTheDocument();
  });

  it('handles single category distribution', () => {
    const singleDistribution = { Gender: 1.0 };
    render(<BiasDistributionChart distribution={singleDistribution} />);
    expect(screen.getByText('Bias Distribution')).toBeInTheDocument();
  });

  it('renders with correct chart options', () => {
    const { container } = render(<BiasDistributionChart distribution={mockDistribution} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
}); 