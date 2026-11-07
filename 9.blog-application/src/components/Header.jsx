import React from 'react';
import { IconBook, IconPlus } from './Icons';

export default function Header({ currentView, onNavigate, apiSource }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-logo" onClick={() => onNavigate('list')}>
          <div className="brand-icon-wrap">
            <IconBook size={22} />
          </div>
          <div className="brand-text-wrap">
            <h1 className="brand-title">BlogVerse</h1>
            <span className="brand-tagline">Stories & Tech Insights</span>
          </div>
        </div>

        <div className="header-right-nav">
          {apiSource && (
            <span className={`api-status-badge ${apiSource === 'REST API' ? 'status-online' : 'status-fallback'}`}>
              <span className="status-dot"></span>
              {apiSource}
            </span>
          )}

          {currentView !== 'create' ? (
            <button
              type="button"
              className="btn btn-primary btn-header-write"
              onClick={() => onNavigate('create')}
            >
              <IconPlus size={16} /> Write Article
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('list')}
            >
              View All Articles
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
