import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// Add any global setup here if needed
beforeAll(() => {
    // Setup any global test environment configuration
});

afterAll(() => {
    // Cleanup any global test environment configuration
});

export default {
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testEnvironment: 'jsdom',
  };
  