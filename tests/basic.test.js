// import '@testing-library/jest-dom';
import * as React from 'react';
import {
  render, screen, act, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import TabsDemo from '../docs/examples/TabsDemo';

describe('Test', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('renders App component', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(<TabsDemo />, { container });

    expect(screen.getByText('No Data')).toBeInTheDocument();
    // screen.getByText('aaa0 index index index index').toBeInTheDocument();

    // fireEvent.click(screen.getByText('Tab 2'));
  });
});
