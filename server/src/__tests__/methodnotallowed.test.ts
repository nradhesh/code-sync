import request from 'supertest';
import { app } from '../server';

describe('Method Not Allowed', () => {
  it('POST /health should return 404 or 405', async () => {
    const response = await request(app).post('/health');
    // Accept either 404 (not found) or 405 (method not allowed)
    expect([404, 405]).toContain(response.status);
  });
}); 