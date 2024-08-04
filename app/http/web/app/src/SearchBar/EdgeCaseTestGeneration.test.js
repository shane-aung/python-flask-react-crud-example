import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMock } from 'jest-mock-extended';
import SearchBar from './SearchBar'; // Adjust the import path as needed

// Mock the Okta authentication
const mockOktaAuth = createMock<{
  signOut: jest.Mock<Promise<void>>;
}>();

const setup = (props = {}) => {
  const utils = render(<SearchBar classes={{}} oktaAuth={mockOktaAuth} {...props} />);
  const input = screen.getByPlaceholderText('Search for your OOS project on Github + Press Enter');
  const logoutButton = screen.getByText('Logout');
  return {
    ...utils,
    input,
    logoutButton
  };
};

test('handles empty input gracefully when onSearch is called', () => {
  const onSearch = jest.fn();
  const { input } = setup({ onSearch });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
  expect(onSearch).toHaveBeenCalledWith(expect.any(Object)); // Expect that onSearch is called with an event object
});

test('handles logout function failure', async () => {
  mockOktaAuth.signOut.mockRejectedValueOnce(new Error('Logout failed'));
  const { logoutButton } = setup();
  await expect(fireEvent.click(logoutButton)).resolves.not.toThrow();
  await waitFor(() => {
    expect(mockOktaAuth.signOut).toHaveBeenCalled();
  });
});

test('renders correctly with no props', () => {
  setup();
  expect(screen.getByPlaceholderText('Search for your OOS project on Github + Press Enter')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();
});

test('handles special characters in search input', () => {
  const onSearch = jest.fn();
  const { input } = setup({ onSearch });
  fireEvent.change(input, { target: { value: '@!#$%^&*()' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
  expect(onSearch).toHaveBeenCalledWith(expect.any(Object)); // Expect that onSearch is called with an event object
});

test('handles multiple key presses rapidly', () => {
  const onSearch = jest.fn();
  const { input } = setup({ onSearch });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
  expect(onSearch).toHaveBeenCalledTimes(2);
});

test('renders without crashing when classes are empty', () => {
  setup({ classes: {} });
  expect(screen.getByPlaceholderText('Search for your OOS project on Github + Press Enter')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();
});
