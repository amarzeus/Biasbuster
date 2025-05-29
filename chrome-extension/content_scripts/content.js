// Global variables
let biasAnalysisResults = null;
let highlightedElements = [];
let observedArticles = new Set();
let predictionTimeoutId = null;
let lastAnalyzedText = '';
let serverBaseUrl = 'http://localhost:8080';
let analysisFeatures = {
  sentimentAnalysis: true,
  sourceCredibility: true,
  autoAnalysis: true
};

// Initialize when the script is injected
console.log("Biasbuster content script loaded.");

// Load user settings from storage
chrome.storage.sync.get(['serverUrl', 'analysisFeatures'], function(data) {
  if (data.serverUrl) {
    serverBaseUrl = data.serverUrl;
  }
  
  if (data.analysisFeatures) {
    analysisFeatures = { ...analysisFeatures, ...data.analysisFeatures };
  }
  
  console.log("Biasbuster settings loaded:", { serverBaseUrl, analysisFeatures });
  
  // Start automatic analysis if enabled
  if (analysisFeatures.autoAnalysis) {
    initializeAutoAnalysis();
  }
});

// Listen for messages from popup or service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getArticleContentAndAnalyze") {
    console.log("Content Script: Received request to analyze article content.");
    const articleText = getArticleText();
    
    if (articleText) {
      // Save this text to avoid redundant analysis
      lastAnalyzedText = articleText;
      
      console.log("Content Script: Sending text to service worker for analysis.");
      chrome.runtime.sendMessage({ 
        action: "analyzeText", 
        text: articleText,
        options: {
          includeSentiment: analysisFeatures.sentimentAnalysis,
          includeCredibility: analysisFeatures.sourceCredibility
        }
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Content Script: Error sending message to service worker:", chrome.runtime.lastError.message);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        
        console.log("Content Script: Received response from service worker:", response);
        if (response && response.success) {
          biasAnalysisResults = response.data;
          highlightBias(biasAnalysisResults);
          sendResponse({ success: true, data: biasAnalysisResults, text: articleText });
        } else {
          sendResponse({ success: false, error: response ? response.error : "Unknown error from service worker" });
        }
      });
      return true; // Indicates asynchronous response
    } else {
      console.warn("Content Script: No text found to analyze.");
      sendResponse({ success: false, error: "No text found on page to analyze." });
    }
  } else if (request.action === "clearHighlights") {
    clearHighlights();
    sendResponse({ success: true });
  } else if (request.action === "updateSettings") {
    // Update settings
    if (request.settings.serverUrl) {
      serverBaseUrl = request.settings.serverUrl;
    }
    
    if (request.settings.analysisFeatures) {
      analysisFeatures = { ...analysisFeatures, ...request.settings.analysisFeatures };
      
      // Toggle auto analysis based on new settings
      if (analysisFeatures.autoAnalysis) {
        initializeAutoAnalysis();
      }
    }
    
    sendResponse({ success: true });
  }
});

/**
 * Initialize automatic analysis for articles as you read
 */
function initializeAutoAnalysis() {
  console.log("Content Script: Initializing automatic analysis");
  
  // Use Intersection Observer to detect when article elements are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If article element is visible and hasn't been analyzed yet
      if (entry.isIntersecting && !observedArticles.has(entry.target)) {
        observedArticles.add(entry.target);
        
        // Extract text from just this article element
        const articleText = entry.target.innerText;
        
        // Only analyze if we have substantial text and it's different from last analysis
        if (articleText && articleText.length > 100 && articleText !== lastAnalyzedText) {
          console.log("Content Script: Article scrolled into view, analyzing automatically");
          
          // Use debounce to avoid too many requests
          if (predictionTimeoutId) {
            clearTimeout(predictionTimeoutId);
          }
          
          predictionTimeoutId = setTimeout(() => {
            analyzeArticleText(articleText, { quickAnalysis: true });
          }, 1500);
        }
      }
    });
  }, { threshold: 0.3 }); // Start observing when 30% of element is visible
  
  // Find potential article elements to observe
  const articleElements = findArticleElements();
  articleElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Find potential article elements on the page 
 */
