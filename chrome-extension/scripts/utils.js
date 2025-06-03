// Utility functions and API interactions
export const Utils = {
    // API Endpoints
    API: {
        BASE_URL: 'https://api.biasbuster.com/v1',
        endpoints: {
            analyze: '/analyze',
            suggest: '/suggest',
            feedback: '/feedback',
            stats: '/stats'
        }
    },

    // Storage Keys
    STORAGE_KEYS: {
        SETTINGS: 'biasSettings',
        ANALYTICS: 'analyticsData',
        CACHE: 'analysisCache',
        USER_PREFS: 'userPreferences'
    },

    // Bias Types
    BIAS_TYPES: {
        GENDER: 'gender',
        RACIAL: 'racial',
        POLITICAL: 'political',
        CULTURAL: 'cultural'
    },

    // API Calls
    async fetchAPI(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.API.BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    // Storage Operations
    storage: {
        async get(key) {
            try {
                const result = await chrome.storage.local.get(key);
                return result[key];
            } catch (error) {
                console.error('Storage get failed:', error);
                return null;
            }
        },

        async set(key, value) {
            try {
                await chrome.storage.local.set({ [key]: value });
                return true;
            } catch (error) {
                console.error('Storage set failed:', error);
                return false;
            }
        },

        async remove(key) {
            try {
                await chrome.storage.local.remove(key);
                return true;
            } catch (error) {
                console.error('Storage remove failed:', error);
                return false;
            }
        }
    },

    // Cache Management
    cache: {
        async get(key) {
            const cache = await Utils.storage.get(Utils.STORAGE_KEYS.CACHE) || {};
            return cache[key];
        },

        async set(key, value, ttl = 3600000) { // Default TTL: 1 hour
            const cache = await Utils.storage.get(Utils.STORAGE_KEYS.CACHE) || {};
            cache[key] = {
                value,
                timestamp: Date.now(),
                ttl
            };
            return Utils.storage.set(Utils.STORAGE_KEYS.CACHE, cache);
        },

        async isValid(key) {
            const cached = await this.get(key);
            if (!cached) return false;

            const now = Date.now();
            const isExpired = (now - cached.timestamp) > cached.ttl;
            
            if (isExpired) {
                await this.remove(key);
                return false;
            }
            
            return true;
        },

        async remove(key) {
            const cache = await Utils.storage.get(Utils.STORAGE_KEYS.CACHE) || {};
            delete cache[key];
            return Utils.storage.set(Utils.STORAGE_KEYS.CACHE, cache);
        }
    },

    // Text Processing
    text: {
        generateHash(text) {
            let hash = 0;
            for (let i = 0; i < text.length; i++) {
                const char = text.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString();
        },

        truncate(text, length = 100) {
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        },

        sanitize(text) {
            return text
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&[^;]+;/g, '') // Remove HTML entities
                .trim();
        }
    },

    // UI Helpers
    ui: {
        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        },

        createLoader() {
            const loader = document.createElement('div');
            loader.className = 'loader';
            return loader;
        },

        toggleLoader(show = true) {
            const existing = document.querySelector('.loader');
            if (show && !existing) {
                document.body.appendChild(this.createLoader());
            } else if (!show && existing) {
                existing.remove();
            }
        }
    },

    // Date/Time Helpers
    datetime: {
        formatDate(date) {
            return new Date(date).toLocaleString();
        },

        getTimeAgo(timestamp) {
            const seconds = Math.floor((Date.now() - timestamp) / 1000);
            
            const intervals = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                minute: 60
            };

            for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                const interval = Math.floor(seconds / secondsInUnit);
                if (interval >= 1) {
                    return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
                }
            }
            
            return 'Just now';
        }
    },

    // Error Handling
    async handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Log error for analytics
        try {
            await this.fetchAPI('/log-error', {
                method: 'POST',
                body: JSON.stringify({
                    error: error.message,
                    context,
                    timestamp: Date.now()
                })
            });
        } catch (e) {
            console.error('Failed to log error:', e);
        }

        // Show user-friendly message
        this.ui.showToast(
            'An error occurred. Please try again later.',
            'error'
        );
    }
};
