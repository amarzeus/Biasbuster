// Data management module
export const DataManager = {
    async loadAnalyticsData(timeRange = 'day') {
        try {
            const response = await chrome.storage.local.get('analyticsData');
            const data = response.analyticsData || await this.fetchAnalyticsData(timeRange);
            
            this.updateDashboard(data);
            this.updateLastUpdated();
            
            return data;
        } catch (error) {
            console.error('Failed to load analytics data:', error);
            this.showError('Failed to load analytics data');
        }
    },

    async fetchAnalyticsData(timeRange) {
        // Simulate API call - replace with actual API endpoint
        const mockData = {
            totalAnalyses: 750,
            totalBiases: 320,
            avgBiasScore: 45,
            suggestionsApplied: 210,
            biasTypes: [30, 25, 20, 25],
            biasScoreTrend: [65, 59, 80, 81, 56, 55, 40],
            commonPhrases: [12, 19, 3, 5, 2],
            activity: [150, 200, 180, 220]
        };

        // Store in local storage for caching
        await chrome.storage.local.set({ 
            analyticsData: mockData,
            lastUpdated: new Date().toISOString()
        });

        return mockData;
    },

    updateDashboard(data) {
        // Update overview cards
        const elements = {
            totalAnalyses: document.getElementById('totalAnalyses'),
            totalBiases: document.getElementById('totalBiases'),
            avgBiasScore: document.getElementById('avgBiasScore'),
            suggestionsApplied: document.getElementById('suggestionsApplied')
        };

        if (elements.totalAnalyses) elements.totalAnalyses.textContent = data.totalAnalyses;
        if (elements.totalBiases) elements.totalBiases.textContent = data.totalBiases;
        if (elements.avgBiasScore) elements.avgBiasScore.textContent = `${data.avgBiasScore}%`;
        if (elements.suggestionsApplied) elements.suggestionsApplied.textContent = data.suggestionsApplied;

        // Update detailed stats
        this.updateDetailedStats(data);
    },

    updateDetailedStats(data) {
        // Update top websites
        const topWebsites = document.getElementById('topWebsites');
        if (topWebsites) {
            topWebsites.innerHTML = data.topWebsites?.map(site => 
                `<li>${site.url} - ${site.count} analyses</li>`
            ).join('') || '';
        }

        // Update top suggestions
        const topSuggestions = document.getElementById('topSuggestions');
        if (topSuggestions) {
            topSuggestions.innerHTML = data.topSuggestions?.map(suggestion => 
                `<li>${suggestion.text} - ${suggestion.uses} uses</li>`
            ).join('') || '';
        }

        // Update impact metrics
        const elements = {
            contentImproved: document.getElementById('contentImproved'),
            timeSaved: document.getElementById('timeSaved'),
            accuracyRate: document.getElementById('accuracyRate'),
            responseTime: document.getElementById('responseTime'),
            cacheHitRate: document.getElementById('cacheHitRate'),
            modelVersion: document.getElementById('modelVersion')
        };

        if (elements.contentImproved) elements.contentImproved.textContent = `${data.contentImproved || 0}%`;
        if (elements.timeSaved) elements.timeSaved.textContent = `${data.timeSaved || 0} hrs`;
        if (elements.accuracyRate) elements.accuracyRate.textContent = `${data.accuracyRate || 0}%`;
        if (elements.responseTime) elements.responseTime.textContent = `${data.responseTime || 0}ms`;
        if (elements.cacheHitRate) elements.cacheHitRate.textContent = `${data.cacheHitRate || 0}%`;
        if (elements.modelVersion) elements.modelVersion.textContent = data.modelVersion || 'GPT-4';
    },

    updateLastUpdated() {
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            lastUpdated.textContent = new Date().toLocaleString();
        }
    },

    showError(message) {
        // Implement error display UI
        console.error(message);
    }
};
