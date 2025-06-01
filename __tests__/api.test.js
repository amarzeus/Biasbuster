const request = require('supertest');
const mongoose = require('mongoose');

// Import the app after environment setup
let app;

beforeAll(async () => {
  // Import app after environment variables are set
  app = require('../src/index').app;
});

afterAll(async () => {
  // Close any remaining connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('API Endpoints', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'testpassword123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
    });

    test('should not register user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'testpassword123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'testpassword123',
          name: 'Login User'
        });
    });

    test('should login with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/analysis/analyze', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get auth token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'analyzer@example.com',
          password: 'testpassword123',
          name: 'Analyzer User'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'analyzer@example.com',
          password: 'testpassword123'
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

      const response = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(200);

      expect(response.body).toHaveProperty('MainTopic');
      expect(response.body).toHaveProperty('BiasDetected');
      expect(response.body).toHaveProperty('BiasInstances');
      expect(response.body).toHaveProperty('BiasSummary');
    });

    test('should require authentication', async () => {
      const analysisData = {
        text: 'This is a test article.'
      };

      const response = await request(app)
        .post('/api/analysis/analyze')
        .send(analysisData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate input text', async () => {
      const analysisData = {
        text: ''
      };

      const response = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/analysis/batch', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get auth token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'batch@example.com',
          password: 'testpassword123',
          name: 'Batch User'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'batch@example.com',
          password: 'testpassword123'
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

      const response = await request(app)
        .post('/api/analysis/batch')
        .set('Authorization', `Bearer ${authToken}`)
        .send(batchData)
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results).toHaveLength(2);
    });
  });

  describe('GET /api/perspectives/:topic', () => {
    test('should return alternative perspectives', async () => {
      const topic = 'climate change';

      const response = await request(app)
        .get(`/api/perspectives/${encodeURIComponent(topic)}`)
        .expect(200);

      expect(response.body).toHaveProperty('perspectives');
      expect(Array.isArray(response.body.perspectives)).toBe(true);
    });
  });

  describe('POST /api/feedback', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get auth token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'feedback@example.com',
          password: 'testpassword123',
          name: 'Feedback User'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'feedback@example.com',
          password: 'testpassword123'
        });

      authToken = loginResponse.body.token;
    });

    test('should submit feedback', async () => {
      const feedbackData = {
        analysisId: 'test-analysis-id',
        rating: 4,
        comment: 'Good analysis, very helpful!'
      };

      const response = await request(app)
        .post('/api/feedback')
        .set('Authorization', `Bearer ${authToken}`)
        .send(feedbackData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Feedback submitted successfully');
    });
  });
});
