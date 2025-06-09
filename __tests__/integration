const supertest = require('supertest');
const http = require('http');
const mongoose = require('mongoose');
const { app } = require('../src/index');

let server;
let request;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve)); // Wait for server to be ready
  request = supertest(server);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  await new Promise(resolve => server.close(resolve)); // Wait for server to close
});

describe('API Endpoints', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'ok'); // Adjusted to 'ok'
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user', async () => {
      const userData = {
        email: `test-${Date.now()}@example.com`, // Unique email for each test run
        password: 'testpassword123',
        name: 'Test User'
      };

      const response = await request
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      // Assuming the response directly contains user and token
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('token');
    });

    test('should not register user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'testpassword123Valid', // Use a valid password format
        name: 'Test User'
      };

      const response = await request
        .post('/api/auth/register')
        .send(userData)
        .expect(400); // This should fail if validation is not working

      expect(response.body).toHaveProperty('error'); 
    });
  });

  describe('POST /api/auth/login', () => {
    const loginUserEmail = `login-${Date.now()}@example.com`;
    const loginUserPassword = 'testpassword123';

    beforeEach(async () => {
      // Register a user for login tests
      await request
        .post('/api/auth/register')
        .send({
          email: loginUserEmail,
          password: loginUserPassword,
          name: 'Login User'
        });
    });

    test('should login with valid credentials', async () => {
      const loginData = {
        email: loginUserEmail,
        password: loginUserPassword
      };

      const response = await request
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('should not login with invalid credentials', async () => {
      const loginData = {
        email: loginUserEmail,
        password: 'wrongpassword'
      };

      const response = await request
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials'); 
    });
  });

  describe('POST /api/analysis/analyze', () => {
    let authToken;
    const analyzerUserEmail = `analyzer-${Date.now()}@example.com`;
    const analyzerUserPassword = 'testpassword123';

    beforeEach(async () => {
      // Register and login to get auth token
      await request
        .post('/api/auth/register')
        .send({
          email: analyzerUserEmail,
          password: analyzerUserPassword,
          name: 'Analyzer User'
        });

      const loginResponse = await request
        .post('/api/auth/login')
        .send({
          email: analyzerUserEmail,
          password: analyzerUserPassword
        });

      authToken = loginResponse.body.token;
    });

    test('should analyze text for bias', async () => {
      const analysisData = {
        text: 'This is a test article that may contain some bias.',
        options: {
          includeSentiment: true,
          includeCredibility: true
        }
      };

      const response = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(200);

      // Adjusting based on the new understanding of the response structure
      expect(response.body).toHaveProperty('biasAnalysis');
      expect(response.body.biasAnalysis).toHaveProperty('MainTopic');
      expect(response.body.biasAnalysis).toHaveProperty('BiasDetected');
      expect(response.body.biasAnalysis).toHaveProperty('BiasInstances');
      expect(response.body.biasAnalysis).toHaveProperty('BiasSummary');
    });

    test('should require authentication', async () => {
      const analysisData = {
        text: 'This is a test article.'
      };

      const response = await request
        .post('/api/analysis/analyze')
        .send(analysisData)
        .expect(401);

      expect(response.body).toHaveProperty('message'); // Adjusted based on typical error structure
    });

    test('should validate input text', async () => {
      const analysisData = {
        text: '' // Empty text
      };

      const response = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(400); // Expect 400 for bad input, not 500

      expect(response.body).toHaveProperty('error'); 
    });
  });

  describe('POST /api/analysis/batch', () => {
    let authToken;
    const batchUserEmail = `batch-${Date.now()}@example.com`;
    const batchUserPassword = 'testpassword123';

    beforeEach(async () => {
      await request
        .post('/api/auth/register')
        .send({
          email: batchUserEmail,
          password: batchUserPassword,
          name: 'Batch User'
        });

      const loginResponse = await request
        .post('/api/auth/login')
        .send({
          email: batchUserEmail,
          password: batchUserPassword
        });
      authToken = loginResponse.body.token;
    });

    test('should analyze multiple texts', async () => {
      const batchData = {
        texts: [
          'First test article with potential bias.',
          'Second test article for analysis.'
        ]
      };

      const response = await request
        .post('/api/analysis/batch')
        .set('Authorization', `Bearer ${authToken}`)
        .send(batchData)
        .expect(200); // If 404, the route might be missing or misconfigured

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results).toHaveLength(2);
    });
  });

  describe('GET /api/perspectives/:topic', () => {
    test('should return alternative perspectives', async () => {
      const topic = 'climate change';

      const response = await request
        .get(`/api/perspectives/${encodeURIComponent(topic)}`)
        .expect(200); // If 404, route/controller issue

      // If the actual response is {}, this will fail.
      // The backend needs to return a 'perspectives' array.
      expect(response.body).toHaveProperty('perspectives');
      expect(Array.isArray(response.body.perspectives)).toBe(true); 
    });
  });

  describe('POST /api/feedback', () => {
    let authToken;
    const feedbackUserEmail = `feedback-${Date.now()}@example.com`;
    const feedbackUserPassword = 'testpassword123';
    
    beforeEach(async () => {
      await request
        .post('/api/auth/register')
        .send({
          email: feedbackUserEmail,
          password: feedbackUserPassword,
          name: 'Feedback User'
        });

      const loginResponse = await request
        .post('/api/auth/login')
        .send({
          email: feedbackUserEmail,
          password: feedbackUserPassword
        });
      authToken = loginResponse.body.token;
    });

    test('should submit feedback', async () => {
      const feedbackData = {
        analysisId: 'test-analysis-id', // This might need to be a valid ID from an actual analysis
        rating: 4,
        comment: 'Good analysis, very helpful!'
      };

      const response = await request
        .post('/api/feedback')
        .set('Authorization', `Bearer ${authToken}`)
        .send(feedbackData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Feedback submitted successfully');
    });
  });
});
