import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Security } from '@okta/okta-react';

import Main from './Main'; // Import the component to be tested

jest.mock('@okta/okta-react', () => ({
  Security: jest.fn(),
}));

describe('Main component', () => {
  it('renders Login component when not authenticated', () => {
    // Mock the Security component to simulate not authenticated state
    Security.mockImplementation(({ children }) => children);

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByRole('login-form')).toBeInTheDocument(); // Assuming Login component has a login form
  });

  it('renders Home component when authenticated', () => {
    // Mock the Security component to simulate authenticated state
    Security.mockImplementation(({ children }) => children[1]); // Assuming Home is the second child

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument(); // Assuming Home component has 'Home' text
  });

  // Add more tests for different scenarios, such as:
  // - Testing the LoginCallback component rendering
  // - Testing route changes and component updates
  // - Testing interactions with Okta authentication (if possible without mocking)
});
