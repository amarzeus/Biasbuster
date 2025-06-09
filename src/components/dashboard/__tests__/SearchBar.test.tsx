import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';
import { AuditEntry } from '../../../types/dashboard';

describe('SearchBar', () => {
  const mockData: AuditEntry[] = [
    {
      id: '1',
      timestamp: new Date(),
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
      timestamp: new Date(),
      riskLevel: 'low',
      riskScore: 0.35,
      biasCount: 2,
      fairnessScore: 0.92,
      category: 'age',
      details: {
        detectedBiases: [
          {
            type: 'age',
            description: 'Age bias in promotions',
            impact: 'low',
            confidence: 0.75,
          },
        ],
        metrics: {
          accuracy: 0.88,
          f1Score: 0.85,
          falsePositiveRate: 0.12,
          falseNegativeRate: 0.15,
        },
      },
      recommendations: ['Review promotion criteria', 'Monitor age distribution'],
    },
  ];

  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnSearch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders search input and field selector', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search audits...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows clear button when search term is entered', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search audits...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears search term when clear button is clicked', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search audits...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
  });

  it('searches in all fields by default', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search audits...');
    fireEvent.change(input, { target: { value: 'gender' } });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith([mockData[0]]);
  });

  it('searches in specific field when selected', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'category' } });
    
    const input = screen.getByPlaceholderText('Search audits...');
    fireEvent.change(input, { target: { value: 'age' } });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith([mockData[1]]);
  });

  it('returns all data when search term is empty', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search audits...');
    fireEvent.change(input, { target: { value: '' } });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith(mockData);
  });

  it('debounces search input', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search audits...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('searches in recommendations', () => {
    render(<SearchBar data={mockData} onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search audits...');
    fireEvent.change(input, { target: { value: 'blind screening' } });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(mockOnSearch).toHaveBeenCalledWith([mockData[0]]);
  });
}); 