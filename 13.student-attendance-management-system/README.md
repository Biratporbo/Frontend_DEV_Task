# EduTrack — Student Attendance Management System

A robust, modern, and human-crafted Student Attendance Management System built with **React 18** and **Redux Toolkit (RTK)**. Designed for college faculties and department administrators, it provides centralized student record management, class session attendance marking, real-time derived attendance calculations, configurable low-attendance warning alerts, interactive charts, and CSV report exports.

---

## 🌟 Key Architecture & Redux Toolkit Highlights

### 1. Centralized Application Store (`configureStore`)
- Configured in `src/app/store.js` using Redux Toolkit's `configureStore()`.
- Integrates multiple domain-specific slices: `students`, `attendance`, `subjects`, and `filters`.
- Injects standard RTK middleware alongside custom execution telemetry and audit tracking middleware.

### 2. Domain-Specific Slices (`createSlice`)
- **`studentsSlice`**: Manages the student directory (add, edit, delete, modal states) and state persistence.
- **`attendanceSlice`**: Manages session drafts, batch commitments, individual updates, and duplicate entry prevention for the same student, subject, and date.
- **`subjectsSlice`**: Manages academic courses, faculty allocations, and department mappings.
- **`filtersSlice`**: Coordinates tab navigation, directory filters, session selectors, date ranges, and the configurable attendance threshold.

### 3. Asynchronous Operations (`createAsyncThunk`)
- **`fetchStudentsAsync`**: Simulates loading student directory records asynchronously from an academic database.
- **`saveAttendanceBatchAsync`**: Simulates an asynchronous remote API call to batch-save class session marks with network delay and error handling.
- **`saveStudentRemote`**: Simulates remote synchronization of new student registrations.

### 4. Builder Callback Reducers (`extraReducers`)
- Utilizes the modern RTK builder callback notation (`builder.addCase(...)`) to handle `pending`, `fulfilled`, and `rejected` states across all asynchronous thunks.

### 5. Derived State & Memoized Selectors (`createSelector`)
Optimized report calculations implemented with `createSelector` in `src/features/attendance/attendanceSelectors.js`:
- **`selectStudentAttendanceSummaries`**: Derives individual attendance percentages taking into account Present (P), Absent (A), Late (L = 0.5 credit), Internship Placed (PL = excused/attended), and Official Engagement (E = excused/attended).
- **`selectLowAttendanceStudents`**: Identifies students whose attendance rate strictly falls below the configurable threshold (e.g. `< 45%`).
- **`selectOverallAttendanceMetrics`**: System-wide KPI metrics (average attendance %, total sessions, marks breakdown).
- **`selectSubjectAttendanceSummaries`**: Subject-by-subject attendance rates, conducted sessions, and marks.
- **`selectFilteredReportRecords`**: Fast filtering across dates, subjects, semesters, sections, and individual students for reporting and CSV generation.
- **`selectMonthlyAttendanceTrend`**: Calendar-month aggregations for trend visualization.

### 6. Custom Middleware & Audit Trail
- **`actionLoggerMiddleware`**: Measures action execution duration in milliseconds and logs previous state, dispatched payload, and next state snapshots to the console.
- **`auditMiddleware`**: Records compliance audit logs (`STUDENT_ENROLLED`, `ATTENDANCE_BATCH_SAVED`, `THRESHOLD_UPDATED`) to `localStorage`.

### 7. State Persistence (`localStorage`)
- Automatically preserves students (`edutrack_students_v1`), attendance records (`edutrack_attendance_v1`), subjects, and the customized threshold across page refreshes.

### 8. Automated Testing Suite
- Comprehensive unit and integration tests using **Jest** and **React Testing Library** in `src/App.test.js` validating reducers, memoized selectors, attendance percentage calculations, duplicate prevention, and component rendering.

---

## 📋 Core Features

### 👥 1. Student Record Management
- **Add, Edit, and Delete**: Full student management with ID, Roll Number, Name, Department, Semester, Section, Email, and Phone Number.
- **Real-Time Search**: Instant search across names, IDs, roll numbers, and emails.
- **Multi-Level Filters**: Filter roster by Department, Semester, and Section.
- **Profile Inspector**: Quick modal view showing student contact details, individual attendance percentages, and historical session logs.

### 📋 2. Class Attendance Marking
- **Class Selector**: Select Date, Subject, Semester, and Section.
- **Auto-Roster**: Displays students registered for the selected semester and section.
- **Status Categories**:
  - **P** — Present
  - **A** — Absent
  - **L** — Late (half-credit attendance)
  - **PL** — Internship Placed (excused credit)
  - **E** — Official Engagement / University Event (excused credit)
