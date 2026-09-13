import React from 'react';
import './StatsBar.css';

function StatsBar({ totalCount, filteredCount, departmentCount, selectedDepartment }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">Total Employees:</span>
        <span className="stat-value">{totalCount}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Showing Records:</span>
        <span className="stat-value">{filteredCount}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Departments:</span>
        <span className="stat-value">{departmentCount}</span>
      </div>

      {selectedDepartment !== 'All' && (
        <div className="stat-badge">
          Filtered by: <strong>{selectedDepartment}</strong>
        </div>
      )}
    </div>
  );
}

export default StatsBar;

