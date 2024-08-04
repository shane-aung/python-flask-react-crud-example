import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { withOktaAuth } from '@okta/okta-react';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Home from './Home';
import APIClient from '../apiClient';
import githubClient from '../githubClient';

jest.mock('@okta/okta-react');
jest.mock('../apiClient');
jest.mock('../githubClient');

const theme = createMuiTheme();

const mockProps = {
  authState: {
    accessToken: {
      accessToken: 'testAccessToken'
    }
  }
};

describe('Home Component', () => {
  beforeEach(() => {
    APIClient.mockClear();
    githubClient.mockClear();
  });

  test('renders without crashing', () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/kudos/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  test('handles tab changes', () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    const searchTab = screen.getByText(/search/i);
    fireEvent.click(searchTab);
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(/search/i);
  });

  test('handles search input', async () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    githubClient.mockResolvedValue({
      items: [{ id: 1, name: 'repo1' }]
    });

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByText(/repo1/i)).toBeInTheDocument());
  });

  test('handles kudo actions', async () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    APIClient.mockImplementation(() => {
      return {
        getKudos: jest.fn().mockResolvedValue([{ id: 1, name: 'repo1' }]),
        createKudo: jest.fn(),
        deleteKudo: jest.fn()
      };
    });

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByText(/repo1/i)).toBeInTheDocument());

    const kudoButton = screen.getByText(/repo1/i);
    fireEvent.click(kudoButton);

    await waitFor(() => {
      expect(APIClient().deleteKudo).toHaveBeenCalledTimes(1);
    });
  });
});
