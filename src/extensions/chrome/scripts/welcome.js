import { Utils } from './utils.js';

class WelcomePage {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.checkFirstRun();
        this.loadUserPreferences();
    }

    setupEventListeners() {
        // Tutorial button
        document.getElementById('openTutorial')?.addEventListener('click', () => {
            this.openTutorial();
        });

        // Settings button
        document.getElementById('openSettings')?.addEventListener('click', () => {
            this.openSettings();
        });

        // Analytics button
        document.getElementById('openAnalytics')?.addEventListener('click', () => {
            this.openAnalytics();
        });

        // Social links tracking
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackSocialClick(e.currentTarget.href);
            });
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.close();
            }
        });
    }

    async checkFirstRun() {
        try {
            const data = await Utils.storage.get(Utils.STORAGE_KEYS.USER_PREFS);
            if (!data || !data.hasSeenWelcome) {
                await this.markWelcomeSeen();
                this.showFirstRunElements();
            } else {
                this.hideFirstRunElements();
            }
        } catch (error) {
            console.error('Error checking first run:', error);
        }
    }

    async markWelcomeSeen() {
        try {
            const prefs = await Utils.storage.get(Utils.STORAGE_KEYS.USER_PREFS) || {};
            prefs.hasSeenWelcome = true;
            prefs.welcomeSeenDate = Date.now();
            await Utils.storage.set(Utils.STORAGE_KEYS.USER_PREFS, prefs);
        } catch (error) {
            console.error('Error marking welcome as seen:', error);
        }
    }

    async loadUserPreferences() {
        try {
            const settings = await Utils.storage.get(Utils.STORAGE_KEYS.SETTINGS);
            if (settings) {
                this.updateUIWithSettings(settings);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }

    updateUIWithSettings(settings) {
        // Update any UI elements that reflect user settings
        const elements = {
            genderBias: document.querySelector('[data-feature="gender-bias"]'),
            racialBias: document.querySelector('[data-feature="racial-bias"]'),
            politicalBias: document.querySelector('[data-feature="political-bias"]'),
            culturalBias: document.querySelector('[data-feature="cultural-bias"]')
        };

        if (elements.genderBias) {
            elements.genderBias.classList.toggle('active', settings.biasTypes?.gender);
        }
        // ... update other elements similarly
    }

    showFirstRunElements() {
        // Show elements specific to first-time users
        document.querySelectorAll('.first-run-only').forEach(el => {
            el.style.display = 'block';
        });
    }

    hideFirstRunElements() {
        // Hide elements specific to first-time users
        document.querySelectorAll('.first-run-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    openTutorial() {
        // Create and show tutorial modal or redirect to tutorial page
        const tutorialUrl = chrome.runtime.getURL('tutorial.html');
        chrome.tabs.create({ url: tutorialUrl });
    }

    openSettings() {
        chrome.runtime.openOptionsPage();
    }

    openAnalytics() {
        const analyticsUrl = chrome.runtime.getURL('analytics.html');
        chrome.tabs.create({ url: analyticsUrl });
    }

    async trackSocialClick(url) {
        try {
            // Track social link clicks for analytics
            const stats = await Utils.storage.get(Utils.STORAGE_KEYS.ANALYTICS) || {};
            if (!stats.socialClicks) stats.socialClicks = {};
            if (!stats.socialClicks[url]) stats.socialClicks[url] = 0;
            stats.socialClicks[url]++;
            await Utils.storage.set(Utils.STORAGE_KEYS.ANALYTICS, stats);
        } catch (error) {
            console.error('Error tracking social click:', error);
        }
    }

    showToast(message, type = 'info') {
        Utils.ui.showToast(message, type);
    }
}

// Initialize welcome page
document.addEventListener('DOMContentLoaded', () => {
    window.welcomePage = new WelcomePage();
});

// Export for testing
export default WelcomePage;