function findArticleElements() {
  const potentialSelectors = [
    'article', 
    '[role="article"]',
    '.article-content', 
    '.post-content', 
    '.entry-content', 
    '.story-content',
    '.article-body',
    'main',
    '.main-content'
  ];
  
  const results = [];
  
  for (const selector of potentialSelectors) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.innerText.length > 200) {
        results.push(el);
      }
    });
  }
  
  return results;
}

/**
 * Analyze article text directly from content script
 */
async function analyzeArticleText(text, options = {}) {
  try {
    // Show subtle notification that analysis is happening
    if (!options.quickAnalysis) {
      showFloatingNotification('Analyzing content for bias...');
    }
    
    // Send directly to background script for API call
    chrome.runtime.sendMessage({ 
      action: "analyzeText", 
      text: text,
      options: {
        includeSentiment: analysisFeatures.sentimentAnalysis,
        includeCredibility: analysisFeatures.sourceCredibility,
        quickAnalysis: options.quickAnalysis
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Content Script: Error sending message to service worker:", chrome.runtime.lastError.message);
        if (!options.quickAnalysis) {
          showFloatingNotification('Error analyzing content', 'error');
        }
        return;
      }
      
      if (response && response.success) {
        biasAnalysisResults = response.data;
        lastAnalyzedText = text;
        
        // If this is a quick analysis, use a simpler highlighting approach
        if (options.quickAnalysis) {
          quickHighlightBias(biasAnalysisResults);
        } else {
          highlightBias(biasAnalysisResults);
          showFloatingNotification('Analysis complete! Bias has been highlighted.', 'success');
        }
      } else {
        if (!options.quickAnalysis) {
          showFloatingNotification('Error analyzing content', 'error');
        }
      }
    });
  } catch (error) {
    console.error("Content Script: Error in direct analysis:", error);
  }
}

/**
 * Show a floating notification to the user
 */
function showFloatingNotification(message, type = 'info') {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.biasbuster-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `biasbuster-notification biasbuster-${type}`;
  notification.textContent = message;
  
  // Position styles are in highlighter.css
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('biasbuster-notification-hide');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300); // Allow fade-out animation to complete
  }, 3000);
}

/**
 * Extract the main article text from the page
 * Uses a combination of heuristics to find the main content
 */
function getArticleText() {
  console.log("Content Script: Extracting article text...");
  
  // Try to use Readability-like heuristics to find the main content
  let text = "";
  let mainContentFound = false;
  
  // 1. Try to find article by common selectors
  const selectors = [
    'article', 
    '[role="article"]',
    'main', 
    '.article-content', 
    '.post-content', 
    '.entry-content', 
    '.story-content',
    '.article-body',
    '.story-body',
    '.news-article'
  ];
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      // If multiple elements match, take the longest one
      let longestText = '';
      let longestElement = null;
      
      elements.forEach(el => {
        if (el.innerText.length > longestText.length) {
          longestText = el.innerText;
          longestElement = el;
        }
      });
      
      if (longestElement && longestText.length > 200) { // Minimum length threshold
        text = longestText;
        console.log(`Content Script: Found article content using selector: ${selector}`);
        mainContentFound = true;
        break;
      }
    }
  }
  
  // 2. If no article found, try to find a container with many paragraphs
  if (!mainContentFound) {
    const allElements = document.querySelectorAll('div, section');
    let bestElement = null;
    let maxParagraphs = 0;
    
    allElements.forEach(el => {
      const paragraphs = el.querySelectorAll('p');
      if (paragraphs.length > maxParagraphs) {
        maxParagraphs = paragraphs.length;
        bestElement = el;
      }
    });
    
    if (bestElement && maxParagraphs >= 3) { // At least 3 paragraphs
      text = bestElement.innerText;
      console.log(`Content Script: Found article content using paragraph count (${maxParagraphs} paragraphs)`);
      mainContentFound = true;
    }
  }
  
  // 3. If still no article found, fallback to all paragraphs
  if (!mainContentFound) {
    const paragraphs = document.querySelectorAll('p');
    if (paragraphs.length > 0) {
      text = Array.from(paragraphs)
        .map(p => p.innerText)
        .join('\n\n');
      console.log(`Content Script: Using fallback method: all paragraphs (${paragraphs.length})`);
      mainContentFound = true;
    }
  }
  
  // 4. Last resort: use body text
  if (!mainContentFound || text.length < 100) {
    text = document.body.innerText;
    console.log("Content Script: Using entire body text as fallback");
  }
  
  console.log(`Content Script: Extracted ${text.length} characters of text`);
  return text.trim();
}

