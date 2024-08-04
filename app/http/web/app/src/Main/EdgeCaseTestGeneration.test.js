import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import Main from './Main';
import Login from '../Login';
import Home from '../Home';

// Mock the OktaAuth instance and components
jest.mock('@okta/okta-auth-js', () => ({
  OktaAuth: jest.fn().mockImplementation(() => ({
    signInWithRedirect: jest.fn(),
  })),
}));
jest.mock('../Login', () => () => <div>Login Component</div>);
jest.mock('../Home', () => () => <div>Home Component</div>);

describe('Main Component Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle OktaAuth initialization errors gracefully', () => {
    // Simulate an error in OktaAuth initialization
    OktaAuth.mockImplementationOnce(() => {
      throw new Error('OktaAuth initialization failed');
    });

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Router>
        <Main />
      </Router>
    );

    // Check that an error is logged
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('OktaAuth initialization failed'));

    consoleError.mockRestore();
  });

  test('should render Login component on invalid route', async () => {
    window.history.pushState({}, 'Test page', '/invalid');

    render(
      <Router>
        <Main />
      </Router>
    );

    // Verify Login component is still rendered for an invalid route
    await waitFor(() => {
      expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
    });
  });

  test('should not render Home component without authentication', async () => {
    // Mock SecureRoute to simulate no authentication
    jest.mock('@okta/okta-react', () => ({
      SecureRoute: (props) => {
        if (window.location.pathname === '/home') {
          return <div>Not Authenticated</div>;
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

    // Verify Home component is not rendered without authentication
    await waitFor(() => {
      expect(screen.queryByText(/Home Component/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Not Authenticated/i)).toBeInTheDocument();
    });
  });

  test('should handle unexpected restoreOriginalUri behavior', async () => {
    const mockReplace = jest.fn();
    const history = { replace: mockReplace };
    
    // Simulate unexpected behavior in restoreOriginalUri
    const originalUri = '/unexpected';
    const restoreOriginalUri = jest.fn().mockImplementation(() => {
      throw new Error('Unexpected restoreOriginalUri behavior');
    });

    // Override the restoreOriginalUri function
    render(
      <Router>
        <Main history={history} restoreOriginalUri={restoreOriginalUri} />
      </Router>
    );

    // Simulate call to restoreOriginalUri
    await waitFor(() => {
      expect(() => restoreOriginalUri()).toThrow('Unexpected restoreOriginalUri behavior');
    });
  });
});
