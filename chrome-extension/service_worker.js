// Biasbuster Chrome Extension Service Worker
// Handles background processing and API communication

// Configuration
const API_BASE_URL = 'http://localhost:8080/api/v1';
let settings = {
  serverUrl: API_BASE_URL,
  analysisFeatures: {
    sentimentAnalysis: true,
    sourceCredibility: true,
    autoAnalysis: true
  }
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Biasbuster extension installed');
  
  // Set default settings
  chrome.storage.sync.set({ 
    serverUrl: settings.serverUrl,
    analysisFeatures: settings.analysisFeatures
  });
  
  // Add context menu for selected text analysis
  chrome.contextMenus.create({
    id: 'analyze-selection',
    title: 'Analyze selected text with Biasbuster',
    contexts: ['selection']
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyze-selection' && info.selectionText) {
    // Open popup with selected text
    chrome.storage.local.set({ 
      pendingAnalysis: info.selectionText 
    }, () => {
      chrome.action.openPopup();
    });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle API requests
  if (request.action === 'analyzeText') {
    analyzeText(request.text, request.options)
      .then(result => {
        sendResponse({ success: true, data: result });
      })
      .catch(error => {
        console.error('Analysis error:', error);
        sendResponse({ 
          success: false, 
          error: error.message || 'Failed to analyze text' 
        });
      });
    return true; // Indicates asynchronous response
  }
  
  // Handle settings update
  if (request.action === 'updateSettings') {
    chrome.storage.sync.set({ 
      serverUrl: request.settings.serverUrl,
      analysisFeatures: request.settings.analysisFeatures
    }, () => {
      settings = {
        serverUrl: request.settings.serverUrl,
        analysisFeatures: request.settings.analysisFeatures
      };
      sendResponse({ success: true });
    });
    return true; // Indicates asynchronous response
  }
  
  // Handle getting settings
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['serverUrl', 'analysisFeatures'], (data) => {
      sendResponse({ 
        success: true, 
        settings: {
          serverUrl: data.serverUrl || API_BASE_URL,
          analysisFeatures: data.analysisFeatures || settings.analysisFeatures
        }
      });
    });
    return true; // Indicates asynchronous response
  }
});

/**
 * Analyze text for bias using the API
 */
async function analyzeText(text, options = {}) {
  try {
    // Load current settings
    const data = await chrome.storage.sync.get(['serverUrl']);
    const apiUrl = data.serverUrl || API_BASE_URL;
    
    console.log(`Analyzing text with API: ${apiUrl}/analyze`);
    
    // Quick analysis uses a simplified endpoint
    const endpoint = options.quickAnalysis ? 
      `${apiUrl}/analyze?quick=true` : 
      `${apiUrl}/analyze`;
    
    // Prepare request options
    const requestOptions = {
      includeSentiment: options.includeSentiment,
      includeCredibility: options.includeCredibility,
      model: options.preferredModel || 'auto'
    };
    
    // Call API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        text,
        options: requestOptions
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // Parse and return result
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in analyzeText:', error);
    
    // For quick analysis, use fallback
    if (options.quickAnalysis) {
      return createMockAnalysis(text);
    }
    
    throw error;
  }
}

/**
 * Create a simple mock analysis for fallback when API fails
 */
function createMockAnalysis(text) {
  // Extract a sample sentence for mock analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const sampleSentence = sentences[Math.floor(Math.random() * sentences.length)] || 
                         'Sample sentence for analysis.';
  
  return {
    MainTopic: 'Mock Analysis Result',
    BiasDetected: 'yes',
    BiasInstances: [
      {
        Sentence: sampleSentence,
        BiasType: 'Possible Bias',
        Explanation: 'This is a mock bias detection when offline.',
        Severity: '1',
        Justification: 'Mock analysis cannot determine actual severity.',
        Mitigation: 'Please try again when online for real analysis.'
      }
    ],
    BiasSummary: 'Mock analysis performed because the server is unavailable.',
    TrustedSources: [
      'https://example.com/media-literacy'
    ],
    EducationalContent: 'Biasbuster works best when connected to the server.'
  };
}

// Listen for tab updates to potentially trigger analysis
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only act when the tab has completely loaded
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    // We don't automatically analyze every page, but we could enable the action button
    chrome.action.enable(tabId);
  }
}); 