import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './CompletedTasks.css';

const CompletedTasks = () => {
  const { tasks } = useTasks();
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const completedTasks = tasks.filter((task) => {
    if (task.status !== 'Closed') return false;
    if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="completed-tasks-page">
      <div className="page-header-row">
        <div>
          <h1>Completed Tasks Archive</h1>
          <p>Protected archive of completed academic, personal, and enterprise items</p>
        </div>
        <Link to="/tasks" className="btn btn-secondary">
          <span>Active Tasks</span>
        </Link>
      </div>

      <div className="card completed-filter-card">
        <div className="filter-dropdowns">
          <div className="filter-control">
            <label>Filter by Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
            </select>
          </div>

          <div className="filter-control">
            <label>Filter by Priority</label>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="archive-count-tag">
          <span>Total Closed: <strong>{completedTasks.length}</strong></span>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <div className="card empty-archive-card">
          <div className="archive-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3>No completed tasks in this view</h3>
          <p>Mark active tasks as complete or adjust your filter selection to review past work.</p>
          <Link to="/tasks" className="btn btn-primary btn-sm">Browse Active Tasks</Link>
        </div>
      ) : (
        <div className="tasks-grid">
          {completedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;

