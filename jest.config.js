module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  // Using jsdom for browser-like environment
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
  ],
  // Mock browser globals
  setupFiles: ['./__tests__/setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
}; 