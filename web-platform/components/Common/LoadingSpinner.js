class LoadingSpinner {
    constructor(options = {}) {
        this.size = options.size || 40;
        this.color = options.color || 'var(--primary-color)';
        this.message = options.message || 'Loading...';
        this.container = null;
    }

    show(parentElement = document.body) {
        // Create spinner container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'loading-overlay';
            
            const spinnerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner" style="
                        width: ${this.size}px;
                        height: ${this.size}px;
                        border-top-color: ${this.color};
                    "></div>
                    <p class="loading-message">${this.message}</p>
                </div>
            `;
            
            this.container.innerHTML = spinnerHTML;
            
            // Add styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(3px);
                }

                .loading-content {
                    text-align: center;
                }

                .loading-spinner {
                    border: 4px solid var(--border-color);
                    border-radius: 50%;
                    border-top: 4px solid var(--primary-color);
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }

                .loading-message {
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    margin: 0;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .loading-overlay {
                        background: rgba(0, 0, 0, 0.7);
                    }
                }
            `;
            
            document.head.appendChild(style);
        }

        // Add position relative to parent if not already set
        const parentPosition = window.getComputedStyle(parentElement).position;
        if (parentPosition === 'static') {
            parentElement.style.position = 'relative';
        }

        // Add spinner to parent
        parentElement.appendChild(this.container);
    }

    hide() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    updateMessage(message) {
        if (this.container) {
            const messageElement = this.container.querySelector('.loading-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
    }

    setProgress(percent) {
        if (this.container) {
            this.updateMessage(`${Math.round(percent)}% complete`);
        }
    }
}

// Export for use in other files
window.LoadingSpinner = LoadingSpinner;
