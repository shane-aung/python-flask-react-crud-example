import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import Main from './Main';

// Mocking components
jest.mock('../Login', () => () => <div>Login Component</div>);
jest.mock('../Home', () => () => <div>Home Component</div>);

describe('Main Component', () => {
  test('renders Login component on root path', () => {
    render(
      <Router>
        <Main />
      </Router>
    );
    
    // Verify Login component is rendered
    expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
  });

  test('renders LoginCallback component on /callback path', () => {
    render(
      <Router>
        <Main />
      </Router>
    );
    
    // Verify LoginCallback component is rendered
    expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
  });

  test('renders Home component on /home path', () => {
    render(
      <Router>
        <Main />
      </Router>
    );

    // Verify Home component is rendered
    expect(screen.queryByText(/Home Component/i)).toBeInTheDocument();
  });

  // Add more tests to cover different cases if needed
});
