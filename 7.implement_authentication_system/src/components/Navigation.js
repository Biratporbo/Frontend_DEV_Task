import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeTasksCount = tasks.filter((t) => t.status !== 'Closed').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Closed').length;

  return (
    <aside className="sidebar-nav">
      <div className="nav-brand">
        <div className="brand-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="brand-text">
          <h2>AuthGuard</h2>
          <span>Task Workspace</span>
        </div>
      </div>

      <nav className="nav-menu">
        <div className="nav-section-title">MAIN NAVIGATION</div>

        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/tasks"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
          <span>Active Tasks</span>
          {activeTasksCount > 0 && <span className="nav-badge">{activeTasksCount}</span>}
        </NavLink>

        <NavLink
          to="/tasks/add"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
          </svg>
          <span>Add Task</span>
        </NavLink>

        <NavLink
          to="/completed"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>Completed</span>
          {completedTasksCount > 0 && <span className="nav-badge nav-badge-muted">{completedTasksCount}</span>}
        </NavLink>
      </nav>

      <div className="nav-footer">
        {user && (
          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info-text">
              <span className="user-display-name">{user.name || user.username}</span>
              <span className="user-role-tag">{user.role || 'Member'}</span>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="btn-logout" title="Sign out and revoke token">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Navigation;

