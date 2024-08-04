import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GithubRepo from './GithubRepo';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  }
});

const StyledGithubRepo = withStyles(styles)(GithubRepo);

describe('GithubRepo Component Edge Cases', () => {
  test('renders with an empty repo object', () => {
    const { container } = render(<StyledGithubRepo repo={{}} isKudo={false} onKudo={() => {}} />);
    expect(container).toBeInTheDocument();
  });

  test('renders with repo object missing properties', () => {
    const { getByText } = render(<StyledGithubRepo repo={{ full_name: 'sample/repo' }} isKudo={false} onKudo={() => {}} />);
    expect(getByText('sample/repo')).toBeInTheDocument();
  });

  test('renders with null or undefined properties in repo object', () => {
    const repoWithNullProperties = { full_name: null, description: undefined };
    const { container, queryByText } = render(<StyledGithubRepo repo={repoWithNullProperties} isKudo={false} onKudo={() => {}} />);
    expect(container).toBeInTheDocument();
    expect(queryByText('sample/repo')).not.toBeInTheDocument();
  });

  test('renders with non-string description property', () => {
    const repoWithNonStringDescription = { full_name: 'sample/repo', description: 12345 };
    const { getByText } = render(<StyledGithubRepo repo={repoWithNonStringDescription} isKudo={false} onKudo={() => {}} />);
    expect(getByText('12345')).toBeInTheDocument();
  });

  test('renders with non-boolean isKudo property', () => {
    const { getByLabelText } = render(<StyledGithubRepo repo={{ full_name: 'sample/repo', description: 'desc' }} isKudo={'true'} onKudo={() => {}} />);
    expect(getByLabelText('Add to favorites').firstChild).toHaveStyle({ color: 'primary' });

    const { rerender } = render(<StyledGithubRepo repo={{ full_name: 'sample/repo', description: 'desc' }} isKudo={'false'} onKudo={() => {}} />);
    expect(getByLabelText('Add to favorites').firstChild).toHaveStyle({ color: 'primary' });
  });

  test('renders without onKudo callback', () => {
    const { getByLabelText } = render(<StyledGithubRepo repo={{ full_name: 'sample/repo', description: 'desc' }} isKudo={false} />);
    fireEvent.click(getByLabelText('Add to favorites'));
    // No error should be thrown
  });

  test('renders with invalid onKudo callback', () => {
    const { getByLabelText } = render(<StyledGithubRepo repo={{ full_name: 'sample/repo', description: 'desc' }} isKudo={false} onKudo={'invalid'} />);
    fireEvent.click(getByLabelText('Add to favorites'));
    // No error should be thrown
  });

  test('handles very long full_name gracefully', () => {
    const longFullName = 'a'.repeat(1000);
    const repoWithLongFullName = { full_name: longFullName, description: 'This is a sample repository' };
    const { getByText } = render(<StyledGithubRepo repo={repoWithLongFullName} isKudo={false} onKudo={() => {}} />);
    const fullNameElement = getByText(longFullName);
    expect(fullNameElement).toBeInTheDocument();
  });

  test('handles very long description gracefully', () => {
    const longDescription = 'a'.repeat(1000);
    const repoWithLongDescription = { full_name: 'sample/repo', description: longDescription };
    const { getByText } = render(<StyledGithubRepo repo={repoWithLongDescription} isKudo={false} onKudo={() => {}} />);
    const descriptionElement = getByText(longDescription);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveStyle({ minHeight: '90px', overflow: 'scroll' });
  });

  test('matches snapshot for edge cases', () => {
    const repoWithEdgeCaseProps = { full_name: 'sample/repo', description: null };
    const { asFragment } = render(<StyledGithubRepo repo={repoWithEdgeCaseProps} isKudo={'invalid'} onKudo={'invalid'} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
