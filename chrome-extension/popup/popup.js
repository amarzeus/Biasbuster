// DOM Elements
const initialView = document.getElementById('initial-view');
const resultsView = document.getElementById('results-view');
const educationalView = document.getElementById('educational-view');
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

// Global variables
let currentTabId = null;
let analysisResults = null;
let highlightsVisible = true;

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
}

// Toggle highlights on the page
function toggleHighlights() {
    highlightsVisible = !highlightsVisible;
    
    chrome.tabs.sendMessage(currentTabId, { 
        action: highlightsVisible ? 'getArticleContentAndAnalyze' : 'clearHighlights' 
    });
    
    toggleHighlightsBtn.textContent = highlightsVisible ? 'Hide Highlights' : 'Show Highlights';
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
}

function showResultsView() {
    initialView.classList.add('hidden');
    resultsView.classList.remove('hidden');
    educationalView.classList.add('hidden');
}

function showEducationalView() {
    initialView.classList.add('hidden');
    resultsView.classList.add('hidden');
    educationalView.classList.remove('hidden');
} 