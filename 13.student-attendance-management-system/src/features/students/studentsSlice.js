import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_STUDENTS } from './initialStudents';

const STUDENTS_STORAGE_KEY = 'edutrack_students_v1';

function loadStoredStudents() {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load students from localStorage, using initial roster:', err);
  }
  return INITIAL_STUDENTS;
}

function persistStudents(students) {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.warn('Failed to persist students to localStorage:', err);
  }
}

/**
 * Async thunk: Simulates asynchronous student directory loading from an API
 */
export const fetchStudentsAsync = createAsyncThunk(
  'students/fetchStudentsAsync',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate network latency (300ms)
      await new Promise((resolve) => setTimeout(resolve, 300));
      return loadStoredStudents();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch student directory');
    }
  }
);

/**
 * Async thunk: Simulates remote persistence of a student record
 */
export const saveStudentRemote = createAsyncThunk(
  'students/saveStudentRemote',
  async (studentData, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return studentData;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save student record');
    }
  }
);

const initialState = {
  list: loadStoredStudents(),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isAddEditModalOpen: false,
  editingStudent: null, // null for Add, student object for Edit
  isDeleteModalOpen: false,
  studentToDelete: null,
  selectedStudentId: null
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      const newStudent = {
        ...action.payload,
        id: action.payload.id || `STU-${Date.now().toString().slice(-6)}`,
        avatarBg: action.payload.avatarBg || '#2563eb'
      };
      state.list.unshift(newStudent);
      persistStudents(state.list);
    },
    updateStudent: (state, action) => {
      const index = state.list.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
        persistStudents(state.list);
      }
    },
    deleteStudent: (state, action) => {
      const studentId = action.payload;
      state.list = state.list.filter((s) => s.id !== studentId);
      persistStudents(state.list);
      if (state.selectedStudentId === studentId) {
        state.selectedStudentId = null;
      }
    },
    openAddModal: (state) => {
      state.isAddEditModalOpen = true;
      state.editingStudent = null;
    },
    openEditModal: (state, action) => {
      state.isAddEditModalOpen = true;
      state.editingStudent = action.payload;
    },
    closeAddEditModal: (state) => {
      state.isAddEditModalOpen = false;
      state.editingStudent = null;
    },
    openDeleteModal: (state, action) => {
      state.isDeleteModalOpen = true;
      state.studentToDelete = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.studentToDelete = null;
    },
    setSelectedStudentId: (state, action) => {
      state.selectedStudentId = action.payload;
    },
    resetStudentsToDefault: (state) => {
      state.list = INITIAL_STUDENTS;
      persistStudents(INITIAL_STUDENTS);
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchStudentsAsync
      .addCase(fetchStudentsAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStudentsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load students';
      })
      // saveStudentRemote
      .addCase(saveStudentRemote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveStudentRemote.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(saveStudentRemote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to sync student';
      });
  }
});

export const {
  addStudent,
  updateStudent,
  deleteStudent,
  openAddModal,
  openEditModal,
  closeAddEditModal,
  openDeleteModal,
  closeDeleteModal,
  setSelectedStudentId,
  resetStudentsToDefault
} = studentsSlice.actions;

export const selectAllStudents = (state) => state.students.list;
export const selectStudentsStatus = (state) => state.students.status;
export const selectStudentsError = (state) => state.students.error;
export const selectIsAddEditModalOpen = (state) => state.students.isAddEditModalOpen;
export const selectEditingStudent = (state) => state.students.editingStudent;
export const selectIsDeleteModalOpen = (state) => state.students.isDeleteModalOpen;
export const selectStudentToDelete = (state) => state.students.studentToDelete;
export const selectSelectedStudentId = (state) => state.students.selectedStudentId;

export const selectStudentById = (state, studentId) =>
  state.students.list.find((s) => s.id === studentId);

export default studentsSlice.reducer;
