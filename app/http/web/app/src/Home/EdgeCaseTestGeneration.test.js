import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { withOktaAuth } from '@okta/okta-react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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

  test('handles search input and displays results', async () => {
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

  test('handles search input with no results', async () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    githubClient.mockResolvedValue({
      items: []
    });

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByText(/no results/i)).toBeInTheDocument());
  });

  test('handles search input errors', async () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    githubClient.mockRejectedValue(new Error('API error'));

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
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

  test('updates state correctly on kudo actions', async () => {
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
      expect(screen.queryByText(/repo1/i)).not.toBeInTheDocument();
    });

    fireEvent.click(kudoButton);

    await waitFor(() => {
      expect(screen.getByText(/repo1/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays kudos on mount', async () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    APIClient.mockImplementation(() => {
      return {
        getKudos: jest.fn().mockResolvedValue([{ id: 1, name: 'repo1' }])
      };
    });

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByText(/repo1/i)).toBeInTheDocument());
  });

  test('handles empty search input', () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    expect(githubClient).not.toHaveBeenCalled();
  });

  test('handles short search input', () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'ab' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    expect(githubClient).not.toHaveBeenCalled();
  });

  test('handles no access token', async () => {
    const mockPropsWithoutToken = {
      authState: {}
    };

    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockPropsWithoutToken} {...props} />);
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  test('handles API failures on initial load (kudos)', async () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    APIClient.mockImplementation(() => {
      return {
        getKudos: jest.fn().mockRejectedValue(new Error('API error'))
      };
    });

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });

  test('handles kudo action for an already kudoed repo', async () => {
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

  test('handles kudo action for a non-kudoed repo', async () => {
    withOktaAuth.mockImplementation((Component) => (props) => <Component {...mockProps} {...props} />);
    APIClient.mockImplementation(() => {
      return {
        getKudos: jest.fn().mockResolvedValue([]),
        createKudo: jest.fn(),
        deleteKudo: jest.fn()
      };
    });

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    const kudoButton = screen.getByText(/repo1/i);
    fireEvent.click(kudoButton);

    await waitFor(() => {
      expect(APIClient().createKudo).toHaveBeenCalledTimes(1);
    });
  });
});
