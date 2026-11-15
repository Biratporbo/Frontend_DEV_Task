import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectSortBy,
  setSortBy,
  selectSelectedCategory,
  selectSearchQuery,
  clearFilters
} from '../../features/products/productsSlice';

export function ProductFilters({ totalCount }) {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchQuery = useAppSelector(selectSearchQuery);

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.trim() !== '' || sortBy !== 'featured';

  return (
    <div className="product-filters-toolbar">
      <div className="filters-info-row">
        <span className="results-count-text">
          Showing <strong>{totalCount}</strong> {totalCount === 1 ? 'product' : 'products'}
          {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={() => dispatch(clearFilters())}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="sort-control-wrap">
        <label htmlFor="product-sort-select" className="sort-label">
          Sort By:
        </label>
        <select
          id="product-sort-select"
          className="sort-select"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
        >
          <option value="featured">Featured / Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="title">Alphabetical (A - Z)</option>
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;
