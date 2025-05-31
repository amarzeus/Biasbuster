import { analyzeText, showError, showLoading, getAuthToken } from '../web-platform/script';

describe('Frontend Script Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <textarea id="analysis-input"></textarea>
      <div id="analysis-results"></div>
    `;
  });

  test('showError displays error message', () => {
    showError('Test error message');
    const results = document.getElementById('analysis-results');
    expect(results.innerHTML).toContain('Test error message');
  });

  test('showLoading displays loading spinner', () => {
    showLoading();
    const results = document.getElementById('analysis-results');
    expect(results.innerHTML).toContain('Analyzing text for bias');
  });

  test('getAuthToken returns token from localStorage', () => {
    localStorage.setItem('authToken', 'test-token');
    expect(getAuthToken()).toBe('test-token');
  });

  test('analyzeText returns early if input is empty', async () => {
    const spyShowError = jest.spyOn(window, 'showError').mockImplementation(() => {});
    document.getElementById('analysis-input').value = '';
    await analyzeText();
    expect(spyShowError).toHaveBeenCalledWith('Please enter some text to analyze');
    spyShowError.mockRestore();
  });
});
