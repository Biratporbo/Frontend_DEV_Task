import React from 'react';
import { IconChevronLeft, IconChevronRight } from './Icons';

export function Pagination({ currentPage, totalPages, totalResults, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate pagination items with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination-wrapper" aria-label="Movie search pagination">
      <div className="pagination-info">
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          {totalResults > 0 && ` (${totalResults.toLocaleString()} total titles found)`}
        </span>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn nav-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <IconChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <div className="pagination-numbers">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                  &hellip;
                </span>
              );
            }
            return (
              <button
                key={p}
                type="button"
                className={`pagination-number-btn ${currentPage === p ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-current={currentPage === p ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="pagination-btn nav-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <IconChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
