import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import './Dashboard.css';

const Dashboard = () => {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const totalTasks = tasks.length;
  const raisedCount = tasks.filter((t) => t.status === 'Raised').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const closedCount = tasks.filter((t) => t.status === 'Closed').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && t.status !== 'Closed').length;

  const academicCount = tasks.filter((t) => t.category === 'Academic').length;
  const personalCount = tasks.filter((t) => t.category === 'Personal').length;
  const workCount = tasks.filter((t) => t.category === 'Work').length;

  const recentActiveTasks = tasks
    .filter((t) => t.status !== 'Closed')
    .slice(0, 4);

  return (
    <div className="dashboard-view">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Hello, {user?.name || 'Developer'} 👋</h1>
          <p>Here is your current productivity pulse and upcoming task commitments.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/tasks/add" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create Task</span>
          </Link>
          <Link to="/tasks" className="btn btn-secondary">
            <span>Browse All Tasks</span>
          </Link>
        </div>
      </div>

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
              <p>Top items currently requiring your attention</p>
            </div>
            <Link to="/tasks" className="see-all-link">
              <span>View All ({tasks.filter(t => t.status !== 'Closed').length})</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentActiveTasks.length === 0 ? (
            <div className="empty-state card">
              <p>No active tasks found! You have completed all work.</p>
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
            <h3>Category Breakdown</h3>
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

          <div className="card quick-tips-card">
            <h3>Navigation Tips</h3>
            <ul className="tips-list">
              <li><strong>Dynamic Routes:</strong> Click on any task card to inspect its details at <code>/tasks/:id</code>.</li>
              <li><strong>Nested Routes:</strong> Tasks sub-routes are handled inside <code>/tasks</code> via React Router Outlet.</li>
              <li><strong>Protected Routes:</strong> Logging out locks access to all workspace paths.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

