# Test Suite Documentation

This directory contains comprehensive tests for the BiasBuster application, covering unit tests, integration tests, end-to-end tests, performance tests, and security tests.

## Test Structure

### 1. Unit Tests (`script.test.js`)
Tests individual JavaScript functions and modules in isolation.

**Coverage:**
- DOM manipulation functions
- Event handlers
- Utility functions
- Data processing logic
- Error handling

**Key Test Cases:**
- Text analysis functionality
- UI component behavior
- Form validation
- Local storage operations
- API response handling

### 2. Integration Tests (`api.test.js`)
Tests the interaction between different components and API endpoints.

**Coverage:**
- Authentication endpoints (`/api/auth/register`, `/api/auth/login`)
- Analysis endpoints (`/api/analysis/analyze`, `/api/analysis/batch`)
- Perspectives endpoint (`/api/perspectives/:topic`)
- Feedback endpoint (`/api/feedback`)
- Health check endpoint (`/health`)

**Key Test Cases:**
- User registration and login flow
- Bias analysis with authentication
- Batch text analysis
- Alternative perspectives fetching
- Feedback submission

### 3. End-to-End Tests (`web-platform.test.js`)
Tests complete user workflows using Puppeteer to simulate real browser interactions.

**Coverage:**
- Full user registration and login process
- Complete bias analysis workflow
- UI interactions and navigation
- Form submissions and validations
- Error handling and user feedback

**Key Test Cases:**
- User can register and login successfully
- User can analyze text for bias
- Results are displayed correctly
- Navigation works properly
- Error messages are shown appropriately

### 4. Performance Tests (`performance.test.js`)
Tests application performance under various load conditions using Autocannon.

**Coverage:**
- API endpoint response times
- Concurrent user simulation
- Memory usage monitoring
- Rate limiting verification
- Static file serving performance

**Key Metrics:**
- Requests per second
- Average response time
- Memory consumption
- Error rates
- Timeout handling

### 5. Security Tests (`security.test.js`)
Tests security measures and vulnerability protections.

**Coverage:**
- Authentication and authorization
- Input validation and sanitization
- XSS and SQL injection prevention
- Password security requirements
- CORS configuration
- Security headers

**Key Test Cases:**
- Unauthorized access prevention
- Token validation and expiration
- Malicious input rejection
- Weak password detection
- Email format validation
- Security header presence

## Test Configuration

### Jest Configuration (`jest.config.js`)
- **Environment:** jsdom for browser simulation
- **Setup:** Automated test environment setup
- **Coverage:** Comprehensive code coverage reporting
- **Timeout:** 30 seconds for async operations
- **Mocking:** Automatic mocking of external dependencies

### Test Setup (`setup.js`)
- **Database:** MongoDB Memory Server for isolated testing
- **Environment Variables:** Test-specific configuration
- **Mocks:** DOM API, fetch, localStorage, and service mocks
- **Cleanup:** Automatic cleanup between tests

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
# Unit tests
npm run test:unit

# API integration tests
npm run test:api

# End-to-end tests
npm run test:e2e

# Performance tests
npm run test:performance

# Security tests
npm run test:security
```

### Test Options
```bash
# Watch mode for development
npm test -- --watch

# Coverage report
npm test -- --coverage

# Verbose output
npm test -- --verbose

# Run specific test file
npm test -- script.test.js
```

## Test Data and Mocks

### Mock Services
- **AI Service:** Mocked to return consistent bias analysis results
- **Perspectives Service:** Mocked to return sample alternative perspectives
- **Database:** In-memory MongoDB for isolated testing
- **Authentication:** JWT tokens with test secrets

### Test Data
- **Sample Text:** Various text samples for bias analysis testing
- **User Data:** Test user accounts with different roles and permissions
- **Analysis Results:** Predefined analysis results for consistent testing

## Coverage Requirements

### Minimum Coverage Targets
- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

### Coverage Reports
- **Text:** Console output during test runs
- **LCOV:** Detailed HTML reports in `coverage/` directory
- **Clover:** XML format for CI/CD integration

## Continuous Integration

### GitHub Actions Integration
Tests are automatically run on:
- Pull requests to main branch
- Pushes to main branch
- Scheduled daily runs

### Test Pipeline
1. **Setup:** Install dependencies and configure environment
2. **Unit Tests:** Run isolated component tests
3. **Integration Tests:** Test API endpoints and database interactions
4. **Security Tests:** Verify security measures
5. **Performance Tests:** Check performance benchmarks
6. **E2E Tests:** Simulate complete user workflows
7. **Coverage:** Generate and upload coverage reports

## Best Practices

### Writing Tests
1. **Descriptive Names:** Use clear, descriptive test names
2. **Arrange-Act-Assert:** Follow the AAA pattern
3. **Isolation:** Each test should be independent
4. **Cleanup:** Always clean up after tests
5. **Mocking:** Mock external dependencies appropriately

### Test Maintenance
1. **Regular Updates:** Keep tests updated with code changes
2. **Performance Monitoring:** Monitor test execution times
3. **Coverage Analysis:** Regularly review coverage reports
4. **Flaky Test Detection:** Identify and fix unreliable tests
5. **Documentation:** Keep test documentation current

## Troubleshooting

### Common Issues
1. **Timeout Errors:** Increase timeout for slow operations
2. **Memory Leaks:** Ensure proper cleanup in afterEach hooks
3. **Database Conflicts:** Use unique test data for each test
4. **Mock Issues:** Verify mock implementations match real services
5. **Environment Variables:** Ensure test environment is properly configured

### Debug Mode
```bash
# Run tests with debug output
npm test -- --verbose --no-cache

# Run single test with debugging
npm test -- --testNamePattern="specific test name"
```

## Dependencies

### Core Testing Libraries
- **Jest:** Test framework and assertion library
- **Supertest:** HTTP assertion library for API testing
- **Puppeteer:** Browser automation for E2E testing
- **Autocannon:** HTTP benchmarking tool for performance testing
- **MongoDB Memory Server:** In-memory database for testing

### Supporting Libraries
- **ts-jest:** TypeScript support for Jest
- **jest-environment-jsdom:** Browser environment simulation
- **identity-obj-proxy:** CSS module mocking
- **jest-watch-typeahead:** Enhanced watch mode

## Future Enhancements

### Planned Improvements
1. **Visual Regression Testing:** Screenshot comparison tests
2. **Accessibility Testing:** WCAG compliance verification
3. **Cross-browser Testing:** Multi-browser E2E testing
4. **Load Testing:** Extended performance testing scenarios
5. **Contract Testing:** API contract verification

### Monitoring Integration
1. **Test Metrics:** Integration with monitoring tools
2. **Performance Tracking:** Historical performance data
3. **Error Reporting:** Automated error notification
4. **Coverage Trends:** Coverage tracking over time
