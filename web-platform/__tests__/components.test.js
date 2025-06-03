// Component Tests
describe('ThemeToggle Component', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <nav>
                <ul></ul>
            </nav>
        `;
        localStorage.clear();
    });

    test('initializes with correct theme', () => {
        const themeToggle = new ThemeToggle();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('toggles theme correctly', () => {
        const themeToggle = new ThemeToggle();
        const button = document.getElementById('theme-toggle');
        button.click();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });
});

describe('RealTimeAnalyzer Component', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <textarea id="analysis-input"></textarea>
            <div id="analysis-results"></div>
        `;
    });

    test('initializes WebSocket connection', () => {
        const analyzer = new RealTimeAnalyzer();
        analyzer.init();
        expect(analyzer.socket).not.toBeNull();
    });

    test('debounces analysis requests', (done) => {
        const analyzer = new RealTimeAnalyzer();
        analyzer.init();
        const input = document.getElementById('analysis-input');
        
        let analysisCount = 0;
        analyzer.queueAnalysis = () => {
            analysisCount++;
        };

        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        input.value = 'test input';
        input.dispatchEvent(new Event('input'));

        setTimeout(() => {
            expect(analysisCount).toBe(1);
            done();
        }, 600);
    });
});

describe('BiasVisualizer Component', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="analysis-results"></div>
        `;
        global.Chart = jest.fn(() => ({
            destroy: jest.fn()
        }));
    });

    test('displays analysis results correctly', () => {
        const visualizer = new BiasVisualizer();
        const mockAnalysis = {
            MainTopic: "Test Analysis",
            BiasDetected: "yes",
            BiasInstances: [
                {
                    Sentence: "Test sentence",
                    BiasType: "Test Bias",
                    Explanation: "Test explanation",
                    Severity: "3",
                    Justification: "Test justification",
                    Mitigation: "Test mitigation"
                }
            ],
            BiasSummary: "Test summary",
            TrustedSources: ["https://example.com"],
            EducationalContent: "Test content"
        };

        visualizer.displayResults(mockAnalysis);
        const results = document.getElementById('analysis-results');
        
        expect(results.innerHTML).toContain("Test Analysis");
        expect(results.innerHTML).toContain("Test sentence");
        expect(results.innerHTML).toContain("Test Bias");
    });

    test('calculates bias score correctly', () => {
        const visualizer = new BiasVisualizer();
        const instances = [
            { Severity: "3" },
            { Severity: "4" }
        ];
        const score = visualizer.calculateOverallScore(instances);
        expect(score).toBe("7"); // 10 - (3.5 * 2)
    });
});

describe('ResultsDashboard Component', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="dashboard-container"></div>
        `;
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    totalAnalyses: 10,
                    biasDetectionRate: 0.75,
                    commonBiasTypes: [],
                    averageSeverity: 2.5,
                    mitigationSuccessRate: 0.8
                })
            })
        );
    });

    test('loads metrics successfully', async () => {
        const dashboard = new ResultsDashboard();
        await dashboard.init();
        
        expect(dashboard.metrics.totalAnalyses).toBe(10);
        expect(dashboard.metrics.biasDetectionRate).toBe(0.75);
    });

    test('updates metrics with new analysis', async () => {
        const dashboard = new ResultsDashboard();
        await dashboard.init();
        
        const mockAnalysis = {
            BiasDetected: "yes",
            BiasInstances: [
                { Severity: "3", BiasType: "Test Bias" }
            ]
        };

        dashboard.updateMetrics(mockAnalysis);
        expect(dashboard.metrics.totalAnalyses).toBe(11);
    });
});

// Integration Tests
describe('Component Integration', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <nav><ul></ul></nav>
            <textarea id="analysis-input"></textarea>
            <div id="analysis-results"></div>
            <div id="dashboard-container"></div>
        `;
    });

    test('full analysis flow works correctly', async () => {
        // Initialize all components
        const themeToggle = new ThemeToggle();
        const analyzer = new RealTimeAnalyzer();
        const dashboard = new ResultsDashboard();
        
        await dashboard.init();
        analyzer.init();

        // Simulate user input
        const input = document.getElementById('analysis-input');
        input.value = "Test content for analysis";
        input.dispatchEvent(new Event('input'));

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 600));

        // Verify components interaction
        expect(analyzer.isProcessing).toBe(true);
        expect(document.getElementById('analysis-results')).not.toBeNull();
    });
});
