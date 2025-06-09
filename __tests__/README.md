# Biasbuster Test Suite

This directory contains all test files for the Biasbuster project, organized according to the Product Requirements Document (PRD).

## Directory Structure

```
__tests__/
├── unit/              # Unit tests for individual components
├── integration/       # Integration tests for component interactions
├── e2e/              # End-to-end tests for complete workflows
├── performance/      # Performance and load tests
├── security/         # Security and vulnerability tests
├── accessibility/    # Accessibility compliance tests
└── utils/           # Test utilities and helpers
```

## Test Categories

1. **Unit Tests**
   - Component-level tests
   - Function-level tests
   - Utility function tests

2. **Integration Tests**
   - API endpoint tests
   - Service interaction tests
   - Database integration tests

3. **End-to-End Tests**
   - User workflow tests
   - Browser extension tests
   - Web platform tests

4. **Performance Tests**
   - Load testing
   - Stress testing
   - Response time testing

5. **Security Tests**
   - Authentication tests
   - Authorization tests
   - Vulnerability tests

6. **Accessibility Tests**
   - WCAG compliance tests
   - Screen reader compatibility
   - Keyboard navigation tests

## Test Requirements

1. All tests must be written in Jest
2. Follow the AAA pattern (Arrange, Act, Assert)
3. Include proper test descriptions
4. Use appropriate test fixtures and mocks
5. Maintain test isolation
6. Follow test naming conventions

## Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance
npm run test:security
npm run test:accessibility

# Run tests with coverage
npm run test:coverage
```

## Test Coverage Requirements

- Minimum 80% code coverage
- 100% coverage for critical paths
- Regular coverage reports
- Continuous integration checks

## Contributing to Tests

Please refer to `CONTRIBUTING.md` for guidelines on contributing to the test suite.
