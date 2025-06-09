import { BiasDetector } from '../../../core/ml/BiasDetector';
import { BiasAnalysisResult, BiasDetectionConfig } from '../../../types/bias';
import { ModelConfig } from '../../../types/ml';

// Mock chrome API
const mockChrome = {
  runtime: {
    getURL: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  },
  storage: {
    sync: {
      get: jest.fn()
    }
  }
};

global.chrome = mockChrome as any;

// Mock BiasDetector
jest.mock('../../../core/ml/BiasDetector');

describe('ContentScript', () => {
  let contentScript: any;
  let mockBiasDetector: jest.Mocked<BiasDetector>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock BiasDetector instance
    mockBiasDetector = {
      analyzeText: jest.fn(),
      updateModel: jest.fn()
    } as any;

    (BiasDetector as jest.Mock).mockImplementation(() => mockBiasDetector);

    // Mock chrome.storage.sync.get
    mockChrome.storage.sync.get.mockResolvedValue({
      biasbusterConfig: {
        sensitivity: 0.7,
        enabledBiasTypes: ['gender', 'racial'],
        language: 'en'
      }
    });

    // Create content script instance
    contentScript = new (require('../content').ContentScript)();
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      expect(mockChrome.storage.sync.get).toHaveBeenCalledWith('biasbusterConfig');
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalled();
    });

    it('should handle missing configuration', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});
      const contentScript = new (require('../content').ContentScript)();
      expect(contentScript).toBeDefined();
    });
  });

  describe('message handling', () => {
    it('should handle ANALYZE_PAGE message', async () => {
      const message = { type: 'ANALYZE_PAGE' };
      const sendResponse = jest.fn();

      // Trigger message handler
      const messageHandler = mockChrome.runtime.onMessage.addListener.mock.calls[0][0];
      await messageHandler(message, {}, sendResponse);

      expect(mockBiasDetector.analyzeText).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalled();
    });

    it('should handle TOGGLE_ENABLED message', () => {
      const message = { type: 'TOGGLE_ENABLED', enabled: false };
      const sendResponse = jest.fn();

      // Trigger message handler
      const messageHandler = mockChrome.runtime.onMessage.addListener.mock.calls[0][0];
      messageHandler(message, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ success: true });
    });

    it('should handle UPDATE_CONFIG message', () => {
      const message = {
        type: 'UPDATE_CONFIG',
        config: { sensitivity: 0.8 }
      };
      const sendResponse = jest.fn();

      // Trigger message handler
      const messageHandler = mockChrome.runtime.onMessage.addListener.mock.calls[0][0];
      messageHandler(message, {}, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('DOM observation', () => {
    it('should observe DOM changes', () => {
      const mockObserver = {
        observe: jest.fn()
      };

      global.MutationObserver = jest.fn().mockImplementation((callback) => ({
        observe: mockObserver.observe,
        disconnect: jest.fn()
      }));

      const contentScript = new (require('../content').ContentScript)();
      expect(mockObserver.observe).toHaveBeenCalledWith(
        document.body,
        {
          childList: true,
          subtree: true,
          characterData: true
        }
      );
    });

    it('should handle DOM changes', async () => {
      const mockTextNode = {
        nodeType: Node.TEXT_NODE,
        textContent: 'Test text'
      };

      const mockMutation = {
        type: 'childList',
        addedNodes: [mockTextNode]
      };

      // Trigger mutation observer callback
      const observerCallback = (global.MutationObserver as jest.Mock).mock.calls[0][0];
      await observerCallback([mockMutation]);

      expect(mockBiasDetector.analyzeText).toHaveBeenCalledWith('Test text');
    });
  });

  describe('text analysis', () => {
    it('should analyze text nodes', async () => {
      const mockTextNode = {
        textContent: 'Test text'
      };

      await contentScript.analyzeText(mockTextNode.textContent);

      expect(mockBiasDetector.analyzeText).toHaveBeenCalledWith('Test text');
    });

    it('should handle analysis errors', async () => {
      mockBiasDetector.analyzeText.mockRejectedValue(new Error('Analysis failed'));

      const mockTextNode = {
        textContent: 'Test text'
      };

      await contentScript.analyzeText(mockTextNode.textContent);

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('bias highlighting', () => {
    it('should highlight biased content', () => {
      const result: BiasAnalysisResult = {
        text: 'Test text',
        analysis: {
          biasTypes: ['gender'],
          severity: 0.8,
          explanation: 'Test explanation',
          highlightedText: 'Test text'
        },
        timestamp: new Date().toISOString(),
        confidence: 0.9,
        suggestions: ['Suggestion 1']
      };

      contentScript.highlightBias(result);
      // Add assertions for highlighting logic
    });
  });
}); 