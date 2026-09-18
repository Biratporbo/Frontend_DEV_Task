import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const { updateTaskStatus, deleteTask } = useTasks();
  const navigate = useNavigate();

  const handleStatusToggle = (e) => {
    e.stopPropagation();
    if (task.status === 'Closed') {
      updateTaskStatus(task.id, 'Raised');
    } else {
      updateTaskStatus(task.id, 'Closed');
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.header}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      className={`task-card ${task.status === 'Closed' ? 'task-card-closed' : ''}`}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>
          <span className="badge badge-category">
            {task.category}
          </span>
          <span className={`badge badge-${task.status.toLowerCase()}`}>
            {task.status}
          </span>
        </div>
        <div className="task-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleStatusToggle}
            className={`btn-icon ${task.status === 'Closed' ? 'btn-icon-reopen' : 'btn-icon-complete'}`}
            title={task.status === 'Closed' ? 'Reopen task' : 'Mark as closed'}
          >
            {task.status === 'Closed' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <button
            onClick={handleDelete}
            className="btn-icon btn-icon-delete"
            title="Delete task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.header}</h3>
      <p className="task-desc">{task.description}</p>

      <div className="task-meta-grid">
        <div className="task-meta-item">
          <span className="meta-label">Raised:</span>
          <span className="meta-value">{task.raisedDate}</span>
        </div>
        <div className="task-meta-item">
          <span className="meta-label">Due Date:</span>
          <span className="meta-value meta-due">{task.dueDate}</span>
        </div>
      </div>

      <div className="task-card-footer" onClick={(e) => e.stopPropagation()}>
        <Link to={`/tasks/${task.id}`} className="task-view-link">
          <span>Inspect Task</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
        <Link to={`/tasks/${task.id}/edit`} className="task-edit-link">
          Edit
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;

