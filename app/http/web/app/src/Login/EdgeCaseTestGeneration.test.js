import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { withOktaAuth } from '@okta/okta-react';
import Login from './Login';

jest.mock('@okta/okta-react', () => ({
  withOktaAuth: (Component) => (props) => <Component {...props} />,
}));

describe('Login Component Edge Cases', () => {
  const mockSignInWithRedirect = jest.fn();
  const mockAuthState = {
    isAuthenticated: false,
  };

  const renderComponent = (authState = mockAuthState) => {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Route path="/login">
          <Login authState={authState} oktaAuth={{ signInWithRedirect: mockSignInWithRedirect }} />
        </Route>
        <Route path="/home" render={() => <div>Home Page</div>} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle undefined authState gracefully', () => {
    renderComponent(undefined);
    expect(screen.queryByText('Login with Okta')).not.toBeInTheDocument();
  });

  it('should handle partially defined authState object', () => {
    const partialAuthState = {
      isAuthenticated: undefined,
    };
    renderComponent(partialAuthState);
    const loginButton = screen.getByText('Login with Okta');
    expect(loginButton).toBeInTheDocument();
  });

  it('should handle signInWithRedirect failure gracefully', async () => {
    mockSignInWithRedirect.mockRejectedValueOnce(new Error('Sign-in failed'));
    renderComponent();
    const loginButton = screen.getByText('Login with Okta');
    fireEvent.click(loginButton);
    await waitFor(() => expect(mockSignInWithRedirect).toHaveBeenCalled());
    // Ensure no unhandled promise rejection warning
  });

  it('should handle button click during loading state if implemented', async () => {
    // Simulate loading state by mocking signInWithRedirect to resolve after a delay
    mockSignInWithRedirect.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    renderComponent();
    const loginButton = screen.getByText('Login with Okta');
    fireEvent.click(loginButton);
    fireEvent.click(loginButton);
    await waitFor(() => expect(mockSignInWithRedirect).toHaveBeenCalledTimes(1));
  });

  it('should handle authState with extra unexpected properties', () => {
    const extendedAuthState = {
      isAuthenticated: false,
      extraProp: 'unexpected',
    };
    renderComponent(extendedAuthState);
    const loginButton = screen.getByText('Login with Okta');
    expect(loginButton).toBeInTheDocument();
  });

  it('should not break if oktaAuth is an empty object', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Route path="/login">
          <Login authState={mockAuthState} oktaAuth={{}} />
        </Route>
      </MemoryRouter>
    );
    const loginButton = screen.getByText('Login with Okta');
    fireEvent.click(loginButton);
    // Ensure no errors are thrown
  });

  it('should render without crashing if authState is an empty object', () => {
    renderComponent({});
    const loginButton = screen.getByText('Login with Okta');
    expect(loginButton).toBeInTheDocument();
  });
});
