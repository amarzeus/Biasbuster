// Mock browser APIs and globals
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

global.WebSocket = jest.fn().mockImplementation(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    send: jest.fn(),
    close: jest.fn()
}));

// Mock Chart.js
global.Chart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
    })
);

// Mock DOM APIs
document.documentElement.setAttribute = jest.fn();
document.documentElement.classList = {
    add: jest.fn(),
    remove: jest.fn()
};

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Helper functions for testing
global.setupTestDOM = () => {
    document.body.innerHTML = `
        <nav>
            <ul></ul>
        </nav>
        <textarea id="analysis-input"></textarea>
        <div id="analysis-results"></div>
        <div id="dashboard-container"></div>
    `;
};

global.createMockAnalysis = () => ({
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
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn();

// Mock console methods but keep error logging for debugging
const originalConsoleError = console.error;
console.log = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = (...args) => {
    originalConsoleError(...args);
    // Also store for test assertions
    console.error.mock.calls.push(args);
};

// Clean up between tests
afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.body.innerHTML = '';
});
