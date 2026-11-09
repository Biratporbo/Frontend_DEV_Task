import React, { useState, useMemo } from 'react';
import MovieCard from './MovieCard';
import { IconHeart, IconSearch, IconTrash, IconFilm } from './Icons';

export function FavoritesView({
  favorites,
  onToggleFavorite,
  onSelectMovie,
  onClearFavorites,
  onDiscoverClick
}) {
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');

  const filteredAndSortedFavorites = useMemo(() => {
    let list = [...favorites];

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.Title.toLowerCase().includes(q) ||
          (m.Year && m.Year.includes(q)) ||
          (m.Type && m.Type.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'titleAsc') return a.Title.localeCompare(b.Title);
      if (sortBy === 'titleDesc') return b.Title.localeCompare(a.Title);
      if (sortBy === 'yearDesc') return (parseInt(b.Year, 10) || 0) - (parseInt(a.Year, 10) || 0);
      if (sortBy === 'yearAsc') return (parseInt(a.Year, 10) || 0) - (parseInt(b.Year, 10) || 0);
      // default: date added (newest first)
      return (b.addedAt || 0) - (a.addedAt || 0);
    });

    return list;
  }, [favorites, filterQuery, sortBy]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all movies from your favorites?')) {
      onClearFavorites();
    }
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-empty-state">
        <div className="empty-icon-wrap">
          <IconHeart size={48} className="empty-heart-icon" />
        </div>
        <h3 className="empty-heading">No Favorite Movies Yet</h3>
        <p className="empty-desc">
          You haven't saved any movies to your watchlist. Browse movies in the Discover tab and click the heart icon to add them here!
        </p>
        <button type="button" className="primary-action-btn" onClick={onDiscoverClick}>
          <IconFilm size={18} />
          <span>Discover Movies Now</span>
        </button>
      </div>
    );
  }

  return (
    <section className="favorites-section">
      <div className="favorites-toolbar">
        <div className="favorites-title-wrap">
          <h2 className="section-title">
            <IconHeart size={22} fill="#ef4444" />
            <span>My Favorite Movies</span>
          </h2>
          <span className="favorites-count-badge">
            {favorites.length} {favorites.length === 1 ? 'title' : 'titles'} saved
          </span>
        </div>

        <div className="favorites-actions">
          <div className="favorites-search-wrap">
            <IconSearch size={15} className="fav-search-icon" />
            <input
              type="text"
              className="fav-search-input"
              placeholder="Filter your favorites..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>

          <select
            className="favorites-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort favorites"
          >
            <option value="dateDesc">Recently Added</option>
            <option value="titleAsc">Title (A to Z)</option>
            <option value="titleDesc">Title (Z to A)</option>
            <option value="yearDesc">Year (Newest First)</option>
            <option value="yearAsc">Year (Oldest First)</option>
          </select>

          <button
            type="button"
            className="clear-favorites-btn"
            onClick={handleClearAll}
            title="Clear all saved favorites"
          >
            <IconTrash size={15} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {filteredAndSortedFavorites.length === 0 ? (
        <div className="favorites-no-match">
          <p>No favorites match your search filter "{filterQuery}".</p>
          <button
            type="button"
            className="text-link-btn"
            onClick={() => setFilterQuery('')}
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="movie-grid">
          {filteredAndSortedFavorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FavoritesView;
