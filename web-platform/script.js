// API endpoints
const API_BASE_URL = '/api';
const ENDPOINTS = {
    ANALYZE: `${API_BASE_URL}/analysis/analyze`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    USER_ANALYSES: `${API_BASE_URL}/analysis/user/analyses`
};

// DOM Elements
const analysisInput = document.getElementById('analysis-input');
const analyzeButton = document.getElementById('analyze-button');
const resultsSection = document.getElementById('analysis-results');

// State management
let currentUser = null;
let analysisHistory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
    initializeDemo();
});

// Event Listeners
function setupEventListeners() {
    if (analyzeButton) {
        analyzeButton.addEventListener('click', handleAnalysis);
    }

    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Analysis Functions
async function analyzeText() {
    try {
        const text = analysisInput.value.trim();
        
        if (!text) {
            showError('Please enter some text to analyze');
            return;
        }

        // Show loading state
        showLoading();

        // Make API request
        const response = await fetch(ENDPOINTS.ANALYZE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Analysis failed');
        }

        const result = await response.json();
        displayResults(result);

    } catch (error) {
        showError('Failed to analyze text. Please try again.');
        console.error('Analysis error:', error);
    }
}

// Display Functions
function displayResults(analysis) {
    if (!resultsSection) return;

    // Clear loading state
    resultsSection.innerHTML = '';

    // Create results container
    const container = document.createElement('div');
    container.className = 'analysis-results-container';

    // Add bias summary
    const summary = document.createElement('div');
    summary.className = 'bias-summary';
    summary.innerHTML = `
        <h3>Analysis Summary</h3>
        <p>${analysis.BiasSummary}</p>
    `;
    container.appendChild(summary);

    // Add bias instances
    if (analysis.BiasInstances.length > 0) {
        const instances = document.createElement('div');
        instances.className = 'bias-instances';
        instances.innerHTML = `
            <h3>Detected Biases</h3>
            ${analysis.BiasInstances.map(instance => `
                <div class="bias-instance">
                    <p class="bias-text">${instance.Sentence}</p>
                    <div class="bias-details">
                        <span class="bias-type">${instance.BiasType}</span>
                        <span class="bias-severity">Severity: ${instance.Severity}/5</span>
                    </div>
                    <p class="bias-explanation">${instance.Explanation}</p>
                    <p class="bias-mitigation">Suggestion: ${instance.Mitigation}</p>
                </div>
            `).join('')}
        `;
        container.appendChild(instances);
    }

    // Add educational content
    if (analysis.EducationalContent) {
        const education = document.createElement('div');
        education.className = 'educational-content';
        education.innerHTML = `
            <h3>Learn More</h3>
            <p>${analysis.EducationalContent}</p>
        `;
        container.appendChild(education);
    }

    // Add trusted sources
    if (analysis.TrustedSources && analysis.TrustedSources.length > 0) {
        const sources = document.createElement('div');
        sources.className = 'trusted-sources';
        sources.innerHTML = `
            <h3>Trusted Sources</h3>
            <ul>
                ${analysis.TrustedSources.map(source => `
                    <li><a href="${source}" target="_blank" rel="noopener noreferrer">${source}</a></li>
                `).join('')}
            </ul>
        `;
        container.appendChild(sources);
    }

    resultsSection.appendChild(container);
}

function showLoading() {
    if (!resultsSection) return;
    resultsSection.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Analyzing text for bias...</p>
        </div>
    `;
}

function showError(message) {
    if (!resultsSection) return;
    resultsSection.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

// Authentication Functions
function getAuthToken() {
    return localStorage.getItem('authToken');
}

async function checkAuthStatus() {
    const token = getAuthToken();
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                currentUser = await response.json();
                updateUIForAuthenticatedUser();
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }
}

function updateUIForAuthenticatedUser() {
    // Update navigation
    const nav = document.querySelector('nav ul');
    if (nav) {
        nav.innerHTML += `
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
    }
}

// Demo Initialization
function initializeDemo() {
    if (analysisInput) {
        analysisInput.value = `In a controversial move that has sparked debate, the government's new policy has been criticized by opposition leaders as "reckless" and "ill-conceived." Supporters argue that the measures are necessary for progress, while critics claim it will disproportionately affect certain communities.`;
    }
}

// Export functions for use in other scripts
window.analyzeText = analyzeText;
window.logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
};
