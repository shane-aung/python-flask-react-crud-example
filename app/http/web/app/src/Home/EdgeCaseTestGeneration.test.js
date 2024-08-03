import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';
import githubClient from '../githubClient';
import APIClient from '../apiClient';

jest.mock('../githubClient');
jest.mock('../apiClient');

// ... other test cases

test('handles empty search results', async () => {
  githubClient.mockResolvedValue({ items: [] });

  render(<Home />);

  const searchBar = screen.getByLabelText('Search');
  userEvent.type(searchBar, 'test');
  userEvent.keyboard('Enter');

  await waitFor(() => {
    expect(screen.queryByText('No repositories found')).toBeInTheDocument();
  });
});

test('handles invalid search input', () => {
  const mockOnSearch = jest.fn();
  render(<Home onSearch={mockOnSearch} />);

  const searchBar = screen.getByLabelText('Search');
  userEvent.type(searchBar, '123');
  userEvent.keyboard('Enter');

  expect(mockOnSearch).not.toHaveBeenCalled();
});

test('handles API error for getKudos', async () => {
  APIClient.mockImplementation(() => ({
    getKudos: () => Promise.reject(new Error('API error')),
  }));

  render(<Home />);

  // Add assertions for error handling behavior, e.g., displaying an error message
});

// ... other test cases for API errors, large number of repositories, and concurrent API calls

