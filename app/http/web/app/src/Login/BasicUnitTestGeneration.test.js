import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login'; // Import the component
import { withOktaAuth } from '@okta/okta-react'; // Import for mocking

// Mock the withOktaAuth function
jest.mock('@okta/okta-react', () => ({
  withOktaAuth: jest.fn((Component) => Component),
}));

describe('Login', () => {
    const mockOktaAuth = {
      signInWithRedirect: jest.fn(),
    };
  
    it('renders the login button', () => {
      render(<Login oktaAuth={mockOktaAuth} authState={{ isAuthenticated: false }} />);
  
      const loginButton = screen.getByRole('button', { name: 'Login with Okta' });
      expect(loginButton).toBeInTheDocument();
    });
  
    it('calls signInWithRedirect on button click', async () => {
      render(<Login oktaAuth={mockOktaAuth} authState={{ isAuthenticated: false }} />);
  
      const loginButton = screen.getByRole('button', { name: 'Login with Okta' });
      await userEvent.click(loginButton);
  
      expect(mockOktaAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });
  
    it('redirects to /home when authenticated', () => {
      const { rerender } = render(<Login oktaAuth={mockOktaAuth} authState={{ isAuthenticated: true }} />);
  
      // Check for Redirect component (you might need to adjust based on your testing library)
      // ...
  
      // Or, you can test if the login button is not rendered:
      const loginButton = screen.queryByRole('button', { name: 'Login with Okta' });
      expect(loginButton).toBeNull();
    });
  });
  