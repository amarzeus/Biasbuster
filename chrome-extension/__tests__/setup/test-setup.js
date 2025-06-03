// Jest setup file for Chrome Extension testing

// Mock DOM environment
require('@testing-library/jest-dom');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.Event = dom.window.Event;

// Mock Chrome Extension API
global.chrome = {
    storage: {
        local: {
            get: jest.fn(() => Promise.resolve({})),
            set: jest.fn(() => Promise.resolve()),
            remove: jest.fn(() => Promise.resolve())
        },
        sync: {
            get: jest.fn(() => Promise.resolve({})),
            set: jest.fn(() => Promise.resolve())
        }
    },
    runtime: {
        getURL: jest.fn(path => `chrome-extension://mock-id/${path}`),
        sendMessage: jest.fn(() => Promise.resolve()),
        onMessage: {
            addListener: jest.fn(),
            removeListener: jest.fn()
        },
        openOptionsPage: jest.fn(),
        getManifest: jest.fn(() => ({
            version: '1.0.0'
        }))
    },
    tabs: {
        query: jest.fn(() => Promise.resolve([])),
        create: jest.fn(() => Promise.resolve()),
        sendMessage: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        onUpdated: {
            addListener: jest.fn(),
            removeListener: jest.fn()
        }
    },
    contextMenus: {
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeAll: jest.fn(),
        onClicked: {
            addListener: jest.fn(),
            removeListener: jest.fn()
        }
    },
    commands: {
        onCommand: {
            addListener: jest.fn(),
            removeListener: jest.fn()
        }
    },
    notifications: {
        create: jest.fn(),
        clear: jest.fn(),
        onClicked: {
            addListener: jest.fn(),
            removeListener: jest.fn()
        }
    },
    action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn(),
        setTitle: jest.fn(),
        openPopup: jest.fn()
    },
    alarms: {
        create: jest.fn(),
        clear: jest.fn(),
        onAlarm: {
            addListener: jest.fn(),
            removeListener: jest.fn()
        }
    }
};

// Mock fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob())
    })
);

// Mock Chart.js
global.Chart = class {
    constructor() {
        return {
            update: jest.fn(),
            destroy: jest.fn(),
            data: { datasets: [] }
        };
    }
};

// Utility functions for testing
global.TestUtils = {
    // Simulate user text selection
    simulateTextSelection: (text) => {
        const range = document.createRange();
        const selection = window.getSelection();
        const textNode = document.createTextNode(text);
        document.body.appendChild(textNode);
        range.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        return selection;
    },

    // Simulate context menu click
    simulateContextMenuClick: async (info, tab) => {
        const listeners = chrome.contextMenus.onClicked.addListener.mock.calls;
        for (const [listener] of listeners) {
            await listener(info, tab);
        }
    },

    // Simulate keyboard shortcut
    simulateKeyboardShortcut: async (command) => {
        const listeners = chrome.commands.onCommand.addListener.mock.calls;
        for (const [listener] of listeners) {
            await listener(command);
        }
    },

    // Wait for promises to resolve
    flushPromises: () => new Promise(resolve => setImmediate(resolve)),

    // Clear all mocks
    clearMocks: () => {
        jest.clearAllMocks();
        fetch.mockClear();
    },

    // Mock storage data
    mockStorageData: (data) => {
        chrome.storage.local.get.mockImplementation((key) => {
            if (typeof key === 'string') {
                return Promise.resolve({ [key]: data[key] });
            }
            return Promise.resolve(data);
        });
    }
};

// Console error/warning suppression for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
});

afterAll(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
});

// Clean up after each test
afterEach(() => {
    TestUtils.clearMocks();
    document.body.innerHTML = '';
});
