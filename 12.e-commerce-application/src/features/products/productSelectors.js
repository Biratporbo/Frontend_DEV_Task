import { createSelector } from '@reduxjs/toolkit';
import { selectAllProducts } from './productsSlice';

export const selectProductStatus = (state) => state.products.status;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductError = (state) => state.products.error;
export const selectProductsError = (state) => state.products.error;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSortBy = (state) => state.products.sortBy;
export const selectSelectedProductId = (state) => state.products.selectedProductId;

/**
 * Memoized selector: Derive unique categories list
 */
export const selectCategories = createSelector(
  [selectAllProducts],
  (products) => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }
);

/**
 * Memoized selector: Filter, search, and sort products
 */
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSelectedCategory, selectSearchQuery, selectSortBy],
  (products, category, searchQuery, sortBy) => {
    let result = [...products];

    // 1. Category Filter
    if (category && category !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // 2. Keyword Search
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating?.rate || 0) - (a.rating?.rate || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      // 'featured' / default: natural ID order
      return a.id - b.id;
    });

    return result;
  }
);

/**
 * Memoized selector: Selected product detail object
 */
export const selectActiveProduct = createSelector(
  [selectAllProducts, selectSelectedProductId],
  (products, selectedId) => {
    if (!selectedId) return null;
    return products.find((p) => p.id === Number(selectedId)) || null;
  }
);