- **Batch Actions**: Quick "Mark All Present" and "Mark All Absent" buttons.
- **Duplicate Prevention**: If attendance for a given `(date, subjectCode, section)` already exists, the portal indicates update mode and modifies existing records in-place without duplicating entries.

### 📊 3. Analytics & Configurable Alerts
- **Real-Time KPIs**: Overall attendance percentage, conducted sessions count, enrolled student count, and low-attendance alert count.
- **Configurable Alert Threshold**: Interactive slider (defaults to **45%**, adjustable between 10% and 90%) that dynamically recalibrates low-attendance flags across the entire portal.
- **Low Attendance Warning Cards**: Visual callout cards highlighting students at academic risk with class deficit calculations.
- **Subject-Wise Summary Cards**: Performance comparisons across all curricula.

### 📑 4. Reports & CSV Export
- **Daily & Monthly Reports**: Switch between detailed daily log entries and monthly aggregate views.
- **Multi-Criteria Filter**: Filter reports by Date Range, Subject, Semester, Section, and Student.
- **Visual Analytics**: Interactive Recharts distribution donut chart and subject comparison bar chart.
- **Export to CSV**: Export filtered attendance records or student summary reports to clean `.csv` spreadsheet files.

---

## 📂 Project Structure

```
13.student-attendance-management-system/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── hooks.js                     # useAppDispatch & useAppSelector hooks
│   │   └── store.js                     # configureStore setup with custom middleware
│   ├── components/
│   │   ├── analytics/
│   │   │   └── AttendanceDashboard.jsx  # KPI metrics, threshold slider, alert cards
│   │   ├── attendance/
│   │   │   └── AttendanceMarking.jsx    # Class session selector & status marking
│   │   ├── common/
│   │   │   ├── Footer.jsx               # Portal footer
│   │   │   ├── Icons.jsx                # Vector SVG icon library
│   │   │   ├── LoadingSpinner.jsx       # Async loading state spinner
│   │   │   ├── Navbar.jsx               # Brand header, navigation tabs & demo reset
│   │   │   └── NotificationToast.jsx    # Global toast notification alerts
│   │   ├── reports/
│   │   │   ├── AttendanceCharts.jsx     # Recharts bar and status donut charts
│   │   │   └── AttendanceReports.jsx    # Daily/Monthly reports & CSV download
│   │   └── students/
│   │       ├── DeleteConfirmModal.jsx   # Safe student deletion dialog
│   │       ├── StudentDetailModal.jsx   # Student profile and attendance history
│   │       ├── StudentFormModal.jsx     # Add/Edit student modal
│   │       └── StudentList.jsx          # Directory table with search & filters
│   ├── features/
│   │   ├── attendance/
│   │   │   ├── attendanceSelectors.js   # Memoized derived state selectors
│   │   │   ├── attendanceSlice.js       # Attendance slice & async thunk
│   │   │   └── initialAttendance.js     # Realistic sample attendance dataset
│   │   ├── filters/
│   │   │   └── filtersSlice.js          # Tab navigation, filters & threshold state
│   │   ├── students/
│   │   │   ├── initialStudents.js       # Preloaded student roster (14 students)
│   │   │   └── studentsSlice.js         # Student directory slice & async thunks
│   │   └── subjects/
│   │       ├── initialSubjects.js       # Academic courses dataset
│   │       └── subjectsSlice.js         # Subjects state slice
│   ├── middleware/
│   │   ├── actionLoggerMiddleware.js    # Performance telemetry and action logger
│   │   └── auditMiddleware.js           # Compliance audit trail middleware
│   ├── styles/
│   │   ├── App.css                      # Component styling, grid, buttons & modals
│   │   └── index.css                    # Design tokens and typography reset
│   ├── utils/
│   │   ├── csvExporter.js               # CSV formatting and file download helpers
│   │   └── dateUtils.js                 # Date formatting utilities
│   ├── App.js                           # Root application component
│   ├── App.test.js                      # Unit and integration test suite
│   ├── index.js                         # React 18 createRoot & Provider mount
│   └── setupTests.js                    # Testing library setup
├── .env                                 # PORT=3006 configuration
├── .gitignore                           # Git ignore rules
├── package.json                         # Scripts & dependencies
├── vercel.json                          # Vercel SPA rewrites
└── README.md                            # Comprehensive project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Navigate to the project directory
cd 13.student-attendance-management-system

# Install dependencies
npm install
```

### Running Locally
```bash
npm start
```
The application will launch at **`http://localhost:3006`**.

### Running Tests
```bash
npm test -- --watchAll=false
```

### Production Build
```bash
npm run build
```

---

## 📄 License
MIT
