import React from 'react';
import { IconFilm } from './Icons';

export function LoadingSpinner({ text = 'Searching movies...' }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-reel-wrapper">
        <IconFilm size={36} className="loading-reel-icon" />
      </div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default LoadingSpinner;
