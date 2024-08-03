import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GithubRepo from './GithubRepo'; // Replace with your component path

jest.mock('@material-ui/core/styles', () => ({
  withStyles: jest.fn((styles) => (Component) => Component),
}));

describe('GithubRepo', () => {
    const mockRepo = {
      full_name: 'owner/repo',
      description: 'Repo description',
    };
  
    const mockOnKudo = jest.fn();
  
    it('renders the component correctly', () => {
      render(<GithubRepo repo={mockRepo} onKudo={mockOnKudo} />);
  
      const card = screen.getByRole('generic'); // Assuming the card has a generic role
      const title = screen.getByText(mockRepo.full_name);
      const description = screen.getByText(mockRepo.description);
      const favoriteIcon = screen.getByRole('button');
  
      expect(card).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(favoriteIcon).toBeInTheDocument();
    });
  
    it('renders the favorite icon with the correct color', () => {
      render(<GithubRepo repo={mockRepo} onKudo={mockOnKudo} isKudo={true} />);
      const favoriteIcon = screen.getByRole('button');
      expect(favoriteIcon).toHaveAttribute('data-testid', 'favoriteIcon'); // Assuming you add a data-testid for easier targeting
      expect(favoriteIcon).toHaveStyle({ color: 'secondary' });
  
      render(<GithubRepo repo={mockRepo} onKudo={mockOnKudo} isKudo={false} />);
      expect(favoriteIcon).toHaveStyle({ color: 'primary' });
    });
  
    it('calls onKudo when the favorite icon is clicked', async () => {
      render(<GithubRepo repo={mockRepo} onKudo={mockOnKudo} />);
      const favoriteIcon = screen.getByRole('button');
  
      await userEvent.click(favoriteIcon);
  
      expect(mockOnKudo).toHaveBeenCalledWith(mockRepo);
    });
  });
  