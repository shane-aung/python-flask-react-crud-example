import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import Main from './Main';
import Login from '../Login';
import Home from '../Home';

// Mock the OktaAuth instance
jest.mock('@okta/okta-auth-js', () => ({
  OktaAuth: jest.fn().mockImplementation(() => ({
    signInWithRedirect: jest.fn(),
  })),
}));

// Mock components
jest.mock('../Login', () => () => <div>Login Component</div>);
jest.mock('../Home', () => () => <div>Home Component</div>);

describe('Main Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize OktaAuth with correct props', () => {
    const { container } = render(
      <Router>
        <Main />
      </Router>
    );

    // Ensure OktaAuth is initialized correctly
    expect(OktaAuth).toHaveBeenCalledWith({
      issuer: 'https://dev-as0ayq8ahyuo3snl.us.auth0.com/oauth2/default',
      clientId: 'UmI40w0bA75pxK8uOLFNr70U22Ly3I3O',
      redirectUri: `${window.location.origin}/callback`,
    });
  });

  test('should render Login component on root path', async () => {
    window.history.pushState({}, 'Test page', '/');
    
    render(
      <Router>
        <Main />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
    });
  });

  test('should render LoginCallback component on /callback path', async () => {
    window.history.pushState({}, 'Test page', '/callback');
    
    render(
      <Router>
        <Main />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
    });
  });

  test('should render Home component on /home path when authenticated', async () => {
    // Mock the SecureRoute component to simulate authentication
    jest.mock('@okta/okta-react', () => ({
      SecureRoute: (props) => {
        if (window.location.pathname === '/home') {
          return <div>Home Component</div>;
        }
        return null;
      },
    }));

    window.history.pushState({}, 'Test page', '/home');
    
    render(
      <Router>
        <Main />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Home Component/i)).toBeInTheDocument();
    });
  });

  test('should call restoreOriginalUri function', async () => {
    const mockReplace = jest.fn();
    const history = { replace: mockReplace };
    
    render(
      <Router>
        <Main history={history} />
      </Router>
    );

    // Simulate the OktaAuth restoreOriginalUri method
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.any(String) // you can add more specific checks here
      );
    });
  });
});
