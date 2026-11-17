import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveTab, setActiveTab, showToast } from '../../features/filters/filtersSlice';
import { selectLowAttendanceStudents } from '../../features/attendance/attendanceSelectors';
import { resetStudentsToDefault } from '../../features/students/studentsSlice';
import { resetAttendanceToDefault } from '../../features/attendance/attendanceSlice';
import { resetSubjectsToDefault } from '../../features/subjects/subjectsSlice';
import {
  IconCalendar,
  IconUser,
  IconBarChart,
  IconFileText,
  IconAlert,
  IconRefresh
} from './Icons';

export function Navbar() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const lowAttendanceStudents = useAppSelector(selectLowAttendanceStudents);

  const handleResetData = () => {
    if (window.confirm('Reset all students and attendance records to the initial dataset?')) {
      dispatch(resetStudentsToDefault());
      dispatch(resetAttendanceToDefault());
      dispatch(resetSubjectsToDefault());
      dispatch(showToast({ message: 'Academic dataset reset to initial state', type: 'info' }));
    }
  };

  const navItems = [
    { id: 'marking', label: 'Mark Attendance', icon: <IconCalendar size={18} /> },
    { id: 'students', label: 'Student Records', icon: <IconUser size={18} /> },
    {
      id: 'analytics',
      label: 'Analytics & Alerts',
      icon: <IconBarChart size={18} />,
      badge: lowAttendanceStudents.length > 0 ? `${lowAttendanceStudents.length} Alert` : null
    },
    { id: 'reports', label: 'Reports & Export', icon: <IconFileText size={18} /> }
  ];

  return (
    <header className="portal-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-logo-badge">
            <span className="brand-icon">🎓</span>
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-main">EduTrack</span>
              <span className="brand-pill">Redux Portal</span>
            </div>
            <p className="brand-subtitle">Student Attendance Management System</p>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Portal Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab(item.id))}
              >
                <span className="tab-icon">{item.icon}</span>
                <span className="tab-label">{item.label}</span>
                {item.badge && (
                  <span className="tab-alert-badge" title="Students with attendance below threshold">
                    <IconAlert size={12} />
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-reset-btn"
            onClick={handleResetData}
            title="Reset to default initial data"
          >
            <IconRefresh size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
