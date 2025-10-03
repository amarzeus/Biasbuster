import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedGeminiService } from '../../services/enhancedGeminiService';
import BiasAnalyser from '../../components/BiasAnalyser';

jest.mock('../../services/enhancedGeminiService', () => {
  return {
    EnhancedGeminiService: jest.fn().mockImplementation(() => {
      return {
        analyzeWithContext: jest.fn().mockResolvedValue({ analysis: { findings: [] }, sources: [] }),
        analyzeImage: jest.fn().mockResolvedValue({ analysis: { findings: [] }, sources: [] }),
        analyzeVideo: jest.fn().mockResolvedValue({ analysis: { findings: [] }, sources: [] }),
        analyzeAudio: jest.fn().mockResolvedValue({ analysis: { findings: [] }, sources: [] }),
      };
    }),
  };
});

// Mock import.meta.env for tests
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_KEY: 'mock_key',
      },
    },
  },
});

const mockAddHistoryItem = jest.fn();
const mockUpdateFeedbackForHistoryItem = jest.fn();

describe('BiasAnalyser Component', () => {
  beforeEach(() => {
    mockAddHistoryItem.mockClear();
    mockUpdateFeedbackForHistoryItem.mockClear();
  });

  test('renders input textarea and analyze button', () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);
    const textarea = screen.getByPlaceholderText('Paste news articles, emails, or any text here...');
    const button = screen.getByText('Analyze');
    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('disables analyze button when textarea is empty', () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);
    const button = screen.getByText('Analyze');
    expect(button).toBeDisabled();
  });

  test('enables analyze button when textarea has input', () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);
    const textarea = screen.getByPlaceholderText('Paste news articles, emails, or any text here...');
    const button = screen.getByText('Analyze');
    fireEvent.change(textarea, { target: { value: 'Some text to analyze' } });
    expect(button).toBeEnabled();
  });
});
