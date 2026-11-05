import React from 'react';
import { ALL_CATEGORIES } from '../data/categories';
import { getShortMonthLabel } from '../utils/formatters';
import { IconSearch, IconFilter, IconX } from './Icons';

export default function FilterToolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  typeFilter,
  onTypeFilterChange,
  monthFilter,
  onMonthFilterChange,
  sortBy,
  onSortChange,
  availableMonths = [],
  filteredCount,
  totalCount,
  onClearFilters
}) {
  const isFilterActive =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'all' ||
    typeFilter !== 'all' ||
    monthFilter !== 'all' ||
    sortBy !== 'date-desc';

  return (
    <div className="filter-toolbar-card">
      <div className="filter-top-row">
        {/* Search Bar */}
        <div className="filter-search-wrap">
          <IconSearch size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, category, payment method, notes..."
            className="filter-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <IconX size={14} />
            </button>
          )}
        </div>

        {/* Counter & Clear */}
        <div className="filter-stats-wrap">
          <span className="results-count-pill">
            Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> records
          </span>

          {isFilterActive && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={onClearFilters}
              title="Reset all active filters"
            >
              <IconX size={13} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="filter-controls-grid">
        {/* Type Filter */}
        <div className="filter-control-item">
          <label className="control-label">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All (Income & Expenses)</option>
            <option value="expense">Expenses Only (-)</option>
            <option value="income">Income Only (+)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-control-item">
          <label className="control-label">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div className="filter-control-item">
          <label className="control-label">Month Period</label>
          <select
            value={monthFilter}
            onChange={(e) => onMonthFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time History</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {getShortMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-control-item">
          <label className="control-label">Sort Order</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="date-desc">Newest First (Date ↓)</option>
            <option value="date-asc">Oldest First (Date ↑)</option>
            <option value="amount-desc">Highest Amount ($ ↓)</option>
            <option value="amount-asc">Lowest Amount ($ ↑)</option>
            <option value="title-asc">Title (A to Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

