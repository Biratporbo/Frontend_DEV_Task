import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_SUBJECTS } from './initialSubjects';

const SUBJECTS_STORAGE_KEY = 'edutrack_subjects_v1';

function loadStoredSubjects() {
  try {
    const raw = localStorage.getItem(SUBJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load subjects from localStorage:', err);
  }
  return INITIAL_SUBJECTS;
}

function persistSubjects(subjects) {
  try {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.warn('Failed to persist subjects to localStorage:', err);
  }
}

const initialState = {
  list: loadStoredSubjects(),
  selectedSubjectCode: 'CS401',
  status: 'idle',
  error: null
};

export const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    addSubject: (state, action) => {
      state.list.push(action.payload);
      persistSubjects(state.list);
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubjectCode = action.payload;
    },
    resetSubjectsToDefault: (state) => {
      state.list = INITIAL_SUBJECTS;
      state.selectedSubjectCode = 'CS401';
      persistSubjects(INITIAL_SUBJECTS);
    }
  }
});

export const { addSubject, setSelectedSubject, resetSubjectsToDefault } = subjectsSlice.actions;

export const selectAllSubjects = (state) => state.subjects.list;
export const selectSelectedSubjectCode = (state) => state.subjects.selectedSubjectCode;
export const selectSelectedSubject = (state) =>
  state.subjects.list.find((sub) => sub.code === state.subjects.selectedSubjectCode);

export default subjectsSlice.reducer;
