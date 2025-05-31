import request from 'supertest';
import app from '../src/index';

describe('API Endpoints', () => {
  let token = '';

  it('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/register should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('POST /api/auth/login should login user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('POST /api/analysis/analyze should analyze text for bias', async () => {
    const res = await request(app)
      .post('/api/analysis/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'This is a test text to analyze for bias.'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('BiasDetected');
  });

  it('POST /api/analysis/analyze-batch should analyze multiple texts', async () => {
    const res = await request(app)
      .post('/api/analysis/analyze-batch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        texts: [
          'First test text.',
          'Second test text.'
        ]
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results.length).toBe(2);
  });

  it('POST /api/feedback should accept feedback', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({
        analysisId: '12345',
        feedback: 'This is helpful.'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Feedback received');
  });

  it('should handle invalid routes with 404', async () => {
    const res = await request(app).get('/invalid-route');
    expect(res.statusCode).toEqual(404);
  });
});
