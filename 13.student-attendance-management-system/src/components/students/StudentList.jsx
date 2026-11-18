import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  openAddModal,
  openEditModal,
  openDeleteModal,
  setSelectedStudentId
} from '../../features/students/studentsSlice';
import {
  selectStudentSearch,
  selectStudentDepartment,
  selectStudentSemester,
  selectStudentSection,
  setStudentSearch,
  setStudentDepartment,
  setStudentSemester,
  setStudentSection,
  resetStudentFilters
} from '../../features/filters/filtersSlice';
import {
  selectFilteredStudents,
  selectStudentAttendanceSummaries
} from '../../features/attendance/attendanceSelectors';
import { DEPARTMENTS, SEMESTERS, SECTIONS } from '../../features/students/initialStudents';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUser,
  IconAlert,
  IconRefresh
} from '../common/Icons';

export function StudentList() {
  const dispatch = useAppDispatch();
  const filteredStudents = useAppSelector(selectFilteredStudents);
  const studentSummaries = useAppSelector(selectStudentAttendanceSummaries);

  const search = useAppSelector(selectStudentSearch);
  const department = useAppSelector(selectStudentDepartment);
  const semester = useAppSelector(selectStudentSemester);
  const section = useAppSelector(selectStudentSection);

  // Quick lookup map for calculated attendance percentages
  const summaryMap = {};
  studentSummaries.forEach((s) => {
    summaryMap[s.id] = s;
  });

  const hasActiveFilters =
    search.trim() !== '' ||
    department !== 'all' ||
    semester !== 'all' ||
    section !== 'all';

  return (
    <div className="tab-view-container">
      {/* Top Header & Actions Toolbar */}
      <div className="section-toolbar">
        <div>
          <h2 className="tab-main-heading">Student Directory</h2>
          <p className="tab-main-desc">
            Manage enrolled students, academic departments, semester cohorts, and class sections.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => dispatch(openAddModal())}
        >
          <IconPlus size={18} />
          <span>Enroll Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-card">
        <div className="search-input-wrap">
          <IconSearch size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => dispatch(setStudentSearch(e.target.value))}
            placeholder="Search by student name, roll number, ID, or email..."
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => dispatch(setStudentSearch(''))}
            >
              &times;
            </button>
          )}
        </div>

        <div className="filter-selects-row">
          <div className="filter-item">
            <label htmlFor="dept-filter" className="filter-label">Department:</label>
            <select
              id="dept-filter"
              className="filter-select"
              value={department}
              onChange={(e) => dispatch(setStudentDepartment(e.target.value))}
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="sem-filter" className="filter-label">Semester:</label>
            <select
              id="sem-filter"
              className="filter-select"
              value={semester}
              onChange={(e) => dispatch(setStudentSemester(e.target.value))}
            >
              <option value="all">All Semesters</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="sec-filter" className="filter-label">Section:</label>
            <select
              id="sec-filter"
              className="filter-select"
              value={section}
              onChange={(e) => dispatch(setStudentSection(e.target.value))}
            >
              <option value="all">All Sections</option>
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-outline btn-reset"
              onClick={() => dispatch(resetStudentFilters())}
              title="Reset all search filters"
            >
              <IconRefresh size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Roster Table Card */}
      <div className="content-card">
        <div className="card-header-row">
          <span className="results-badge">
            Showing <strong>{filteredStudents.length}</strong> {filteredStudents.length === 1 ? 'student' : 'students'}
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-wrap">
              <IconUser size={36} />
            </div>
            <h3 className="empty-title">No Students Found</h3>
            <p className="empty-desc">
              No student records matched your search query or filter criteria. Try adjusting your filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => dispatch(resetStudentFilters())}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Department</th>
                  <th>Class</th>
                  <th>Email</th>
                  <th>Attendance</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const summary = summaryMap[student.id];
                  const hasStats = summary && summary.totalClasses > 0;

                  return (
                    <tr key={student.id} className={summary?.isLowAttendance ? 'row-alert' : ''}>
                      <td>
                        <div
                          className="student-cell-profile"
                          onClick={() => dispatch(setSelectedStudentId(student.id))}
                          role="button"
                          tabIndex={0}
                        >
                          <div
                            className="student-avatar-sm"
                            style={{ backgroundColor: student.avatarBg || '#2563eb' }}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="student-name-link">{student.name}</span>
                            <span className="student-roll-sub">Roll: {student.rollNumber}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="id-code-badge">{student.id}</span>
                      </td>

                      <td className="dept-cell">{student.department}</td>

                      <td>
                        <span className="class-pill">
                          Sem {student.semester} &bull; Sec {student.section}
                        </span>
                      </td>

                      <td className="email-cell">{student.email}</td>

                      <td>
                        {hasStats ? (
                          <div className="rate-indicator-group">
                            <span
                              className={`percentage-chip ${
                                summary.isLowAttendance ? 'chip-danger' : 'chip-success'
                              }`}
                            >
                              {summary.percentage}%
                            </span>
                            {summary.isLowAttendance && (
                              <span className="low-flag-icon" title={`Below threshold (< ${summary.threshold}%)`}>
                                <IconAlert size={14} />
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">No classes yet</span>
                        )}
                      </td>

                      <td>
                        <div className="actions-cell-right">
                          <button
                            type="button"
                            className="action-icon-btn action-view"
                            onClick={() => dispatch(setSelectedStudentId(student.id))}
                            title="View student profile & attendance history"
                          >
                            <IconUser size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            onClick={() => dispatch(openEditModal(student))}
                            title="Edit student record"
                          >
                            <IconEdit size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-icon-btn action-delete"
                            onClick={() => dispatch(openDeleteModal(student))}
                            title="Delete student record"
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentList;
