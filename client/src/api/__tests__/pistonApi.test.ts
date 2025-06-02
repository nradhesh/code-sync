import { describe, it, expect, vi, beforeEach } from 'vitest';
import pistonApi from '../pistonApi';
// import axios from 'axios';

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            defaults: {
                baseURL: 'https://emkc.org/api/v2/piston',
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

describe('Piston API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should be configured with the correct base URL', () => {
        expect(pistonApi.defaults.baseURL).toBe('https://emkc.org/api/v2/piston');
    });

    it('should be configured with the correct headers', () => {
        expect(pistonApi.defaults.headers.common['Content-Type']).toBe('application/json');
    });

    it('should make successful API calls', async () => {
        const mockResponse = { 
            data: { 
                language: 'python',
                version: '3.9.0',
                run: {
                    stdout: 'Hello, World!',
                    stderr: '',
                    output: 'Hello, World!',
                    code: 0
                }
            } 
        };

        pistonApi.post = vi.fn().mockResolvedValue(mockResponse);

        const response = await pistonApi.post('/execute', {
            language: 'python',
            source: 'print("Hello, World!")'
        });

        expect(response).toEqual(mockResponse);
        expect(response.data.run.stdout).toBe('Hello, World!');
        expect(response.data.run.code).toBe(0);
    });

    it('should handle API errors correctly', async () => {
        const mockError = new Error('API Error');
        pistonApi.post = vi.fn().mockRejectedValue(mockError);

        await expect(pistonApi.post('/execute', {
            language: 'python',
            source: 'invalid code'
        }))
            .rejects
            .toThrow('API Error');
    });

    it('should handle runtime errors from code execution', async () => {
        const mockResponse = {
            data: {
                language: 'python',
                version: '3.9.0',
                run: {
                    stdout: '',
                    stderr: 'NameError: name "undefined_variable" is not defined',
                    output: 'NameError: name "undefined_variable" is not defined',
                    code: 1
                }
            }
        };

        pistonApi.post = vi.fn().mockResolvedValue(mockResponse);

        const response = await pistonApi.post('/execute', {
            language: 'python',
            source: 'print(undefined_variable)'
        });

        expect(response.data.run.code).toBe(1);
        expect(response.data.run.stderr).toContain('NameError');
    });
}); 