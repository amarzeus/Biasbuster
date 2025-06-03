module.exports = {
    // The root directory for the test suite
    rootDir: '.',

    // Test environment setup
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/__tests__/setup/test-setup.js'
    ],

    // File patterns for tests
    testMatch: [
        '<rootDir>/__tests__/**/*.test.js',
        '<rootDir>/__tests__/**/*.spec.js'
    ],

    // Module file extensions
    moduleFileExtensions: ['js', 'json'],

    // Module name mapper for imports
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__tests__/setup/fileMock.js'
    },

    // Coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/scripts/**/*.js',
        '!<rootDir>/scripts/analytics/**/*.js', // Exclude analytics scripts for now
        '!<rootDir>/node_modules/**'
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov', 'clover'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },

    // Test timeout
    testTimeout: 10000,

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Transform configuration
    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    // Ignore patterns
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],

    // Global configuration
    globals: {
        chrome: true
    },

    // Reporter configuration
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'reports/junit',
                outputName: 'js-test-results.xml',
                classNameTemplate: '{classname}',
                titleTemplate: '{title}',
                ancestorSeparator: ' › ',
                usePathForSuiteName: true
            }
        ]
    ],

    // Snapshot configuration
    snapshotSerializers: [
        'jest-snapshot-serializer-raw'
    ],

    // Error handling
    errorOnDeprecated: true,

    // Maximum number of concurrent workers
    maxWorkers: '50%',

    // Display options
    bail: false,
    notify: true,
    notifyMode: 'failure-change',

    // Watch plugins
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],

    // Projects configuration for monorepo setup
    projects: [
        {
            displayName: 'chrome-extension',
            testMatch: [
                '<rootDir>/__tests__/**/*.test.js'
            ]
        }
    ],

    // Custom resolver
    resolver: undefined,

    // Rest timeouts
    testEnvironmentOptions: {
        url: 'http://localhost'
    },

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: [
        'scripts/**/*.js',
        '!**/node_modules/**',
        '!**/vendor/**'
    ],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'v8'
};
