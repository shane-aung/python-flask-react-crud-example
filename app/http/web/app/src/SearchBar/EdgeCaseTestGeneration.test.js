test('handles empty search input', () => {
    // ...
    const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
    userEvent.type(searchInput, '');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 13 });
    // Assert expected behavior, e.g., no search is performed
  });
  
  test('handles search input with special characters', () => {
    // ...
    const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
    userEvent.type(searchInput, '!@#$%^&*()');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 13 });
    // Assert expected behavior, e.g., search is performed with special characters
  });
  
  test('handles long search input', () => {
    // ...
    const searchInput = screen.getByPlaceholderText(/Search for your OOS project on Github \+ Press Enter/i);
    const longString = 'abcdefghijklmnopqrstuvwxyz'.repeat(100); // Or a defined maximum length
    userEvent.type(searchInput, longString);
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 13 });
    // Assert expected behavior, e.g., search is truncated or handled appropriately
  });
  test('handles logout error', async () => {
    // ... mock oktaAuth with a failing signOut function ...
    render(<SearchBar />);
  
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    userEvent.click(logoutButton);
  
    // Assert error handling, e.g., display error message, retry logic
  });
  test('handles missing onSearch prop', () => {
    // ...
    render(<SearchBar />);
    // Assert no errors or unexpected behavior
  });
  
  test('handles invalid props', () => {
    // ... pass invalid props to the component ...
    render(<SearchBar invalidProp="test" />);
    // Assert no errors or unexpected behavior
  });
  