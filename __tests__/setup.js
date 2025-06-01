/**
 * Jest setup file to mock browser environment and database
 */

// Add TextEncoder/TextDecoder polyfill
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock MongoDB
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Setup MongoDB Memory Server
let mongod;

beforeAll(async () => {
  // Start MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  
  // Connect to in-memory database
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Cleanup
  await mongoose.connection.close();
  await mongod.stop();
});

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = '3000';
process.env.NODE_ENV = 'test';

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
      },
      showError: jest.fn(),
      showLoading: jest.fn()
    };
  }

  // Mock fetch API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('')
    })
  );

  // Mock other browser globals
  global.localStorage = window.localStorage;
  global.navigator = {
    userAgent: 'node.js'
  };
};

// Initialize mocks
mockDOM();

// Mock AI service responses
jest.mock('../src/services/aiService', () => ({
  callAI: jest.fn().mockResolvedValue({
    MainTopic: 'Test Topic',
    BiasDetected: 'yes',
    BiasInstances: [{
      Sentence: 'Test sentence',
      BiasType: 'Test bias',
      Explanation: 'Test explanation',
      Severity: '1',
      Justification: 'Test justification',
      Mitigation: 'Test mitigation'
    }],
    BiasSummary: 'Test summary',
    TrustedSources: ['https://example.com'],
    EducationalContent: 'Test educational content'
  })
}));

// Mock perspectives service
jest.mock('../src/services/perspectivesService', () => ({
  fetchMockPerspectives: jest.fn().mockResolvedValue([
    {
      title: 'Test Article',
      source: 'Test Source',
      url: 'https://example.com',
      summary: 'Test summary'
    }
  ])
}));
