// DOM Elements
const initialView = document.getElementById('initial-view');
const resultsView = document.getElementById('results-view');
const educationalView = document.getElementById('educational-view');
const visualizationView = document.getElementById('visualization-view');
const statisticsView = document.getElementById('statistics-view');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingDiv = document.querySelector('.loading');
const errorMessage = document.getElementById('error-message');
const mainTopic = document.getElementById('main-topic');
const biasDetected = document.getElementById('bias-detected');
const biasSummary = document.getElementById('bias-summary');
const biasInstancesList = document.getElementById('bias-instances-list');
const toggleHighlightsBtn = document.getElementById('toggle-highlights-btn');
const backBtn = document.getElementById('back-btn');
const educationalContent = document.getElementById('educational-content');
const trustedSources = document.getElementById('trusted-sources');
const backToResultsBtn = document.getElementById('back-to-results-btn');
const educationalLink = document.getElementById('educational-link');
const settingsLink = document.getElementById('settings-link');
const feedbackLink = document.getElementById('feedback-link');
const visualizationLink = document.getElementById('visualization-link');
const statisticsLink = document.getElementById('statistics-link');
const heatMapContainer = document.getElementById('heat-map-container');
const statisticsContainer = document.getElementById('statistics-container');

// Global variables
let currentTabId = null;
let analysisResults = null;
let highlightsVisible = true;
let articleText = '';

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  // Get the current tab ID
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      currentTabId = tabs[0].id;
    }
  });
    
  // Set up event listeners
  setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
  analyzeBtn.addEventListener('click', analyzeCurrentPage);
  toggleHighlightsBtn.addEventListener('click', toggleHighlights);
  backBtn.addEventListener('click', showInitialView);
  backToResultsBtn.addEventListener('click', showResultsView);
  educationalLink.addEventListener('click', showEducationalView);
  visualizationLink.addEventListener('click', showVisualizationView);
  statisticsLink.addEventListener('click', showStatisticsView);
    
  // Back buttons in various views
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', showResultsView);
  });
    
  settingsLink.addEventListener('click', () => {
    // Open settings page (future implementation)
    alert('Settings page coming soon!');
  });
    
  feedbackLink.addEventListener('click', () => {
    // Open feedback form (future implementation)
    alert('Feedback form coming soon!');
  });
}

// Analyze the current page
function analyzeCurrentPage() {
  showLoading(true);
    
  // Send message to content script to get the article text and analyze it
  chrome.tabs.sendMessage(currentTabId, { action: 'getArticleContentAndAnalyze' }, (response) => {
    showLoading(false);
        
    if (chrome.runtime.lastError) {
      showError('Could not connect to the page. Please refresh and try again.');
      return;
    }
        
    if (response && response.success) {
      analysisResults = response.data;
      articleText = response.text;
      displayResults(analysisResults);
      showResultsView();
    } else {
      showError(response ? response.error : 'Failed to analyze the page.');
    }
  });
}

// Display analysis results
function displayResults(results) {
  // Clear previous results
  biasInstancesList.innerHTML = '';
    
  // Display main topic and summary
  mainTopic.textContent = `Topic: ${results.MainTopic}`;
  biasDetected.textContent = `Bias Detected: ${results.BiasDetected === 'yes' ? 'Yes' : 'No'}`;
  biasDetected.style.color = results.BiasDetected === 'yes' ? '#d9534f' : '#28a745';
  biasSummary.textContent = `Summary: ${results.BiasSummary}`;
    
  // Display bias instances
  if (results.BiasDetected === 'yes' && results.BiasInstances && results.BiasInstances.length > 0) {
    results.BiasInstances.forEach((instance, index) => {
      const biasInstance = document.createElement('div');
      biasInstance.className = 'bias-instance';
            
      biasInstance.innerHTML = `
                <div class="bias-instance-header">
                    <span class="bias-type">${instance.BiasType}</span>
                    <span class="bias-severity severity-${instance.Severity}">
                        Severity: ${getSeverityText(instance.Severity)}
                    </span>
                </div>
                <div class="bias-sentence">"${instance.Sentence}"</div>
                <div class="bias-explanation">${instance.Explanation}</div>
                <div class="bias-mitigation">
                    <strong>Suggested rewrite:</strong> "${instance.Mitigation}"
                </div>
            `;
            
      biasInstancesList.appendChild(biasInstance);
    });
  } else {
    biasInstancesList.innerHTML = '<p>No bias detected in this article.</p>';
  }
    
  // Prepare educational view content
  educationalContent.textContent = results.EducationalContent || 'No educational content available.';
    
  // Prepare trusted sources
  trustedSources.innerHTML = '';
  if (results.TrustedSources && results.TrustedSources.length > 0) {
    results.TrustedSources.forEach(source => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = source;
      a.textContent = source;
      a.target = '_blank'; // Open in new tab
      li.appendChild(a);
      trustedSources.appendChild(li);
    });
  } else {
    trustedSources.innerHTML = '<li>No specific sources provided.</li>';
  }
    
  // Create visualization
  createBiasVisualization(articleText, results);
    
  // Create statistics
  createBiasStatistics(results);
}

