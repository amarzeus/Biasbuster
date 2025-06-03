import { Utils } from './utils.js';

class TutorialPage {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.initialize();
    }

    initialize() {
        this.setupCarousel();
        this.setupEventListeners();
        this.setupInteractiveDemo();
        this.showCurrentSlide();
        this.updateNavigationState();
    }

    setupCarousel() {
        // Create slide dots
        const dotsContainer = document.querySelector('.slide-dots');
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.setAttribute('data-slide', i);
            dotsContainer.appendChild(dot);
        }

        // Set initial active state
        this.updateDots();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevSlide')?.addEventListener('click', () => {
            this.navigateSlide(-1);
        });

        document.getElementById('nextSlide')?.addEventListener('click', () => {
            this.navigateSlide(1);
        });

        // Dot navigation
        document.querySelector('.slide-dots')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            }
        });

        // Action buttons
        document.getElementById('startAnalyzing')?.addEventListener('click', () => {
            this.startAnalyzing();
        });

        document.getElementById('openSettings')?.addEventListener('click', () => {
            this.openSettings();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.navigateSlide(-1);
                    break;
                case 'ArrowRight':
                    this.navigateSlide(1);
                    break;
                case 'Escape':
                    this.closeTutorial();
                    break;
            }
        });

        // Track tutorial progress
        this.trackProgress();
    }

    setupInteractiveDemo() {
        const sampleText = document.querySelector('.sample-text');
        if (sampleText) {
            sampleText.addEventListener('mouseup', () => {
                const selection = window.getSelection();
                if (selection && selection.toString().trim()) {
                    this.showAnalysisDemo(selection.toString());
                }
            });
        }

        // Initialize interactive elements
        this.setupBiasMeter();
        this.setupSettingsDemo();
    }

    navigateSlide(direction) {
        const newIndex = this.currentSlide + direction;
        if (newIndex >= 0 && newIndex < this.totalSlides) {
            this.goToSlide(newIndex);
        }
    }

    goToSlide(index) {
        // Remove active class from current slide
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active');
        });

        // Add active class to new slide
        const newSlide = document.querySelector(`#slide${index + 1}`);
        if (newSlide) {
            newSlide.classList.add('active');
            this.currentSlide = index;
            this.updateNavigationState();
            this.updateDots();
            this.trackProgress();
        }
    }

    updateNavigationState() {
        const prevButton = document.getElementById('prevSlide');
        const nextButton = document.getElementById('nextSlide');

        if (prevButton) {
            prevButton.disabled = this.currentSlide === 0;
        }
        if (nextButton) {
            nextButton.disabled = this.currentSlide === this.totalSlides - 1;
        }
    }

    updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    showCurrentSlide() {
        document.querySelector(`#slide${this.currentSlide + 1}`)?.classList.add('active');
    }

    setupBiasMeter() {
        const meterFill = document.querySelector('.meter-fill');
        if (meterFill) {
            // Animate meter fill
            setTimeout(() => {
                meterFill.style.width = '45%';
            }, 500);
        }
    }

    setupSettingsDemo() {
        // Add interactivity to demo settings
        document.querySelectorAll('.setting-option input').forEach(input => {
            input.addEventListener('change', () => {
                if (input.type === 'checkbox') {
                    this.updateDemoSetting(input.checked);
                } else if (input.type === 'range') {
                    this.updateDemoSensitivity(input.value);
                }
            });
        });
    }

    updateDemoSetting(checked) {
        // Update demo UI based on setting changes
        const demoArea = document.querySelector('.interactive-demo');
        if (demoArea) {
            demoArea.classList.toggle('highlighting-enabled', checked);
        }
    }

    updateDemoSensitivity(value) {
        // Update demo UI based on sensitivity changes
        const meterFill = document.querySelector('.meter-fill');
        if (meterFill) {
            meterFill.style.width = `${value}%`;
        }
    }

    async showAnalysisDemo(text) {
        // Simulate analysis with demo data
        const demoAnalysis = {
            score: 45,
            biasTypes: {
                gender: 'high',
                racial: 'low',
                political: 'medium'
            }
        };

        // Update UI with demo results
        this.updateDemoResults(demoAnalysis);
    }

    updateDemoResults(analysis) {
        const meterFill = document.querySelector('.meter-fill');
        if (meterFill) {
            meterFill.style.width = `${analysis.score}%`;
        }

        // Update bias type indicators
        Object.entries(analysis.biasTypes).forEach(([type, level]) => {
            const indicator = document.querySelector(`.bias-type .type-indicator[data-type="${type}"]`);
            if (indicator) {
                indicator.className = `type-indicator ${level}`;
            }
        });
    }

    async trackProgress() {
        try {
            const progress = {
                lastSlide: this.currentSlide,
                completed: this.currentSlide === this.totalSlides - 1,
                timestamp: Date.now()
            };

            await Utils.storage.set('tutorialProgress', progress);
        } catch (error) {
            console.error('Error tracking tutorial progress:', error);
        }
    }

    startAnalyzing() {
        // Close tutorial and open extension popup
        chrome.action.openPopup();
        window.close();
    }

    openSettings() {
        chrome.runtime.openOptionsPage();
        window.close();
    }

    closeTutorial() {
        window.close();
    }
}

// Initialize tutorial when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tutorialPage = new TutorialPage();
});

// Export for testing
export default TutorialPage;
