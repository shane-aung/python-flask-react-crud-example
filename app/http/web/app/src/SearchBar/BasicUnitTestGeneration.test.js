import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { withOktaAuth } from '@okta/okta-react';
import SearchBar from './SearchBar'; // Adjust the import path as needed
import { createMock } from 'jest-mock-extended';

// Mock the Okta authentication
const mockOktaAuth = createMock<{
  signOut: jest.Mock<Promise<void>>;
}>();

const setup = (props = {}) => {
  const utils = render(<SearchBar oktaAuth={mockOktaAuth} {...props} />);
  const input = screen.getByPlaceholderText('Search for your OOS project on Github + Press Enter');
  const logoutButton = screen.getByText('Logout');
  return {
    ...utils,
    input,
    logoutButton
  };
};

test('renders SearchBar component', () => {
  setup();
  expect(screen.getByPlaceholderText('Search for your OOS project on Github + Press Enter')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();
});

test('calls onSearch when a key is pressed', () => {
  const onSearch = jest.fn();
  const { input } = setup({ onSearch });
  fireEvent.keyPress(input, { key: 'Enter', code: 13 });
  expect(onSearch).toHaveBeenCalled();
});

test('calls logout when Logout button is clicked', async () => {
  const { logoutButton } = setup();
  await fireEvent.click(logoutButton);
  expect(mockOktaAuth.signOut).toHaveBeenCalled();
});

// Optional: Snapshot test
import renderer from 'react-test-renderer';
test('matches snapshot', () => {
  const tree = renderer.create(<SearchBar oktaAuth={mockOktaAuth} />).toJSON();
  expect(tree).toMatchSnapshot();
});
