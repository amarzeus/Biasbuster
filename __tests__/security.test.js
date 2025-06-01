const supertest = require('supertest');
const http = require('http');
const mongoose = require('mongoose');
const { app } = require('../src/index'); // Assuming app is exported from src/index
const jwt = require('jsonwebtoken'); // For generating test tokens

let server;
let request;
let authToken;
const testUserEmailGlobal = `security-global-${Date.now()}@example.com`;
const testUserPasswordGlobal = 'testpassword123Secure!'; // Stronger password

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve)); // Wait for server to be ready
  request = supertest(server);
  // Register and login a user to get a valid token
  try {
    await request
      .post('/api/auth/register')
      .send({
        email: testUserEmailGlobal,
        password: testUserPasswordGlobal,
        name: 'Security Global Test User'
      });

    const loginResponse = await request
      .post('/api/auth/login')
      .send({
        email: testUserEmailGlobal,
        password: testUserPasswordGlobal
      });
    authToken = loginResponse.body.token;
    if (!authToken) {
      console.error("Failed to obtain authToken in beforeAll");
      // Optionally throw an error to fail the setup if token is crucial
      // throw new Error("Failed to obtain authToken in beforeAll for security tests");
    }
  } catch (error) {
    console.error("Error in beforeAll setup for security.test.js:", error.message);
    // Optionally throw an error
    // throw error;
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  await new Promise(resolve => server.close(resolve)); // Wait for server to close
});

describe('Security Tests', () => {
  describe('Authentication Security', () => {
    test('should reject requests without authentication token', async () => {
      const response = await request
        .post('/api/analysis/analyze') // Example protected route
        .send({ text: 'Some text' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });

    test('should reject requests with invalid token', async () => {
      const response = await request
        .post('/api/analysis/analyze')
        .set('Authorization', 'Bearer invalidtoken123')
        .send({ text: 'Some text' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, invalid token');
    });

    test('should reject expired tokens', async () => {
      const expiredToken = jwt.sign({ id: 'testuserid', email: testUserEmailGlobal }, process.env.JWT_SECRET || 'fallbackSecret', { expiresIn: '1ms' });
      await new Promise(resolve => setTimeout(resolve, 50)); 
      
      const response = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({ text: 'Some text' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, invalid token');
    });
  });

  describe('Input Validation', () => {
    // This beforeEach ensures authToken is set before each test in this describe block
    beforeEach(() => {
        if (!authToken) {
            // This is a safeguard. Ideally, beforeAll should have set it.
            // If it's critical and not set, you might want to fail tests early.
            throw new Error("Auth token not available for input validation tests. Check beforeAll hook.");
        }
    });

    test('should reject XSS attempts in text input', async () => {
      const maliciousText = '<script>alert("XSS")</script>';
      const response = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: maliciousText })
        .expect(400); 

      expect(response.body).toHaveProperty('error'); // Or 'message' based on your API's error response
    });

    test('should reject SQL injection attempts', async () => {
      const sqlInjection = "' OR '1'='1";
      const response = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: sqlInjection })
        .expect(400);

      expect(response.body).toHaveProperty('error'); 
    });

    test('should reject extremely long input if limits are set', async () => {
      const longText = 'a'.repeat(20000); 
      const response = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: longText })
        .expect(400); 

      expect(response.body).toHaveProperty('error'); 
    });

    test('should reject empty or null input for required fields', async () => {
      const response1 = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: '' }) 
        .expect(400);
      
      expect(response1.body).toHaveProperty('error');

      const response2 = await request
        .post('/api/analysis/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({}) // No text field
        .expect(400);
      expect(response2.body).toHaveProperty('error');
    });
  });

  describe('Password Security', () => {
    test('should reject weak passwords during registration', async () => {
      const weakPasswords = ['12345', 'password', 'qwerty', '123456']; // Added more examples
      for (const pass of weakPasswords) {
        const response = await request
          .post('/api/auth/register')
          .send({
            email: `weakpass-${Date.now()}-${Math.random()}@example.com`,
            password: pass,
            name: 'Weak Password User'
          })
          .expect(400);
        expect(response.body).toHaveProperty('error'); 
      }
    });

    test('should require minimum password length during registration', async () => {
      const response = await request
        .post('/api/auth/register')
        .send({
          email: `shortpass-${Date.now()}@example.com`,
          password: 'shrt', 
          name: 'Short Password User'
        })
        .expect(400);
      expect(response.body).toHaveProperty('error'); 
    });
  });

  describe('Email Validation', () => {
    test('should reject invalid email formats during registration', async () => {
      const invalidEmails = ['plainaddress', '#@%^%#$@#$@#.com', '@example.com', 'Joe Smith <email@example.com>', 'email.example.com', 'email@example@example.com', '.email@example.com', 'email.@example.com', 'email..email@example.com', 'email@example.com (Joe Smith)', 'email@example', 'email@111.222.333.44444', 'email@example..com', 'Abc..123@example.com'];
      for (const email of invalidEmails) {
        const response = await request
          .post('/api/auth/register')
          .send({
            email: email,
            password: testUserPasswordGlobal, 
            name: 'Test User'
          })
          .expect(400);
        expect(response.body).toHaveProperty('error'); 
      }
    });
  });

  describe('CORS Security', () => {
    test('should have proper CORS headers for OPTIONS request', async () => {
      const response = await request
        .options('/api/auth/register') 
        .expect(204); 

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-origin']).toBe('*'); 
      expect(response.headers).toHaveProperty('access-control-allow-methods');
      expect(response.headers).toHaveProperty('access-control-allow-headers');
    });
  });

  describe('Content Security Headers', () => {
    test('should include essential security headers', async () => {
      const response = await request
        .get('/health') 
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
      expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
      // Add more specific checks if your app sets other headers like CSP, HSTS
      // e.g. expect(response.headers).toHaveProperty('strict-transport-security');
      // e.g. expect(response.headers).toHaveProperty('content-security-policy');
    });
  });
});
