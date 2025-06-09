import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });
});
