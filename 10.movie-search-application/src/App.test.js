import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('CineSearch Application', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders navbar brand title and subtitle', () => {
    render(<App />);
    expect(screen.getByText(/Cine/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/OMDb Movie Explorer/i)).toBeInTheDocument();
  });

  test('renders search input with placeholder', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Search movies, TV series, actors, or franchises/i);
    expect(input).toBeInTheDocument();
  });

  test('renders popular search chips', () => {
    render(<App />);
    expect(screen.getByText(/Popular Searches:/i)).toBeInTheDocument();
    expect(screen.getByText('Batman')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  test('renders Discover and Favorites navigation tabs', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Discover/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Favorites/i })).toBeInTheDocument();
  });

  test('switches to Favorites tab and shows empty state', () => {
    render(<App />);
    const favoritesTab = screen.getByRole('button', { name: /Favorites/i });
    fireEvent.click(favoritesTab);

    expect(screen.getByText(/No Favorite Movies Yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover Movies Now/i)).toBeInTheDocument();
  });
});
