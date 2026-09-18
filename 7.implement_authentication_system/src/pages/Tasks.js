import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './Tasks.css';

const Tasks = () => {
  const { tasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'ACTIVE' && task.status === 'Closed') return false;
    if (statusFilter !== 'ALL' && statusFilter !== 'ACTIVE' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
    if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHeader = task.header.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      if (!matchHeader && !matchDesc) return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('ALL');
    setCategoryFilter('ALL');
    setStatusFilter('ACTIVE');
  };

  return (
    <div className="tasks-page">
      <div className="page-header-row">
        <div>
          <h1>Active Tasks Directory</h1>
          <p>Protected tasks workspace &bull; Filter by priority, category, or lifecycle state</p>
        </div>
        <Link to="/tasks/add" className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New Task</span>
        </Link>
      </div>

      <div className="card filter-bar-card">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks by header or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn">
              &times;
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <div className="filter-control">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ACTIVE">Active (Raised + Pending)</option>
              <option value="ALL">All Statuses</option>
              <option value="Raised">Raised Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Closed">Closed Only</option>
            </select>
          </div>

          <div className="filter-control">
            <label>Priority</label>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="filter-control">
            <label>Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-summary">
        <span>Showing <strong>{filteredTasks.length}</strong> tasks</span>
        {(searchQuery || priorityFilter !== 'ALL' || categoryFilter !== 'ALL' || statusFilter !== 'ACTIVE') && (
          <button onClick={resetFilters} className="reset-filters-btn">
            Reset Filters
          </button>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card empty-results-card">
          <div className="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <h3>No tasks match your criteria</h3>
          <p>Try adjusting your search query, priority, or category filters.</p>
          <button onClick={resetFilters} className="btn btn-secondary btn-sm">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;

