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
});

// Functions
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
    
    // Show results
    statusDiv.textContent = 'Analysis complete!';
    statusDiv.style.color = 'green';
    resultsDiv.classList.remove('hidden');
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
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