/**
 * Highlight biased content on the page
 */
function highlightBias(analysisResult) {
  console.log("Content Script: Highlighting bias instances...", analysisResult);
  
  // Clear any existing highlights first
  clearHighlights();
  
  if (!analysisResult || !analysisResult.BiasInstances || analysisResult.BiasInstances.length === 0) {
    console.log("Content Script: No bias instances to highlight.");
    return;
  }
  
  // For each bias instance, find and highlight it in the DOM
  analysisResult.BiasInstances.forEach((instance, index) => {
    const sentence = instance.Sentence;
    if (!sentence) return;
    
    // Find the text in the DOM
    const foundElements = findTextInPage(sentence);
    
    foundElements.forEach(({ node, startOffset, endOffset }) => {
      try {
        // Create a highlight element
        const range = document.createRange();
        range.setStart(node, startOffset);
        range.setEnd(node, endOffset);
        
        const highlightSpan = document.createElement('span');
        highlightSpan.className = `biasbuster-highlight severity-${instance.Severity}`;
        highlightSpan.dataset.biasIndex = index.toString();
        highlightSpan.dataset.biasType = instance.BiasType;
        highlightSpan.dataset.biasSeverity = instance.Severity;
        highlightSpan.title = `${instance.BiasType} (Severity: ${instance.Severity}/2)\n${instance.Explanation}`;
        
        // Add click event to show more details
        highlightSpan.addEventListener('click', (e) => {
          e.stopPropagation();
          showBiasTooltip(e.target, instance);
        });
        
        range.surroundContents(highlightSpan);
        highlightedElements.push(highlightSpan);
        
      } catch (e) {
        console.warn(`Content Script: Could not highlight sentence: "${sentence.substring(0, 40)}..."`, e);
      }
    });
  });
  
  console.log(`Content Script: Highlighted ${highlightedElements.length} bias instances.`);
  
  // Add bias summary indicator if we have sentiment analysis
  if (analysisResult.SentimentAnalysis || analysisResult.SourceCredibility) {
    addBiasSummaryIndicator(analysisResult);
  }
}

/**
 * Quick bias highlighting for auto-analysis
 * Uses a simpler, less intrusive approach
 */
function quickHighlightBias(analysisResult) {
  // Don't clear existing highlights for quick analysis
  
  if (!analysisResult || !analysisResult.BiasInstances || analysisResult.BiasInstances.length === 0) {
    console.log("Content Script: No bias instances to highlight in quick analysis.");
    return;
  }
  
  // Extract high severity instances only for quick highlighting
  const highSeverityInstances = analysisResult.BiasInstances.filter(
    instance => instance.Severity === '2' || parseInt(instance.Severity) === 2
  );
  
  if (highSeverityInstances.length === 0) {
    console.log("Content Script: No high severity bias to highlight in quick analysis.");
    return;
  }
  
  // For each bias instance, find and highlight it in the DOM with a subtle style
  highSeverityInstances.forEach((instance, index) => {
    const sentence = instance.Sentence;
    if (!sentence) return;
    
    // Find the text in the DOM
    const foundElements = findTextInPage(sentence);
    
    foundElements.forEach(({ node, startOffset, endOffset }) => {
      try {
        // Create a highlight element
        const range = document.createRange();
        range.setStart(node, startOffset);
        range.setEnd(node, endOffset);
        
        const highlightSpan = document.createElement('span');
        highlightSpan.className = `biasbuster-quick-highlight severity-${instance.Severity}`;
        highlightSpan.dataset.biasType = instance.BiasType;
        highlightSpan.title = `Potential ${instance.BiasType}\n(Click the Biasbuster icon for full analysis)`;
        
        range.surroundContents(highlightSpan);
        highlightedElements.push(highlightSpan);
        
      } catch (e) {
        console.warn(`Content Script: Could not quick-highlight sentence: "${sentence.substring(0, 40)}..."`, e);
      }
    });
  });
  
  console.log(`Content Script: Quick-highlighted ${highlightedElements.length} high-severity bias instances.`);
  
  // Add a small floating indicator that subtle bias was detected
  if (highlightedElements.length > 0) {
    addSubtleBiasIndicator(highlightedElements.length);
  }
}

