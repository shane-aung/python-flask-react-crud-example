import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMock } from 'jest-mock-extended';
import { withStyles } from '@material-ui/core/styles';
import SearchBar from './SearchBar'; // Adjust the import path as needed

// Mock the Okta authentication
const mockOktaAuth = createMock<{
  signOut: jest.Mock<Promise<void>>;
}>();

// Mock styles
const mockClasses = {
  root: 'root',
  MuiAppBar: 'MuiAppBar',
  grow: 'grow',
  title: 'title',
  search: 'search',
  searchIcon: 'searchIcon',
  inputRoot: 'inputRoot',
  inputInput: 'inputInput',
  toolbar: 'toolbar'
};

const setup = (props = {}) => {
  const utils = render(<SearchBar classes={mockClasses} oktaAuth={mockOktaAuth} {...props} />);
  const input = screen.getByPlaceholderText('Search for your OOS project on Github + Press Enter');
  const logoutButton = screen.getByText('Logout');
  return {
    ...utils,
    input,
    logoutButton
  };
};

test('renders SearchBar component with correct elements', () => {
  setup();
  expect(screen.getByPlaceholderText('Search for your OOS project on Github + Press Enter')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Search/i })).toBeInTheDocument();
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

test('renders with correct styles applied', () => {
  setup();
  const searchDiv = screen.getByText(/Search for your OOS project on Github + Press Enter/i).parentElement;
  expect(searchDiv).toHaveClass(mockClasses.search);
  const logoutButton = screen.getByText('Logout');
  expect(logoutButton).toHaveClass(mockClasses.grow);
});

test('handles missing onSearch prop gracefully', () => {
  const { input } = setup({});
  expect(() => fireEvent.keyPress(input, { key: 'Enter', code: 13 })).not.toThrow();
});

test('matches snapshot', () => {
  const { asFragment } = setup();
  expect(asFragment()).toMatchSnapshot();
});
