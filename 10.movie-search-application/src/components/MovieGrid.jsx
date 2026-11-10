import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { IconFilm, IconSearch, IconSparkles } from './Icons';

export function MovieGrid({
  movies,
  favoritesMap,
  onToggleFavorite,
  onSelectMovie,
  isLoading,
  error,
  isFeatured,
  searchTerm,
  onRetry,
  onClearSearch
}) {
  if (isLoading) {
    return <LoadingSpinner text={searchTerm ? `Searching for "${searchTerm}"...` : 'Loading movies...'} />;
  }

  if (error) {
    return (
      <div className="error-state-card" role="alert">
        <div className="error-icon-wrap">
          <IconFilm size={40} />
        </div>
        <h3 className="error-title">Search Notice</h3>
        <p className="error-message">{error}</p>
        <div className="error-actions">
          {onRetry && (
            <button type="button" className="retry-action-btn" onClick={onRetry}>
              Retry Search
            </button>
          )}
          {onClearSearch && (
            <button type="button" className="clear-filter-btn" onClick={onClearSearch}>
              Clear Search
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap">
          <IconSearch size={44} />
        </div>
        <h3 className="empty-title">No Movies Found</h3>
        <p className="empty-desc">
          We couldn't find any titles matching "{searchTerm}". Try checking your spelling or adjusting your type/year filters.
        </p>
        {onClearSearch && (
          <button type="button" className="primary-action-btn" onClick={onClearSearch}>
            Reset Search
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="movie-grid-container">
      {isFeatured && (
        <div className="featured-banner">
          <div className="featured-banner-content">
            <span className="featured-pill">
              <IconSparkles size={14} />
              Featured Showcase
            </span>
            <h2 className="featured-heading">Trending & Acclaimed Masterpieces</h2>
            <p className="featured-sub">
              Browse curated selections below, or type in the search bar above to query over 500,000+ films, series, and episodes via OMDb API.
            </p>
          </div>
        </div>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={!!favoritesMap[movie.imdbID]}
            onToggleFavorite={onToggleFavorite}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;