// Toggle highlights on the page
function toggleHighlights() {
  highlightsVisible = !highlightsVisible;
    
  chrome.tabs.sendMessage(currentTabId, { 
    action: highlightsVisible ? 'getArticleContentAndAnalyze' : 'clearHighlights' 
  });
    
  toggleHighlightsBtn.textContent = highlightsVisible ? 'Hide Highlights' : 'Show Highlights';
}

// Create bias visualization
function createBiasVisualization(text, data) {
  if (!heatMapContainer) return;
    
  // Clear previous visualization
  heatMapContainer.innerHTML = '';
    
  // If no bias detected, show message
  if (data.BiasDetected !== 'yes' || !data.BiasInstances || data.BiasInstances.length === 0) {
    heatMapContainer.innerHTML = '<p>No bias detected to visualize.</p>';
    return;
  }
    
  // Truncate text if too long for popup
  const maxLength = 300;
  let displayText = text;
  if (text && text.length > maxLength) {
    displayText = text.substring(0, maxLength) + '... (truncated)';
  }
    
  // Split text into sentences using simple split - not perfect but works for demo
  const sentences = displayText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
  // Create heat map container
  const heatMapContent = document.createElement('div');
  heatMapContent.className = 'heat-map-content';
    
  // Go through each sentence and check for bias
  sentences.forEach(sentence => {
    const sentenceSpan = document.createElement('span');
    sentenceSpan.className = 'sentence';
        
    // Find if this sentence has bias
    const biasInstance = data.BiasInstances.find(instance => 
      instance.Sentence && sentence.includes(instance.Sentence.substring(0, 30)));
        
    if (biasInstance) {
      sentenceSpan.className += ` biased severity-${biasInstance.Severity}`;
      sentenceSpan.title = `${biasInstance.BiasType}: ${biasInstance.Explanation}`;
    }
        
    sentenceSpan.textContent = sentence.trim() + '. ';
    heatMapContent.appendChild(sentenceSpan);
  });
    
  // Add legend
  const legend = document.createElement('div');
  legend.className = 'heat-map-legend';
  legend.innerHTML = `
        <div class="legend-title">Bias Severity:</div>
        <div class="legend-item">
            <span class="legend-color severity-0"></span>
            <span>Low</span>
        </div>
        <div class="legend-item">
            <span class="legend-color severity-1"></span>
            <span>Medium</span>
        </div>
        <div class="legend-item">
            <span class="legend-color severity-2"></span>
            <span>High</span>
        </div>
    `;
    
  heatMapContainer.appendChild(legend);
  heatMapContainer.appendChild(heatMapContent);
}

