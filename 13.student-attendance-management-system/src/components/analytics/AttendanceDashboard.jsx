import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectOverallAttendanceMetrics,
  selectStudentAttendanceSummaries,
  selectLowAttendanceStudents,
  selectSubjectAttendanceSummaries
} from '../../features/attendance/attendanceSelectors';
import {
  selectAttendanceThreshold,
  setAttendanceThreshold
} from '../../features/filters/filtersSlice';
import { setSelectedStudentId as setOpenStudentDetailId } from '../../features/students/studentsSlice';
import { exportStudentSummariesToCSV } from '../../utils/csvExporter';
import {
  IconAlert,
  IconCheck,
  IconUser,
  IconBarChart,
  IconDownload
} from '../common/Icons';

export function AttendanceDashboard() {
  const dispatch = useAppDispatch();
  const overall = useAppSelector(selectOverallAttendanceMetrics);
  const studentSummaries = useAppSelector(selectStudentAttendanceSummaries);
  const lowAttendanceStudents = useAppSelector(selectLowAttendanceStudents);
  const subjectSummaries = useAppSelector(selectSubjectAttendanceSummaries);
  const threshold = useAppSelector(selectAttendanceThreshold);

  const handleThresholdChange = (e) => {
    dispatch(setAttendanceThreshold(e.target.value));
  };

  const handleExportSummaryCSV = () => {
    exportStudentSummariesToCSV(studentSummaries, threshold, `student_attendance_summary_${threshold}pct.csv`);
  };

  return (
    <div className="tab-view-container">
      {/* Top Header & Actions */}
      <div className="section-toolbar">
        <div>
          <h2 className="tab-main-heading">Attendance Analytics & Alerts</h2>
          <p className="tab-main-desc">
            Monitor real-time student attendance percentages, subject performance, and automated low-attendance warnings.
          </p>
        </div>

        <button
          type="button"
          className="btn-outline"
          onClick={handleExportSummaryCSV}
          title="Export student attendance percentages to CSV"
        >
          <IconDownload size={16} />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card card-primary">
          <div className="kpi-card-header">
            <span className="kpi-title">Average Attendance Rate</span>
            <span className="kpi-icon-pill">
              <IconBarChart size={18} />
            </span>
          </div>
          <div className="kpi-main-metric">{overall.overallPercentage}%</div>
          <p className="kpi-subtext">Across {overall.totalSessions} class sessions conducted</p>
        </div>

        <div className="kpi-card card-danger">
          <div className="kpi-card-header">
            <span className="kpi-title">Low Attendance Alerts</span>
            <span className="kpi-icon-pill icon-pill-alert">
              <IconAlert size={18} />
            </span>
          </div>
          <div className="kpi-main-metric text-red">{overall.lowAttendanceCount}</div>
          <p className="kpi-subtext">
            Students falling below configured <strong>{threshold}%</strong> threshold
          </p>
        </div>

        <div className="kpi-card card-info">
          <div className="kpi-card-header">
            <span className="kpi-title">Total Enrolled Students</span>
            <span className="kpi-icon-pill">
              <IconUser size={18} />
            </span>
          </div>
          <div className="kpi-main-metric">{overall.totalEnrolled}</div>
          <p className="kpi-subtext">Active student records across all departments</p>
        </div>

        <div className="kpi-card card-success">
          <div className="kpi-card-header">
            <span className="kpi-title">Total Marks Recorded</span>
            <span className="kpi-icon-pill">
              <IconCheck size={18} />
            </span>
          </div>
          <div className="kpi-main-metric">{overall.totalRecords}</div>
          <p className="kpi-subtext">
            {overall.breakdown.present} Present &bull; {overall.breakdown.absent} Absent &bull; {overall.breakdown.late} Late
          </p>
        </div>
      </div>

      {/* Threshold Configuration Callout Bar */}
      <div className="threshold-config-card">
        <div className="threshold-info-col">
          <div className="threshold-title-row">
            <IconAlert size={20} className="text-amber" />
            <h4 className="threshold-heading">Configurable Attendance Alert Threshold</h4>
          </div>
          <p className="threshold-description">
            Students whose calculated attendance rate falls strictly below this threshold are automatically flagged for academic counseling and semester detention notices.
          </p>
        </div>

        <div className="threshold-control-col">
          <label htmlFor="threshold-slider" className="threshold-slider-label">
            Threshold: <strong>{threshold}%</strong>
          </label>
          <div className="slider-wrapper">
            <input
              id="threshold-slider"
              type="range"
              min="10"
              max="90"
              step="5"
              value={threshold}
              onChange={handleThresholdChange}
              className="threshold-range-input"
            />
            <div className="slider-ticks">
              <span>25%</span>
              <span className="tick-default">45% (Default)</span>
              <span>75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Attendance Alert Section */}
      {lowAttendanceStudents.length > 0 && (
        <div className="content-card card-danger-border">
          <div className="card-header-row alert-header-row">
            <div className="alert-header-title">
              <IconAlert size={20} className="text-red" />
              <h3>Critical: Students Below {threshold}% Attendance ({lowAttendanceStudents.length})</h3>
            </div>
            <span className="badge-danger-pill">Immediate Action Required</span>
          </div>

          <p className="alert-section-desc">
            The following students do not meet the minimum mandatory attendance criterion of <strong>{threshold}%</strong>.
          </p>

          <div className="low-students-grid">
            {lowAttendanceStudents.map((student) => (
              <div
                key={student.id}
                className="low-student-card"
                onClick={() => dispatch(setOpenStudentDetailId(student.id))}
                role="button"
                tabIndex={0}
              >
                <div className="low-card-top">
                  <div
                    className="student-avatar-sm"
                    style={{ backgroundColor: student.avatarBg || '#dc2626' }}
                  >
                    {student.name.charAt(0)}
                  </div>
                  <div className="low-card-name-group">
                    <span className="low-student-name">{student.name}</span>
                    <span className="low-student-meta">Roll: {student.rollNumber} &bull; {student.department}</span>
                  </div>
                  <div className="low-score-badge">
                    {student.percentage}%
                  </div>
                </div>

                <div className="low-card-stats-row">
                  <span>Classes: {student.totalClasses}</span>
                  <span className="text-green">P: {student.presentCount}</span>
                  <span className="text-red">A: {student.absentCount}</span>
                  <span>Deficit: {Math.max(0, Math.ceil((threshold * student.totalClasses) / 100 - student.effectiveAttended))} classes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject-Wise Performance Summary */}
      <div className="content-card">
        <div className="card-header-row">
          <h3 className="card-title-text">Subject-Wise Attendance Summary</h3>
          <span className="text-muted text-sm">{subjectSummaries.length} Subjects</span>
        </div>

        <div className="subjects-cards-grid">
          {subjectSummaries.map((sub) => {
            const hasSessions = sub.totalSessions > 0;
            return (
              <div key={sub.code} className="subject-summary-item">
                <div className="subject-item-header">
                  <span className="subject-code-pill">{sub.code}</span>
                  <span
                    className={`subject-rate-badge ${
                      hasSessions && sub.attendanceRate < threshold ? 'rate-low' : 'rate-good'
                    }`}
                  >
                    {hasSessions ? `${sub.attendanceRate}%` : 'N/A'}
                  </span>
                </div>
                <h4 className="subject-item-name">{sub.name}</h4>
                <p className="subject-item-faculty">Faculty: {sub.faculty}</p>
                <div className="subject-item-metrics">
                  <span>Sessions: <strong>{sub.totalSessions}</strong></span>
                  <span>Marks: <strong>{sub.totalRecords}</strong></span>
                  <span className="text-green">P: <strong>{sub.present}</strong></span>
                  <span className="text-red">A: <strong>{sub.absent}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Students Attendance Percentage Table */}
      <div className="content-card">
        <div className="card-header-row">
          <div>
            <h3 className="card-title-text">Individual Student Attendance Summary</h3>
            <p className="card-subtitle-text">
              Derived calculations taking into account Present (P), Placed (PL), Engaged (E), and Late (L) credits.
            </p>
          </div>
          <span className="results-badge">Total Students: {studentSummaries.length}</span>
        </div>

        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll / ID</th>
                <th>Class</th>
                <th>Total Classes</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late / Placed / Engaged</th>
                <th>Attendance Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentSummaries.map((s) => (
                <tr
                  key={s.id}
                  className={s.isLowAttendance ? 'row-alert' : ''}
                  onClick={() => dispatch(setOpenStudentDetailId(s.id))}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="student-cell-profile">
                      <div
                        className="student-avatar-sm"
                        style={{ backgroundColor: s.avatarBg || '#2563eb' }}
                      >
                        {s.name.charAt(0)}
                      </div>
                      <span className="student-name-bold">{s.name}</span>
                    </div>
                  </td>

                  <td>
                    <span className="id-code-badge">{s.rollNumber}</span>
                    <span className="text-muted block text-xs">{s.id}</span>
                  </td>

                  <td>
                    <span className="class-pill">Sem {s.semester} &bull; Sec {s.section}</span>
                  </td>

                  <td><strong>{s.totalClasses}</strong></td>

                  <td><span className="text-green font-semibold">{s.presentCount}</span></td>

                  <td><span className="text-red font-semibold">{s.absentCount}</span></td>

                  <td>
                    <span className="stat-multi-chip">
                      L: {s.lateCount} &bull; PL: {s.placedCount} &bull; E: {s.engagedCount}
                    </span>
                  </td>

                  <td>
                    <div className="rate-bar-container">
                      <div
                        className={`rate-progress-fill ${
                          s.isLowAttendance ? 'fill-danger' : 'fill-success'
                        }`}
                        style={{ width: `${Math.min(100, s.percentage)}%` }}
                      ></div>
                      <span className="rate-bar-label font-bold">{s.percentage}%</span>
                    </div>
                  </td>

                  <td>
                    {s.isLowAttendance ? (
                      <span className="status-pill status-pill-alert" title={`Below ${threshold}% threshold`}>
                        <IconAlert size={12} />
                        Low Attendance
                      </span>
                    ) : (
                      <span className="status-pill status-pill-normal">
                        <IconCheck size={12} />
                        Satisfactory
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceDashboard;
