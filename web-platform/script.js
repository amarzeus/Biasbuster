// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeComponents();
    setupEventListeners();
    setupModalHandlers();
});

function initializeComponents() {
    // Initialize RealTimeAnalyzer
    window.realTimeAnalyzer = new RealTimeAnalyzer();
    window.realTimeAnalyzer.init();

    // Initialize ResultsDashboard if user is authenticated
    if (localStorage.getItem('authToken')) {
        window.resultsDashboard = new ResultsDashboard();
        window.resultsDashboard.init();
    }

    // Initialize ToastNotification
    window.toast = new ToastNotification({
        position: 'top-right',
        duration: 3000
    });

    // Initialize ThemeToggle
    window.themeToggle = new ThemeToggle({
        storageKey: 'biasbuster-theme',
        defaultTheme: 'light'
    });
}

function setupEventListeners() {
    // Clear button functionality
    const clearButton = document.getElementById('clear-button');
    const textInput = document.getElementById('analysis-input');
    const resultsContainer = document.getElementById('analysis-results');

    if (clearButton && textInput && resultsContainer) {
        clearButton.addEventListener('click', () => {
            textInput.value = '';
            resultsContainer.innerHTML = '<p class="placeholder">Results will appear here...</p>';
            window.toast.info('Text cleared');
        });
    }

    // Manual analysis button
    const analyzeButton = document.getElementById('analyze-button');
    if (analyzeButton && window.realTimeAnalyzer) {
        analyzeButton.addEventListener('click', () => {
            const text = textInput?.value || '';
            if (text.trim()) {
                window.realTimeAnalyzer.analyzeText(text);
            } else {
                window.toast.warning('Please enter some text to analyze');
            }
        });
    }

    // Real-time toggle
    const realtimeToggle = document.getElementById('realtime-toggle');
    if (realtimeToggle) {
        realtimeToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            window.toast.info(`Real-time analysis ${isEnabled ? 'enabled' : 'disabled'}`);
            if (window.realTimeAnalyzer) {
                window.realTimeAnalyzer.toggleRealTimeAnalysis(isEnabled);
            }
        });
    }

    // Sensitivity level
    const sensitivitySelect = document.getElementById('sensitivity-level');
    if (sensitivitySelect) {
        sensitivitySelect.addEventListener('change', (e) => {
            const level = e.target.value;
            window.toast.info(`Sensitivity level set to ${level}`);
            if (window.realTimeAnalyzer) {
                window.realTimeAnalyzer.updateSensitivity(level);
            }
        });
    }
}

function setupModalHandlers() {
    // Color customization modal
    setupModal('customize-colors', 'color-modal', {
        onSave: (modal) => {
            const biasColor = document.getElementById('bias-highlight-color').value;
            const suggestionColor = document.getElementById('suggestion-highlight-color').value;
            
            document.documentElement.style.setProperty('--bias-highlight-color', biasColor);
            document.documentElement.style.setProperty('--suggestion-highlight-color', suggestionColor);
            
            localStorage.setItem('biasbuster-colors', JSON.stringify({ biasColor, suggestionColor }));
            window.toast.success('Colors updated successfully');
            closeModal(modal);
        }
    });

    // Bias settings modal
    setupModal('customize-bias', 'bias-modal', {
        onSave: (modal) => {
            const customWords = document.getElementById('custom-bias-input').value
                .split('\n')
                .map(word => word.trim())
                .filter(word => word);

            const categories = {};
            document.querySelectorAll('.category-toggles input[type="checkbox"]').forEach(checkbox => {
                categories[checkbox.value] = checkbox.checked;
            });

            if (window.realTimeAnalyzer) {
                window.realTimeAnalyzer.updateCustomBiasWords('custom', customWords);
                Object.entries(categories).forEach(([category, enabled]) => {
                    window.realTimeAnalyzer.toggleCategory(category, enabled);
                });
            }

            localStorage.setItem('biasbuster-custom-words', JSON.stringify(customWords));
            localStorage.setItem('biasbuster-categories', JSON.stringify(categories));
            window.toast.success('Bias settings updated successfully');
            closeModal(modal);
        }
    });

    // Load saved settings
    loadSavedSettings();
}

function setupModal(triggerButtonId, modalId, { onSave }) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerButtonId);
    const saveButton = modal?.querySelector(`#save-${modalId.replace('-modal', '')}`);
    const cancelButton = modal?.querySelector(`#cancel-${modalId.replace('-modal', '')}`);

    if (!modal || !trigger) return;

    trigger.addEventListener('click', () => openModal(modal));
    
    if (saveButton) {
        saveButton.addEventListener('click', () => onSave(modal));
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => closeModal(modal));
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal(modal);
        }
    });
}

function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function loadSavedSettings() {
    // Load saved colors
    try {
        const savedColors = JSON.parse(localStorage.getItem('biasbuster-colors'));
        if (savedColors) {
            document.documentElement.style.setProperty('--bias-highlight-color', savedColors.biasColor);
            document.documentElement.style.setProperty('--suggestion-highlight-color', savedColors.suggestionColor);
            
            const biasColorInput = document.getElementById('bias-highlight-color');
            const suggestionColorInput = document.getElementById('suggestion-highlight-color');
            
            if (biasColorInput) biasColorInput.value = savedColors.biasColor;
            if (suggestionColorInput) suggestionColorInput.value = savedColors.suggestionColor;
        }
    } catch (error) {
        console.error('Error loading saved colors:', error);
    }

    // Load saved bias settings
    try {
        const savedWords = JSON.parse(localStorage.getItem('biasbuster-custom-words'));
        const savedCategories = JSON.parse(localStorage.getItem('biasbuster-categories'));
        
        const customWordsInput = document.getElementById('custom-bias-input');
        if (customWordsInput && savedWords) {
            customWordsInput.value = savedWords.join('\n');
        }

        if (savedCategories) {
            document.querySelectorAll('.category-toggles input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = savedCategories[checkbox.value] ?? true;
            });
        }

        if (window.realTimeAnalyzer) {
            if (savedWords) {
                window.realTimeAnalyzer.updateCustomBiasWords('custom', savedWords);
            }
            if (savedCategories) {
                Object.entries(savedCategories).forEach(([category, enabled]) => {
                    window.realTimeAnalyzer.toggleCategory(category, enabled);
                });
            }
        }
    } catch (error) {
        console.error('Error loading saved bias settings:', error);
    }
}

// Export for use in other files
window.BiasBuster = {
    realTimeAnalyzer: window.realTimeAnalyzer,
    resultsDashboard: window.resultsDashboard,
    toast: window.toast,
    themeToggle: window.themeToggle
};