// Create bias statistics
function createBiasStatistics(data) {
  if (!statisticsContainer) return;
    
  // Clear previous statistics
  statisticsContainer.innerHTML = '';
    
  // If no bias detected, show message
  if (data.BiasDetected !== 'yes' || !data.BiasInstances || data.BiasInstances.length === 0) {
    statisticsContainer.innerHTML = '<p>No bias detected for statistical analysis.</p>';
    return;
  }
    
  // Count bias types and severity
  const biasTypes = {};
  const severityCounts = { '0': 0, '1': 0, '2': 0 };
  let totalSeverity = 0;
    
  data.BiasInstances.forEach(instance => {
    // Count bias types
    if (!biasTypes[instance.BiasType]) {
      biasTypes[instance.BiasType] = 0;
    }
    biasTypes[instance.BiasType]++;
        
    // Count severity
    severityCounts[instance.Severity]++;
    totalSeverity += parseInt(instance.Severity);
  });
    
  // Calculate average severity
  const averageSeverity = (totalSeverity / data.BiasInstances.length).toFixed(1);
    
  // Create summary stats
  const summaryStats = document.createElement('div');
  summaryStats.className = 'summary-stats';
  summaryStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${data.BiasInstances.length}</div>
            <div class="stat-label">Bias Instances</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${averageSeverity}/2</div>
            <div class="stat-label">Avg. Severity</div>
        </div>
    `;
    
  // Create severity breakdown
  const severityBreakdown = document.createElement('div');
  severityBreakdown.className = 'severity-breakdown';
  severityBreakdown.innerHTML = '<h4>Severity Distribution</h4>';
    
  const severityGraph = document.createElement('div');
  severityGraph.className = 'severity-graph';
    
  for (const severity in severityCounts) {
    const percentage = Math.round((severityCounts[severity] / data.BiasInstances.length) * 100);
    const severityBar = document.createElement('div');
    severityBar.className = 'severity-bar-container';
    severityBar.innerHTML = `
            <div class="severity-label">${getSeverityText(severity)}</div>
            <div class="severity-bar-wrapper">
                <div class="severity-bar severity-${severity}" style="width: ${percentage}%"></div>
                <span class="severity-count">${severityCounts[severity]}</span>
            </div>
        `;
    severityGraph.appendChild(severityBar);
  }
    
  severityBreakdown.appendChild(severityGraph);
    
  // Add all to container
  statisticsContainer.appendChild(summaryStats);
  statisticsContainer.appendChild(severityBreakdown);
    
  // Add bias types breakdown if there's enough space
  if (Object.keys(biasTypes).length > 0 && Object.keys(biasTypes).length < 4) {
    const biasTypeBreakdown = document.createElement('div');
    biasTypeBreakdown.className = 'bias-type-breakdown';
    biasTypeBreakdown.innerHTML = '<h4>Common Bias Types</h4>';
        
    const biasTypesList = document.createElement('ul');
    biasTypesList.className = 'bias-types-list';
        
    Object.entries(biasTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([type, count]) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="bias-type">${type}</span>: ${count} instances`;
        biasTypesList.appendChild(li);
      });
        
    biasTypeBreakdown.appendChild(biasTypesList);
    statisticsContainer.appendChild(biasTypeBreakdown);
  }
}

// Helper function to get text for severity levels
function getSeverityText(severity) {
  switch (severity) {
  case '0':
    return 'Low';
  case '1':
    return 'Medium';
  case '2':
    return 'High';
  default:
    return 'Unknown';
  }
}

// Show/hide loading state
function showLoading(isLoading) {
  if (isLoading) {
    analyzeBtn.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    errorMessage.classList.add('hidden');
  } else {
    analyzeBtn.classList.remove('hidden');
    loadingDiv.classList.add('hidden');
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

// View management functions
function showInitialView() {
  initialView.classList.remove('hidden');
  resultsView.classList.add('hidden');
  educationalView.classList.add('hidden');
  visualizationView.classList.add('hidden');
  statisticsView.classList.add('hidden');
}

function showResultsView() {
  initialView.classList.add('hidden');
  resultsView.classList.remove('hidden');
  educationalView.classList.add('hidden');
  visualizationView.classList.add('hidden');
  statisticsView.classList.add('hidden');
}

function showEducationalView() {
  initialView.classList.add('hidden');
  resultsView.classList.add('hidden');
  educationalView.classList.remove('hidden');
  visualizationView.classList.add('hidden');
  statisticsView.classList.add('hidden');
}

function showVisualizationView() {
  initialView.classList.add('hidden');
  resultsView.classList.add('hidden');
  educationalView.classList.add('hidden');
  visualizationView.classList.remove('hidden');
  statisticsView.classList.add('hidden');
}

function showStatisticsView() {
  initialView.classList.add('hidden');
  resultsView.classList.add('hidden');
  educationalView.classList.add('hidden');
  visualizationView.classList.add('hidden');
  statisticsView.classList.remove('hidden');
} 