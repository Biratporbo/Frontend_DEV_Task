import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSelectedStudentId, setSelectedStudentId } from '../../features/students/studentsSlice';
import { selectStudentAttendanceSummaries } from '../../features/attendance/attendanceSelectors';
import { selectAllAttendanceRecords } from '../../features/attendance/attendanceSlice';
import { STATUS_LABELS } from '../../features/attendance/initialAttendance';
import { formatDateDisplay } from '../../utils/dateUtils';
import { IconClose, IconAlert } from '../common/Icons';

export function StudentDetailModal() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(selectSelectedStudentId);
  const studentSummaries = useAppSelector(selectStudentAttendanceSummaries);
  const allRecords = useAppSelector(selectAllAttendanceRecords);

  if (!selectedId) return null;

  const student = studentSummaries.find((s) => s.id === selectedId);
  if (!student) return null;

  const studentRecords = allRecords
    .filter((r) => r.studentId === student.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleClose = () => {
    dispatch(setSelectedStudentId(null));
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-box modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div
              className="student-avatar-lg"
              style={{ backgroundColor: student.avatarBg || '#2563eb' }}
            >
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="modal-title">{student.name}</h3>
              <p className="modal-subtitle">
                Roll: {student.rollNumber} &bull; ID: {student.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="student-profile-body">
          {/* Metadata Cards */}
          <div className="profile-info-grid">
            <div className="info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{student.department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Class</span>
              <span className="info-value">Semester {student.semester} &bull; Section {student.section}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value email-value">{student.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{student.phone || 'N/A'}</span>
            </div>
          </div>

          {/* Attendance KPI Summary */}
          <div className="attendance-kpi-card">
            <div className="kpi-score-col">
              <div className="kpi-rate-number" style={{ color: student.isLowAttendance ? '#dc2626' : '#16a34a' }}>
                {student.percentage}%
              </div>
              <div className="kpi-rate-title">Overall Attendance</div>
              {student.isLowAttendance && (
                <div className="low-att-badge">
                  <IconAlert size={14} />
                  <span>Below {student.threshold}% Threshold</span>
                </div>
              )}
            </div>

            <div className="kpi-breakdown-col">
              <div className="breakdown-stat">
                <span className="stat-label">Total Classes</span>
                <span className="stat-value">{student.totalClasses}</span>
              </div>
              <div className="breakdown-stat">
                <span className="stat-label">Present (P)</span>
                <span className="stat-value text-green">{student.presentCount}</span>
              </div>
              <div className="breakdown-stat">
                <span className="stat-label">Absent (A)</span>
                <span className="stat-value text-red">{student.absentCount}</span>
              </div>
              <div className="breakdown-stat">
                <span className="stat-label">Late (L)</span>
                <span className="stat-value text-orange">{student.lateCount}</span>
              </div>
              <div className="breakdown-stat">
                <span className="stat-label">Placed (PL)</span>
                <span className="stat-value text-purple">{student.placedCount}</span>
              </div>
              <div className="breakdown-stat">
                <span className="stat-label">Official (E)</span>
                <span className="stat-value text-blue">{student.engagedCount}</span>
              </div>
            </div>
          </div>

          {/* Past Attendance Records Table */}
          <div className="student-history-section">
            <h4 className="section-heading">Class Attendance History ({studentRecords.length} sessions)</h4>
            {studentRecords.length === 0 ? (
              <p className="no-history-text">No attendance records logged yet for this student.</p>
            ) : (
              <div className="table-responsive">
                <table className="portal-table history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentRecords.map((r) => {
                      const badge = STATUS_LABELS[r.status] || STATUS_LABELS.P;
                      return (
                        <tr key={r.id}>
                          <td>{formatDateDisplay(r.date)}</td>
                          <td><strong>{r.subjectCode}</strong></td>
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

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModal;
