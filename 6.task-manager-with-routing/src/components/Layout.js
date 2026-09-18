import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import './Layout.css';

const Layout = () => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'Overview & Analytics';
    if (pathname.startsWith('/tasks/add')) return 'Create New Task';
    if (pathname.includes('/edit')) return 'Edit Task';
    if (pathname.startsWith('/tasks/')) return 'Task Details';
    if (pathname.startsWith('/tasks')) return 'Active Tasks Directory';
    if (pathname.startsWith('/completed')) return 'Completed Tasks Archive';
    return 'Workspace';
  };

  return (
    <div className="app-shell">
      <Navigation />
      <div className="main-viewport">
        <header className="top-header">
          <div className="header-breadcrumbs">
            <span className="breadcrumb-root">TaskFlow</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{getPageTitle(location.pathname)}</span>
          </div>
          <div className="header-system-time">
            <span className="live-indicator"></span>
            <span>Live Workspace</span>
          </div>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

