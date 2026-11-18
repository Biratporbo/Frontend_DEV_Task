import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_ATTENDANCE_RECORDS, generateAttendanceKey } from './initialAttendance';

const ATTENDANCE_STORAGE_KEY = 'edutrack_attendance_v1';

function loadStoredAttendance() {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load attendance from localStorage, using initial dataset:', err);
  }
  return INITIAL_ATTENDANCE_RECORDS;
}

function persistAttendance(records) {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Failed to persist attendance to localStorage:', err);
  }
}

/**
 * Async thunk: Simulates asynchronous API batch submission of attendance
 */
export const saveAttendanceBatchAsync = createAsyncThunk(
  'attendance/saveAttendanceBatchAsync',
  async (sessionPayload, { rejectWithValue }) => {
    try {
      // Simulate network latency (400ms)
      await new Promise((resolve) => setTimeout(resolve, 400));
      return sessionPayload;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save attendance session');
    }
  }
);

const initialState = {
  records: loadStoredAttendance(),
  // Draft entries for currently open marking session: { [studentId]: { status: 'P', remarks: '' } }
  sessionDraft: {},
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastSavedSessionInfo: null
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    /**
     * Initializes draft for the current class session from existing records or defaults
     */
    initSessionDraft: (state, action) => {
      const { students, existingRecords } = action.payload;
      const draft = {};

      students.forEach((student) => {
        const existing = existingRecords.find((r) => r.studentId === student.id);
        draft[student.id] = {
          status: existing ? existing.status : 'P', // Default to Present for streamlined attendance
          remarks: existing ? existing.remarks || '' : '',
          isExisting: Boolean(existing)
        };
      });

      state.sessionDraft = draft;
    },

    /**
     * Updates an individual student's status in the current draft session
     */
    setStudentDraftStatus: (state, action) => {
      const { studentId, status } = action.payload;
      if (!state.sessionDraft[studentId]) {
        state.sessionDraft[studentId] = { status, remarks: '' };
      } else {
        state.sessionDraft[studentId].status = status;
      }
    },

    /**
     * Updates optional remarks for a student
     */
    setStudentDraftRemarks: (state, action) => {
      const { studentId, remarks } = action.payload;
      if (state.sessionDraft[studentId]) {
        state.sessionDraft[studentId].remarks = remarks;
      }
    },

    /**
     * Bulk updates all students in current session to a given status (e.g., 'P', 'A')
     */
    markAllDraftStatus: (state, action) => {
      const targetStatus = action.payload;
      Object.keys(state.sessionDraft).forEach((studentId) => {
        state.sessionDraft[studentId].status = targetStatus;
      });
    },

    /**
     * Directly marks or updates an individual attendance entry centrally
     */
    markIndividualAttendance: (state, action) => {
      const record = action.payload;
      const key = generateAttendanceKey(record.date, record.subjectCode, record.studentId);
      const existingIndex = state.records.findIndex((r) => r.id === key);

      const entry = {
        ...record,
        id: key,
        markedAt: new Date().toISOString()
      };

      if (existingIndex !== -1) {
        state.records[existingIndex] = entry;
      } else {
        state.records.push(entry);
      }
      persistAttendance(state.records);
    },

    /**
     * Synchronously commits session draft records into main attendance store
     * Prevents duplicate entries by updating in-place matching (date, subject, studentId)
     */
    commitAttendanceSession: (state, action) => {
      const { date, subjectCode, semester, section, entries } = action.payload;

      entries.forEach(({ studentId, studentName, status, remarks }) => {
        const key = generateAttendanceKey(date, subjectCode, studentId);
        const existingIndex = state.records.findIndex((r) => r.id === key);

        const newRecord = {
          id: key,
          date,
          subjectCode,
          semester,
          section,
          studentId,
          studentName,
          status,
          remarks: remarks || '',
          markedAt: new Date().toISOString()
        };

        if (existingIndex !== -1) {
          state.records[existingIndex] = newRecord;
        } else {
          state.records.push(newRecord);
        }
      });

      persistAttendance(state.records);
      state.lastSavedSessionInfo = {
        date,
        subjectCode,
        semester,
        section,
        count: entries.length,
        timestamp: new Date().toLocaleTimeString()
      };
    },

    /**
     * Deletes an attendance record
     */
    deleteAttendanceRecord: (state, action) => {
      state.records = state.records.filter((r) => r.id !== action.payload);
      persistAttendance(state.records);
    },

    /**
     * Removes all attendance records associated with a deleted student
     */
    purgeStudentAttendance: (state, action) => {
      state.records = state.records.filter((r) => r.studentId !== action.payload);
      persistAttendance(state.records);
    },

    resetAttendanceToDefault: (state) => {
      state.records = INITIAL_ATTENDANCE_RECORDS;
      state.sessionDraft = {};
      persistAttendance(INITIAL_ATTENDANCE_RECORDS);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveAttendanceBatchAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(saveAttendanceBatchAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        const { date, subjectCode, semester, section, entries } = action.payload;

        entries.forEach(({ studentId, studentName, status, remarks }) => {
          const key = generateAttendanceKey(date, subjectCode, studentId);
          const existingIndex = state.records.findIndex((r) => r.id === key);

          const newRecord = {
            id: key,
            date,
            subjectCode,
            semester,
            section,
            studentId,
            studentName,
            status,
            remarks: remarks || '',
            markedAt: new Date().toISOString()
          };

          if (existingIndex !== -1) {
            state.records[existingIndex] = newRecord;
          } else {
            state.records.push(newRecord);
          }
        });

        persistAttendance(state.records);
        state.lastSavedSessionInfo = {
          date,
          subjectCode,
          semester,
          section,
          count: entries.length,
          timestamp: new Date().toLocaleTimeString()
        };
      })
      .addCase(saveAttendanceBatchAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to save attendance session';
      });
  }
});

export const {
  initSessionDraft,
  setStudentDraftStatus,
  setStudentDraftRemarks,
  markAllDraftStatus,
  markIndividualAttendance,
  commitAttendanceSession,
  deleteAttendanceRecord,
  purgeStudentAttendance,
  resetAttendanceToDefault
} = attendanceSlice.actions;

export const selectAllAttendanceRecords = (state) => state.attendance.records;
export const selectSessionDraft = (state) => state.attendance.sessionDraft;
export const selectAttendanceStatus = (state) => state.attendance.status;
export const selectAttendanceError = (state) => state.attendance.error;
export const selectLastSavedSessionInfo = (state) => state.attendance.lastSavedSessionInfo;

export default attendanceSlice.reducer;
