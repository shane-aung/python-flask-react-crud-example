import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';
import githubClient from '../githubClient';
import APIClient from '../apiClient';

jest.mock('../githubClient');
jest.mock('../apiClient');

// ... other test cases from previous response

test('componentDidMount calls getKudos with correct accessToken', () => {
  const mockAccessToken = 'test-token';
  const mockGetKudos = jest.fn();
  const mockAPIClient = jest.fn().mockReturnValue({ getKudos: mockGetKudos });
  APIClient.mockImplementation(mockAPIClient);

  render(<Home authState={{ accessToken: { accessToken: mockAccessToken } }} />);

  expect(mockAPIClient).toHaveBeenCalledWith(mockAccessToken);
  expect(mockGetKudos).toHaveBeenCalledTimes(1);
});

test('handleTabChange updates state correctly', () => {
  const { container } = render(<Home />);
  const tabs = container.querySelectorAll('button');

  userEvent.click(tabs[1]); // Click the second tab

  expect(screen.getByText('Search')).toBeInTheDocument();
});

// ... other test cases for component lifecycle and state management

test('handles error when API call fails', async () => {
  const mockError = new Error('API error');
  APIClient.mockImplementation(() => ({
    getKudos: () => Promise.reject(mockError),
  }));

  render(<Home />);

  // Add assertions for error handling behavior, e.g., displaying an error message
});

// ... other test cases for error handling and edge cases
