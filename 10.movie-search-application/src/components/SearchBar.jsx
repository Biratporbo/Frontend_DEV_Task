import React from 'react';
import { IconSearch, IconClose, IconFilter, IconCalendar } from './Icons';

const QUICK_SEARCH_CHIPS = ['Batman', 'Inception', 'Avengers', 'Interstellar', 'Spider-Man', 'Matrix'];

export function SearchBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedYear,
  onYearChange,
  onClear,
  onChipClick,
  isLoading
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClear();
    }
  };

  return (
    <section className="search-section">
      <div className="search-bar-wrapper">
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <div className="search-input-group">
            <span className="search-icon-adornment">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search movies, TV series, actors, or franchises (e.g. Batman)..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={onClear}
                title="Clear search"
              >
                <IconClose size={16} />
              </button>
            )}
          </div>

          <div className="search-filters">
            <div className="filter-item">
              <IconFilter size={15} className="filter-icon" />
              <select
                className="filter-select"
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                aria-label="Filter by media type"
              >
                <option value="">All Types</option>
                <option value="movie">Movies</option>
                <option value="series">TV Series</option>
                <option value="episode">Episodes</option>
              </select>
            </div>

            <div className="filter-item year-filter">
              <IconCalendar size={15} className="filter-icon" />
              <input
                type="number"
                className="year-input"
                placeholder="Year (e.g. 2024)"
                min="1900"
                max={new Date().getFullYear() + 2}
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                aria-label="Filter by release year"
              />
              {selectedYear && (
                <button
                  type="button"
                  className="filter-clear-pill"
                  onClick={() => onYearChange('')}
                  title="Clear year filter"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="quick-chips-row">
          <span className="chips-label">Popular Searches:</span>
          <div className="chips-list">
            {QUICK_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip-btn ${searchTerm.toLowerCase() === chip.toLowerCase() ? 'active' : ''}`}
                onClick={() => onChipClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
