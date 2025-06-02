import { describe, it, expect } from 'vitest';
import { formatDate } from '../formateDate';

describe('formatDate', () => {
    it('formats morning time correctly', () => {
        const timestamp = '2024-03-20T09:30:00';
        expect(formatDate(timestamp)).toBe('9:30 AM');
    });

    it('formats afternoon time correctly', () => {
        const timestamp = '2024-03-20T14:45:00';
        expect(formatDate(timestamp)).toBe('2:45 PM');
    });

    it('formats midnight correctly', () => {
        const timestamp = '2024-03-20T00:00:00';
        expect(formatDate(timestamp)).toBe('12:00 AM');
    });

    it('formats noon correctly', () => {
        const timestamp = '2024-03-20T12:00:00';
        expect(formatDate(timestamp)).toBe('12:00 PM');
    });

    it('pads minutes with leading zero', () => {
        const timestamp = '2024-03-20T09:05:00';
        expect(formatDate(timestamp)).toBe('9:05 AM');
    });
}); 