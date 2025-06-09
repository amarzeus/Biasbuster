// Constants
const API_ENDPOINT = 'https://api.biasbuster.com/v1';
const BIAS_TYPES = {
    GENDER: 'gender',
    RACIAL: 'racial',
    POLITICAL: 'political',
    CULTURAL: 'cultural'
};

// DOM Elements
const elements = {
    analyzeButton: document.getElementById('analyzeButton'),
    originalContent: document.getElementById('originalContent'),
    analysisContent: document.getElementById('analysisContent'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// State Management
let currentState = {
    analyzing: false,
    selectedText: '',
    analysisResults: null,
    settings: null
};

// Initialize Extension
async function initializeExtension() {
    loadUserSettings();
    attachEventListeners();
    checkForSelectedText();
}

// Event Listeners
function attachEventListeners() {
    elements.analyzeButton.addEventListener('click', handleAnalyzeClick);
    
    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'TEXT_SELECTED') {
            handleSelectedText(request.text);
        }
    });
}

// Handle text selection
function handleSelectedText(text) {
    currentState.selectedText = text;
    elements.originalContent.textContent = text;
    elements.analyzeButton.disabled = !text;
}

// Analyze content for bias
async function handleAnalyzeClick() {
    try {
        setLoading(true);
        
        const textToAnalyze = currentState.selectedText || await getPageContent();
        const results = await analyzeBias(textToAnalyze);
        
        displayResults(results);
    } catch (error) {
        showError('Failed to analyze content: ' + error.message);
    } finally {
        setLoading(false);
    }
}

// Bias Analysis
async function analyzeBias(text) {
    const response = await fetch(`${API_ENDPOINT}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text,
            biasTypes: getUserSelectedBiasTypes(),
            settings: currentState.settings
        })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
}

// Display Results
function displayResults(results) {
    const { biasedContent, biasScores } = results;
    
    // Clear previous content
    elements.analysisContent.innerHTML = '';
    
    // Create side-by-side comparison
    const comparisonHtml = createComparisonView(biasedContent);
    elements.analysisContent.innerHTML = comparisonHtml;
    
    // Highlight biased text in red
    highlightBiasedText(biasedContent.segments);
    
    // Update bias score display
    updateBiasScoreDisplay(biasScores);
}

// Create side-by-side comparison view
function createComparisonView(biasedContent) {
    return biasedContent.segments.map(segment => {
        const biasClass = segment.hasBias ? 'biased-text' : '';
        return `
            <div class="content-segment ${biasClass}">
                <span class="text">${segment.text}</span>
                ${segment.hasBias ? createBiasTooltip(segment.biasDetails) : ''}
            </div>
        `;
    }).join('');
}

// Create tooltip for bias explanation
function createBiasTooltip(biasDetails) {
    return `
        <div class="tooltip">
            <span class="tooltip-icon">ℹ️</span>
            <div class="tooltip-text">
                <strong>Bias Type:</strong> ${biasDetails.type}<br>
                <strong>Explanation:</strong> ${biasDetails.explanation}<br>
                <strong>Suggestion:</strong> ${biasDetails.suggestion}
            </div>
        </div>
    `;
}

// Highlight biased text
function highlightBiasedText(segments) {
    segments.forEach((segment, index) => {
        if (segment.hasBias) {
            const element = elements.analysisContent.children[index];
            element.classList.add('highlight-bias');
        }
    });
}

// Update bias score display
function updateBiasScoreDisplay(scores) {
    const overallScore = calculateOverallScore(scores);
    const scoreBar = document.querySelector('.score-bar');
    if (scoreBar) {
        scoreBar.style.width = `${overallScore}%`;
        scoreBar.style.backgroundColor = getBiasScoreColor(overallScore);
    }
}

// Utility Functions
function calculateOverallScore(scores) {
    const weights = {
        [BIAS_TYPES.GENDER]: 0.25,
        [BIAS_TYPES.RACIAL]: 0.25,
        [BIAS_TYPES.POLITICAL]: 0.25,
        [BIAS_TYPES.CULTURAL]: 0.25
    };

    return Object.entries(scores).reduce((total, [type, score]) => {
        return total + (score * weights[type]);
    }, 0);
}

function getBiasScoreColor(score) {
    if (score < 30) return '#00C851';  // Low bias - green
    if (score < 70) return '#ffbb33';  // Medium bias - yellow
    return '#ff4444';  // High bias - red
}

function setLoading(isLoading) {
    currentState.analyzing = isLoading;
    elements.analyzeButton.disabled = isLoading;
    elements.loadingOverlay.style.display = isLoading ? 'flex' : 'none';
}

function showError(message) {
    // Implement error display UI
    console.error(message);
}

// Settings Management
async function loadUserSettings() {
    try {
        const settings = await chrome.storage.sync.get('biasSettings');
        currentState.settings = settings.biasSettings || getDefaultSettings();
    } catch (error) {
        console.error('Failed to load settings:', error);
        currentState.settings = getDefaultSettings();
    }
}

function getDefaultSettings() {
    return {
        sensitivity: 0.7,
        biasTypes: Object.values(BIAS_TYPES),
        customPhrases: []
    };
}

function getUserSelectedBiasTypes() {
    return Array.from(document.querySelectorAll('input[name="bias-type"]:checked'))
        .map(checkbox => checkbox.value);
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', initializeExtension);
