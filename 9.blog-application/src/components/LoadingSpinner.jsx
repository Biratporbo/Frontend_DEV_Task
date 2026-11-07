import React from 'react';

export default function LoadingSpinner({ message = 'Loading stories from REST API...' }) {
  return (
    <div className="loading-state-container">
      <div className="spinner-orbit">
        <div className="spinner-core"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}
