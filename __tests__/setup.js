/**
 * Jest setup file to mock browser environment
 */

// Mock DOM API
const mockDOM = () => {
  // Mock document
  if (!global.document) {
    global.document = {
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(() => []),
      getElementById: jest.fn(() => ({
        addEventListener: jest.fn(),
        value: '',
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn()
        },
        style: {},
        innerHTML: ''
      })),
      createElement: jest.fn(() => ({
        appendChild: jest.fn(),
        classList: {
          add: jest.fn(),
          remove: jest.fn()
        },
        addEventListener: jest.fn(),
        style: {},
        innerHTML: ''
      })),
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        innerHTML: ''
      }
    };
  }

  // Mock window
  if (!global.window) {
    global.window = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      location: {
        href: 'http://localhost/'
      },
      localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
      }
    };
  }

  // Mock other browser globals
  global.fetch = jest.fn();
  global.localStorage = window.localStorage;
  global.navigator = {
    userAgent: 'node.js'
  };
};

// Initialize mocks
mockDOM(); 