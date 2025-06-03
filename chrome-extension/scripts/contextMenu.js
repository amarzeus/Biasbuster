// Context Menu Handler
export const ContextMenuManager = {
    init() {
        this.createContextMenus();
        this.setupListeners();
    },

    createContextMenus() {
        // Remove existing items to avoid duplicates
        chrome.contextMenus.removeAll(() => {
            // Main analyze menu item
            chrome.contextMenus.create({
                id: 'analyzeBias',
                title: 'Analyze for Bias',
                contexts: ['selection']
            });

            // Submenu items for different bias types
            const biasTypes = [
                { id: 'gender', title: 'Gender Bias' },
                { id: 'racial', title: 'Racial Bias' },
                { id: 'political', title: 'Political Bias' },
                { id: 'cultural', title: 'Cultural Bias' }
            ];

            biasTypes.forEach(type => {
                chrome.contextMenus.create({
                    id: `analyze${type.id}`,
                    parentId: 'analyzeBias',
                    title: type.title,
                    contexts: ['selection']
                });
            });

            // Quick actions
            chrome.contextMenus.create({
                id: 'separator1',
                type: 'separator',
                contexts: ['selection']
            });

            chrome.contextMenus.create({
                id: 'quickAnalyze',
                title: 'Quick Analyze (All Types)',
                contexts: ['selection']
            });

            chrome.contextMenus.create({
                id: 'suggestImprovements',
                title: 'Suggest Improvements',
                contexts: ['selection']
            });

            // Tools submenu
            chrome.contextMenus.create({
                id: 'biasTools',
                title: 'Bias Tools',
                contexts: ['page']
            });

            const tools = [
                { id: 'scanPage', title: 'Scan Entire Page' },
                { id: 'openAnalytics', title: 'Open Analytics Dashboard' },
                { id: 'openSettings', title: 'Open Settings' }
            ];

            tools.forEach(tool => {
                chrome.contextMenus.create({
                    id: tool.id,
                    parentId: 'biasTools',
                    title: tool.title,
                    contexts: ['page']
                });
            });
        });
    },

    setupListeners() {
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            const selectedText = info.selectionText;

            switch (info.menuItemId) {
                case 'analyzegender':
                case 'analyzeracial':
                case 'analyzepolitical':
                case 'analyzecultural':
                    this.handleBiasTypeAnalysis(info.menuItemId.replace('analyze', ''), selectedText, tab);
                    break;

                case 'quickAnalyze':
                    this.handleQuickAnalysis(selectedText, tab);
                    break;

                case 'suggestImprovements':
                    this.handleSuggestImprovements(selectedText, tab);
                    break;

                case 'scanPage':
                    this.handlePageScan(tab);
                    break;

                case 'openAnalytics':
                    this.openAnalyticsDashboard();
                    break;

                case 'openSettings':
                    this.openSettings();
                    break;
            }
        });
    },

    async handleBiasTypeAnalysis(biasType, text, tab) {
        try {
            const analysis = await this.analyzeBias(text, [biasType]);
            this.showAnalysisResults(analysis, tab);
        } catch (error) {
            console.error('Bias analysis failed:', error);
            this.showError('Failed to analyze text', tab);
        }
    },

    async handleQuickAnalysis(text, tab) {
        try {
            const analysis = await this.analyzeBias(text, ['gender', 'racial', 'political', 'cultural']);
            this.showAnalysisResults(analysis, tab);
        } catch (error) {
            console.error('Quick analysis failed:', error);
            this.showError('Failed to analyze text', tab);
        }
    },

    async handleSuggestImprovements(text, tab) {
        try {
            const suggestions = await this.getSuggestions(text);
            this.showSuggestions(suggestions, tab);
        } catch (error) {
            console.error('Failed to get suggestions:', error);
            this.showError('Failed to generate suggestions', tab);
        }
    },

    async handlePageScan(tab) {
        try {
            // Send message to content script to get page content
            chrome.tabs.sendMessage(tab.id, { action: 'scanPage' });
        } catch (error) {
            console.error('Page scan failed:', error);
            this.showError('Failed to scan page', tab);
        }
    },

    openAnalyticsDashboard() {
        chrome.tabs.create({ url: 'analytics.html' });
    },

    openSettings() {
        chrome.runtime.openOptionsPage();
    },

    async analyzeBias(text, biasTypes) {
        const response = await fetch('https://api.biasbuster.com/v1/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                biasTypes
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    },

    async getSuggestions(text) {
        const response = await fetch('https://api.biasbuster.com/v1/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    },

    showAnalysisResults(analysis, tab) {
        chrome.tabs.sendMessage(tab.id, {
            action: 'showResults',
            data: analysis
        });
    },

    showSuggestions(suggestions, tab) {
        chrome.tabs.sendMessage(tab.id, {
            action: 'showSuggestions',
            data: suggestions
        });
    },

    showError(message, tab) {
        chrome.tabs.sendMessage(tab.id, {
            action: 'showError',
            data: { message }
        });
    }
};

// Initialize context menus when the extension loads
ContextMenuManager.init();
