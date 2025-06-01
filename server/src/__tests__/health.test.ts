import request from 'supertest';
import { app } from '../server';
import { connectDB, disconnectDB } from '../config/db';

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await disconnectDB();
});

describe('Health Endpoint', () => {
    it('GET /health should return status ok', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
}); 