import React from 'react';
import { IconAlert, IconRefresh } from './Icons';

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-banner-card">
      <div className="error-icon-box">
        <IconAlert size={26} />
      </div>
      <div className="error-content-box">
        <h4 className="error-heading">API Communication Error</h4>
        <p className="error-description">
          {error || 'Unable to connect to the REST API server. Please check your network or json-server status.'}
        </p>
        {onRetry && (
          <button type="button" className="btn btn-secondary btn-retry" onClick={onRetry}>
            <IconRefresh size={15} /> Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
