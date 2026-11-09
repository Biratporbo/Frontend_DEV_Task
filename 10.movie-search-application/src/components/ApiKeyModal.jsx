import React, { useState, useEffect } from 'react';
import { getActiveApiKey, setCustomApiKey } from '../api/omdbApi';
import { IconClose, IconKey, IconCheck, IconExternal } from './Icons';

export function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [keyInput, setKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getActiveApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCustomApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      onKeyUpdated();
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setCustomApiKey('');
    setKeyInput('trilogy');
    setSavedSuccess(true);
    setTimeout(() => {
      onKeyUpdated();
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="api-modal-title">
      <div className="api-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="api-modal-header">
          <div className="api-modal-title-group">
            <IconKey size={20} className="api-modal-icon" />
            <h3 id="api-modal-title" className="api-modal-title">
              OMDb API Configuration
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <IconClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="api-modal-body">
          <p className="api-modal-desc">
            This application connects to the official <strong>OMDb API</strong>. You can use the built-in default key or supply your personal key if you hit rate limits.
          </p>

          <div className="api-input-wrap">
            <label htmlFor="omdb-key-input" className="api-label">
              Active API Key:
            </label>
            <input
              id="omdb-key-input"
              type="text"
              className="api-text-input"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. trilogy or your own key"
              required
            />
          </div>

          <div className="api-info-links">
            <a
              href="https://www.omdbapi.com/apikey.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="api-help-link"
            >
              <span>Get a free personal OMDb API Key</span>
              <IconExternal size={13} />
            </a>
          </div>

          {savedSuccess && (
            <div className="api-success-toast">
              <IconCheck size={16} />
              <span>API Key saved successfully! Reloading data...</span>
            </div>
          )}

          <div className="api-modal-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Reset to Default Key
            </button>
            <button type="submit" className="btn-primary">
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApiKeyModal;
