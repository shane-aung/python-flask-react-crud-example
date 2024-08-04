import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
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
    waitFor(() => expect(screen.getByText('Home Page')).toBeInTheDocument());
  });

  it('should call signInWithRedirect when login button is clicked', async () => {
    renderComponent();
    const loginButton = screen.getByText('Login with Okta');
    fireEvent.click(loginButton);
    await waitFor(() => expect(mockSignInWithRedirect).toHaveBeenCalled());
  });

  it('should not call signInWithRedirect if button is clicked multiple times quickly', async () => {
    renderComponent();
    const loginButton = screen.getByText('Login with Okta');
    fireEvent.click(loginButton);
    fireEvent.click(loginButton);
    await waitFor(() => expect(mockSignInWithRedirect).toHaveBeenCalledTimes(1));
  });

  it('should not render the button if authState is null', () => {
    renderComponent(null);
    expect(screen.queryByText('Login with Okta')).not.toBeInTheDocument();
  });

  it('should handle case when oktaAuth is not provided', () => {
    const renderWithoutOktaAuth = () => {
      return render(
        <MemoryRouter initialEntries={['/login']}>
          <Route path="/login">
            <Login authState={mockAuthState} />
          </Route>
        </MemoryRouter>
      );
    };

    const { container } = renderWithoutOktaAuth();
    expect(container).toBeEmptyDOMElement();
  });

  it('should display proper styling for the login container', () => {
    renderComponent();
    const loginContainer = screen.getByRole('button', { name: 'Login with Okta' }).parentElement;
    expect(loginContainer).toHaveStyle('height: 100vh');
    expect(loginContainer).toHaveStyle('display: flex');
    expect(loginContainer).toHaveStyle('align-items: center');
    expect(loginContainer).toHaveStyle('justify-content: center');
  });
});
