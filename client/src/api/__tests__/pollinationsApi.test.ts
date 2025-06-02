import { describe, it, expect, vi, beforeEach } from 'vitest';
import pollinationsApi from '../pollinationsApi';
// import axios from 'axios';

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            defaults: {
                baseURL: 'https://text.pollinations.ai',
                headers: {
                    common: {
                        'Content-Type': 'application/json'
                    }
                }
            },
            post: vi.fn()
        }))
    }
}));

describe('Pollinations API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should be configured with the correct base URL', () => {
        expect(pollinationsApi.defaults.baseURL).toBe('https://text.pollinations.ai');
    });

    it('should be configured with the correct headers', () => {
        expect(pollinationsApi.defaults.headers.common['Content-Type']).toBe('application/json');
    });

    it('should make successful API calls', async () => {
        const mockResponse = { data: 'test response' };
        pollinationsApi.post = vi.fn().mockResolvedValue(mockResponse);

        const response = await pollinationsApi.post('/endpoint', { data: 'test' });
        expect(response).toEqual(mockResponse);
    });

    it('should handle API errors correctly', async () => {
        const mockError = new Error('API Error');
        pollinationsApi.post = vi.fn().mockRejectedValue(mockError);

        await expect(pollinationsApi.post('/endpoint', { data: 'test' }))
            .rejects
            .toThrow('API Error');
    });
}); 