import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Security } from '@okta/okta-react';

import Main from './Main'; // Import the component to be tested

jest.mock('@okta/okta-react', () => ({
  Security: jest.fn(),
}));

it('renders Login component when not authenticated', () => {
    Security.mockImplementation(({ children }) => children);
  
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
  
    expect(screen.getByRole('login-form')).toBeInTheDocument();
  });
  
  it('renders Home component when authenticated', () => {
    Security.mockImplementation(({ children }) => children[1]); // Assuming Home is the second child
  
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
  
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  
  it('renders loading indicator when pending authentication', () => {
    // Simulate pending authentication state
    Security.mockImplementation(({ children }) => children[2]); // Assuming loading indicator is the third child
  
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
  
    expect(screen.getByRole('loading')).toBeInTheDocument(); // Assuming loading indicator has role 'loading'
  });
  
  it('handles authentication errors', () => {
    // Simulate authentication error
    Security.mockImplementation(() => {
      throw new Error('Authentication failed');
    });
  
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
  
    // Expect error handling or fallback UI
    expect(screen.getByText('Authentication failed')).toBeInTheDocument(); // Or other error handling mechanism
  });

  it('navigates to Home component when clicking a link', () => {
    // Simulate authenticated state
    Security.mockImplementation(({ children }) => children[1]);
  
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
  
    const homeLink = screen.getByRole('link', { name: 'Home' }); // Assuming a link to Home exists
    userEvent.click(homeLink);
  
    // Verify navigation to Home component
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  
  it('renders error boundary when child component throws an error', () => {
    // Simulate child component error
    const ErrorComponent = () => {
      throw new Error('Child component error');
    };
  
    // Mock Security to render ErrorComponent
    Security.mockImplementation(({ children }) => <ErrorComponent />);
  
    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );
  
    // Expect error boundary to render
    expect(screen.getByText('An error occurred')).toBeInTheDocument(); // Assuming an error boundary is implemented
  });
  