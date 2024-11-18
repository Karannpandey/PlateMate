// client/src/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch globally to control API responses
global.fetch = jest.fn();

describe('Meal Planner App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.mockClear();
  });

  test('renders name input screen initially', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Meal Planner')).toBeInTheDocument();
  });

  test('prevents submission of name less than 2 characters', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(input, { target: { value: 'A' } });
    expect(submitButton).toBeDisabled();
  });

  test('allows user to enter name and proceed', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Choose Your Goal')).toBeInTheDocument();
  });

  test('renders goal selection buttons after name entry', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Muscle Building')).toBeInTheDocument();
    expect(screen.getByText('Heart Healthy')).toBeInTheDocument();
  });

  test('initializes user and fetches meal plan for muscle building goal', async () => {
    // Mock successful API responses
    fetch.mockImplementation((url) => {
      switch (url) {
        case 'http://localhost:5001/api/initialize':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
          });
        case 'http://localhost:5001/api/getMealPlan':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              breakfast: { recipe: 'Protein Pancakes', cluster: 1 },
              lunch: { recipe: 'Chicken Salad', cluster: 2 },
              dinner: { recipe: 'Salmon with Quinoa', cluster: 3 },
            }),
          });
        default:
          return Promise.resolve({ ok: false });
      }
    });

    render(<App />);
    const input = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    const muscleBuildingButton = await screen.findByText('Muscle Building');
    fireEvent.click(muscleBuildingButton);

    await waitFor(() => {
      expect(screen.getByText('Today\'s Meal Plan')).toBeInTheDocument();
      expect(screen.getByText('Protein Pancakes')).toBeInTheDocument();
    });
  });

  test('submits meal ratings successfully', async () => {
    // Mock API responses for initialization, meal plan, and ratings update
    fetch.mockImplementation((url, options) => {
      switch (url) {
        case 'http://localhost:5001/api/initialize':
        case 'http://localhost:5001/api/getMealPlan':
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              breakfast: { recipe: 'Protein Pancakes', cluster: 1 },
              lunch: { recipe: 'Chicken Salad', cluster: 2 },
              dinner: { recipe: 'Salmon with Quinoa', cluster: 3 },
            }),
          });
        case 'http://localhost:5001/api/updateRatings':
          const body = JSON.parse(options.body);
          expect(body.ratings.breakfast.rating).toBeGreaterThanOrEqual(0);
          expect(body.ratings.breakfast.rating).toBeLessThanOrEqual(5);
          return Promise.resolve({ ok: true });
        default:
          return Promise.resolve({ ok: false });
      }
    });

    render(<App />);
    const input = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    const muscleBuildingButton = await screen.findByText('Muscle Building');
    fireEvent.click(muscleBuildingButton);

    await waitFor(() => {
      const breakfastRating = screen.getByLabelText(/breakfast rating/i);
      const lunchRating = screen.getByLabelText(/lunch rating/i);
      const dinnerRating = screen.getByLabelText(/dinner rating/i);
      const submitRatingsButton = screen.getByRole('button', { name: /submit ratings/i });

      fireEvent.change(breakfastRating, { target: { value: '4.5' } });
      fireEvent.change(lunchRating, { target: { value: '3.7' } });
      fireEvent.change(dinnerRating, { target: { value: '4.2' } });

      fireEvent.click(submitRatingsButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Day 2')).toBeInTheDocument();
    });
  });
});