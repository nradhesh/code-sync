/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

describe('Example Component Test', () => {
    it('should render without crashing', () => {
        render(
            <BrowserRouter>
                <div data-testid="example">Hello Test</div>
            </BrowserRouter>
        );
        
        expect(screen.getByTestId('example')).toBeInTheDocument();
        expect(screen.getByText('Hello Test')).toBeVisible();
    });
});
