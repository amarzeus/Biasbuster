module.exports = {
    // The root directory that Jest should scan for tests and modules
    rootDir: '.',

    // The test environment that will be used for testing
    testEnvironment: 'jsdom',

    // The glob patterns Jest uses to detect test files
    testMatch: [
        '**/__tests__/**/*.test.js'
    ],

    // Setup files that will be run before each test
    setupFilesAfterEnv: [
        '<rootDir>/__tests__/setup/test-setup.js'
    ],

    // An array of regexp pattern strings that are matched against all test paths
    testPathIgnorePatterns: [
        '/node_modules/'
    ],

    // An array of regexp pattern strings that are matched against all source file paths
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/'
    ],

    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: [
        'json',
        'text',
        'lcov',
        'clover'
    ],

    // The paths to modules that run some code to configure or set up the testing environment
    setupFiles: [],

    // A map from regular expressions to module names that allow to stub out resources
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
    },

    // Indicates whether each individual test should be reported during the run
    verbose: true,

    // An array of regexp pattern strings that are matched against all source file paths before re-running tests
    watchPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ]
};
