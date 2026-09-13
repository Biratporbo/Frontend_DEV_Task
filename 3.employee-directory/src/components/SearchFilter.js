import React from 'react';
import './SearchFilter.css';

function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  onReset
}) {
  return (
    <div className="search-filter-box">
      <div className="filter-group">
        <label htmlFor="search-input" className="filter-label">Search Employee:</label>
        <input
          id="search-input"
          type="text"
          className="filter-input"
          placeholder="Search by name, ID, or phone..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="department-select" className="filter-label">Department Filter:</label>
        <select
          id="department-select"
          className="filter-select"
          value={selectedDepartment}
          onChange={onDepartmentChange}
        >
          <option value="All">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {(searchTerm || selectedDepartment !== 'All') && (
        <div className="filter-action">
          <button type="button" className="btn-reset" onClick={onReset}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;

