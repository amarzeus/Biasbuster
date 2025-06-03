class ToastNotification {
    constructor(options = {}) {
        this.duration = options.duration || 3000;
        this.position = options.position || 'top-right';
        this.container = this.createContainer();
        this.addStyles();
    }

    createContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = `toast-container ${this.position}`;
            document.body.appendChild(container);
        }
        return container;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                z-index: 9999;
                max-width: 400px;
                padding: 1rem;
                pointer-events: none;
            }

            .toast-container.top-right {
                top: 1rem;
                right: 1rem;
            }

            .toast-container.top-left {
                top: 1rem;
                left: 1rem;
            }

            .toast-container.bottom-right {
                bottom: 1rem;
                right: 1rem;
            }

            .toast-container.bottom-left {
                bottom: 1rem;
                left: 1rem;
            }

            .toast {
                background: var(--surface-color);
                color: var(--text-primary);
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                pointer-events: all;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                border: 1px solid var(--border-color);
            }

            .toast.show {
                transform: translateX(0);
            }

            .toast.success {
                border-left: 4px solid var(--success-color);
            }

            .toast.error {
                border-left: 4px solid var(--error-color);
            }

            .toast.info {
                border-left: 4px solid var(--primary-color);
            }

            .toast.warning {
                border-left: 4px solid var(--warning-color);
            }

            .toast-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .toast.success .toast-icon {
                color: var(--success-color);
            }

            .toast.error .toast-icon {
                color: var(--error-color);
            }

            .toast.info .toast-icon {
                color: var(--primary-color);
            }

            .toast.warning .toast-icon {
                color: var(--warning-color);
            }

            .toast-content {
                flex-grow: 1;
                font-size: 0.9rem;
            }

            .toast-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.25rem;
                font-size: 1.25rem;
                line-height: 1;
                transition: color 0.2s ease;
            }

            .toast-close:hover {
                color: var(--text-primary);
            }

            @media (max-width: 480px) {
                .toast-container {
                    left: 1rem;
                    right: 1rem;
                    max-width: none;
                }

                .toast {
                    margin-left: 0;
                    margin-right: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    getIcon(type) {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getIcon(type)}</span>
            <div class="toast-content">${message}</div>
            <button class="toast-close" aria-label="Close notification">×</button>
        `;

        this.container.appendChild(toast);

        // Trigger reflow for animation
        toast.offsetHeight;
        toast.classList.add('show');

        const close = () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };

        toast.querySelector('.toast-close').addEventListener('click', close);

        if (this.duration > 0) {
            setTimeout(close, this.duration);
        }

        // Add hover pause functionality
        let timeoutId;
        toast.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });
        toast.addEventListener('mouseleave', () => {
            if (this.duration > 0) {
                timeoutId = setTimeout(close, this.duration);
            }
        });

        return {
            close,
            element: toast
        };
    }

    success(message) {
        return this.show(message, 'success');
    }

    error(message) {
        return this.show(message, 'error');
    }

    warning(message) {
        return this.show(message, 'warning');
    }

    info(message) {
        return this.show(message, 'info');
    }
}

// Export for use in other files
window.ToastNotification = ToastNotification;
