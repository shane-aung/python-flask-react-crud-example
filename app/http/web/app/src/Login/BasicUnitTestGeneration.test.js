import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { withOktaAuth } from '@okta/okta-react';
import Login from './Login';

jest.mock('@okta/okta-react', () => ({
  withOktaAuth: (Component) => (props) => <Component {...props} />,
}));

describe('Login Component', () => {
  const mockSignInWithRedirect = jest.fn();
  const mockAuthState = {
    isAuthenticated: false,
  };

  const renderComponent = (authState = mockAuthState) => {
    return render(
      <MemoryRouter>
        <Login authState={authState} oktaAuth={{ signInWithRedirect: mockSignInWithRedirect }} />
      </MemoryRouter>
    );
  };

  it('should render login button when user is not authenticated', () => {
    renderComponent();
    const loginButton = screen.getByText('Login with Okta');
    expect(loginButton).toBeInTheDocument();
  });

  it('should redirect to /home when user is authenticated', () => {
    const authenticatedAuthState = {
      isAuthenticated: true,
    };
    renderComponent(authenticatedAuthState);
    expect(screen.queryByText('Login with Okta')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/home');
  });

  it('should call signInWithRedirect when login button is clicked', async () => {
    renderComponent();
    const loginButton = screen.getByText('Login with Okta');
    fireEvent.click(loginButton);
    expect(mockSignInWithRedirect).toHaveBeenCalled();
  });
});
