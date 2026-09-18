import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTaskStatus, deleteTask } = useTasks();

  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="card task-not-found-card">
        <div className="not-found-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Task Not Found</h2>
        <p>No task exists matching ID <code>{id}</code>. It may have been deleted or the URL is incorrect.</p>
        <button onClick={() => navigate('/tasks')} className="btn btn-primary">
          Return to Tasks Directory
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm(`Permanently delete "${task.header}"?`)) {
      deleteTask(task.id);
      navigate('/tasks');
    }
  };

  return (
    <div className="task-details-view">
      <div className="details-header-bar">
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Back</span>
        </button>

        <div className="details-header-actions">
          <Link to={`/tasks/${task.id}/edit`} className="btn btn-secondary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            <span>Edit</span>
          </Link>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="card task-details-card">
        <div className="task-meta-top">
          <div className="badge-group">
            <span className={`badge badge-${task.priority.toLowerCase()}`}>
              {task.priority} Priority
            </span>
            <span className="badge badge-category">
              Category: {task.category}
            </span>
            <span className={`badge badge-${task.status.toLowerCase()}`}>
              Status: {task.status}
            </span>
          </div>
          <span className="task-id-badge">ID: {task.id}</span>
        </div>

        <h1 className="task-full-title">{task.header}</h1>

        <div className="task-full-desc-box">
          <h4>DESCRIPTION</h4>
          <p>{task.description}</p>
        </div>

        <div className="details-specs-grid">
          <div className="spec-card">
            <span className="spec-label">Raised Date & Time</span>
            <span className="spec-value">{task.raisedDate}</span>
            <span className="spec-sub">Automatically logged at creation</span>
          </div>

          <div className="spec-card">
            <span className="spec-label">Target Due Date</span>
            <span className="spec-value spec-due-highlight">{task.dueDate}</span>
            <span className="spec-sub">Scheduled deadline</span>
          </div>

          <div className="spec-card">
            <span className="spec-label">Current Lifecycle State</span>
            <span className="spec-value">{task.status}</span>
            <span className="spec-sub">Updated in real-time</span>
          </div>
        </div>

        <div className="status-transition-panel">
          <span className="panel-label">Quick Status Transition:</span>
          <div className="status-buttons">
            <button
              onClick={() => handleStatusChange('Raised')}
              className={`btn btn-sm ${task.status === 'Raised' ? 'btn-primary' : 'btn-secondary'}`}
              disabled={task.status === 'Raised'}
            >
              Mark as Raised
            </button>
            <button
              onClick={() => handleStatusChange('Pending')}
              className={`btn btn-sm ${task.status === 'Pending' ? 'btn-primary' : 'btn-secondary'}`}
              disabled={task.status === 'Pending'}
            >
              Mark as Pending
            </button>
            <button
              onClick={() => handleStatusChange('Closed')}
              className={`btn btn-sm ${task.status === 'Closed' ? 'btn-success' : 'btn-secondary'}`}
              disabled={task.status === 'Closed'}
            >
              Mark as Closed (Complete)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

