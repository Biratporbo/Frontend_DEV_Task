import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectReportType,
  selectReportSubject,
  selectReportSemester,
  selectReportSection,
  selectReportStudentId,
  selectReportStartDate,
  selectReportEndDate,
  setReportType,
  setReportSubject,
  setReportSemester,
  setReportSection,
  setReportStudentId,
  setStartDate,
  setEndDate,
  resetReportFilters
} from '../../features/filters/filtersSlice';
import {
  selectFilteredReportRecords,
  selectSubjectAttendanceSummaries,
  selectOverallAttendanceMetrics,
  selectMonthlyAttendanceTrend
} from '../../features/attendance/attendanceSelectors';
import { selectAllStudents } from '../../features/students/studentsSlice';
import { selectAllSubjects } from '../../features/subjects/subjectsSlice';
import { exportAttendanceReportToCSV } from '../../utils/csvExporter';
import { formatDateDisplay } from '../../utils/dateUtils';
import { STATUS_LABELS } from '../../features/attendance/initialAttendance';
import AttendanceCharts from './AttendanceCharts';
import {
  IconDownload,
  IconFilter,
  IconRefresh
} from '../common/Icons';

export function AttendanceReports() {
  const dispatch = useAppDispatch();
  const reportType = useAppSelector(selectReportType);
  const reportSubject = useAppSelector(selectReportSubject);
  const reportSemester = useAppSelector(selectReportSemester);
  const reportSection = useAppSelector(selectReportSection);
  const reportStudentId = useAppSelector(selectReportStudentId);
  const startDate = useAppSelector(selectReportStartDate);
  const endDate = useAppSelector(selectReportEndDate);

  const filters = {
    type: reportType,
    subject: reportSubject,
    semester: reportSemester,
    section: reportSection,
    studentId: reportStudentId,
    startDate,
    endDate
  };
  const filteredRecords = useAppSelector(selectFilteredReportRecords);
  const subjectSummaries = useAppSelector(selectSubjectAttendanceSummaries);
  const overall = useAppSelector(selectOverallAttendanceMetrics);
  const monthlyTrend = useAppSelector(selectMonthlyAttendanceTrend);
  const students = useAppSelector(selectAllStudents);
  const subjects = useAppSelector(selectAllSubjects);

  const handleExportCSV = () => {
    const filename = `attendance_report_${filters.type}_${filters.startDate}_to_${filters.endDate}.csv`;
    exportAttendanceReportToCSV(filteredRecords, filename);
  };

  return (
    <div className="tab-view-container">
      {/* Page Header */}
      <div className="section-toolbar">
        <div>
          <h2 className="tab-main-heading">Attendance Reports & Exports</h2>
          <p className="tab-main-desc">
            Generate customized daily and monthly attendance audit reports, view distribution analytics, and export to CSV.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleExportCSV}
          disabled={filteredRecords.length === 0}
        >
          <IconDownload size={18} />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filters Toolbar Card */}
      <div className="filter-card">
        {/* Report Mode Switcher (Daily vs Monthly) */}
        <div className="report-mode-toggle-group">
          <button
            type="button"
            className={`mode-toggle-btn ${filters.type === 'daily' ? 'active' : ''}`}
            onClick={() => dispatch(setReportType('daily'))}
          >
            Daily Session Log
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${filters.type === 'monthly' ? 'active' : ''}`}
            onClick={() => dispatch(setReportType('monthly'))}
          >
            Monthly Aggregate View
          </button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="report-filters-grid">
          {/* Subject Filter */}
          <div className="filter-item">
            <label htmlFor="report-subject" className="filter-label">Subject:</label>
            <select
              id="report-subject"
              className="filter-select"
              value={filters.subject}
              onChange={(e) => dispatch(setReportSubject(e.target.value))}
            >
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.code} value={sub.code}>{sub.code} — {sub.name}</option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div className="filter-item">
            <label htmlFor="report-sem" className="filter-label">Semester:</label>
            <select
              id="report-sem"
              className="filter-select"
              value={filters.semester}
              onChange={(e) => dispatch(setReportSemester(e.target.value))}
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="filter-item">
            <label htmlFor="report-sec" className="filter-label">Section:</label>
            <select
              id="report-sec"
              className="filter-select"
              value={filters.section}
              onChange={(e) => dispatch(setReportSection(e.target.value))}
            >
              <option value="all">All Sections</option>
              {['A', 'B', 'C'].map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Student Filter */}
          <div className="filter-item">
            <label htmlFor="report-student" className="filter-label">Student:</label>
            <select
              id="report-student"
              className="filter-select"
              value={filters.studentId}
              onChange={(e) => dispatch(setReportStudentId(e.target.value))}
            >
              <option value="all">All Students</option>
              {students.map((stu) => (
                <option key={stu.id} value={stu.id}>{stu.name} ({stu.rollNumber})</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="filter-item">
            <label htmlFor="report-start-date" className="filter-label">From Date:</label>
            <input
              id="report-start-date"
              type="date"
              className="filter-input-date"
              value={filters.startDate}
              onChange={(e) => dispatch(setStartDate(e.target.value))}
            />
          </div>

          {/* End Date */}
          <div className="filter-item">
            <label htmlFor="report-end-date" className="filter-label">To Date:</label>
            <input
              id="report-end-date"
              type="date"
              className="filter-input-date"
              value={filters.endDate}
              onChange={(e) => dispatch(setEndDate(e.target.value))}
            />
          </div>

          <div className="filter-item filter-btn-col">
            <button
              type="button"
              className="btn-outline btn-reset"
              onClick={() => dispatch(resetReportFilters())}
              title="Reset all report filters"
            >
              <IconRefresh size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <AttendanceCharts subjectSummaries={subjectSummaries} overall={overall} />

      {/* Monthly Aggregate Table (when Monthly view is selected) */}
      {filters.type === 'monthly' && (
        <div className="content-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title-text">Monthly Attendance Summary</h3>
              <p className="card-subtitle-text">Aggregated attendance volume and percentage by calendar month.</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Marks</th>
                  <th>Present (P)</th>
                  <th>Absent (A)</th>
                  <th>Late (L)</th>
                  <th>Placed (PL)</th>
                  <th>Engaged (E)</th>
                  <th>Monthly Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrend.map((m) => (
                  <tr key={m.month}>
                    <td><strong>{m.label}</strong> ({m.month})</td>
                    <td>{m.total}</td>
                    <td><span className="text-green font-semibold">{m.present}</span></td>
                    <td><span className="text-red font-semibold">{m.absent}</span></td>
                    <td>{m.late}</td>
                    <td>{m.placed}</td>
                    <td>{m.engaged}</td>
                    <td>
                      <span className="percentage-chip chip-success font-bold">
                        {m.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filtered Attendance Records Table */}
      <div className="content-card">
        <div className="card-header-row">
          <div>
            <h3 className="card-title-text">Attendance Log Entries</h3>
            <p className="card-subtitle-text">
              Showing matching session marks according to active filter criteria.
            </p>
          </div>
          <span className="results-badge">
            Matching: <strong>{filteredRecords.length}</strong> records
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-wrap">
              <IconFilter size={36} />
            </div>
            <h3 className="empty-title">No Matching Records Found</h3>
            <p className="empty-desc">
              No attendance records matched the specified filters or date range. Please broaden your search criteria.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => dispatch(resetReportFilters())}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Cohort</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => {
                  const badge = STATUS_LABELS[r.status] || STATUS_LABELS.P;
                  return (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap font-medium">{formatDateDisplay(r.date)}</td>
                      <td>
                        <span className="subject-code-pill">{r.subjectCode}</span>
                      </td>
                      <td>
                        <span className="class-pill">Sem {r.semester} &bull; Sec {r.section}</span>
                      </td>
                      <td className="font-semibold text-slate-800">{r.studentName}</td>
                      <td><span className="id-code-badge">{r.studentId}</span></td>
                      <td>
                        <span
                          className="status-pill"
                          style={{
                            color: badge.color,
                            backgroundColor: badge.bg,
                            borderColor: badge.border
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="remarks-cell">{r.remarks || '—'}</td>
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

export default AttendanceReports;
