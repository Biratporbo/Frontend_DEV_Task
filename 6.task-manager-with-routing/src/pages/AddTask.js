import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import './AddTask.css';

const AddTask = () => {
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Academic');
  const [dueDate, setDueDate] = useState('2026-08-28');
  const [status, setStatus] = useState('Raised');

  // Preview current automatically captured raised date and time
  const now = new Date();
  const autoPickedTime = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!header.trim()) return;

    const newId = addTask({
      header: header.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || '2026-08-28',
      status,
    });

    // Navigate to the dynamic route of the created task
    navigate(`/tasks/${newId}`);
  };

  return (
    <div className="add-task-page">
      <div className="page-header-row">
        <div>
          <h1>Create New Task</h1>
          <p>Define task header, priority tier, category, and target deadline</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <div className="add-task-container">
        <form onSubmit={handleSubmit} className="card task-form-card">
          <div className="form-group">
            <label htmlFor="task-header">
              Task Header <span className="req">*</span>
            </label>
            <input
              id="task-header"
              type="text"
              placeholder="e.g. Complete Organic Chemistry Lab Analysis"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">
              Task Description <span className="req">*</span>
            </label>
            <textarea
              id="task-desc"
              rows="4"
              placeholder="Detail the scope of work, relevant links, requirements, or deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-duedate">Due Date</label>
              <input
                id="task-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-status">Initial Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Raised">Raised</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Automatic Raised Timestamp notification */}
          <div className="auto-timestamp-banner">
            <div className="auto-timestamp-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="auto-timestamp-content">
              <strong>Raised Date & Time:</strong>
              <span>Automatically picked as <code>{autoPickedTime}</code></span>
            </div>
          </div>

          <div className="form-action-footer">
            <button type="submit" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Publish Task</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="btn btn-secondary"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;

