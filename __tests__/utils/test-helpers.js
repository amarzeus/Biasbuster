const jwt = require('jsonwebtoken');

/**
 * Generate a valid JWT token for testing
 * @param {string} userId - User ID to include in token
 * @param {Object} additionalClaims - Additional claims to include in token
 * @returns {string} JWT token
 */
const generateTestToken = (userId, additionalClaims = {}) => {
  return jwt.sign(
    { userId, ...additionalClaims },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

/**
 * Generate test user data
 * @param {Object} overrides - Override default user data
 * @returns {Object} Test user data
 */
const generateTestUser = (overrides = {}) => ({
  email: `test${Date.now()}@example.com`,
  password: 'TestPassword123!',
  name: 'Test User',
  ...overrides
});

/**
 * Generate sample text for bias analysis
 * @param {string} type - Type of bias to include ('gender', 'racial', 'age', etc.)
 * @returns {string} Sample text with specified bias
 */
const generateSampleText = (type = 'general') => {
  const samples = {
    gender: 'All firemen must be physically fit. A businessman should always wear a suit.',
    racial: 'That neighborhood is known for a specific ethnic group.',
    age: 'Young people are tech-savvy while older workers struggle with computers.',
    general: 'This is a neutral test article for bias analysis.'
  };
  return samples[type] || samples.general;
};

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified time
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Clear all test data from the database
 * @param {Object} mongoose - Mongoose instance
 * @returns {Promise} Promise that resolves when cleanup is complete
 */
const clearTestData = async (mongoose) => {
  if (!mongoose.connection.readyState) {
    throw new Error('Database connection not established');
  }
  
  const collections = await mongoose.connection.db.collections();
  
  return Promise.all(
    collections.map(collection => collection.deleteMany({}))
  );
};

/**
 * Create a test user and return auth token
 * @param {Object} app - Express app instance
 * @param {Object} userData - User data overrides
 * @returns {Promise<Object>} Object containing token and user data
 */
const createTestUserAndGetToken = async (app, userData = {}) => {
  const request = require('supertest');
  const testUser = generateTestUser(userData);
  
  await request(app)
    .post('/api/auth/register')
    .send(testUser);
    
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });
    
  return {
    token: loginResponse.body.token,
    user: testUser
  };
};

/**
 * Generate random test data
 * @param {string} type - Type of data to generate ('email', 'password', 'text')
 * @returns {string} Random test data
 */
const generateRandomTestData = (type) => {
  const timestamp = Date.now();
  switch (type) {
    case 'email':
      return `test${timestamp}@example.com`;
    case 'password':
      return `Test${timestamp}!`;
    case 'text':
      return `Test text ${timestamp}`;
    default:
      return `${type}_${timestamp}`;
  }
};

/**
 * Mock API response data
 * @param {string} type - Type of response to mock
 * @returns {Object} Mocked response data
 */
const mockApiResponse = (type) => {
  const responses = {
    analysis: {
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
      BiasSummary: 'Test summary'
    },
    perspectives: [{
      title: 'Test Perspective',
      source: 'Test Source',
      url: 'https://example.com',
      summary: 'Test perspective summary'
    }],
    error: {
      error: 'Test error message',
      status: 400
    }
  };
  return responses[type] || responses.error;
};

module.exports = {
  generateTestToken,
  generateTestUser,
  generateSampleText,
  wait,
  clearTestData,
  createTestUserAndGetToken,
  generateRandomTestData,
  mockApiResponse
};
