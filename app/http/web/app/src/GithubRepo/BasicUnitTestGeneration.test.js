import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GithubRepo from './GithubRepo';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

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

describe('GithubRepo Component', () => {
  const repo = {
    full_name: 'sample/repo',
    description: 'This is a sample repository',
  };

  test('renders GithubRepo component with given props', () => {
    const { getByText } = render(<StyledGithubRepo repo={repo} isKudo={false} onKudo={() => {}} />);
    expect(getByText('sample/repo')).toBeInTheDocument();
    expect(getByText('This is a sample repository')).toBeInTheDocument();
  });

  test('renders with correct kudo color', () => {
    const { getByLabelText, rerender } = render(<StyledGithubRepo repo={repo} isKudo={false} onKudo={() => {}} />);
    expect(getByLabelText('Add to favorites').firstChild).toHaveStyle({ color: 'primary' });

    rerender(<StyledGithubRepo repo={repo} isKudo={true} onKudo={() => {}} />);
    expect(getByLabelText('Add to favorites').firstChild).toHaveStyle({ color: 'secondary' });
  });

  test('calls onKudo prop when favorite icon is clicked', () => {
    const onKudo = jest.fn();
    const { getByLabelText } = render(<StyledGithubRepo repo={repo} isKudo={false} onKudo={onKudo} />);
    fireEvent.click(getByLabelText('Add to favorites'));
    expect(onKudo).toHaveBeenCalledTimes(1);
    expect(onKudo).toHaveBeenCalledWith(repo);
  });
});