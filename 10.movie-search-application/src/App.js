import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import Pagination from './components/Pagination';
import FavoritesView from './components/FavoritesView';
import MovieDetailModal from './components/MovieDetailModal';
import ApiKeyModal from './components/ApiKeyModal';
import { useDebounce } from './hooks/useDebounce';
import { searchMovies } from './api/omdbApi';
import './styles/App.css';

const FAVORITES_STORAGE_KEY = 'cinesearch_favorites_v1';

export function App() {
  // Navigation tab: 'search' | 'favorites'
  const [activeTab, setActiveTab] = useState('search');

  // Search & Filter State
  const [searchInput, setSearchInput] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search term (500ms delay to optimize API requests)
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Data & Async State
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFeatured, setIsFeatured] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Favorites State (persisted in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal State
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Synchronize favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Fast O(1) Map for checking favorite status
  const favoritesMap = useMemo(() => {
    const map = {};
    favorites.forEach((fav) => {
      map[fav.imdbID] = true;
    });
    return map;
  }, [favorites]);

  // Search Executor
  const executeSearch = useCallback(async (query, page, type, year) => {
    setLoading(true);
    setError('');

    try {
      const data = await searchMovies(query, page, type, year);
      setMovies(data.movies || []);
      setTotalResults(data.totalResults || 0);
      setTotalPages(data.totalPages || 1);
      setIsFeatured(!!data.isFeatured);
    } catch (err) {
      setMovies([]);
      setTotalResults(0);
      setTotalPages(1);
      setError(err.message || 'An error occurred while searching for movies.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search when debounced input or filters change
  useEffect(() => {
    // Reset to page 1 when search term or filters change
    setCurrentPage(1);
    executeSearch(debouncedSearchTerm, 1, selectedType, selectedYear);
  }, [debouncedSearchTerm, selectedType, selectedYear, executeSearch]);

  // Trigger search when page changes
  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    executeSearch(debouncedSearchTerm, newPage, selectedType, selectedYear);
    // Smooth scroll to top of movie grid
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  // Clear search and reset filters
  const handleClearSearch = () => {
    setSearchInput('');
    setSelectedType('');
    setSelectedYear('');
    setCurrentPage(1);
  };

  // Quick chip click
  const handleChipClick = (chip) => {
    setSearchInput(chip);
    setActiveTab('search');
  };

  // Toggle Favorite
  const handleToggleFavorite = (movie) => {
    if (!movie || !movie.imdbID) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.imdbID === movie.imdbID);
      if (exists) {
        return prev.filter((item) => item.imdbID === movie.imdbID);
      } else {
        const newFav = {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Type: movie.Type || 'movie',
          Poster: movie.Poster,
          imdbRating: movie.imdbRating || 'N/A',
          addedAt: Date.now()
        };
        return [newFav, ...prev];
      }
    });
  };

  // Clear all favorites
  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  // Retry search
  const handleRetrySearch = () => {
    executeSearch(debouncedSearchTerm, currentPage, selectedType, selectedYear);
  };

  return (
    <div className="app-wrapper">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favorites.length}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'search' ? (
          <>
            <SearchBar
              searchTerm={searchInput}
              onSearchChange={setSearchInput}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onClear={handleClearSearch}
              onChipClick={handleChipClick}
              isLoading={loading}
            />

            <MovieGrid
              movies={movies}
              favoritesMap={favoritesMap}
              onToggleFavorite={handleToggleFavorite}
              onSelectMovie={setSelectedMovieId}
              isLoading={loading}
              error={error}
              isFeatured={isFeatured}
              searchTerm={debouncedSearchTerm}
              onRetry={handleRetrySearch}
              onClearSearch={handleClearSearch}
            />

            {!loading && !error && !isFeatured && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <FavoritesView
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectMovie={setSelectedMovieId}
            onClearFavorites={handleClearAllFavorites}
            onDiscoverClick={() => setActiveTab('search')}
          />
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovieId && (
        <MovieDetailModal
          imdbID={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          isFavorite={!!favoritesMap[selectedMovieId]}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => {
          executeSearch(debouncedSearchTerm, currentPage, selectedType, selectedYear);
        }}
      />

      <footer className="app-footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} CineSearch — Movie Search Application powered by OMDb API.</p>
          <p>Built with React, Debounced Optimization & LocalStorage Favorites.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
