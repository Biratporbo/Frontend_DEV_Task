import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectMarkingDate,
  selectMarkingSubject,
  selectMarkingSemester,
  selectMarkingSection,
  setMarkingDate,
  setMarkingSubject,
  setMarkingSemester,
  setMarkingSection,
  showToast
} from '../../features/filters/filtersSlice';
import { selectAllSubjects } from '../../features/subjects/subjectsSlice';
import {
  selectStudentsForMarkingClass,
  selectExistingSessionRecords
} from '../../features/attendance/attendanceSelectors';
import {
  selectSessionDraft,
  selectAttendanceStatus,
  initSessionDraft,
  setStudentDraftStatus,
  setStudentDraftRemarks,
  markAllDraftStatus,
  saveAttendanceBatchAsync
} from '../../features/attendance/attendanceSlice';
import { formatDateDisplay } from '../../utils/dateUtils';
import {
  IconCheck,
  IconCalendar,
  IconBook,
  IconAlert
} from '../common/Icons';

export function AttendanceMarking() {
  const dispatch = useAppDispatch();

  // Class Selection Filters
  const date = useAppSelector(selectMarkingDate);
  const subjectCode = useAppSelector(selectMarkingSubject);
  const semester = useAppSelector(selectMarkingSemester);
  const section = useAppSelector(selectMarkingSection);

  const subjects = useAppSelector(selectAllSubjects);
  const classStudents = useAppSelector(selectStudentsForMarkingClass);
  const existingRecords = useAppSelector(selectExistingSessionRecords);
  const sessionDraft = useAppSelector(selectSessionDraft);
  const attendanceStatus = useAppSelector(selectAttendanceStatus);

  // Whenever the class selection changes, synchronize the draft
  useEffect(() => {
    dispatch(
      initSessionDraft({
        students: classStudents,
        existingRecords
      })
    );
  }, [date, subjectCode, semester, section, classStudents, existingRecords, dispatch]);

  const currentSubject = subjects.find((s) => s.code === subjectCode);
  const isUpdatingExisting = existingRecords.length > 0;

  // Compute live draft stats
  let draftPresent = 0;
  let draftAbsent = 0;
  let draftLate = 0;
  let draftPlaced = 0;
  let draftEngaged = 0;

  classStudents.forEach((student) => {
    const status = sessionDraft[student.id]?.status || 'P';
    if (status === 'P') draftPresent += 1;
    else if (status === 'A') draftAbsent += 1;
    else if (status === 'L') draftLate += 1;
    else if (status === 'PL') draftPlaced += 1;
    else if (status === 'E') draftEngaged += 1;
  });

  const handleSaveAttendance = async () => {
    if (classStudents.length === 0) {
      dispatch(showToast({ message: 'No registered students in this class to mark', type: 'error' }));
      return;
    }

    const entries = classStudents.map((student) => {
      const draft = sessionDraft[student.id] || { status: 'P', remarks: '' };
      return {
        studentId: student.id,
        studentName: student.name,
        status: draft.status || 'P',
        remarks: draft.remarks || ''
      };
    });

    const payload = {
      date,
      subjectCode,
      semester,
      section,
      entries
    };

    try {
      await dispatch(saveAttendanceBatchAsync(payload)).unwrap();
      dispatch(
        showToast({
          message: `Attendance saved for ${subjectCode} (${date}) - ${entries.length} students recorded`,
          type: 'success'
        })
      );
    } catch (err) {
      dispatch(showToast({ message: 'Error saving attendance session', type: 'error' }));
    }
  };

  return (
    <div className="tab-view-container">
      {/* Page Header */}
      <div className="section-toolbar">
        <div>
          <h2 className="tab-main-heading">Class Attendance Marking</h2>
          <p className="tab-main-desc">
            Select the session date, subject, and cohort to record daily student attendance.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleSaveAttendance}
          disabled={attendanceStatus === 'loading' || classStudents.length === 0}
        >
          {attendanceStatus === 'loading' ? (
            <>
              <div className="mini-spinner"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <IconCheck size={18} />
              <span>{isUpdatingExisting ? 'Update Attendance' : 'Save Attendance'}</span>
            </>
          )}
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="class-selector-card">
        <div className="selector-grid">
          {/* Date Picker */}
          <div className="selector-field">
            <label htmlFor="marking-date" className="selector-label">
              <IconCalendar size={15} />
              <span>Session Date</span>
            </label>
            <input
              id="marking-date"
              type="date"
              className="selector-input"
              value={date}
              onChange={(e) => dispatch(setMarkingDate(e.target.value))}
            />
          </div>

          {/* Subject Dropdown */}
          <div className="selector-field">
            <label htmlFor="marking-subject" className="selector-label">
              <IconBook size={15} />
              <span>Subject Curriculum</span>
            </label>
            <select
              id="marking-subject"
              className="selector-select"
              value={subjectCode}
              onChange={(e) => dispatch(setMarkingSubject(e.target.value))}
            >
              {subjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code} — {sub.name} (Sem {sub.semester})
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selector */}
          <div className="selector-field">
            <label htmlFor="marking-sem" className="selector-label">
              <span>Semester</span>
            </label>
            <select
              id="marking-sem"
              className="selector-select"
              value={semester}
              onChange={(e) => dispatch(setMarkingSemester(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Section Selector */}
          <div className="selector-field">
            <label htmlFor="marking-sec" className="selector-label">
              <span>Section</span>
            </label>
            <select
              id="marking-sec"
              className="selector-select"
              value={section}
              onChange={(e) => dispatch(setMarkingSection(e.target.value))}
            >
              {['A', 'B', 'C'].map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Class Meta Callout */}
        <div className="class-meta-banner">
          <div className="class-meta-info">
            <span className="meta-badge-subject">{subjectCode}</span>
            <span className="meta-subject-name">{currentSubject?.name || 'Class Session'}</span>
            <span className="meta-divider">&bull;</span>
            <span className="meta-detail">Faculty: {currentSubject?.faculty || 'Dept Faculty'}</span>
            <span className="meta-divider">&bull;</span>
            <span className="meta-detail">Date: {formatDateDisplay(date)}</span>
          </div>

          {isUpdatingExisting ? (
            <div className="existing-records-pill pill-warning">
              <IconAlert size={14} />
              <span>Existing records found &bull; Update mode active</span>
            </div>
          ) : (
            <div className="existing-records-pill pill-new">
              <IconCheck size={14} />
              <span>New Session &bull; Ready to mark</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Pills & Live Session Stats */}
      <div className="marking-toolbar-row">
        <div className="quick-action-btns">
          <span className="quick-label">Batch Actions:</span>
          <button
            type="button"
            className="quick-btn btn-mark-all-p"
            onClick={() => dispatch(markAllDraftStatus('P'))}
          >
            Mark All Present (P)
          </button>
          <button
            type="button"
            className="quick-btn btn-mark-all-a"
            onClick={() => dispatch(markAllDraftStatus('A'))}
          >
            Mark All Absent (A)
          </button>
        </div>

        {/* Live Counters */}
        <div className="session-stats-group">
          <div className="stat-pill pill-present" title="Present students">
            <span className="pill-dot"></span>
            <span>Present: <strong>{draftPresent}</strong></span>
          </div>
          <div className="stat-pill pill-absent" title="Absent students">
            <span className="pill-dot"></span>
            <span>Absent: <strong>{draftAbsent}</strong></span>
          </div>
          <div className="stat-pill pill-late" title="Late students">
            <span className="pill-dot"></span>
            <span>Late: <strong>{draftLate}</strong></span>
          </div>
          <div className="stat-pill pill-placed" title="Internship Placed">
            <span className="pill-dot"></span>
            <span>Placed: <strong>{draftPlaced}</strong></span>
          </div>
          <div className="stat-pill pill-engaged" title="Official Engagement">
            <span className="pill-dot"></span>
            <span>Official: <strong>{draftEngaged}</strong></span>
          </div>
          <div className="stat-pill pill-total">
            <span>Total: <strong>{classStudents.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Student Marking Table */}
      <div className="content-card">
        {classStudents.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-wrap">
              <IconAlert size={36} />
            </div>
            <h3 className="empty-title">No Students Registered for this Class</h3>
            <p className="empty-desc">
              There are no student records matching <strong>Semester {semester} &bull; Section {section}</strong>. Please switch cohorts or enroll students in this section via the Student Records tab.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="portal-table marking-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Student</th>
                  <th>Roll / ID</th>
                  <th>Status Marking</th>
                  <th>Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student, idx) => {
                  const studentDraft = sessionDraft[student.id] || { status: 'P', remarks: '' };
                  const currentStatus = studentDraft.status;

                  return (
                    <tr key={student.id} className={`marking-row ${currentStatus === 'A' ? 'row-absent-highlight' : ''}`}>
                      <td className="index-cell">{idx + 1}</td>

                      <td>
                        <div className="student-cell-profile">
                          <div
                            className="student-avatar-sm"
                            style={{ backgroundColor: student.avatarBg || '#2563eb' }}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="student-name-bold">{student.name}</span>
                            <span className="student-email-sub">{student.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="id-code-badge">{student.rollNumber}</span>
                        <span className="text-muted block text-xs">{student.id}</span>
                      </td>

                      <td>
                        <div className="status-selector-button-group">
                          {/* P */}
                          <button
                            type="button"
                            className={`status-btn btn-p ${currentStatus === 'P' ? 'selected' : ''}`}
                            onClick={() =>
                              dispatch(setStudentDraftStatus({ studentId: student.id, status: 'P' }))
                            }
                            title="Present"
                          >
                            P
                          </button>

                          {/* A */}
                          <button
                            type="button"
                            className={`status-btn btn-a ${currentStatus === 'A' ? 'selected' : ''}`}
                            onClick={() =>
                              dispatch(setStudentDraftStatus({ studentId: student.id, status: 'A' }))
                            }
                            title="Absent"
                          >
                            A
                          </button>

                          {/* L */}
                          <button
                            type="button"
                            className={`status-btn btn-l ${currentStatus === 'L' ? 'selected' : ''}`}
                            onClick={() =>
                              dispatch(setStudentDraftStatus({ studentId: student.id, status: 'L' }))
                            }
                            title="Late (0.5 credit)"
                          >
                            L
                          </button>

                          {/* PL */}
                          <button
                            type="button"
                            className={`status-btn btn-pl ${currentStatus === 'PL' ? 'selected' : ''}`}
                            onClick={() =>
                              dispatch(setStudentDraftStatus({ studentId: student.id, status: 'PL' }))
                            }
                            title="Internship Placed (Excused)"
                          >
                            PL
                          </button>

                          {/* E */}
                          <button
                            type="button"
                            className={`status-btn btn-e ${currentStatus === 'E' ? 'selected' : ''}`}
                            onClick={() =>
                              dispatch(setStudentDraftStatus({ studentId: student.id, status: 'E' }))
                            }
                            title="Official Engagement (Event)"
                          >
                            E
                          </button>
                        </div>
                      </td>

                      <td>
                        <input
                          type="text"
                          className="remarks-input"
                          placeholder="e.g. Arrived late, Hackathon..."
                          value={studentDraft.remarks || ''}
                          onChange={(e) =>
                            dispatch(
                              setStudentDraftRemarks({
                                studentId: student.id,
                                remarks: e.target.value
                              })
                            )
                          }
                          />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Save Bar */}
        {classStudents.length > 0 && (
          <div className="card-bottom-action-bar">
            <span className="action-hint-text">
              {isUpdatingExisting
                ? 'Modifications will update existing records in the central Redux store without creating duplicates.'
                : 'Submitting will record centralized attendance for all listed students.'}
            </span>

            <button
              type="button"
              className="btn-primary"
              onClick={handleSaveAttendance}
              disabled={attendanceStatus === 'loading'}
            >
              <IconCheck size={18} />
              <span>{isUpdatingExisting ? 'Save Updated Attendance' : 'Submit Class Attendance'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceMarking;
