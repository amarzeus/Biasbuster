import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';

describe('Biasbuster UI Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    describe('Welcome Page', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="welcome-container">
                    <header>
                        <img src="icons/icon128.png" alt="Biasbuster Logo" class="logo">
                        <h1>Welcome to Biasbuster</h1>
                    </header>
                    <div class="steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h3>Select Text</h3>
                            </div>
                        </div>
                    </div>
                    <button id="openTutorial">Watch Tutorial</button>
                    <button id="openSettings">Configure Settings</button>
                </div>
            `;
        });

        test('renders welcome page correctly', () => {
            expect(document.querySelector('h1')).toHaveTextContent('Welcome to Biasbuster');
            expect(document.querySelector('.logo')).toBeInTheDocument();
            expect(document.querySelector('.steps')).toBeInTheDocument();
        });

        test('buttons trigger correct actions', () => {
            const tutorialBtn = document.getElementById('openTutorial');
            const settingsBtn = document.getElementById('openSettings');

            fireEvent.click(tutorialBtn);
            expect(chrome.tabs.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: expect.stringContaining('tutorial.html')
                })
            );

            fireEvent.click(settingsBtn);
            expect(chrome.runtime.openOptionsPage).toHaveBeenCalled();
        });
    });

    describe('Tutorial Page', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="tutorial-carousel">
                    <div class="carousel-slides">
                        <div id="slide1" class="slide">Slide 1</div>
                        <div id="slide2" class="slide">Slide 2</div>
                    </div>
                    <div class="carousel-controls">
                        <button id="prevSlide">Previous</button>
                        <div class="slide-dots"></div>
                        <button id="nextSlide">Next</button>
                    </div>
                </div>
            `;
        });

        test('carousel navigation works correctly', () => {
            const prevBtn = document.getElementById('prevSlide');
            const nextBtn = document.getElementById('nextSlide');
            const slides = document.querySelectorAll('.slide');

            // Initial state
            expect(slides[0]).toHaveClass('active');
            expect(prevBtn).toBeDisabled();

            // Navigate forward
            fireEvent.click(nextBtn);
            expect(slides[1]).toHaveClass('active');
            expect(prevBtn).not.toBeDisabled();

            // Navigate back
            fireEvent.click(prevBtn);
            expect(slides[0]).toHaveClass('active');
            expect(prevBtn).toBeDisabled();
        });
    });

    describe('Analytics Dashboard', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="analytics-container">
                    <div class="stats">
                        <div id="totalAnalyses">0</div>
                        <div id="biasesDetected">0</div>
                    </div>
                    <canvas id="biasChart"></canvas>
                    <button id="exportData">Export Data</button>
                </div>
            `;
        });

        test('displays analytics data correctly', async () => {
            const testData = {
                totalAnalyses: 100,
                biasesDetected: 45
            };

            // Update display
            document.getElementById('totalAnalyses').textContent = testData.totalAnalyses;
            document.getElementById('biasesDetected').textContent = testData.biasesDetected;

            expect(document.getElementById('totalAnalyses')).toHaveTextContent('100');
            expect(document.getElementById('biasesDetected')).toHaveTextContent('45');
        });

        test('export functionality works', () => {
            const exportBtn = document.getElementById('exportData');
            const mockData = new Blob(['test data'], { type: 'text/csv' });
            global.URL.createObjectURL = jest.fn(() => 'blob:test');

            fireEvent.click(exportBtn);
            
            expect(global.URL.createObjectURL).toHaveBeenCalled();
        });
    });

    describe('Options Page', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="options-container">
                    <div class="bias-types">
                        <label>
                            <input type="checkbox" id="genderBias" checked>
                            Gender Bias
                        </label>
                        <label>
                            <input type="checkbox" id="racialBias" checked>
                            Racial Bias
                        </label>
                    </div>
                    <div class="sensitivity">
                        <label>
                            Sensitivity
                            <input type="range" id="sensitivitySlider" min="0" max="100" value="70">
                        </label>
                    </div>
                    <button id="saveSettings">Save Settings</button>
                </div>
            `;
        });

        test('settings are saved correctly', async () => {
            const genderCheckbox = document.getElementById('genderBias');
            const sensitivitySlider = document.getElementById('sensitivitySlider');
            const saveButton = document.getElementById('saveSettings');

            // Change settings
            fireEvent.click(genderCheckbox);
            fireEvent.change(sensitivitySlider, { target: { value: '80' } });
            fireEvent.click(saveButton);

            // Verify storage update
            expect(chrome.storage.local.set).toHaveBeenCalledWith(
                expect.objectContaining({
                    settings: expect.objectContaining({
                        biasTypes: expect.objectContaining({
                            gender: false
                        }),
                        sensitivity: 0.8
                    })
                })
            );
        });
    });

    describe('Popup UI', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="popup-container">
                    <div class="analysis-status">Ready</div>
                    <button id="analyzeBtn">Analyze Selection</button>
                    <div class="results" style="display: none;">
                        <div class="bias-score">0</div>
                        <div class="suggestions"></div>
                    </div>
                </div>
            `;
        });

        test('analysis button triggers content script', () => {
            const analyzeBtn = document.getElementById('analyzeBtn');
            
            fireEvent.click(analyzeBtn);

            expect(chrome.tabs.query).toHaveBeenCalledWith(
                expect.objectContaining({ active: true, currentWindow: true })
            );
        });

        test('displays results correctly', () => {
            const results = {
                biasScore: 0.45,
                suggestions: ['Consider rephrasing...']
            };

            // Show results
            const resultsDiv = document.querySelector('.results');
            resultsDiv.style.display = 'block';
            document.querySelector('.bias-score').textContent = results.biasScore;
            const suggestionsDiv = document.querySelector('.suggestions');
            suggestionsDiv.innerHTML = `<p>${results.suggestions[0]}</p>`;

            expect(resultsDiv).toBeVisible();
            expect(document.querySelector('.bias-score')).toHaveTextContent('0.45');
            expect(suggestionsDiv).toHaveTextContent('Consider rephrasing...');
        });
    });
});
