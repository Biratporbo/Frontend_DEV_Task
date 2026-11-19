/**
 * Custom Redux Middleware: Attendance & Student Management Audit Tracker
 * Records compliance audit logs for academic recordkeeping in localStorage.
 */
const AUDIT_STORAGE_KEY = 'edutrack_audit_log_v1';

function appendAuditEntry(entry) {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    });
    // Keep last 50 audit entries
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (err) {
    console.warn('Failed to record audit event:', err);
  }
}

export const auditMiddleware = () => (next) => (action) => {
  const result = next(action);

  if (action.type === 'attendance/saveAttendanceBatchAsync/fulfilled') {
    appendAuditEntry({
      type: 'ATTENDANCE_BATCH_SAVED',
      description: `Saved attendance for ${action.payload.subjectCode} (${action.payload.date}) - Sem ${action.payload.semester} Sec ${action.payload.section} (${action.payload.entries.length} students)`,
      payload: action.payload
    });
  } else if (action.type === 'attendance/commitAttendanceSession') {
    appendAuditEntry({
      type: 'ATTENDANCE_SESSION_COMMITTED',
      description: `Committed attendance for ${action.payload.subjectCode} (${action.payload.date})`,
      payload: action.payload
    });
  } else if (action.type === 'students/addStudent') {
    appendAuditEntry({
      type: 'STUDENT_ENROLLED',
      description: `Enrolled student: ${action.payload.name} (${action.payload.rollNumber})`,
      payload: action.payload
    });
  } else if (action.type === 'students/deleteStudent') {
    appendAuditEntry({
      type: 'STUDENT_EXPELLED_OR_REMOVED',
      description: `Removed student ID: ${action.payload}`,
      payload: action.payload
    });
  } else if (action.type === 'filters/setAttendanceThreshold') {
    appendAuditEntry({
      type: 'THRESHOLD_UPDATED',
      description: `Configured low attendance alert threshold to ${action.payload}%`,
      payload: action.payload
    });
  }

  return result;
};

export default auditMiddleware;
