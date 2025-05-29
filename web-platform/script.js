// Constants
const API_URL = 'http://localhost:8080/api/v1/analyze';
const API_HEALTH_URL = 'http://localhost:8080/api/v1/health';
let isServerAvailable = false;

// DOM Elements
const articleText = document.getElementById('article-text');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const statusDiv = document.getElementById('status');
const resultsContainer = document.getElementById('results-container');
const mainTopic = document.getElementById('main-topic').querySelector('span');
const biasSummary = document.getElementById('bias-summary');
const biasDetails = document.getElementById('bias-details');
const biasVisualization = document.getElementById('bias-visualization');
const sentimentAnalysis = document.getElementById('sentiment-analysis');
const biasSuggestions = document.getElementById('bias-suggestions');
const credibilityScore = document.getElementById('credibility-score');

// Example articles with varying degrees of bias
const exampleArticles = [
    // Example 1: Politically biased article
    `WASHINGTON DISASTER: Government Wastes Billions on Failed Climate Program
    
    The federal government has once again proven it cannot be trusted with taxpayer dollars. The latest climate initiative, championed by liberal politicians, has wasted over $12 billion with absolutely nothing to show for it.
    
    "This is typical big government overreach," said Senator James Wilson. "They keep throwing money at a problem that many experts say isn't even real."
    
    Meanwhile, hardworking Americans are struggling to pay their bills as energy prices soar due to these unnecessary environmental regulations. The radical climate agenda continues to hurt our economy while countries like China and India face no consequences.
    
    Critics argue that this program was designed to satisfy environmental extremists rather than implement practical solutions. The devastating impact on the coal industry has left thousands unemployed in rural communities.`,
    
    // Example 2: Article with subtler bias
    `New Study Examines Healthcare Options
    
    A recent study by the Institute for Health Policy has found that single-payer healthcare systems in several European countries provide coverage to all citizens at approximately 30% lower cost than the current U.S. system.
    
    The research, which analyzed healthcare outcomes and costs across 12 countries, suggests that administrative savings and negotiated medication prices contribute significantly to the cost difference.
    
    However, industry representatives question whether such a system could work in America. "The U.S. healthcare market has unique challenges that make European models difficult to implement here," said Jennifer Roberts of the Healthcare Business Association.
    
    The study comes as lawmakers debate various healthcare reform proposals, with advocates on both sides claiming their approach would better serve Americans.`,
    
    // Example 3: Relatively balanced article
    `Global Tech Conference Highlights AI Advancements
    
    The International Technology Summit concluded yesterday with presentations from leading tech companies showcasing advancements in artificial intelligence.
    
    Google demonstrated new natural language processing capabilities, while Microsoft revealed improvements in computer vision technology. Several smaller startups presented innovative applications in healthcare, transportation, and education sectors.
    
    Experts discussed both the potential benefits and risks of rapid AI development. "These technologies offer tremendous opportunities to solve complex problems, but also raise important ethical questions about privacy, security, and employment," said Dr. Aisha Patel, AI ethics researcher.
    
    The conference also addressed concerns about AI regulation, with representatives from government agencies, tech companies, and advocacy groups participating in panel discussions about establishing responsible innovation frameworks.`
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check API health
    checkApiHealth();
    
    // Event listeners
    analyzeBtn.addEventListener('click', analyzeArticle);
    clearBtn.addEventListener('click', clearArticle);
    document.getElementById('example1-btn').addEventListener('click', () => loadExample(0));
    document.getElementById('example2-btn').addEventListener('click', () => loadExample(1));
    document.getElementById('example3-btn').addEventListener('click', () => loadExample(2));
});

// Functions
async function checkApiHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(API_HEALTH_URL, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log('API is available');
            isServerAvailable = true;
            statusDiv.textContent = 'API connection successful. Ready for analysis.';
            statusDiv.style.color = 'green';
        } else {
            console.warn('API health check failed:', response.status);
            handleOfflineMode();
        }
    } catch (error) {
        console.error('API health check error:', error);
        handleOfflineMode();
    }
}

function handleOfflineMode() {
    isServerAvailable = false;
    statusDiv.innerHTML = '<span style="color: orange;">⚠️ Running in offline demo mode. Server connection unavailable.</span>';
}

function loadExample(index) {
    articleText.value = exampleArticles[index];
    statusDiv.textContent = 'Example article loaded. Click "Analyze for Bias" to analyze.';
}

function clearArticle() {
    articleText.value = '';
    resultsContainer.classList.add('hidden');
    statusDiv.textContent = 'Text cleared. Enter new content to analyze.';
}

