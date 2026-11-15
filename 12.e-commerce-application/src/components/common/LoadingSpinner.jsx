import React from 'react';

export function LoadingSpinner({ text = 'Loading products from Fake Store API...' }) {
  return (
    <div className="loading-state-container" role="status" aria-live="polite">
      <div className="spinner-orbit"></div>
      <p className="loading-state-text">{text}</p>
    </div>
  );
}

export default LoadingSpinner;
