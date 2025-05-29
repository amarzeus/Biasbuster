// Constants
const API_URL = 'http://localhost:8080/api/v1/analyze';

// Example article with bias
const EXAMPLE_ARTICLE = `Media literacy is proven to be on the decline, and I want to start a conversation about how we can improve it in the country. The Brookfield native conceived the project early last year while doing her usual skimming of stories, mostly those related to U.S. politics and the election, and thought she noticed a pattern in the way the word "communism" was being used. Rarely did it have a neutral connotation; it almost always had a negative bent, she thought.

In the New York Times, four of the 50 stories, or 8%, had clear anti-communist sentiment. Another four were vaguely anti-communist, 32 had no anti-communist sentiment, three had somewhat positive interpretations of communism, four were difficult to understand, and three were marked as miscellaneous, or "other."

In the Washington Post, three of the 50, or 6%, had clear anti-communist sentiment. Six were vaguely anti-communist, and 41 were neutral or had no sentiment present.

In the Wall Street Journal, 23 of the 50, or 46%, had clear anti-communist sentiment. Eleven were vaguely anti-communist, 11 had no anti-communist sentiment, and five were difficult to understand.

Many stories in the sample were about the latest Israel-Hamas war and included words like "leftist" to describe protesting college students in a negative way. The Wall Street Journal stories, she found, especially carried the theme of colleges indoctrinating students in "leftist" beliefs.

Regardless, if it's an editorial or not, it goes against journalistic standards to make these very bold claims – bashing whole universities and universities as a concept – and not provide quotes from people involved, not provide any statistics or information, not doing any interviews. It's not professional, and also it's clearly biased against an idea that they perceive as communist.

Above all though, this gets a conversation going about what we should be looking at in the news and how we can better convey to the average person what they should be on the lookout for and how they might think more critically about what they're reading.

AI bias is also a growing concern. For example, a healthcare risk-prediction algorithm used on more than 200 million U.S. citizens demonstrated racial bias because it relied on a faulty metric for determining the need. The algorithm's designers used previous patients' healthcare spending as a proxy for medical needs. This was a bad interpretation of historical data because income and race are highly correlated metrics and making assumptions based on only one variable of correlated metrics led the algorithm to provide inaccurate results.

Another example is Amazon's AI recruiting tool, which showed bias against women by penalizing resumes that included the word "women's." The system incorrectly learned that male candidates were preferable due to biased historical data, leading Amazon to discontinue the use of the algorithm.

Despite some efforts to address these biases, developers' choices and flawed data still cause significant problems. These biases could negatively impact how society views women and how women perceive themselves.`;

// DOM Elements
const articleTextarea = document.getElementById('article-text');
const analyzeBtn = document.getElementById('analyze-btn');
const loadExampleBtn = document.getElementById('load-example');
const statusDiv = document.getElementById('status');
const resultsDiv = document.getElementById('results');
const mainTopicDiv = document.getElementById('main-topic');
const biasSummaryDiv = document.getElementById('bias-summary');
const biasInstancesDiv = document.getElementById('bias-instances');
const trustedSourcesUl = document.getElementById('trusted-sources');
const educationalContentDiv = document.getElementById('educational-content');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if the API is available
    checkApiHealth();
    
    // Add event listener to the analyze button
    analyzeBtn.addEventListener('click', analyzeArticle);
    
    // Add event listener to the load example button
    loadExampleBtn.addEventListener('click', loadExampleArticle);
    
    // Add event listener for demo CTA button
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            alert('The Chrome extension is coming soon! Check back later.');
        });
    }

    // Add tab navigation for analysis views
    setupTabNavigation();
});

// Functions
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.view-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Deactivate all tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show the selected tab content
            document.getElementById(target).classList.remove('hidden');
            button.classList.add('active');
        });
    });
}

async function checkApiHealth() {
    try {
        const healthUrl = API_URL.replace('/analyze', '/health');
        const response = await fetch(healthUrl, {
            method: 'GET'
        });
        
        if (response.ok) {
            console.log('API is available');
        } else {
            console.warn('API health check failed:', response.status);
            statusDiv.textContent = 'Warning: API may be unavailable. Analysis might not work.';
            statusDiv.style.color = 'orange';
        }
    } catch (error) {
        console.error('API health check error:', error);
        statusDiv.textContent = 'Error: Could not connect to analysis API. Please try again later or make sure the server is running.';
        statusDiv.style.color = 'red';
    }
}

function loadExampleArticle() {
    articleTextarea.value = EXAMPLE_ARTICLE;
    statusDiv.textContent = 'Example article loaded. Click "Analyze Text" to analyze it.';
    statusDiv.style.color = 'green';
}

