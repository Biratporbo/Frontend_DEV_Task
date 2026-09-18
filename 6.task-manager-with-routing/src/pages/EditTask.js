import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask } = useTasks();

  const task = getTaskById(id);

  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Academic');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Raised');

  useEffect(() => {
    if (task) {
      setHeader(task.header);
      setDescription(task.description);
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate);
      setStatus(task.status);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="card task-not-found-card">
        <h2>Task Not Found</h2>
        <p>No task exists matching ID <code>{id}</code>.</p>
        <button onClick={() => navigate('/tasks')} className="btn btn-primary">
          Return to Tasks Directory
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!header.trim()) return;

    updateTask(id, {
      header: header.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      status,
    });

    navigate(`/tasks/${id}`);
  };

  return (
    <div className="add-task-page">
      <div className="page-header-row">
        <div>
          <h1>Edit Task</h1>
          <p>Modify task specifications, category, priority, or deadline</p>
        </div>
        <button onClick={() => navigate(`/tasks/${id}`)} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      <div className="add-task-container">
        <form onSubmit={handleSubmit} className="card task-form-card">
          <div className="form-group">
            <label htmlFor="edit-header">
              Task Header <span className="req">*</span>
            </label>
            <input
              id="edit-header"
              type="text"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-desc">
              Task Description <span className="req">*</span>
            </label>
            <textarea
              id="edit-desc"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="edit-priority">Priority</label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-category">Category</label>
              <select
                id="edit-category"
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
              <label htmlFor="edit-duedate">Due Date</label>
              <input
                id="edit-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-status">Status</label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Raised">Raised</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="auto-timestamp-banner">
            <div className="auto-timestamp-content">
              <strong>Raised Timestamp:</strong>
              <span>Originally captured on <code>{task.raisedDate}</code> (Read-only)</span>
            </div>
          </div>

          <div className="form-action-footer">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/tasks/${id}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;

