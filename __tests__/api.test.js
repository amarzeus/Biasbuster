/**
 * Basic tests for Biasbuster API
 */

// Mock API responses
const mockAnalyzeResponse = {
  status: 'success',
  data: {
    MainTopic: 'Politics & Government',
    BiasAnalysis: {
      OverallBias: 'Left-leaning bias detected (2 indicators found)',
      BiasScore: -2.3,
      Details: [
        {
          Text: 'This is an example of biased text.',
          Type: 'Emotional Language',
          ConfidenceScore: 0.85,
          Explanation: 'Uses emotionally charged language that may overstate impact.'
        }
      ]
    },
    SentimentAnalysis: {
      Overall: 'negative',
      Score: -0.6,
      EmotionalTone: ['critical', 'concerned']
    },
    SourceCredibility: {
      Score: 6.5,
      Factors: {
        'Factual Accuracy': 7.0,
        'Multiple Perspectives': 5.5,
        'Citation Quality': 7.0
      }
    },
    Suggestions: [
      'Seek out multiple sources from different perspectives on this topic.',
      'Check whether claims are supported by specific evidence or citations.'
    ]
  }
};

// Mock HTTP client
const mockFetch = jest.fn((url, options) => {
  if (url.includes('/api/v1/analyze')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockAnalyzeResponse)
    });
  }
  
  if (url.includes('/api/v1/health')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'ok' })
    });
  }
  
  return Promise.reject(new Error('Not found'));
});

// Replace global fetch with mock
global.fetch = mockFetch;

// Tests
describe('Biasbuster API', () => {
  test('should call analyze endpoint with correct parameters', async () => {
    // Setup
    const text = 'This is an article to analyze.';
    
    // Execute
    const response = await fetch('http://localhost:8080/api/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        options: {
          includeSentiment: true,
          includeCredibility: true
        }
      })
    });
    
    const result = await response.json();
    
    // Verify
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/analyze',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(String)
      })
    );
    
    expect(result).toEqual(mockAnalyzeResponse);
  });
  
  test('should call health endpoint', async () => {
    // Execute
    const response = await fetch('http://localhost:8080/api/v1/health');
    const result = await response.json();
    
    // Verify
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/health');
    expect(result).toEqual({ status: 'ok' });
  });
}); 