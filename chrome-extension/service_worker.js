// Constants
const API_URL = 'http://localhost:8080/api/v1/analyze';

// Listener for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeText") {
    console.log("Service Worker: Received text for analysis:", request.text.substring(0, 100) + "...");
    
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: request.text }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { 
          throw new Error(err.error || err.message || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Service Worker: Analysis successful", data);
      sendResponse({ success: true, data: data });
    })
    .catch(error => {
      console.error("Service Worker: Error analyzing text:", error);
      sendResponse({ success: false, error: error.message });
    });
    
    return true; // Indicates that the response is sent asynchronously
  }
});

// Initial setup when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Biasbuster extension installed/updated.');
  
  // Set default settings
  chrome.storage.local.set({
    highlightBias: true,
    showPopupOnBias: true,
    apiUrl: API_URL
  }, () => {
    console.log('Default settings initialized.');
  });
});

// Listen for tab updates to potentially trigger analysis
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only act when the tab has completely loaded
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    // We don't automatically analyze every page, but we could enable the action button
    chrome.action.enable(tabId);
  }
}); 