/**
 * Add a summary indicator with sentiment and credibility information
 */
function addBiasSummaryIndicator(analysisResult) {
  const indicator = document.createElement('div');
  indicator.className = 'biasbuster-summary-indicator';
  
  let indicatorContent = '<div class="biasbuster-summary-header">Biasbuster Analysis</div>';
  
  // Add bias score
  const biasCount = analysisResult.BiasInstances?.length || 0;
  const biasLevel = biasCount === 0 ? 'Low' : biasCount <= 2 ? 'Moderate' : 'High';
  let biasLevelClass = biasCount === 0 ? 'low-bias' : biasCount <= 2 ? 'medium-bias' : 'high-bias';
  
  indicatorContent += `
    <div class="biasbuster-metric">
      <div class="biasbuster-metric-label">Bias Level:</div>
      <div class="biasbuster-metric-value ${biasLevelClass}">${biasLevel}</div>
    </div>
  `;
  
  // Add sentiment if available
  if (analysisResult.SentimentAnalysis) {
    const sentiment = analysisResult.SentimentAnalysis;
    let sentimentClass = 'neutral-sentiment';
    
    if (sentiment.Overall === 'positive' || sentiment.Score > 0.3) {
      sentimentClass = 'positive-sentiment';
    } else if (sentiment.Overall === 'negative' || sentiment.Score < -0.3) {
      sentimentClass = 'negative-sentiment';
    }
    
    indicatorContent += `
      <div class="biasbuster-metric">
        <div class="biasbuster-metric-label">Sentiment:</div>
        <div class="biasbuster-metric-value ${sentimentClass}">
          ${sentiment.Overall.charAt(0).toUpperCase() + sentiment.Overall.slice(1)}
        </div>
      </div>
    `;
  }
  
  // Add credibility if available
  if (analysisResult.SourceCredibility) {
    const credibility = analysisResult.SourceCredibility;
    let credibilityClass = 'medium-credibility';
    let credibilityText = 'Average';
    
    if (credibility.Score > 70) {
      credibilityClass = 'high-credibility';
      credibilityText = 'High';
    } else if (credibility.Score < 40) {
      credibilityClass = 'low-credibility';
      credibilityText = 'Low';
    }
    
    indicatorContent += `
      <div class="biasbuster-metric">
        <div class="biasbuster-metric-label">Source Credibility:</div>
        <div class="biasbuster-metric-value ${credibilityClass}">
          ${credibilityText} (${credibility.Score}/100)
        </div>
      </div>
    `;
  }
  
  // Add footer
  indicatorContent += '<div class="biasbuster-summary-footer">Click the Biasbuster icon for details</div>';
  
  indicator.innerHTML = indicatorContent;
  
  // Add close button
  const closeBtn = document.createElement('div');
  closeBtn.className = 'biasbuster-summary-close';
  closeBtn.innerHTML = '×';
  closeBtn.addEventListener('click', () => {
    indicator.remove();
  });
  indicator.appendChild(closeBtn);
  
  // Add to page
  document.body.appendChild(indicator);
  highlightedElements.push(indicator);
}

/**
 * Add a smaller, subtle indicator for automatic analysis
 */
