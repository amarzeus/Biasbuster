import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

const mockAddHistoryItem = jest.fn();
const mockUpdateFeedbackForHistoryItem = jest.fn();

describe('Multi-Modal Analysis Integration', () => {
  beforeEach(() => {
    mockAddHistoryItem.mockClear();
    mockUpdateFeedbackForHistoryItem.mockClear();
  });

  test('analyzes uploaded image file', async () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy image content'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

  // MediaUploader should no longer be visible
  expect(screen.queryByText('Drag & drop some files here, or click to select files (images, videos, audio, text)')).not.toBeInTheDocument();

  // Click analyze
  const analyzeButton = screen.getByText('Analyze Media');
  fireEvent.click(analyzeButton);

  // Wait for ImageAnalyzer to render
    await waitFor(() => expect(screen.getByText('Image Analysis')).toBeInTheDocument());

    // Check that image is displayed
    const img = screen.getByAltText('Uploaded for analysis') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('mock-url');
  });

  test('analyzes uploaded video file', async () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy video content'], 'test.mp4', { type: 'video/mp4' });

  fireEvent.change(fileInput, { target: { files: [file] } });

  // Click analyze
  const analyzeButton = screen.getByText('Analyze Media');
  fireEvent.click(analyzeButton);

  // Wait for VideoAnalyzer to render
    await waitFor(() => expect(screen.getByText('Video Analysis')).toBeInTheDocument());

    // Check that video is displayed
    const video = screen.getByTestId('video-element'); // Assuming we add data-testid to video
    expect(video).toBeInTheDocument();
  });

  test('analyzes uploaded audio file', async () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy audio content'], 'test.mp3', { type: 'audio/mp3' });

  fireEvent.change(fileInput, { target: { files: [file] } });

  // Click analyze
  const analyzeButton = screen.getByText('Analyze Media');
  fireEvent.click(analyzeButton);

  // Wait for AudioAnalyzer to render
    await waitFor(() => expect(screen.getByText('Audio Analysis')).toBeInTheDocument());

    // Check that audio is displayed
    const audio = screen.getByTestId('audio-element'); // Assuming we add data-testid to audio
    expect(audio).toBeInTheDocument();
  });
});
