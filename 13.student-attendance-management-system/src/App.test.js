import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './App';
import studentsReducer, {
  addStudent,
  updateStudent,
  deleteStudent
} from './features/students/studentsSlice';
import attendanceReducer, {
  setStudentDraftStatus,
  markAllDraftStatus,
  commitAttendanceSession,
  saveAttendanceBatchAsync
} from './features/attendance/attendanceSlice';
import subjectsReducer from './features/subjects/subjectsSlice';
import filtersReducer, {
  setActiveTab,
  setAttendanceThreshold,
  setStudentSearch
} from './features/filters/filtersSlice';

import {
  selectStudentAttendanceSummaries,
  selectLowAttendanceStudents,
  selectOverallAttendanceMetrics,
  selectSubjectAttendanceSummaries,
  selectFilteredReportRecords
} from './features/attendance/attendanceSelectors';

describe('Redux Reducers & State Management', () => {
  test('studentsSlice handles addStudent, updateStudent, and deleteStudent', () => {
    const initialState = {
      list: [
        { id: 'STU-001', name: 'Aarav Sharma', rollNumber: 'CS-01', department: 'CS', semester: 4, section: 'A' }
      ],
      status: 'idle',
      error: null,
      isAddEditModalOpen: false,
      editingStudent: null,
      isDeleteModalOpen: false,
      studentToDelete: null,
      selectedStudentId: null
    };

    // 1. Add student
    const newStudent = { id: 'STU-002', name: 'Priya Patel', rollNumber: 'CS-02', department: 'CS', semester: 4, section: 'A' };
    let state = studentsReducer(initialState, addStudent(newStudent));
    expect(state.list.length).toBe(2);
    expect(state.list[0].id).toBe('STU-002');

    // 2. Update student
    state = studentsReducer(state, updateStudent({ id: 'STU-001', name: 'Aarav S. Sharma' }));
    const updated = state.list.find((s) => s.id === 'STU-001');
    expect(updated.name).toBe('Aarav S. Sharma');

    // 3. Delete student
    state = studentsReducer(state, deleteStudent('STU-002'));
    expect(state.list.length).toBe(1);
    expect(state.list.find((s) => s.id === 'STU-002')).toBeUndefined();
  });

  test('attendanceSlice handles session drafts and commits without duplicate records', () => {
    const initialState = {
      records: [
        {
          id: 'ATT_2026-11-16_CS401_STU-001',
          date: '2026-11-16',
          subjectCode: 'CS401',
          semester: 4,
          section: 'A',
          studentId: 'STU-001',
          studentName: 'Aarav',
          status: 'P'
        }
      ],
      sessionDraft: {
        'STU-001': { status: 'P', remarks: '' },
        'STU-002': { status: 'A', remarks: '' }
      },
      status: 'idle',
      error: null,
      lastSavedSessionInfo: null
    };

    // 1. Update draft status
    let state = attendanceReducer(
      initialState,
      setStudentDraftStatus({ studentId: 'STU-001', status: 'L' })
    );
    expect(state.sessionDraft['STU-001'].status).toBe('L');

    // 2. Mark all draft status
    state = attendanceReducer(state, markAllDraftStatus('P'));
    expect(state.sessionDraft['STU-001'].status).toBe('P');
    expect(state.sessionDraft['STU-002'].status).toBe('P');

    // 3. Commit session updating existing record in-place to prevent duplicates
    const commitPayload = {
      date: '2026-11-16',
      subjectCode: 'CS401',
      semester: 4,
      section: 'A',
      entries: [
        { studentId: 'STU-001', studentName: 'Aarav', status: 'A', remarks: 'Sick leave' },
        { studentId: 'STU-002', studentName: 'Priya', status: 'P', remarks: '' }
      ]
    };

    state = attendanceReducer(state, commitAttendanceSession(commitPayload));
    // Must contain exactly 2 records total, not 3 (STU-001 was updated in-place)
    expect(state.records.length).toBe(2);
    const stu1Record = state.records.find((r) => r.studentId === 'STU-001');
    expect(stu1Record.status).toBe('A');
    expect(stu1Record.remarks).toBe('Sick leave');
  });

  test('filtersSlice handles active tab, search, and configurable threshold updates', () => {
    const initialState = {
      activeTab: 'marking',
      studentSearch: '',
      attendanceThreshold: 45
    };

    let state = filtersReducer(initialState, setActiveTab('analytics'));
    expect(state.activeTab).toBe('analytics');

    state = filtersReducer(state, setAttendanceThreshold(75));
    expect(state.attendanceThreshold).toBe(75);

    state = filtersReducer(state, setStudentSearch('Aarav'));
    expect(state.studentSearch).toBe('Aarav');
  });
});

