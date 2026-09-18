import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '64px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
        The requested route does not exist in the AuthGuard routing tree.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '8px' }}>
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;

