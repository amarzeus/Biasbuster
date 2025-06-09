/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  projects: [
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/__tests__/script.test.(ts|tsx|js|jsx)',
        '**/__tests__/web-platform.test.(ts|tsx|js|jsx)'
      ],
      setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json'
        }]
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
      }
    },
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: [
        '**/__tests__/api.test.(ts|tsx|js|jsx)',
        '**/__tests__/security.test.(ts|tsx|js|jsx)',
        '**/__tests__/performance.test.(ts|tsx|js|jsx)'
      ],
      setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json'
        }]
      },
      transformIgnorePatterns: [
        'node_modules/(?!(uuid)/)'
      ]
    },
    {
      displayName: 'chrome-extension',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/src/extensions/chrome/__tests__/**/*.test.(ts|tsx|js|jsx)'
      ],
      setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json'
        }]
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
      }
    }
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*',
    '!src/extensions/chrome/node_modules/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  verbose: true,
  testTimeout: 30000
};
