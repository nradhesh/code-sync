import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express, { Request, Response } from 'express';

const app = express();

// Example route for testing
app.get('/test', (req: Request, res: Response) => {
    res.json({ message: 'Hello Test' });
});

describe('Example API Test', () => {
    it('should return hello test message', async () => {
        const response = await request(app).get('/test');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Hello Test' });
    });
}); 