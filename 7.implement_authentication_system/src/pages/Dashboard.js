import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TokenInspectorModal from '../components/TokenInspectorModal';
import './Dashboard.css';

const Dashboard = () => {
  const { tasks } = useTasks();
  const { user, token } = useAuth();
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const totalTasks = tasks.length;
  const raisedCount = tasks.filter((t) => t.status === 'Raised').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const closedCount = tasks.filter((t) => t.status === 'Closed').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && t.status !== 'Closed').length;

  const academicCount = tasks.filter((t) => t.category === 'Academic').length;
  const personalCount = tasks.filter((t) => t.category === 'Personal').length;
  const workCount = tasks.filter((t) => t.category === 'Work').length;

  const recentActiveTasks = tasks.filter((t) => t.status !== 'Closed').slice(0, 4);

  return (
    <div className="dashboard-view">
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="security-tag">
            <span className="shield-dot"></span>
            <span>PROTECTED SESSION &bull; JWT VERIFIED</span>
          </div>
          <h1>Welcome, {user?.name || user?.username || 'Authenticated User'} 👋</h1>
          <p>You have securely authenticated into the protected workspace environment.</p>
        </div>

        <div className="welcome-actions">
          <button onClick={() => setInspectorOpen(true)} className="btn btn-secondary btn-jwt-inspect">
            <span>🔑 Inspect JWT Token</span>
          </button>
          <Link to="/tasks/add" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">TOTAL TASKS</span>
            <div className="stat-icon icon-total">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-footer">Across all categories</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">RAISED</span>
            <div className="stat-icon icon-raised">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{raisedCount}</div>
          <div className="stat-footer">Newly logged items</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">PENDING</span>
            <div className="stat-icon icon-pending">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4" />
                <path d="m16.2 7.8 2.9-2.9" />
                <path d="M18 12h4" />
                <path d="m16.2 16.2 2.9 2.9" />
                <path d="M12 18v4" />
                <path d="m4.9 19.1 2.9-2.9" />
                <path d="M2 12h4" />
                <path d="m4.9 4.9 2.9 2.9" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{pendingCount}</div>
          <div className="stat-footer">In-progress execution</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">CLOSED</span>
            <div className="stat-icon icon-closed">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{closedCount}</div>
          <div className="stat-footer">Successfully completed</div>
        </div>

        <div className="stat-card stat-alert">
          <div className="stat-header">
            <span className="stat-title">HIGH PRIORITY</span>
            <div className="stat-icon icon-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{highPriorityCount}</div>
          <div className="stat-footer">Requiring immediate action</div>
        </div>
      </div>

      <div className="dashboard-split">
        <section className="section-main">
          <div className="section-header">
            <div>
              <h2>Recent Active Tasks</h2>
              <p>Items currently requiring attention in the protected directory</p>
            </div>
            <Link to="/tasks" className="see-all-link">
              <span>View All ({tasks.filter((t) => t.status !== 'Closed').length})</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentActiveTasks.length === 0 ? (
            <div className="empty-state card">
              <p>No active tasks remaining. All tasks are completed!</p>
              <Link to="/tasks/add" className="btn btn-primary btn-sm">Create New Task</Link>
            </div>
          ) : (
            <div className="tasks-cards-grid">
              {recentActiveTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        <aside className="section-sidebar">
          <div className="card category-breakdown-card">
            <h3>Category Distribution</h3>
            <div className="category-bars">
              <div className="cat-bar-item">
                <div className="cat-bar-header">
                  <span>Academic</span>
                  <span className="cat-count">{academicCount} tasks</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill progress-academic"
                    style={{ width: `${totalTasks > 0 ? (academicCount / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="cat-bar-item">
                <div className="cat-bar-header">
                  <span>Personal</span>
                  <span className="cat-count">{personalCount} tasks</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill progress-personal"
                    style={{ width: `${totalTasks > 0 ? (personalCount / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="cat-bar-item">
                <div className="cat-bar-header">
                  <span>Work</span>
                  <span className="cat-count">{workCount} tasks</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill progress-work"
                    style={{ width: `${totalTasks > 0 ? (workCount / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card security-summary-card">
            <h3>Security & Session</h3>
            <ul className="security-specs-list">
              <li>
                <span className="sec-label">Token Format:</span>
                <span className="sec-value">RFC 7519 3-Part JWT</span>
              </li>
              <li>
                <span className="sec-label">Signing Algorithm:</span>
                <span className="sec-value">HS256 Simulated</span>
              </li>
              <li>
                <span className="sec-label">Route Guard:</span>
                <span className="sec-value">Active & Validated</span>
              </li>
              <li>
                <span className="sec-label">Active User:</span>
                <span className="sec-value">{user?.username} ({user?.role})</span>
              </li>
            </ul>
            <button
              onClick={() => setInspectorOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px', width: '100%' }}
            >
              Open Token Claims Inspector
            </button>
          </div>
        </aside>
      </div>

      <TokenInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
