import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectActiveTab } from './features/filters/filtersSlice';
import { fetchStudentsAsync } from './features/students/studentsSlice';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotificationToast from './components/common/NotificationToast';

import AttendanceMarking from './components/attendance/AttendanceMarking';
import StudentList from './components/students/StudentList';
import AttendanceDashboard from './components/analytics/AttendanceDashboard';
import AttendanceReports from './components/reports/AttendanceReports';

import StudentFormModal from './components/students/StudentFormModal';
import DeleteConfirmModal from './components/students/DeleteConfirmModal';
import StudentDetailModal from './components/students/StudentDetailModal';

function App() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);

  useEffect(() => {
    dispatch(fetchStudentsAsync());
  }, [dispatch]);

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Body per Active Tab */}
      <main className="main-wrapper">
        {activeTab === 'marking' && <AttendanceMarking />}
        {activeTab === 'students' && <StudentList />}
        {activeTab === 'analytics' && <AttendanceDashboard />}
        {activeTab === 'reports' && <AttendanceReports />}
      </main>

      {/* Modals & Dialogs */}
      <StudentFormModal />
      <DeleteConfirmModal />
      <StudentDetailModal />

      {/* Global Notification Toast */}
      <NotificationToast />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
