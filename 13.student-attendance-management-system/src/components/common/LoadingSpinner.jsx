import React from 'react';

export function LoadingSpinner({ text = 'Loading records...' }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="orbit-spinner"></div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}

export default LoadingSpinner;
