// src/components/Footer.js
import React from 'react';
import './Footer.css';

/**
 * Footer Component
 * Displays copyright information via Props.
 */
function Footer(props) {
  const { portalName } = props;

  return (
    <footer className="portal-footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {portalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
