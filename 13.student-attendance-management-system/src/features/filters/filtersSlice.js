import { createSlice } from '@reduxjs/toolkit';

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const THRESHOLD_STORAGE_KEY = 'edutrack_threshold_v1';

function loadStoredThreshold() {
  try {
    const raw = localStorage.getItem(THRESHOLD_STORAGE_KEY);
    if (raw) {
      const val = Number(raw);
      if (!isNaN(val) && val >= 10 && val <= 100) return val;
    }
  } catch (err) {}
  return 45; // Default 45% threshold as highlighted in problem statement
}

const initialState = {
  activeTab: 'marking', // 'marking' | 'students' | 'analytics' | 'reports'

  // Student Directory Filters
  studentSearch: '',
  studentDepartment: 'all',
  studentSemester: 'all',
  studentSection: 'all',

  // Attendance Marking Class Selector
  markingDate: getTodayDateString(),
  markingSubject: 'CS401',
  markingSemester: 4,
  markingSection: 'A',

  // Configurable Attendance Threshold (e.g. 45%)
  attendanceThreshold: loadStoredThreshold(),

  // Reports Filters
  reportType: 'daily', // 'daily' | 'monthly'
  reportSubject: 'all',
  reportSemester: 'all',
  reportSection: 'all',
  reportStudentId: 'all',
  startDate: '2026-11-01',
  endDate: getTodayDateString(),

  // Notification Toast
  toast: null
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    // Student Directory filters
    setStudentSearch: (state, action) => {
      state.studentSearch = action.payload;
    },
    setStudentDepartment: (state, action) => {
      state.studentDepartment = action.payload;
    },
    setStudentSemester: (state, action) => {
      state.studentSemester = action.payload;
    },
    setStudentSection: (state, action) => {
      state.studentSection = action.payload;
    },
    resetStudentFilters: (state) => {
      state.studentSearch = '';
      state.studentDepartment = 'all';
      state.studentSemester = 'all';
      state.studentSection = 'all';
    },

    // Attendance Marking selectors
    setMarkingDate: (state, action) => {
      state.markingDate = action.payload;
    },
    setMarkingSubject: (state, action) => {
      state.markingSubject = action.payload;
    },
    setMarkingSemester: (state, action) => {
      state.markingSemester = Number(action.payload);
    },
    setMarkingSection: (state, action) => {
      state.markingSection = action.payload;
    },

    // Configurable Attendance Threshold
    setAttendanceThreshold: (state, action) => {
      const val = Number(action.payload);
      state.attendanceThreshold = Math.max(10, Math.min(100, val));
      try {
        localStorage.setItem(THRESHOLD_STORAGE_KEY, String(state.attendanceThreshold));
      } catch (e) {}
    },

    // Reports filters
    setReportType: (state, action) => {
      state.reportType = action.payload;
    },
    setReportSubject: (state, action) => {
      state.reportSubject = action.payload;
    },
    setReportSemester: (state, action) => {
      state.reportSemester = action.payload;
    },
    setReportSection: (state, action) => {
      state.reportSection = action.payload;
    },
    setReportStudentId: (state, action) => {
      state.reportStudentId = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    resetReportFilters: (state) => {
      state.reportType = 'daily';
      state.reportSubject = 'all';
      state.reportSemester = 'all';
      state.reportSection = 'all';
      state.reportStudentId = 'all';
      state.startDate = '2026-11-01';
      state.endDate = getTodayDateString();
    },

    // Toasts
    showToast: (state, action) => {
      state.toast = {
        id: Date.now(),
        message: action.payload.message || action.payload,
        type: action.payload.type || 'success'
      };
    },
    hideToast: (state) => {
      state.toast = null;
    }
  }
});

export const {
  setActiveTab,
  setStudentSearch,
  setStudentDepartment,
  setStudentSemester,
  setStudentSection,
  resetStudentFilters,
  setMarkingDate,
  setMarkingSubject,
  setMarkingSemester,
  setMarkingSection,
  setAttendanceThreshold,
  setReportType,
  setReportSubject,
  setReportSemester,
  setReportSection,
  setReportStudentId,
  setStartDate,
  setEndDate,
  resetReportFilters,
  showToast,
  hideToast
} = filtersSlice.actions;

export const selectActiveTab = (state) => state.filters.activeTab;
export const selectStudentSearch = (state) => state.filters.studentSearch;
export const selectStudentDepartment = (state) => state.filters.studentDepartment;
export const selectStudentSemester = (state) => state.filters.studentSemester;
export const selectStudentSection = (state) => state.filters.studentSection;

export const selectMarkingDate = (state) => state.filters.markingDate;
export const selectMarkingSubject = (state) => state.filters.markingSubject;
export const selectMarkingSemester = (state) => state.filters.markingSemester;
export const selectMarkingSection = (state) => state.filters.markingSection;

export const selectAttendanceThreshold = (state) => state.filters.attendanceThreshold;

export const selectReportType = (state) => state.filters.reportType;
export const selectReportSubject = (state) => state.filters.reportSubject;
export const selectReportSemester = (state) => state.filters.reportSemester;
export const selectReportSection = (state) => state.filters.reportSection;
export const selectReportStudentId = (state) => state.filters.reportStudentId;
export const selectReportStartDate = (state) => state.filters.startDate;
export const selectReportEndDate = (state) => state.filters.endDate;

export const selectToast = (state) => state.filters.toast;

export default filtersSlice.reducer;
