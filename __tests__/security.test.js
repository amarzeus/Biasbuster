const request = require('supertest');
const jwt = require('jsonwebtoken');

// Import the app after environment setup
let app;

beforeAll(async () => {
  // Import app after environment variables are set
  app = require('../src/index').app;
});

describe('Security Tests', () => {
  describe('Authentication Security', () => {
    test('should reject requests without authentication token', async () => {
      const response = await request(app)
        .post('/api/analysis/analyze')
        .send({ text: 'Test text' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject requests with invalid token', async () => {
      const response = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', 'Bearer invalid-token')
        .send({ text: 'Test text' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject expired tokens', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-user' },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ text: 'Test text' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Input Validation', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get auth token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'security@example.com',
          password: 'testpassword123',
          name: 'Security User'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'security@example.com',
          password: 'testpassword123'
        });

      authToken = loginResponse.body.token;
    });

    test('should reject XSS attempts in text input', async () => {
      const maliciousText = '<script>alert("xss")</script>';

      const response = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: maliciousText })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject SQL injection attempts', async () => {
      const sqlInjection = "'; DROP TABLE users; --";

      const response = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: sqlInjection })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject extremely long input', async () => {
      const longText = 'a'.repeat(100000); // 100KB of text

      const response = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: longText })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject empty or null input', async () => {
      const response1 = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: '' })
        .expect(400);

      const response2 = await request(app)
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: null })
        .expect(400);

      expect(response1.body).toHaveProperty('error');
      expect(response2.body).toHaveProperty('error');
    });
  });

  describe('Password Security', () => {
    test('should reject weak passwords', async () => {
      const weakPasswords = [
        '123',
        'password',
        'abc',
        '12345678',
        'qwerty'
      ];

      for (const password of weakPasswords) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: `weak${password}@example.com`,
            password: password,
            name: 'Weak Password User'
          })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      }
    });

    test('should require minimum password length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'short@example.com',
          password: '123',
          name: 'Short Password User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Email Validation', () => {
    test('should reject invalid email formats', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@example',
        'user name@example.com'
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: email,
            password: 'validpassword123',
            name: 'Test User'
          })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      }
    });
  });

  describe('CORS Security', () => {
    test('should have proper CORS headers', async () => {
      const response = await request(app)
        .options('/api/auth/register')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers).toHaveProperty('access-control-allow-methods');
      expect(response.headers).toHaveProperty('access-control-allow-headers');
    });
  });

  describe('Content Security', () => {
    test('should have security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for common security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });
});
