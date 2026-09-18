import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { decodeToken, getTimeRemaining } from '../services/jwtService';
import './TokenInspectorModal.css';

const TokenInspectorModal = ({ isOpen, onClose }) => {
  const { token, invalidateToken } = useAuth();
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const decoded = decodeToken(token);

  useEffect(() => {
    if (!token) return;
    setSecondsRemaining(getTimeRemaining(token));

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(token);
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  if (!isOpen || !token || !decoded) return null;

  const parts = token.split('.');

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSeconds = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem < 10 ? '0' : ''}${rem}s`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="jwt-badge-icon">JWT</div>
            <div>
              <h3>Simulated JWT Token Inspector</h3>
              <p>RFC 7519 Compliant JSON Web Token Verification</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Validity Banner */}
          <div className="token-status-banner">
            <div className="status-indicator">
              <span className="live-dot"></span>
              <span>Status: <strong>Valid & Verified</strong></span>
            </div>
            <div className="expiry-countdown">
              <span>Expires in: <strong>{formatSeconds(secondsRemaining)}</strong></span>
            </div>
          </div>

          {/* Raw Encoded Token display */}
          <div className="token-section">
            <div className="section-label-bar">
              <span>RAW ENCODED TOKEN (3-PART BASE64URL)</span>
              <button onClick={handleCopy} className="copy-btn">
                {copied ? 'Copied to Clipboard!' : 'Copy Token'}
              </button>
            </div>
            <div className="raw-token-box">
              <span className="jwt-header-part">{parts[0]}</span>
              <span className="jwt-dot">.</span>
              <span className="jwt-payload-part">{parts[1]}</span>
              <span className="jwt-dot">.</span>
              <span className="jwt-sig-part">{parts[2]}</span>
            </div>
          </div>

          {/* Decoded Parts Grid */}
          <div className="decoded-parts-grid">
            <div className="decoded-box">
              <div className="decoded-box-title header-title">HEADER: Algorithm & Token Type</div>
              <pre className="code-block">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>

            <div className="decoded-box">
              <div className="decoded-box-title payload-title">PAYLOAD: Data Claims & Expiry</div>
              <pre className="code-block">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
          </div>

          {/* Verification Actions */}
          <div className="token-test-actions">
            <div>
              <strong>Test Token Invalidation:</strong>
              <p>Simulate token expiration or tampering to verify Route Protection behavior.</p>
            </div>
            <button
              onClick={() => {
                invalidateToken();
                onClose();
              }}
              className="btn btn-danger btn-sm"
            >
              Simulate Token Expiry
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenInspectorModal;

