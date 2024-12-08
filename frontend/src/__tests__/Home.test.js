import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../components/Home';

test('renders goal selection and form correctly', () => {
  const mockOnUserInitialization = jest.fn();

  render(<Home onUserInitialization={mockOnUserInitialization} />);

  // Check if goal buttons render
  const muscleBuildingButton = screen.getByText(/Muscle Building/i);
  const heartHealthyButton = screen.getByText(/Heart Healthy/i);
  expect(muscleBuildingButton).toBeInTheDocument();
  expect(heartHealthyButton).toBeInTheDocument();

  // Simulate selecting a goal
  fireEvent.click(muscleBuildingButton);

  // Check if the form renders
  const nameInput = screen.getByPlaceholderText(/Enter your name/i);
  const continueButton = screen.getByText(/Continue/i);
  expect(nameInput).toBeInTheDocument();
  expect(continueButton).toBeInTheDocument();

  // Simulate entering name and submitting form
  fireEvent.change(nameInput, { target: { value: 'John' } });
  fireEvent.click(continueButton);
  expect(mockOnUserInitialization).toHaveBeenCalledWith('John', 1);
});
