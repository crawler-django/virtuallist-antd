// import '@testing-library/jest-dom';
import * as React from 'react';
import {
  render, screen, act, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import TabsDemo from '../docs/examples/TabsDemo';
import SinglePageLoading from '../docs/examples/SinglePageLoading';

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

  test('TabsDemo render normally', () => {
    render(<TabsDemo />);

    // expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('aaa0 index index index index')).toBeInTheDocument();

    // fireEvent.click(screen.getByText('Tab 2'));
  });

  test('scrollTo run normally', async () => {
    render(<SinglePageLoading />);

    expect(screen.getAllByText('aaa0 富士山下的你好美 你知道吗').length).toEqual(2);

    fireEvent.click(screen.getByText('跳到1000'));
    fireEvent.click(screen.getByText('跳到500'));
    // screen.debug();
  });
});
