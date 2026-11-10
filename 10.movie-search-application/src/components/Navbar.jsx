import React from 'react';
import { IconFilm, IconHeart, IconSearch, IconKey } from './Icons';

export function Navbar({ activeTab, onTabChange, favoritesCount = 0, onOpenApiKeyModal }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onTabChange('search')} role="button" tabIndex={0}>
          <div className="brand-icon">
            <IconFilm size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Cine<span className="brand-accent">Search</span></span>
            <span className="brand-subtitle">OMDb Movie Explorer</span>
          </div>
        </div>

        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => onTabChange('search')}
          >
            <IconSearch size={16} />
            <span>Discover</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => onTabChange('favorites')}
          >
            <IconHeart size={16} fill={activeTab === 'favorites' ? '#ef4444' : 'currentColor'} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="favorites-badge">{favoritesCount}</span>
            )}
          </button>

          <button
            type="button"
            className="api-key-btn"
            onClick={onOpenApiKeyModal}
            title="Configure OMDb API Key"
          >
            <IconKey size={15} />
            <span className="api-key-label">API Key</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