function addSubtleBiasIndicator(biasCount) {
  const indicator = document.createElement('div');
  indicator.className = 'biasbuster-subtle-indicator';
  
  indicator.innerHTML = `
    <div class="biasbuster-subtle-content">
      <div class="biasbuster-subtle-icon">⚠️</div>
      <div class="biasbuster-subtle-text">
        ${biasCount} potential bias ${biasCount === 1 ? 'instance' : 'instances'} detected
      </div>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(indicator);
  highlightedElements.push(indicator);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    indicator.classList.add('biasbuster-fade-out');
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 500);
  }, 5000);
}

/**
 * Find all occurrences of a text string in the page's text nodes
 */
function findTextInPage(searchText) {
  const results = [];
  const searchTextLower = searchText.toLowerCase();
  
  // Create a tree walker to find all text nodes
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script and style elements
        const parentTag = node.parentNode.tagName;
        if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || 
            parentTag === 'NOSCRIPT' || parentTag === 'IFRAME') {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip empty or whitespace-only nodes
        if (node.nodeValue.trim() === '') {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip nodes that are already highlighted
        if (node.parentNode.classList && 
            (node.parentNode.classList.contains('biasbuster-highlight') || 
             node.parentNode.classList.contains('biasbuster-quick-highlight'))) {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  // Walk through all text nodes
  let currentNode;
  while (currentNode = treeWalker.nextNode()) {
    const nodeText = currentNode.nodeValue;
    const nodeLower = nodeText.toLowerCase();
    let position = nodeLower.indexOf(searchTextLower);
    
    // If found, add to results
    if (position !== -1) {
      results.push({
        node: currentNode,
        startOffset: position,
        endOffset: position + searchText.length
      });
    }
  }
  
  return results;
}

/**
 * Show a tooltip with detailed bias information
 */
function showBiasTooltip(element, biasInfo) {
  // Remove any existing tooltips
  const existingTooltip = document.querySelector('.biasbuster-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'biasbuster-tooltip';
  
  // Add content to tooltip
  tooltip.innerHTML = `
    <div class="biasbuster-tooltip-header">
      <h3>Bias Detected</h3>
      <button class="biasbuster-close-btn">&times;</button>
    </div>
    <div class="biasbuster-tooltip-content">
      <p><strong>Type:</strong> ${biasInfo.BiasType}</p>
      <p><strong>Explanation:</strong> ${biasInfo.Explanation}</p>
      <p><strong>Severity:</strong> ${biasInfo.Severity}/2 - ${biasInfo.Justification}</p>
      <div class="biasbuster-tooltip-mitigation">
        <p><strong>Suggested rewrite:</strong></p>
        <p>${biasInfo.Mitigation}</p>
      </div>
    </div>
  `;
  
  // Position tooltip
  const rect = element.getBoundingClientRect();
  tooltip.style.position = 'absolute';
  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.zIndex = '10000';
  
  // Add close functionality
  document.body.appendChild(tooltip);
  tooltip.querySelector('.biasbuster-close-btn').addEventListener('click', () => {
    tooltip.remove();
  });
  
  // Close when clicking outside
  document.addEventListener('click', function closeTooltip(e) {
    if (!tooltip.contains(e.target) && e.target !== element) {
      tooltip.remove();
      document.removeEventListener('click', closeTooltip);
    }
  });
}

/**
 * Clear all highlights from the page
 */
function clearHighlights() {
  console.log("Content Script: Clearing highlights...");
  
  // Remove existing tooltips
  const tooltips = document.querySelectorAll('.biasbuster-tooltip, .biasbuster-summary-indicator, .biasbuster-subtle-indicator, .biasbuster-notification');
  tooltips.forEach(tooltip => tooltip.remove());
  
  // Remove highlights by unwrapping them
  highlightedElements.forEach(highlight => {
    if (highlight.parentNode) {
      // Replace the highlight with its text content
      const parent = highlight.parentNode;
      const textNode = document.createTextNode(highlight.textContent);
      parent.replaceChild(textNode, highlight);
    }
  });
  
  highlightedElements = [];
} 