// src/components/Header.js
import React from 'react';
import './Header.css';

/**
 * Header Component
 * Demonstrates receiving and displaying portal title, subtitle, and metrics via Props.
 */
function Header(props) {
  const { title, subtitle, stats } = props;

  return (
    <header className="portal-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon" aria-hidden="true">
            🎓
          </div>
          <div className="brand-text">
            <h1 className="portal-title">{title}</h1>
            <p className="portal-subtitle">{subtitle}</p>
          </div>
        </div>

        {stats && (
          <div className="header-stats" aria-label="Portal Statistics">
            <div className="stat-chip">
              <span className="stat-label">Total Enrolled</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">Average CGPA</span>
              <span className="stat-value">{stats.avgCgpa}</span>
            </div>
            <div className="stat-chip highlight">
              <span className="stat-label">Top CGPA</span>
              <span className="stat-value">🌟 {stats.topCgpa}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

