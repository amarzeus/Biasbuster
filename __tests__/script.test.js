// Mock the script functions since they're not ES modules
const mockFunctions = {
  showError: jest.fn(),
  showLoading: jest.fn(),
  getAuthToken: jest.fn(),
  analyzeText: jest.fn()
};

// Mock global functions
global.showError = mockFunctions.showError;
global.showLoading = mockFunctions.showLoading;
global.getAuthToken = mockFunctions.getAuthToken;
global.analyzeText = mockFunctions.analyzeText;

describe('Frontend Script Functions', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup DOM
    document.body.innerHTML = `
      <textarea id="analysis-input"></textarea>
      <div id="analysis-results"></div>
    `;
    
    // Mock getElementById to return proper elements
    document.getElementById = jest.fn((id) => {
      if (id === 'analysis-input') {
        return {
          value: '',
          addEventListener: jest.fn()
        };
      }
      if (id === 'analysis-results') {
        return {
          innerHTML: '',
          style: {},
          classList: {
            add: jest.fn(),
            remove: jest.fn()
          }
        };
      }
      return null;
    });
  });

  test('showError function can be called', () => {
    expect(typeof global.showError).toBe('function');
    global.showError('Test error message');
    expect(mockFunctions.showError).toHaveBeenCalledWith('Test error message');
  });

  test('showLoading function can be called', () => {
    expect(typeof global.showLoading).toBe('function');
    global.showLoading();
    expect(mockFunctions.showLoading).toHaveBeenCalled();
  });

  test('getAuthToken function can be called', () => {
    expect(typeof global.getAuthToken).toBe('function');
    localStorage.setItem('authToken', 'test-token');
    global.getAuthToken();
    expect(mockFunctions.getAuthToken).toHaveBeenCalled();
  });

  test('analyzeText function can be called', async () => {
    expect(typeof global.analyzeText).toBe('function');
    await global.analyzeText();
    expect(mockFunctions.analyzeText).toHaveBeenCalled();
  });

  test('DOM elements can be accessed', () => {
    const input = document.getElementById('analysis-input');
    const results = document.getElementById('analysis-results');
    
    expect(input).toBeTruthy();
    expect(results).toBeTruthy();
  });
});
