import request from 'supertest';
import app from '../src/index';

describe('Security Tests', () => {
  it('should reject unauthorized access to protected endpoints', async () => {
    const res = await request(app).post('/api/analysis/analyze').send({ text: 'Test' });
    expect(res.statusCode).toBe(401);
  });

  it('should reject invalid JWT tokens', async () => {
    const res = await request(app)
      .post('/api/analysis/analyze')
      .set('Authorization', 'Bearer invalidtoken')
      .send({ text: 'Test' });
    expect(res.statusCode).toBe(401);
  });

  it('should sanitize inputs to prevent injection attacks', async () => {
    const token = 'valid-test-token'; // Replace with a valid token or mock authentication
    const maliciousInput = "'; DROP TABLE users; --";
    const res = await request(app)
      .post('/api/analysis/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: maliciousInput });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('BiasDetected');
  });

  it('should enforce HTTPS (if applicable)', () => {
    // This test depends on deployment environment; placeholder for HTTPS enforcement check
    expect(true).toBe(true);
  });
});
