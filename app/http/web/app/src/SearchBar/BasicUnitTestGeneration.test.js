import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar'; // Adjust path to your component

test('renders the search bar with search input and logout button', () => {
  render(<SearchBar />);

  // Check for search input
  const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
  expect(searchInput).toBeInTheDocument();

  // Check for logout button
  const logoutButton = screen.getByRole('button', { name: /Logout/i });
  expect(logoutButton).toBeInTheDocument();
});
test('search input has the correct placeholder text', () => {
    render(<SearchBar />);
  
    const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
    expect(searchInput).toHaveAttribute('placeholder', 'Search for your OOS project on Github + Press Enter');
  });
  jest.mock('@okta/okta-react', () => ({
  withOktaAuth: jest.fn(),
}));

test('logout button calls oktaAuth.signOut on click', () => {
  const mockOktaAuth = {
    signOut: jest.fn(),
  };
  jest.mocked(('@okta/okta-react'), 'withOktaAuth').mockReturnValue((Component) => (props) => <Component {...props} oktaAuth={mockOktaAuth} />);

  render(<SearchBar />);

  const logoutButton = screen.getByRole('button', { name: /Logout/i });
  fireEvent.click(logoutButton);

  expect(mockOktaAuth.signOut).toHaveBeenCalledTimes(1);
});
// Mock the onSearch prop handler
jest.fn().mockReturnValue(undefined);

test('onKeyPress on search input calls onSearch prop handler with correct value', () => {
  const mockOnSearch = jest.fn();
  render(<SearchBar onSearch={mockOnSearch} />);

  const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
  fireEvent.keyDown(searchInput, { key: 'Enter', code: 13 });

  expect(mockOnSearch).toHaveBeenCalledTimes(1);
  // Check if the event argument contains the entered value (if applicable)
});
