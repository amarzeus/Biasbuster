export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^../services/(.*)$': '<rootDir>/services/$1',
    '^@google/genai$': '<rootDir>/src/__mocks__/@google/genai.ts',
  },
  globals: {
    'import.meta': {
      env: {
        VITE_API_KEY: 'mock_key',
      },
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@google/genai).+\\.js$"
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
