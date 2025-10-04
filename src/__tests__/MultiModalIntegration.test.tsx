import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedGeminiService } from '../../services/enhancedGeminiService';
import BiasAnalyser from '../../components/BiasAnalyser';

jest.mock('../../components/MediaUploader', () => ({
  __esModule: true,
  default: ({ onMediaSelected }: { onMediaSelected: (file: File) => void }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log('Mock MediaUploader onChange triggered', event.target.files);
      if (event.target.files) {
        for (let i = 0; i < event.target.files.length; i++) {
          console.log('Calling onMediaSelected with file:', event.target.files[i]);
          onMediaSelected(event.target.files[i]);
        }
      }
    };
    return (
      <input
        data-testid="mock-media-uploader"
        type="file"
        onChange={handleChange}
        multiple
      />
    );
  },
}));

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

// Also set process.env for fallback
process.env.VITE_API_KEY = 'mock_key';
process.env.API_KEY = 'mock_key';

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

    const fileInput = screen.getByTestId('mock-media-uploader');
    const file = new File(['dummy image content'], 'test.png', { type: 'image/png' });

    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Wait for the analysis to complete
    await waitFor(() => {
      expect(screen.queryByText('Your Analysis Awaits')).not.toBeInTheDocument();
    });

    // Wait for ImageAnalyzer to render (analysis happens automatically)
    const imageAnalysisHeading = await screen.findByRole('heading', { name: /Image Analysis/i });
    expect(imageAnalysisHeading).toBeInTheDocument();

    // Check that image is displayed
    const img = screen.getByAltText('Uploaded for analysis') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('mock-url');
  });

  test('analyzes uploaded video file', async () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);

    const fileInput = screen.getByTestId('mock-media-uploader');
    const file = new File(['dummy video content'], 'test.mp4', { type: 'video/mp4' });

    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Wait for the analysis to complete
    await waitFor(() => {
      expect(screen.queryByText('Your Analysis Awaits')).not.toBeInTheDocument();
    });

    // Wait for VideoAnalyzer to render (analysis happens automatically)
    const videoAnalysisHeading = await screen.findByRole('heading', { name: /Video Analysis/i });
    expect(videoAnalysisHeading).toBeInTheDocument();

    // Check that video is displayed
    const video = screen.getByTestId('video-element');
    expect(video).toBeInTheDocument();
  });

  test('analyzes uploaded audio file', async () => {
    render(<BiasAnalyser addHistoryItem={mockAddHistoryItem} updateFeedbackForHistoryItem={mockUpdateFeedbackForHistoryItem} />);

    const fileInput = screen.getByTestId('mock-media-uploader');
    const file = new File(['dummy audio content'], 'test.mp3', { type: 'audio/mp3' });

    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Wait for the analysis to complete
    await waitFor(() => {
      expect(screen.queryByText('Your Analysis Awaits')).not.toBeInTheDocument();
    });

    // Wait for AudioAnalyzer to render (analysis happens automatically)
    const audioAnalysisHeading = await screen.findByRole('heading', { name: /Audio Analysis/i });
    expect(audioAnalysisHeading).toBeInTheDocument();

    // Check that audio is displayed
    const audio = screen.getByTestId('audio-element');
    expect(audio).toBeInTheDocument();
  });
});
