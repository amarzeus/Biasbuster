/**
 * Jest setup file to configure test environment
 */

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Setup MongoDB Memory Server only for backend tests
if (process.env.JEST_WORKER_ID && process.env.JEST_WORKER_ID.includes('backend')) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoose = require('mongoose');

    let mongod;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        process.env.MONGODB_URI = uri;
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongod.stop();
    });
}

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = '3000';
process.env.NODE_ENV = 'test';

// Setup DOM mocking only for frontend tests
if (process.env.JEST_WORKER_ID && process.env.JEST_WORKER_ID.includes('frontend')) {
    const mockDOM = () => {
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

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
                text: () => Promise.resolve('')
            })
        );

        global.localStorage = window.localStorage;
        global.navigator = {
            userAgent: 'node.js'
        };
    };

    mockDOM();
}

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
