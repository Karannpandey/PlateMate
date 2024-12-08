// client/src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app without crashing', () => {
  render(<App />);
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument(); // Adjust text match to something in your App.js
});
