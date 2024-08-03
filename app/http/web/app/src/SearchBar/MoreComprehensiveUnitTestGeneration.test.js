test('renders component structure correctly', () => {
    render(<SearchBar />);
  
    const appBar = screen.getByRole('banner');
    const toolbar = screen.getByRole('toolbar');
    const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
  
    expect(appBar).toBeInTheDocument();
    expect(toolbar).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  
    // Check for correct CSS classes if needed
  });
  test('onSearch prop is called with correct input value', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
  
    const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
    userEvent.type(searchInput, 'test search');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 13 });
  
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });
  
  test('logout button calls oktaAuth.signOut', async () => {
    // ... mocking oktaAuth as before ...
  
    render(<SearchBar />);
  
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    userEvent.click(logoutButton);
  
    await waitFor(() => {
      expect(mockOktaAuth.signOut).toHaveBeenCalledTimes(1);
    });
  });
  