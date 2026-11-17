import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from '../features/students/studentsSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import filtersReducer from '../features/filters/filtersSlice';

import actionLoggerMiddleware from '../middleware/actionLoggerMiddleware';
import auditMiddleware from '../middleware/auditMiddleware';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    attendance: attendanceReducer,
    subjects: subjectsReducer,
    filters: filtersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(actionLoggerMiddleware, auditMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
