import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import TokenInspectorModal from './TokenInspectorModal';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const { token, user } = useAuth();
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'Protected Dashboard';
    if (pathname.startsWith('/tasks/add')) return 'Create New Task';
    if (pathname.includes('/edit')) return 'Edit Task';
    if (pathname.startsWith('/tasks/')) return 'Task Details';
    if (pathname.startsWith('/tasks')) return 'Active Tasks Directory';
    if (pathname.startsWith('/completed')) return 'Completed Tasks Archive';
    return 'Secure Workspace';
  };

  return (
    <div className="app-shell">
      <Navigation />
      <div className="main-viewport">
        <header className="top-header">
          <div className="header-breadcrumbs">
            <span className="breadcrumb-root">AuthGuard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{getPageTitle(location.pathname)}</span>
          </div>

          <div className="header-right-tools">
            {token && (
              <button
                onClick={() => setIsInspectorOpen(true)}
                className="jwt-status-button"
                title="Click to view simulated JWT claims & token breakdown"
              >
                <span className="jwt-key-icon">🔑</span>
                <span className="jwt-btn-text">JWT Token Verified</span>
                <span className="jwt-chip">INSPECT</span>
              </button>
            )}

            <div className="user-status-pill">
              <span className="status-ping"></span>
              <span>{user?.username || 'User'} (Authenticated)</span>
            </div>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>

      {/* Interactive Simulated JWT Inspector Modal */}
      <TokenInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
};

export default Layout;

