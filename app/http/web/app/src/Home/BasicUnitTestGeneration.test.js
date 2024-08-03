// Home.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Home from './Home';

jest.mock('../apiClient');

test('renders search bar and Kudos tab initially', () => {
  const { getByText, getByLabelText } = render(<Home />);

  expect(getByText('Kudos')).toBeInTheDocument();
  expect(getByLabelText('Search')).toBeInTheDocument();
});

test('search bar triggers onSearch on Enter key press', () => {
  const mockOnSearch = jest.fn();
  const { getByLabelText } = render(<Home onSearch={mockOnSearch} />);

  const searchBar = getByLabelText('Search');
  fireEvent.change(searchBar, { target: { value: 'test-repo' } });
  fireEvent.keyDown(searchBar, { key: 'Enter', code: 13 });

  expect(mockOnSearch).toHaveBeenCalledTimes(1);
  expect(mockOnSearch).toHaveBeenCalledWith(expect.any(Object));
});

// Test cases for invalid search length and non-Enter key press can be added here.

test('renders search results on successful search', async () => {
    const mockRepos = [{ id: 1, name: 'test-repo' }];
    const mockGithubClient = jest.fn().mockResolvedValue({ items: mockRepos });
  
    const { getByText, getByLabelText, getByTestId } = render(<Home onSearch={mockGithubClient} />);
  
    const searchBar = getByLabelText('Search');
    fireEvent.change(searchBar, { target: { value: 'test-repo' } });
    fireEvent.keyDown(searchBar, { key: 'Enter', code: 13 });
  
    await new Promise(resolve => setTimeout(resolve, 0)); // wait for async operation
  
    expect(getByTestId('repo-1')).toBeInTheDocument(); // Test for specific repo element
  });
  

  // Mock APIClient methods
const mockGetKudos = jest.fn().mockResolvedValue([]);
const mockCreateKudo = jest.fn();
const mockDeleteKudo = jest.fn();

jest.mock('../apiClient', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getKudos: mockGetKudos,
    createKudo: mockCreateKudo,
    deleteKudo: mockDeleteKudo,
  })),
}));

test('renders Kudos on initial load and calls getKudos', async () => {
  const { getByText } = render(<Home />);

  expect(getByText('Kudos')).toBeInTheDocument();
  expect(mockGetKudos).toHaveBeenCalledTimes(1);
});

test('triggers kudo on GithubRepo click (create)', async () => {
  const mockRepo = { id: 1, name: 'test-repo' };

  const { getByText } = render(<Home />);

  await new Promise(resolve => setTimeout(resolve, 0)); // wait for initial render

  // Simulate click on a GithubRepo component
  // (implementation depends on how GithubRepo is rendered)
  // fireEvent.click(getByTestId('repo-click-target'));

  expect(mockCreateKudo).toHaveBeenCalledTimes(1);
  expect(mockCreateKudo).toHaveBeenCalledWith(mockRepo);
});

// Similar test can be written for deleteKudo functionality.

// Note: Mocking of `withOktaAuth` is not shown here, as it's likely related to authentication logic and doesn't directly affect component functionality.
