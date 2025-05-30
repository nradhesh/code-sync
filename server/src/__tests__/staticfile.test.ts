import request from 'supertest';
import { app } from '../server';

describe('Static File Not Found', () => {
  it('GET /static/nonexistent.js should return 404', async () => {
    const response = await request(app).get('/static/nonexistent.js');
    expect(response.status).toBe(404);
  });
}); 