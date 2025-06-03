// Keyboard Shortcuts Handler
export const ShortcutManager = {
    init() {
        this.setupCommandListeners();
    },

    setupCommandListeners() {
        chrome.commands.onCommand.addListener((command) => {
            switch (command) {
                case 'analyze_selection':
                    this.handleAnalyzeSelection();
                    break;
                case 'toggle_analytics':
                    this.handleToggleAnalytics();
                    break;
                case '_execute_action':
                    this.handleExecuteAction();
                    break;
            }
        });
    },

    async handleAnalyzeSelection() {
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Request selected text from content script
            chrome.tabs.sendMessage(tab.id, { action: 'getSelection' }, async (response) => {
                if (response && response.selectedText) {
                    const analysis = await this.performAnalysis(response.selectedText);
                    this.showResults(analysis, tab.id);
                } else {
                    this.showNotification('Please select text to analyze');
                }
            });
        } catch (error) {
            console.error('Error handling analyze selection:', error);
            this.showNotification('Failed to analyze selection');
        }
    },

    handleToggleAnalytics() {
        // Check if analytics dashboard is already open
        chrome.tabs.query({ url: chrome.runtime.getURL('analytics.html') }, (tabs) => {
            if (tabs.length > 0) {
                // Focus existing analytics tab
                chrome.tabs.update(tabs[0].id, { active: true });
            } else {
                // Open new analytics dashboard
                chrome.tabs.create({ url: 'analytics.html' });
            }
        });
    },

    handleExecuteAction() {
        // Open the popup programmatically
        chrome.action.openPopup();
    },

    async performAnalysis(text) {
        try {
            const response = await fetch('https://api.biasbuster.com/v1/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    biasTypes: ['gender', 'racial', 'political', 'cultural']
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        }
    },

    showResults(analysis, tabId) {
        chrome.tabs.sendMessage(tabId, {
            action: 'showResults',
            data: analysis
        });
    },

    showNotification(message) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Biasbuster',
            message: message
        });
    }
};

// Initialize shortcuts when the extension loads
ShortcutManager.init();