async function analyzeArticle() {
    const text = articleText.value.trim();
    
    if (!text) {
        statusDiv.textContent = 'Please enter some text to analyze.';
        statusDiv.style.color = 'red';
        return;
    }
    
    // Show analyzing status
    statusDiv.textContent = 'Analyzing content...';
    statusDiv.style.color = 'blue';
    
    try {
        let result;
        
        if (isServerAvailable) {
            // Online mode - use actual API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    options: {
                        includeSentiment: true,
                        includeCredibility: true
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            result = await response.json();
        } else {
            // Offline mode - use mock response
            result = generateMockResponse(text);
            // Add artificial delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Display results
        displayResults(result);
        statusDiv.textContent = 'Analysis complete!';
        statusDiv.style.color = 'green';
        
    } catch (error) {
        console.error('Analysis error:', error);
        statusDiv.textContent = 'Error: Could not connect to analysis API. Using offline mode.';
        statusDiv.style.color = 'orange';
        
        // In case of error, generate mock response anyway to demonstrate functionality
        const mockResult = generateMockResponse(text);
        displayResults(mockResult);
        
        // Show offline mode message
        handleOfflineMode();
    }
}

function generateMockResponse(text) {
    // Simplified response structure
    const response = {
        MainTopic: detectTopic(text),
        BiasAnalysis: {
            OverallBias: determineMockBias(text),
            BiasScore: Math.random() * 10 - 5, // Random score between -5 and 5
            Details: generateMockBiasDetails(text)
        },
        SentimentAnalysis: {
            Overall: Math.random() > 0.5 ? "positive" : (Math.random() > 0.5 ? "negative" : "neutral"),
            Score: parseFloat((Math.random() * 2 - 1).toFixed(2)),
            EmotionalTone: ["informative", "concerned", "critical", "objective"].slice(0, Math.floor(Math.random() * 3) + 1)
        },
        SourceCredibility: {
            Score: parseFloat((Math.random() * 10).toFixed(1)),
            Factors: {
                "Factual Accuracy": parseFloat((Math.random() * 10).toFixed(1)),
                "Multiple Perspectives": parseFloat((Math.random() * 10).toFixed(1)),
                "Citation Quality": parseFloat((Math.random() * 10).toFixed(1))
            }
        },
        Suggestions: generateMockSuggestions(text)
    };
    
    return response;
}

function detectTopic(text) {
    // Very simple topic detection based on keywords
    const topics = [
        { keywords: ['government', 'political', 'senator', 'federal', 'washington', 'liberal', 'regulation'], topic: 'Politics & Government' },
        { keywords: ['healthcare', 'medical', 'doctor', 'hospital', 'patient', 'insurance'], topic: 'Healthcare' },
        { keywords: ['tech', 'technology', 'ai', 'artificial intelligence', 'digital', 'computer', 'software'], topic: 'Technology' },
        { keywords: ['climate', 'environment', 'carbon', 'emission', 'warming', 'pollution'], topic: 'Climate & Environment' },
        { keywords: ['economy', 'economic', 'market', 'financial', 'business', 'company', 'industry'], topic: 'Economy & Business' }
    ];
    
    // Convert text to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Count keyword matches for each topic
    const matches = topics.map(topic => {
        const count = topic.keywords.reduce((sum, keyword) => {
            return sum + (lowerText.includes(keyword) ? 1 : 0);
        }, 0);
        return { topic: topic.topic, count };
    });
    
    // Sort by match count in descending order
    matches.sort((a, b) => b.count - a.count);
    
    // Return the topic with the most matches, or "General" if no matches
    return matches[0].count > 0 ? matches[0].topic : "General News";
}

function determineMockBias(text) {
    // Simplified bias detection based on keyword analysis
    const lowerText = text.toLowerCase();
    
    // Political loaded terms
    const leftBiasTerms = ['radical right', 'extremist', 'alt-right', 'far-right', 'conservative agenda', 'corporate greed'];
    const rightBiasTerms = ['radical left', 'socialist', 'liberal agenda', 'leftist', 'big government', 'environmental extremist'];
    
    // Language patterns that might indicate bias
    const biasedLanguage = [
        'clearly', 'obviously', 'undoubtedly', 'everyone knows', 'without question',
        'disaster', 'catastrophe', 'crisis', 'failure', 'scandal',
        'destroy', 'devastating', 'terrible', 'horrible', 'evil'
    ];
    
    // Count occurrences
    let leftBiasCount = leftBiasTerms.reduce((count, term) => count + (lowerText.includes(term) ? 1 : 0), 0);
    let rightBiasCount = rightBiasTerms.reduce((count, term) => count + (lowerText.includes(term) ? 1 : 0), 0);
    let biasedLanguageCount = biasedLanguage.reduce((count, term) => count + (lowerText.includes(term) ? 1 : 0), 0);
    
    // Determine overall bias
    if (leftBiasCount > rightBiasCount && leftBiasCount > 0) {
        return `Left-leaning bias detected (${leftBiasCount} indicators found)`;
    } else if (rightBiasCount > leftBiasCount && rightBiasCount > 0) {
        return `Right-leaning bias detected (${rightBiasCount} indicators found)`;
    } else if (biasedLanguageCount > 2) {
        return `Some general bias detected through emotionally charged language (${biasedLanguageCount} indicators found)`;
    } else {
        return "No significant bias detected";
    }
}

function generateMockBiasDetails(text) {
    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    // Simple biased phrases to look for
    const biasIndicators = [
        { pattern: /disaster/i, type: "Emotional Language", explanation: "Uses dramatic language that may evoke emotional response rather than presenting neutral facts." },
        { pattern: /waste/i, type: "Value Judgment", explanation: "Presents a subjective judgment as fact without sufficient evidence." },
        { pattern: /typical/i, type: "Generalization", explanation: "Makes a sweeping generalization without nuance." },
        { pattern: /radical/i, type: "Labeling", explanation: "Uses politically charged labeling that may misrepresent positions." },
        { pattern: /obviously/i, type: "Assertion", explanation: "Presents opinion as self-evident fact." },
        { pattern: /hardworking/i, type: "Appeal to Identity", explanation: "Appeals to group identity rather than focusing on facts." },
        { pattern: /extremist/i, type: "Demonization", explanation: "Uses extreme characterization to dismiss opposing viewpoints." },
        { pattern: /devastating/i, type: "Emotional Language", explanation: "Uses emotionally charged language that may overstate impact." }
    ];
    
    // Find biased sentences
    const biasedContent = [];
    
    sentences.forEach(sentence => {
        biasIndicators.forEach(indicator => {
            if (indicator.pattern.test(sentence) && Math.random() > 0.3) { // 70% chance to include for variety
                biasedContent.push({
                    text: sentence.trim(),
                    biasType: indicator.type,
                    explanation: indicator.explanation
                });
            }
        });
    });
    
    // If no bias found, return neutral examples
    if (biasedContent.length === 0) {
        return [
            {
                text: "This content appears to present information in a relatively balanced way.",
                biasType: "Balanced Reporting",
                explanation: "The text provides multiple perspectives and uses neutral language."
            }
        ];
    }
    
    return biasedContent;
}

function generateMockSuggestions(text) {
    // Standard suggestions based on bias types
    const standardSuggestions = [
        "Seek out multiple sources from different perspectives on this topic.",
        "Look for primary sources and original research when available.",
        "Consider whether the article presents multiple viewpoints on controversial aspects.",
        "Check whether claims are supported by specific evidence or citations.",
        "Be aware of emotional language that may influence your perception of the content."
    ];
    
    // Filter to 3 random suggestions
    return standardSuggestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
}

function displayResults(result) {
    // Show results container
    resultsContainer.classList.remove('hidden');
    
    // Display main topic
    mainTopic.textContent = result.MainTopic || "Unknown";
    
    // Display bias summary
    biasSummary.textContent = result.BiasAnalysis?.OverallBias || "No significant bias detected";
    
    // Display detailed bias analysis
    if (result.BiasAnalysis?.Details && result.BiasAnalysis.Details.length > 0) {
        biasDetails.innerHTML = result.BiasAnalysis.Details.map(detail => `
            <div class="bias-instance">
                <div class="bias-text">"${detail.text}"</div>
                <div class="bias-type"><strong>${detail.biasType || 'Potential Bias'}</strong></div>
                <div class="bias-explanation">${detail.explanation || 'No explanation provided'}</div>
            </div>
        `).join('');
    } else {
        biasDetails.innerHTML = '<p>No specific instances of bias were detected in this content.</p>';
    }
    
    // Create bias visualization
    createBiasVisualization(result.BiasAnalysis);
    
    // Display sentiment analysis
    if (result.SentimentAnalysis) {
        const sentiment = result.SentimentAnalysis;
        let sentimentColor = 'neutral-color';
        
        if (sentiment.Overall === 'positive') {
            sentimentColor = 'positive-color';
        } else if (sentiment.Overall === 'negative') {
            sentimentColor = 'negative-color';
        }
        
        sentimentAnalysis.innerHTML = `
            <div class="sentiment-overview">
                <div class="sentiment-score">
                    <span class="score-label">Overall Sentiment:</span>
                    <span class="score-value ${sentimentColor}">${sentiment.Overall}</span>
                </div>
                <div class="sentiment-score">
                    <span class="score-label">Sentiment Score:</span>
                    <span class="score-value">${sentiment.Score}</span>
                </div>
            </div>
            <div class="emotional-tone">
                <h4>Emotional Tone:</h4>
                <div class="tone-tags">
                    ${sentiment.EmotionalTone ? sentiment.EmotionalTone.map(tone => 
                        `<span class="tone-tag">${tone}</span>`).join('') : 'Not available'}
                </div>
            </div>
        `;
    } else {
        sentimentAnalysis.innerHTML = '<p>Sentiment analysis not available for this content.</p>';
    }
    
    // Display bias mitigation suggestions
    if (result.Suggestions && result.Suggestions.length > 0) {
        biasSuggestions.innerHTML = `
            <ul class="suggestions-list">
                ${result.Suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        `;
    } else {
        biasSuggestions.innerHTML = '<p>No specific suggestions available for this content.</p>';
    }
    
    // Display credibility score
    if (result.SourceCredibility) {
        const credibility = result.SourceCredibility;
        credibilityScore.innerHTML = `
            <div class="credibility-overview">
                <div class="credibility-meter">
                    <div class="meter-label">Overall Credibility</div>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${credibility.Score * 10}%"></div>
                    </div>
                    <div class="meter-value">${credibility.Score}/10</div>
                </div>
            </div>
            <div class="credibility-factors">
                <h4>Credibility Factors:</h4>
                <ul>
                    ${Object.entries(credibility.Factors || {}).map(([factor, score]) => 
                        `<li><span>${factor}:</span> <strong>${score}/10</strong></li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        credibilityScore.innerHTML = '<p>Source credibility analysis not available for this content.</p>';
    }
}

function createBiasVisualization(biasAnalysis) {
    if (!biasAnalysis) {
        biasVisualization.innerHTML = '<p>Bias visualization not available for this content.</p>';
        return;
    }
    
    // Create a visual representation of bias score
    const biasScore = biasAnalysis.BiasScore || 0;
    const normalizedScore = Math.max(-5, Math.min(5, biasScore)); // Ensure score is between -5 and 5
    
    // Create a gauge visualization
    const percentage = ((normalizedScore + 5) / 10) * 100; // Convert to percentage (0-100)
    
    biasVisualization.innerHTML = `
        <div class="bias-meter">
            <div class="bias-scale">
                <div class="scale-label left">Left-leaning</div>
                <div class="scale-label center">Neutral</div>
                <div class="scale-label right">Right-leaning</div>
            </div>
            <div class="bias-gauge">
                <div class="gauge-bar">
                    <div class="gauge-indicator" style="left: ${percentage}%"></div>
                </div>
                <div class="gauge-labels">
                    <span>-5</span>
                    <span>-2.5</span>
                    <span>0</span>
                    <span>2.5</span>
                    <span>5</span>
                </div>
            </div>
            <div class="bias-score">
                Score: <strong>${normalizedScore.toFixed(1)}</strong>
            </div>
        </div>
        
        <div class="bias-instances-map">
            <h4>Bias Distribution in Text:</h4>
            <div class="heatmap-container">
                ${createTextHeatmap(biasAnalysis.Details || [])}
            </div>
        </div>
    `;
}

function createTextHeatmap(biasDetails) {
    if (!biasDetails || biasDetails.length === 0) {
        return '<p>No specific bias instances to visualize.</p>';
    }
    
    // Create a visual representation of where bias appears in the text
    const text = articleText.value;
    const words = text.split(/\s+/);
    
    // Create an array of word objects with bias information
    const wordObjects = words.map((word, index) => {
        // Check if this word is part of a biased phrase
        const biasMatch = biasDetails.find(detail => 
            detail.text.includes(word) && Math.random() > 0.7); // Random factor for demo visualization
        
        return {
            word,
            index,
            biased: !!biasMatch,
            biasType: biasMatch ? biasMatch.biasType : null,
            explanation: biasMatch ? biasMatch.explanation : null
        };
    });
    
    // Create the heatmap HTML
    return `
        <div class="text-heatmap">
            ${wordObjects.map(obj => {
                if (obj.biased) {
                    return `<span class="biased-word" title="${obj.biasType}: ${obj.explanation}">${obj.word}</span>`;
                } else {
                    return `<span class="normal-word">${obj.word}</span>`;
                }
            }).join(' ')}
        </div>
    `;
} 