async function analyzeArticle() {
    const text = articleTextarea.value.trim();
    
    if (!text) {
        statusDiv.textContent = 'Please enter some text to analyze.';
        statusDiv.style.color = 'red';
        return;
    }
    
    // Show loading state
    analyzeBtn.disabled = true;
    statusDiv.textContent = 'Analyzing... This may take a moment.';
    statusDiv.style.color = '#666';
    resultsDiv.classList.add('hidden');
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayResults(data);
        createBiasVisualization(text, data);
        
    } catch (error) {
        console.error('Analysis error:', error);
        statusDiv.textContent = `Error analyzing text: ${error.message}. Make sure the Biasbuster server is running.`;
        statusDiv.style.color = 'red';
    } finally {
        analyzeBtn.disabled = false;
    }
}

function displayResults(data) {
    // Clear previous results
    biasInstancesDiv.innerHTML = '';
    trustedSourcesUl.innerHTML = '';
    
    // Display main topic and summary
    mainTopicDiv.textContent = `Topic: ${data.MainTopic}`;
    biasSummaryDiv.textContent = `Summary: ${data.BiasSummary}`;
    
    // Display bias instances
    if (data.BiasDetected === 'yes' && data.BiasInstances && data.BiasInstances.length > 0) {
        data.BiasInstances.forEach((instance, index) => {
            const biasItem = document.createElement('div');
            biasItem.className = 'bias-item';
            
            biasItem.innerHTML = `
                <h4>Bias Instance #${index + 1}: ${instance.BiasType}</h4>
                <div class="bias-sentence">"${instance.Sentence}"</div>
                <div class="bias-explanation">${instance.Explanation}</div>
                <div class="bias-severity severity-${instance.Severity}">
                    Severity: ${getSeverityText(instance.Severity)}
                </div>
                <div class="bias-justification">
                    <strong>Why this severity:</strong> ${instance.Justification}
                </div>
                <div class="bias-mitigation">
                    <strong>Suggested rewrite:</strong> "${instance.Mitigation}"
                </div>
            `;
            
            biasInstancesDiv.appendChild(biasItem);
        });
    } else {
        biasInstancesDiv.innerHTML = '<p>No bias detected in this article.</p>';
    }
    
    // Display trusted sources
    if (data.TrustedSources && data.TrustedSources.length > 0) {
        data.TrustedSources.forEach(source => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = source;
            a.textContent = source;
            a.target = '_blank'; // Open in new tab
            li.appendChild(a);
            trustedSourcesUl.appendChild(li);
        });
    } else {
        trustedSourcesUl.innerHTML = '<li>No specific sources provided.</li>';
    }
    
    // Display educational content
    educationalContentDiv.textContent = data.EducationalContent || 'No educational content provided.';
    
    // Create visualization
    createBiasVisualization(articleTextarea.value, data);
    
    // Calculate bias statistics
    calculateBiasStatistics(data);
    
    // Show results
    statusDiv.textContent = 'Analysis complete!';
    statusDiv.style.color = 'green';
    resultsDiv.classList.remove('hidden');
    
    // Show first tab by default
    const defaultTab = document.querySelector('.view-tab');
    if (defaultTab) {
        defaultTab.click();
    }
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function createBiasVisualization(text, data) {
    const visualizationContainer = document.getElementById('bias-visualization');
    if (!visualizationContainer) return;
    
    // Clear previous visualization
    visualizationContainer.innerHTML = '';
    
    // If no bias detected, show message
    if (data.BiasDetected !== 'yes' || !data.BiasInstances || data.BiasInstances.length === 0) {
        visualizationContainer.innerHTML = '<p>No bias detected to visualize.</p>';
        return;
    }
    
    // Create heat map container
    const heatMapContainer = document.createElement('div');
    heatMapContainer.className = 'heat-map-container';
    
    // Split text into paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    // Create bias map
    paragraphs.forEach((paragraph, i) => {
        if (!paragraph.trim()) return; // Skip empty paragraphs
        
        const paragraphDiv = document.createElement('div');
        paragraphDiv.className = 'heat-map-paragraph';
        
        // Find bias instances in this paragraph
        let biasFound = false;
        let paragraphHtml = paragraph;
        
        // Replace bias instances with highlighted spans
        // Sort by length to prevent highlighting issues with overlapping instances
        const sortedInstances = [...data.BiasInstances].sort((a, b) => 
            b.Sentence.length - a.Sentence.length);
            
        for (const instance of sortedInstances) {
            const escapedSentence = instance.Sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedSentence})`, 'g');
            
            if (paragraph.match(regex)) {
                biasFound = true;
                paragraphHtml = paragraphHtml.replace(
                    regex, 
                    `<span class="bias-highlight severity-${instance.Severity}" 
                      data-bias-type="${instance.BiasType}" 
                      title="${instance.BiasType}: ${instance.Explanation}">$1</span>`
                );
            }
        }
        
        // Add paragraph to heat map
        paragraphDiv.innerHTML = paragraphHtml;
        if (biasFound) {
            paragraphDiv.classList.add('contains-bias');
        }
        
        heatMapContainer.appendChild(paragraphDiv);
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
    
    visualizationContainer.appendChild(legend);
    visualizationContainer.appendChild(heatMapContainer);
    
    // Add tooltips to highlighted text
    const highlights = visualizationContainer.querySelectorAll('.bias-highlight');
    highlights.forEach(highlight => {
        highlight.addEventListener('click', () => {
            // Scroll to the corresponding bias instance in the list
            const biasType = highlight.getAttribute('data-bias-type');
            const biasItems = document.querySelectorAll('.bias-item h4');
            
            for (const item of biasItems) {
                if (item.textContent.includes(biasType)) {
                    // Switch to the analysis tab
                    document.querySelector('[data-target="analysis-tab"]').click();
                    // Scroll to the item
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight it
                    const parent = item.parentElement;
                    parent.classList.add('highlight-pulse');
                    setTimeout(() => {
                        parent.classList.remove('highlight-pulse');
                    }, 2000);
                    break;
                }
            }
        });
    });
}

function calculateBiasStatistics(data) {
    const statsContainer = document.getElementById('bias-statistics');
    if (!statsContainer) return;
    
    // Clear previous statistics
    statsContainer.innerHTML = '';
    
    // If no bias detected, show message
    if (data.BiasDetected !== 'yes' || !data.BiasInstances || data.BiasInstances.length === 0) {
        statsContainer.innerHTML = '<p>No bias detected for statistical analysis.</p>';
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
    
    // Create the statistics content
    const statsContent = document.createElement('div');
    statsContent.className = 'stats-content';
    
    // Create summary stats
    const summaryStat = document.createElement('div');
    summaryStat.className = 'stats-summary';
    summaryStat.innerHTML = `
        <div class="stats-card">
            <div class="stats-number">${data.BiasInstances.length}</div>
            <div class="stats-label">Bias Instances</div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${Object.keys(biasTypes).length}</div>
            <div class="stats-label">Bias Types</div>
        </div>
        <div class="stats-card">
            <div class="stats-number">${averageSeverity}/2</div>
            <div class="stats-label">Avg. Severity</div>
        </div>
    `;
    
    // Create bias type breakdown
    const biasTypesChart = document.createElement('div');
    biasTypesChart.className = 'stats-chart bias-types-chart';
    biasTypesChart.innerHTML = '<h4>Bias Types</h4>';
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    // Sort bias types by frequency
    const sortedBiasTypes = Object.entries(biasTypes).sort((a, b) => b[1] - a[1]);
    
    sortedBiasTypes.forEach(([type, count]) => {
        const percentage = Math.round((count / data.BiasInstances.length) * 100);
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';
        barContainer.innerHTML = `
            <div class="chart-label">${type}</div>
            <div class="chart-bar-wrapper">
                <div class="chart-bar" style="width: ${percentage}%"></div>
                <div class="chart-value">${count} (${percentage}%)</div>
            </div>
        `;
        chartContainer.appendChild(barContainer);
    });
    
    biasTypesChart.appendChild(chartContainer);
    
    // Create severity breakdown
    const severityChart = document.createElement('div');
    severityChart.className = 'stats-chart severity-chart';
    severityChart.innerHTML = '<h4>Severity Distribution</h4>';
    
    const severityContainer = document.createElement('div');
    severityContainer.className = 'severity-distribution';
    
    // Create severity bars
    const totalBias = data.BiasInstances.length;
    ['0', '1', '2'].forEach(severity => {
        const count = severityCounts[severity];
        const percentage = Math.round((count / totalBias) * 100);
        
        const severityBar = document.createElement('div');
        severityBar.className = 'severity-bar-container';
        severityBar.innerHTML = `
            <div class="severity-label">${getSeverityText(severity)}</div>
            <div class="severity-bar severity-${severity}" style="height: ${percentage}%">
                <div class="severity-value">${count}</div>
            </div>
        `;
        severityContainer.appendChild(severityBar);
    });
    
    severityChart.appendChild(severityContainer);
    
    // Add all to stats container
    statsContent.appendChild(summaryStat);
    statsContent.appendChild(biasTypesChart);
    statsContent.appendChild(severityChart);
    
    // Add to main container
    statsContainer.appendChild(statsContent);
}

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