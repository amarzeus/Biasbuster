import { BiasDetector } from '../../core/ml/BiasDetector';
import { BiasAnalysisResult, BiasDetectionConfig } from '../../types/bias';
import { ModelConfig } from '../../types/ml';

class ContentScript {
  private biasDetector: BiasDetector;
  private config: BiasDetectionConfig;
  private isEnabled: boolean = true;

  constructor() {
    this.initializeDetector();
    this.loadConfig();
    this.setupMessageListeners();
    this.setupMutationObserver();
  }

  private async initializeDetector(): Promise<void> {
    const modelConfig: ModelConfig = {
      modelType: 'bert',
      modelPath: chrome.runtime.getURL('models/bias-detector'),
      version: '1.0.0',
      parameters: {
        maxLength: 512,
        batchSize: 32,
        threshold: 0.7
      },
      features: {
        useContext: true,
        useSentiment: true,
        useEntityRecognition: true
      }
    };

    this.biasDetector = new BiasDetector(modelConfig);
  }

  private async loadConfig(): Promise<void> {
    const stored = await chrome.storage.sync.get('biasbusterConfig');
    this.config = stored.biasbusterConfig || {
      sensitivity: 0.7,
      enabledBiasTypes: ['gender', 'racial', 'political', 'religious'],
      language: 'en'
    };
  }

  private setupMessageListeners(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case 'ANALYZE_PAGE':
          this.analyzePage().then(sendResponse);
          return true;
        case 'TOGGLE_ENABLED':
          this.isEnabled = message.enabled;
          sendResponse({ success: true });
          break;
        case 'UPDATE_CONFIG':
          this.config = { ...this.config, ...message.config };
          sendResponse({ success: true });
          break;
      }
    });
  }

  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      if (this.isEnabled) {
        this.handleDOMChanges(mutations);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  private async handleDOMChanges(mutations: MutationRecord[]): Promise<void> {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            await this.analyzeText(node.textContent || '');
          }
        }
      }
    }
  }

  private async analyzePage(): Promise<void> {
    const textNodes = this.getTextNodes(document.body);
    for (const node of textNodes) {
      if (node.textContent && node.textContent.trim()) {
        await this.analyzeText(node.textContent);
      }
    }
  }

  private getTextNodes(element: Node): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Text | null;
    while ((node = walker.nextNode() as Text)) {
      textNodes.push(node);
    }

    return textNodes;
  }

  private async analyzeText(text: string): Promise<void> {
    try {
      const result: BiasAnalysisResult = await this.biasDetector.analyzeText(text);
      this.highlightBias(result);
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  }

  private highlightBias(result: BiasAnalysisResult): void {
    // TODO: Implement bias highlighting logic
    // This will create visual indicators for biased content
  }
}

// Initialize the content script
new ContentScript(); 