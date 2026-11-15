import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { useAppDispatch } from '../../app/hooks';
import { clearFilters } from '../../features/products/productsSlice';

export function ProductList({ products, status, error, onRetry }) {
  const dispatch = useAppDispatch();

  if (status === 'loading') {
    return <LoadingSpinner text="Fetching products from Fake Store API..." />;
  }

  if (status === 'failed') {
    return <ErrorAlert message={error} onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-catalog-state">
        <h3 className="empty-catalog-title">No Products Found</h3>
        <p className="empty-catalog-desc">
          No items match your active filters or search terms. Try searching for something else or clearing your filters.
        </p>
        <button
          type="button"
          className="empty-reset-btn"
          onClick={() => dispatch(clearFilters())}
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-grid" data-testid="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
