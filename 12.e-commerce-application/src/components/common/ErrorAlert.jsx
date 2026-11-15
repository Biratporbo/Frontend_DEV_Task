import React from 'react';
import { IconRefresh } from './Icons';

export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="error-alert-card" role="alert">
      <div className="error-alert-content">
        <h3 className="error-alert-title">Notice</h3>
        <p className="error-alert-desc">{message || 'Unable to load products from API.'}</p>
      </div>
      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          <IconRefresh size={16} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;
