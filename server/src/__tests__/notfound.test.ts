import request from 'supertest';
import { app } from '../server';

describe('Not Found Handler', () => {
  it('GET /unknown should return 404', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
  });
}); 