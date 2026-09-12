// src/components/StudentList.js
import React from 'react';
import StudentCard from './StudentCard';
import './StudentList.css';

/**
 * StudentList Component
 * Renders the toolbar (sorting by CGPA, searching, filtering) and the responsive grid of Student Cards.
 * All data and callback handlers are received strictly through Props.
 */
function StudentList(props) {
  const {
    students,
    sortOrder,
    onSortChange,
    searchQuery,
    onSearchChange,
    selectedDepartment,
    onDepartmentChange,
    departments,
    totalCount
  } = props;

  return (
    <section className="student-list-section" aria-label="Student Directory">
      <div className="list-container">
        {/* Controls & Toolbar */}
        <div className="portal-toolbar">
          {/* Search and Department Filter */}
          <div className="filter-group">
            <div className="search-box">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="Search by student name or roll number..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
                aria-label="Search students"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="department-select-wrapper">
              <label htmlFor="dept-select" className="sr-only">Filter by Department</label>
              <select
                id="dept-select"
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className="department-select"
              >
                <option value="All">All Departments</option>
                {departments && departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CGPA Sorting Mechanism Requirement */}
          <div className="sorting-controls">
            <span className="sort-label">Sort by CGPA:</span>
            <div className="sort-button-group" role="group" aria-label="Sort students by CGPA">
              <button
                type="button"
                className={`sort-btn ${sortOrder === 'cgpa-desc' ? 'active' : ''}`}
                onClick={() => onSortChange('cgpa-desc')}
                title="Sort students by CGPA from highest to lowest"
              >
                <span className="sort-icon">↓</span> High to Low
              </button>

              <button
                type="button"
                className={`sort-btn ${sortOrder === 'cgpa-asc' ? 'active' : ''}`}
                onClick={() => onSortChange('cgpa-asc')}
                title="Sort students by CGPA from lowest to highest"
              >
                <span className="sort-icon">↑</span> Low to High
              </button>

              {sortOrder !== 'none' && (
                <button
                  type="button"
                  className="reset-sort-btn"
                  onClick={() => onSortChange('none')}
                  title="Reset to default order"
                >
                  ↺ Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter Tags */}
        <div className="results-summary">
          <p className="summary-text">
            Showing <strong>{students.length}</strong> of <strong>{totalCount}</strong> students
            {sortOrder === 'cgpa-desc' && <span className="active-tag"> • Sorted by CGPA (Highest First)</span>}
            {sortOrder === 'cgpa-asc' && <span className="active-tag"> • Sorted by CGPA (Lowest First)</span>}
            {selectedDepartment !== 'All' && <span className="active-tag"> • Department: {selectedDepartment}</span>}
          </p>
        </div>

        {/* Student Cards Grid */}
        {students.length > 0 ? (
          <div className="student-grid">
            {students.map((student, index) => (
              <StudentCard
                key={student.id}
                name={student.name}
                rollNumber={student.rollNumber}
                department={student.department}
                semester={student.semester}
                cgpa={student.cgpa}
                photo={student.photo}
                email={student.email}
                rank={sortOrder !== 'none' ? index + 1 : null}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3>No Students Found</h3>
            <p>No student matches your current search criteria or department filter.</p>
            <button
              type="button"
              className="empty-reset-btn"
              onClick={() => {
                onSearchChange('');
                onDepartmentChange('All');
                onSortChange('none');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default StudentList;

