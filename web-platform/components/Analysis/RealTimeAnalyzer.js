class RealTimeAnalyzer {
    constructor() {
        this.socket = null;
        this.analysisQueue = [];
        this.isProcessing = false;
        this.debounceTimeout = null;
        this.mlService = null;
        this.customBiasWords = new Map();
        this.biasCategories = new Set(['political', 'gender', 'racial', 'cultural']);
        this.initializeMLService();
    }

    async initializeMLService() {
        // Initialize a simplified ML service for demo purposes
        this.mlService = {
            analyzeBias: async (text, sensitivity) => {
                return this.performBiasAnalysis(text, sensitivity);
            },
            updateCustomBiasWords: (category, words) => {
                this.customBiasWords.set(category, words);
            },
            getCustomBiasWords: (category) => {
                return this.customBiasWords.get(category) || [];
            }
        };
        
        // Load custom bias words from localStorage
        this.loadCustomBiasWords();
    }

    loadCustomBiasWords() {
        const savedWords = localStorage.getItem('biasbuster-bias-words');
        if (savedWords) {
            const parsed = JSON.parse(savedWords);
            this.customBiasWords = new Map(Object.entries(parsed));
        } else {
            // Initialize with default bias words
            this.customBiasWords.set('political', [
                'radical', 'extremist', 'leftist', 'rightist', 'communist', 'socialist', 'fascist'
            ]);
            this.customBiasWords.set('gender', [
                'mankind', 'chairman', 'policeman', 'stewardess', 'housewife', 'mailman', 'businessman'
            ]);
            this.customBiasWords.set('racial', [
                'colored', 'oriental', 'ethnic', 'urban', 'ghetto', 'exotic', 'tribal'
            ]);
            this.customBiasWords.set('cultural', [
                'primitive', 'uncivilized', 'backward', 'third-world', 'developing', 'underdeveloped'
            ]);
        }
    }

    async performBiasAnalysis(text, sensitivity = 0.5) {
        const biasInstances = [];
        let totalScore = 0;
        
        // Analyze each category
        for (const [category, words] of this.customBiasWords) {
            const categoryInstances = this.findBiasInCategory(text, category, words);
            biasInstances.push(...categoryInstances);
            
            if (categoryInstances.length > 0) {
                totalScore += Math.min(categoryInstances.length * 0.2, 1.0);
            }
        }
        
        const overallScore = Math.min(totalScore / this.customBiasWords.size, 1.0);
        
        return {
            text,
            overallScore,
            BiasInstances: biasInstances,
            suggestions: this.generateSuggestions(biasInstances),
            timestamp: new Date()
        };
    }

    findBiasInCategory(text, category, words) {
        const instances = [];
        
        for (const word of words) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                const start = Math.max(0, match.index - 50);
                const end = Math.min(text.length, match.index + word.length + 50);
                
                instances.push({
                    type: category,
                    biasedText: word,
                    context: text.substring(start, end),
                    explanation: `The word "${word}" may carry ${category} bias and could be perceived as non-neutral.`,
                    suggestion: this.getSuggestionForWord(word, category),
                    severity: this.calculateSeverity(word, category)
                });
            }
        }
        
        return instances;
    }

    getSuggestionForWord(word, category) {
        const suggestions = {
            political: {
                'radical': 'person with strong views',
                'extremist': 'person with extreme views',
                'leftist': 'person with progressive views',
                'rightist': 'person with conservative views',
                'communist': 'person with communist views',
                'socialist': 'person with socialist views',
                'fascist': 'person with authoritarian views'
            },
            gender: {
                'chairman': 'chairperson',
                'policeman': 'police officer',
                'stewardess': 'flight attendant',
                'businessman': 'businessperson',
                'housewife': 'homemaker',
                'mailman': 'mail carrier',
                'mankind': 'humanity'
            },
            racial: {
                'colored': 'person of color',
                'oriental': 'Asian',
                'ethnic': 'from diverse backgrounds',
                'urban': 'city-dwelling',
                'ghetto': 'low-income neighborhood',
                'exotic': 'unique',
                'tribal': 'indigenous'
            },
            cultural: {
                'primitive': 'traditional',
                'uncivilized': 'different cultural practices',
                'backward': 'developing',
                'third-world': 'developing nation',
                'developing': 'emerging economy',
                'underdeveloped': 'developing region'
            }
        };

        return suggestions[category]?.[word.toLowerCase()] || 
               `Consider using more neutral language instead of "${word}"`;
    }

    calculateSeverity(word, category) {
        // Simple severity calculation based on word and category
        const highSeverityWords = ['extremist', 'fascist', 'primitive', 'uncivilized'];
        const mediumSeverityWords = ['radical', 'leftist', 'rightist', 'backward'];
        
        if (highSeverityWords.includes(word.toLowerCase())) return 'High';
        if (mediumSeverityWords.includes(word.toLowerCase())) return 'Medium';
        return 'Low';
    }

    generateSuggestions(biasInstances) {
        return biasInstances.map(instance => instance.suggestion);
    }

    init() {
        this.setupWebSocket();
        this.setupEventListeners();
    }

    setupWebSocket() {
        try {
            this.socket = new WebSocket(`ws://${window.location.host}/analysis`);
            
            this.socket.onopen = () => {
                console.log('Real-time analysis connection established');
            };

            this.socket.onmessage = (event) => {
                const result = JSON.parse(event.data);
                this.handleAnalysisResult(result);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                // Fallback to local ML analysis
                this.useFallbackAnalysis();
            };
        } catch (error) {
            console.log('WebSocket not available, using local analysis');
            this.useFallbackAnalysis();
        }
    }

    setupEventListeners() {
        const textArea = document.getElementById('analysis-input');
        if (textArea) {
            textArea.addEventListener('input', (e) => {
                this.debounceAnalysis(e.target.value);
            });
        }

        // Listen for custom bias word updates
        document.addEventListener('biasWordsUpdated', (e) => {
            this.loadCustomBiasWords();
        });
    }

    debounceAnalysis(text) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            this.queueAnalysis(text);
        }, 500); // Wait for 500ms of no typing before analyzing
    }

    queueAnalysis(text) {
        if (text.trim().length === 0) return;
        
        this.analysisQueue.push(text);
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.analysisQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const text = this.analysisQueue.shift();

        try {
            let result;
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ text }));
            } else if (this.mlService) {
                // Use local ML service
                result = await this.mlService.analyzeBias(text, 0.5);
                this.handleAnalysisResult(result);
            } else {
                // Fallback to REST API
                result = await this.analyzeViaREST(text);
                this.handleAnalysisResult(result);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Analysis failed. Please try again.');
        }

        // Process next item in queue
        setTimeout(() => this.processQueue(), 100);
    }

    async analyzeViaREST(text) {
        const response = await fetch('/api/analysis/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Analysis failed');
        }

        return response.json();
    }

    handleAnalysisResult(result) {
        // Show loading state
        this.showLoadingState(false);
        
        // Display results using BiasVisualizer
        if (window.BiasVisualizer) {
            const visualizer = new window.BiasVisualizer();
            visualizer.displayResults(result);
        }
        
        // Update metrics
        if (window.dashboardManager) {
            window.dashboardManager.updateMetrics(result);
        }

        // Store analysis in history
        this.storeAnalysisHistory(result);
    }

    showLoadingState(show = true) {
        const resultsSection = document.getElementById('analysis-results');
        if (!resultsSection) return;

        if (show) {
            resultsSection.innerHTML = `
                <div class="loading-animation">
                    <div class="loading-spinner"></div>
                    <p>Analyzing text for bias...</p>
                </div>
            `;
        }
    }

    storeAnalysisHistory(result) {
        const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
        history.unshift({
            ...result,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 analyses
        if (history.length > 50) {
            history.splice(50);
        }
        
        localStorage.setItem('analysis-history', JSON.stringify(history));
    }

    showError(message) {
        const resultsSection = document.getElementById('analysis-results');
        if (resultsSection) {
            resultsSection.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-button">Retry</button>
                </div>
            `;
        }
    }

    useFallbackAnalysis() {
        console.log('Using local ML analysis as fallback');
        // ML service is already initialized, so we can continue with local analysis
    }

    // Public method to trigger manual analysis
    async analyzeText(text) {
        if (!text || text.trim().length === 0) {
            this.showError('Please enter some text to analyze.');
            return;
        }

        this.showLoadingState(true);
        
        try {
            const result = await this.mlService.analyzeBias(text, 0.5);
            this.handleAnalysisResult(result);
        } catch (error) {
            console.error('Manual analysis error:', error);
            this.showError('Analysis failed. Please try again.');
        }
    }

    // Method to update custom bias words
    updateCustomBiasWords(category, words) {
        if (this.mlService) {
            this.mlService.updateCustomBiasWords(category, words);
        }
        this.loadCustomBiasWords();
    }
}

// Export for use in other files
window.RealTimeAnalyzer = RealTimeAnalyzer;
