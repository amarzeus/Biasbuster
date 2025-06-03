class ThemeToggle {
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'biasbuster-theme';
        this.defaultTheme = options.defaultTheme || 'light';
        this.buttonId = options.buttonId || 'theme-toggle';
        this.darkClass = options.darkClass || 'dark-theme';
        this.lightClass = options.lightClass || 'light-theme';
        this.transitionDuration = options.transitionDuration || 300;
        
        this.currentTheme = this.loadTheme();
        this.button = null;
        
        this.init();
    }

    init() {
        // Create theme toggle button if it doesn't exist
        this.createButton();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Add transition styles
        this.addTransitionStyles();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
    }

    createButton() {
        let button = document.getElementById(this.buttonId);
        
        if (!button) {
            button = document.createElement('button');
            button.id = this.buttonId;
            button.className = 'theme-toggle-button';
            button.setAttribute('aria-label', 'Toggle theme');
            
            // Add button to the DOM
            const targetContainer = document.querySelector('.customization-options') || document.body;
            targetContainer.appendChild(button);
        }
        
        this.button = button;
        this.updateButtonAppearance();
        
        // Add click event listener
        this.button.addEventListener('click', () => this.toggle());
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle-button {
                background: none;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 0.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                transition: all 0.3s ease;
            }

            .theme-toggle-button:hover {
                background: var(--hover-color);
                border-color: var(--primary-color);
            }

            .theme-toggle-button::before {
                content: '🌞';
                font-size: 1.2rem;
            }

            .dark-theme .theme-toggle-button::before {
                content: '🌙';
            }

            @media (hover: hover) {
                .theme-toggle-button:hover {
                    transform: scale(1.1);
                }
            }

            @media (prefers-reduced-motion) {
                .theme-toggle-button {
                    transition: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                transition: background-color ${this.transitionDuration}ms ease,
                            color ${this.transitionDuration}ms ease,
                            border-color ${this.transitionDuration}ms ease,
                            box-shadow ${this.transitionDuration}ms ease;
            }

            @media (prefers-reduced-motion) {
                * {
                    transition: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = (e) => {
                if (this.currentTheme === 'system') {
                    this.applyTheme('system');
                }
            };
            
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else {
                // Fallback for older browsers
                mediaQuery.addListener(handleChange);
            }
        }
    }

    loadTheme() {
        return localStorage.getItem(this.storageKey) || this.defaultTheme;
    }

    saveTheme(theme) {
        localStorage.setItem(this.storageKey, theme);
        this.currentTheme = theme;
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const effectiveTheme = theme === 'system' ? this.getSystemTheme() : theme;
        
        // Remove existing theme classes
        root.classList.remove(this.darkClass, this.lightClass);
        
        // Add new theme class
        root.classList.add(effectiveTheme === 'dark' ? this.darkClass : this.lightClass);
        
        // Update button appearance
        this.updateButtonAppearance();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: effectiveTheme }
        }));
    }

    updateButtonAppearance() {
        if (this.button) {
            const effectiveTheme = this.currentTheme === 'system' ? 
                this.getSystemTheme() : this.currentTheme;
            
            this.button.setAttribute('aria-label', 
                `Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} theme`);
        }
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.saveTheme(newTheme);
        this.applyTheme(newTheme);
        
        // Show toast notification
        if (window.ToastNotification) {
            const toast = new window.ToastNotification();
            toast.info(`Switched to ${newTheme} theme`);
        }
    }

    setTheme(theme) {
        if (['light', 'dark', 'system'].includes(theme)) {
            this.saveTheme(theme);
            this.applyTheme(theme);
        }
    }
}

// Export for use in other files
window.ThemeToggle = ThemeToggle;

// Initialize theme toggle when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeToggle = new ThemeToggle();
});
