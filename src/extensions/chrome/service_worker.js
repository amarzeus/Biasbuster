import { Utils } from './scripts/utils.js';
import { ContextMenuManager } from './scripts/contextMenu.js';
import { ShortcutManager } from './scripts/shortcuts.js';

// Service Worker for Biasbuster Extension
class BiasbusterServiceWorker {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Initialize managers
        ContextMenuManager.init();
        ShortcutManager.init();

        // Set up message listeners
        this.setupMessageListeners();
        
        // Set up alarm for periodic tasks
        this.setupAlarms();
        
        // Set up installation/update handlers
        this.setupLifecycleHandlers();
    }

    setupMessageListeners() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.type) {
                case 'ANALYZE_TEXT':
                    this.handleAnalyzeText(request.text, sender.tab?.id)
                        .then(sendResponse);
                    return true; // Keep channel open for async response

                case 'UPDATE_SETTINGS':
                    this.handleUpdateSettings(request.settings)
                        .then(sendResponse);
                    return true;

                case 'GET_STATS':
                    this.handleGetStats()
                        .then(sendResponse);
                    return true;

                case 'CLEAR_CACHE':
                    this.handleClearCache()
                        .then(sendResponse);
                    return true;
            }
        });
    }

    setupAlarms() {
        // Set up daily analytics sync
        chrome.alarms.create('syncAnalytics', {
            periodInMinutes: 1440 // 24 hours
        });

        // Set up cache cleanup
        chrome.alarms.create('cleanCache', {
            periodInMinutes: 60 // 1 hour
        });

        chrome.alarms.onAlarm.addListener((alarm) => {
            switch (alarm.name) {
                case 'syncAnalytics':
                    this.syncAnalytics();
                    break;
                case 'cleanCache':
                    this.cleanCache();
                    break;
            }
        });
    }

    setupLifecycleHandlers() {
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.handleFirstInstall();
            } else if (details.reason === 'update') {
                this.handleUpdate(details.previousVersion);
            }
        });
    }

    async handleAnalyzeText(text, tabId) {
        try {
            Utils.ui.toggleLoader(true);

            // Check cache first
            const textHash = Utils.text.generateHash(text);
            const cached = await Utils.cache.get(textHash);
            
            if (cached && await Utils.cache.isValid(textHash)) {
                return cached.value;
            }

            // Perform analysis
            const analysis = await Utils.fetchAPI(Utils.API.endpoints.analyze, {
                method: 'POST',
                body: JSON.stringify({ text })
            });

            // Cache results
            await Utils.cache.set(textHash, analysis);

            // Update analytics
            await this.updateAnalytics(analysis);

            return analysis;
        } catch (error) {
            await Utils.handleError(error, 'Text Analysis');
            throw error;
        } finally {
            Utils.ui.toggleLoader(false);
        }
    }

    async handleUpdateSettings(settings) {
        try {
            await Utils.storage.set(Utils.STORAGE_KEYS.SETTINGS, settings);
            return { success: true };
        } catch (error) {
            await Utils.handleError(error, 'Settings Update');
            return { success: false, error: error.message };
        }
    }

    async handleGetStats() {
        try {
            const stats = await Utils.storage.get(Utils.STORAGE_KEYS.ANALYTICS);
            return stats || { totalAnalyses: 0, biasesDetected: 0 };
        } catch (error) {
            await Utils.handleError(error, 'Get Stats');
            return { error: error.message };
        }
    }

    async handleClearCache() {
        try {
            await Utils.storage.remove(Utils.STORAGE_KEYS.CACHE);
            return { success: true };
        } catch (error) {
            await Utils.handleError(error, 'Clear Cache');
            return { success: false, error: error.message };
        }
    }

    async syncAnalytics() {
        try {
            const stats = await Utils.storage.get(Utils.STORAGE_KEYS.ANALYTICS);
            await Utils.fetchAPI(Utils.API.endpoints.stats, {
                method: 'POST',
                body: JSON.stringify(stats)
            });
        } catch (error) {
            await Utils.handleError(error, 'Sync Analytics');
        }
    }

    async cleanCache() {
        try {
            const cache = await Utils.storage.get(Utils.STORAGE_KEYS.CACHE) || {};
            const now = Date.now();

            for (const [key, entry] of Object.entries(cache)) {
                if (now - entry.timestamp > entry.ttl) {
                    delete cache[key];
                }
            }

            await Utils.storage.set(Utils.STORAGE_KEYS.CACHE, cache);
        } catch (error) {
            await Utils.handleError(error, 'Clean Cache');
        }
    }

    async handleFirstInstall() {
        try {
            // Set default settings
            await Utils.storage.set(Utils.STORAGE_KEYS.SETTINGS, {
                biasTypes: {
                    gender: true,
                    racial: true,
                    political: true,
                    cultural: true
                },
                sensitivity: 0.7,
                showInlineSuggestions: true,
                highlightBiasedText: true,
                useCache: true
            });

            // Initialize analytics
            await Utils.storage.set(Utils.STORAGE_KEYS.ANALYTICS, {
                totalAnalyses: 0,
                biasesDetected: 0,
                installDate: Date.now()
            });

            // Show welcome page
            chrome.tabs.create({
                url: chrome.runtime.getURL('welcome.html')
            });
        } catch (error) {
            await Utils.handleError(error, 'First Install');
        }
    }

    async handleUpdate(previousVersion) {
        try {
            // Perform any necessary data migrations
            await this.migrateData(previousVersion);

            // Show update notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Biasbuster Updated',
                message: 'Click to see what\'s new in this version!'
            });
        } catch (error) {
            await Utils.handleError(error, 'Update Handler');
        }
    }

    async migrateData(previousVersion) {
        // Implement version-specific data migrations here
        console.log('Migrating from version:', previousVersion);
    }

    async updateAnalytics(analysis) {
        try {
            const stats = await Utils.storage.get(Utils.STORAGE_KEYS.ANALYTICS) || {
                totalAnalyses: 0,
                biasesDetected: 0
            };

            stats.totalAnalyses++;
            if (analysis.biasesDetected > 0) {
                stats.biasesDetected += analysis.biasesDetected;
            }

            await Utils.storage.set(Utils.STORAGE_KEYS.ANALYTICS, stats);
        } catch (error) {
            await Utils.handleError(error, 'Update Analytics');
        }
    }
}

// Initialize the service worker
const serviceWorker = new BiasbusterServiceWorker();
