import React from 'react';

export function Footer() {
  return (
    <footer className="portal-footer">
      <div className="footer-container">
        <p className="footer-title">
          &copy; 2026 EduTrack — Student Attendance Management System.
        </p>
        <p className="footer-meta">
          Built with Redux Toolkit (multiple slices, memoized derived state, async thunks, custom middleware & persistence).
        </p>
      </div>
    </footer>
  );
}

export default Footer;
