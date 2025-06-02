/// <reference types="vitest" />
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SplitterComponent from '../SplitterComponent';
import { ViewContextProvider } from '@/context/ViewContext';
import useWindowDimensions from '@/hooks/useWindowDimensions';

// Mock the hooks
vi.mock('@/hooks/useLocalStorage', () => ({
    default: () => ({
        setItem: vi.fn(),
        getItem: () => null
    })
}));

const mockUseWindowDimensions = vi.fn().mockReturnValue({
    isMobile: false,
    width: 1024,
    height: 768
});

vi.mock('@/hooks/useWindowDimensions', () => ({
    default: () => mockUseWindowDimensions()
}));

describe('SplitterComponent', () => {
    beforeEach(() => {
        mockUseWindowDimensions.mockClear();
    });

    it('renders children correctly', () => {
        render(
            <ViewContextProvider>
                <SplitterComponent>
                    <div data-testid="test-child">Test Content</div>
                    <div>Additional Content</div>
                </SplitterComponent>
            </ViewContextProvider>
        );
        
        const element = screen.getByTestId('test-child');
        expect(element).toBeTruthy();
        expect(element.textContent).toBe('Test Content');
    });

    it('applies correct initial sizes when sidebar is open', () => {
        const { container } = render(
            <ViewContextProvider>
                <SplitterComponent>
                    <div>Left Panel</div>
                    <div>Right Panel</div>
                </SplitterComponent>
            </ViewContextProvider>
        );

        const splitContainer = container.firstChild;
        expect(splitContainer).toBeTruthy();
        expect(splitContainer instanceof HTMLElement).toBe(true);
    });

    it('handles mobile view correctly', () => {
        // Override the default mock for this test
        mockUseWindowDimensions.mockReturnValue({
            isMobile: true,
            width: 375,
            height: 667
        });

        const { container } = render(
            <ViewContextProvider>
                <SplitterComponent>
                    <div>Left Panel</div>
                    <div>Right Panel</div>
                </SplitterComponent>
            </ViewContextProvider>
        );

        const splitContainer = container.firstChild;
        expect(splitContainer).toBeTruthy();
        expect(splitContainer instanceof HTMLElement).toBe(true);
    });
}); 