describe('Memoized Selectors & Attendance Calculations', () => {
  const mockState = {
    students: {
      list: [
        { id: 'STU-101', name: 'High Attendance Student', semester: 4, section: 'A' },
        { id: 'STU-102', name: 'Low Attendance Student', semester: 4, section: 'A' }
      ]
    },
    attendance: {
      records: [
        // STU-101: 4 classes: 3 P, 1 L (3 + 0.5 = 3.5 / 4 = 87.5%)
        { id: '1', date: '2026-11-01', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-101', status: 'P' },
        { id: '2', date: '2026-11-02', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-101', status: 'P' },
        { id: '3', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-101', status: 'P' },
        { id: '4', date: '2026-11-04', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-101', status: 'L' },

        // STU-102: 4 classes: 1 P, 3 A (1 / 4 = 25%)
        { id: '5', date: '2026-11-01', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-102', status: 'P' },
        { id: '6', date: '2026-11-02', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-102', status: 'A' },
        { id: '7', date: '2026-11-03', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-102', status: 'A' },
        { id: '8', date: '2026-11-04', subjectCode: 'CS401', semester: 4, section: 'A', studentId: 'STU-102', status: 'A' }
      ]
    },
    subjects: {
      list: [
        { code: 'CS401', name: 'Database Management Systems', semester: 4, faculty: 'Prof. Rao' }
      ]
    },
    filters: {
      attendanceThreshold: 45,
      studentSearch: '',
      studentDepartment: 'all',
      studentSemester: 'all',
      studentSection: 'all',
      reportType: 'daily',
      reportSubject: 'all',
      reportSemester: 'all',
      reportSection: 'all',
      reportStudentId: 'all',
      startDate: '2026-11-01',
      endDate: '2026-11-30'
    }
  };

  test('calculates individual attendance percentages accurately', () => {
    const summaries = selectStudentAttendanceSummaries(mockState);
    const stu101 = summaries.find((s) => s.id === 'STU-101');
    const stu102 = summaries.find((s) => s.id === 'STU-102');

    expect(stu101.totalClasses).toBe(4);
    expect(stu101.percentage).toBe(87.5);
    expect(stu101.isLowAttendance).toBe(false);

    expect(stu102.totalClasses).toBe(4);
    expect(stu102.percentage).toBe(25);
    expect(stu102.isLowAttendance).toBe(true);
  });

  test('identifies students falling strictly below configurable threshold (< 45%)', () => {
    const lowStudents = selectLowAttendanceStudents(mockState);
    expect(lowStudents.length).toBe(1);
    expect(lowStudents[0].id).toBe('STU-102');
    expect(lowStudents[0].percentage).toBeLessThan(45);
  });

  test('calculates overall attendance metrics and subject summaries', () => {
    const metrics = selectOverallAttendanceMetrics(mockState);
    expect(metrics.totalEnrolled).toBe(2);
    expect(metrics.totalRecords).toBe(8);
    expect(metrics.lowAttendanceCount).toBe(1);

    const subjects = selectSubjectAttendanceSummaries(mockState);
    expect(subjects.length).toBe(1);
    expect(subjects[0].code).toBe('CS401');
    expect(subjects[0].totalRecords).toBe(8);
  });

  test('filters report records by date and parameters', () => {
    const reports = selectFilteredReportRecords(mockState);
    expect(reports.length).toBe(8);
  });
});

describe('Asynchronous Operations', () => {
  test('saveAttendanceBatchAsync.fulfilled adds and updates records in state', () => {
    const initialState = {
      records: [],
      sessionDraft: {},
      status: 'loading',
      error: null,
      lastSavedSessionInfo: null
    };

    const payload = {
      date: '2026-11-16',
      subjectCode: 'CS401',
      semester: 4,
      section: 'A',
      entries: [
        { studentId: 'STU-1', studentName: 'Test Student', status: 'P', remarks: '' }
      ]
    };

    const nextState = attendanceReducer(
      initialState,
      saveAttendanceBatchAsync.fulfilled(payload, 'req-id', payload)
    );

    expect(nextState.status).toBe('succeeded');
    expect(nextState.records.length).toBe(1);
    expect(nextState.records[0].studentId).toBe('STU-1');
  });
});

describe('EduTrack System Integration', () => {
  test('renders portal navigation header and default Mark Attendance view', () => {
    const testStore = configureStore({
      reducer: {
        students: studentsReducer,
        attendance: attendanceReducer,
        subjects: subjectsReducer,
        filters: filtersReducer
      }
    });

    render(
      <Provider store={testStore}>
        <App />
      </Provider>
    );

    // Verify brand heading
    expect(screen.getAllByText(/EduTrack/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Student Attendance Management System/i).length).toBeGreaterThan(0);

    // Verify tab navigation buttons
    expect(screen.getByRole('button', { name: /Mark Attendance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Student Records/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analytics & Alerts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reports & Export/i })).toBeInTheDocument();
  });
});
