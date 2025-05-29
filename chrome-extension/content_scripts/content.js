// Global variables
let biasAnalysisResults = null;
let highlightedElements = [];

// Initialize when the script is injected
console.log("Biasbuster content script loaded.");

// Listen for messages from popup or service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getArticleContentAndAnalyze") {
    console.log("Content Script: Received request to analyze article content.");
    const articleText = getArticleText();
    
    if (articleText) {
      console.log("Content Script: Sending text to service worker for analysis.");
      chrome.runtime.sendMessage({ action: "analyzeText", text: articleText }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Content Script: Error sending message to service worker:", chrome.runtime.lastError.message);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        
        console.log("Content Script: Received response from service worker:", response);
        if (response && response.success) {
          biasAnalysisResults = response.data;
          highlightBias(biasAnalysisResults);
          sendResponse({ success: true, data: biasAnalysisResults });
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
  }
});

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
            node.parentNode.classList.contains('biasbuster-highlight')) {
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
  const tooltips = document.querySelectorAll('.biasbuster-tooltip');
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